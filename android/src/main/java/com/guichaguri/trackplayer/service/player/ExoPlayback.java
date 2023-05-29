package com.guichaguri.trackplayer.service.player;

import android.content.Context;
import android.support.v4.media.session.PlaybackStateCompat;
import android.util.Log;
import android.os.Handler;

import androidx.annotation.NonNull;

import androidx.media3.common.C;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.PlaybackParameters;
import androidx.media3.common.Player;
import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.common.Timeline;
import androidx.media3.common.Timeline.Window;
import androidx.media3.common.Tracks;
import androidx.media3.database.DatabaseProvider;
import androidx.media3.database.StandaloneDatabaseProvider;
import androidx.media3.common.Metadata;
import androidx.media3.exoplayer.source.ConcatenatingMediaSource;
import androidx.media3.exoplayer.source.MediaSource;
import androidx.media3.datasource.DataSource;
import androidx.media3.datasource.cache.CacheDataSource;
import androidx.media3.datasource.cache.LeastRecentlyUsedCacheEvictor;
import androidx.media3.datasource.cache.SimpleCache;

import com.guichaguri.trackplayer.downloader.DownloadUtils;
import com.guichaguri.trackplayer.service.MusicManager;
import com.guichaguri.trackplayer.service.Utils;
import com.guichaguri.trackplayer.service.models.Track;

import java.io.File;
import java.util.*;

import com.facebook.react.bridge.Promise;

/**
 * @author Guichaguri
 */
@UnstableApi public class ExoPlayback {

    protected final Context context;
    protected final MusicManager manager;
    protected final ExoPlayer player;
    protected List<Track> queue = Collections.synchronizedList(new ArrayList<Track>());

    // https://github.com/google/ExoPlayer/issues/2728
    protected int lastKnownMediaIndex = C.INDEX_UNSET;
    protected long lastKnownMediaPosition = C.POSITION_UNSET;
    protected int previousState = PlaybackStateCompat.STATE_NONE;
    protected float volumeMultiplier = 1.0F;
    protected boolean autoUpdateMetadata;
    protected final Handler handler = new Handler();
    protected Integer scrobbleTrackindex = C.INDEX_UNSET;
    protected long scrobbleDuration = 0;
    protected long scrobbleTrigger = 0;
    protected boolean scrobbleDone = true;
    protected boolean scrobble;

    private final long cacheMaxSize;

    private SimpleCache cache;
    private ConcatenatingMediaSource source;
    private boolean prepared = false;

    public ExoPlayback(Context context, MusicManager manager, ExoPlayer player, long maxCacheSize, boolean autoUpdateMetadata, boolean scrobble) {
        this.context = context;
        this.manager = manager;
        this.player = player;
        this.autoUpdateMetadata = autoUpdateMetadata;
        this.cacheMaxSize = maxCacheSize;
        this.scrobble = scrobble;
    }

    public void initialize() {
        if (cacheMaxSize > 0) {
            File cacheDir = new File(context.getCacheDir(), "TrackPlayerCache");
            DatabaseProvider db = new StandaloneDatabaseProvider(context);
            cache = new SimpleCache(cacheDir, new LeastRecentlyUsedCacheEvictor(cacheMaxSize), db);
        } else {
            cache = null;
        }
        source = new ConcatenatingMediaSource();
        player.setMediaSource(source);
        queue.clear();
        player.addListener(new ExoPlayerListener());
    }

    public DataSource.Factory enableCaching(DataSource.Factory ds) {
        return getDownloadCache(getPlaybackCache(ds));
    }

    public DataSource.Factory getDownloadCache(DataSource.Factory ds) {
        return new CacheDataSource.Factory()
                .setCache(DownloadUtils.getDownloadCache(this.context))
                .setUpstreamDataSourceFactory(ds)
                .setCacheWriteDataSinkFactory(null); // Disable writing.
    }

    public DataSource.Factory getPlaybackCache(DataSource.Factory ds) {
        if (cache == null || cacheMaxSize <= 0) return ds;
        return new CacheDataSource.Factory()
                .setCache(cache)
                .setUpstreamDataSourceFactory(ds)
                .setFlags(CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR);
    }

    private void prepare() {
        if (!prepared) {
            Log.d(Utils.LOG, "Preparing the media source...");
            player.setMediaSource(source);
            player.prepare();
            prepared = true;
        }
    }

    public List<Track> getQueue() {
        return queue;
    }

    public void add(Track track, int index, Promise promise) {
        List<Track> trackList = new ArrayList<>();
        trackList.add(track);
        add(trackList, index, promise);
    }

    public void add(Collection<Track> tracks, int index, Promise promise) {
        boolean armTrack = queue.isEmpty();
        List<MediaSource> trackList = new ArrayList<>();

        for (Track track : tracks) {
            trackList.add(track.toMediaSource(context, this));
        }

        queue.addAll(index, tracks);
        source.addMediaSources(index, trackList, manager.getHandler(), () -> promise.resolve(index));

        prepare();
        manager.onQueueChange();
        if (armTrack) {
            player.seekTo(0, 0);
        }
    }

    public void move(int index, int newIndex, Promise promise) {
        Integer currentIndex = getCurrentTrackIndex();
        boolean triggerCurrentChange = (index == currentIndex || newIndex == currentIndex);
        Collections.swap(queue, index, newIndex);
        source.moveMediaSource(index, newIndex, manager.getHandler(), Utils.toRunnable(promise));
        if (triggerCurrentChange) {
            int update = index == currentIndex ? newIndex : index;
            manager.onTrackUpdate(-1, -1, update, queue.get(update));
        }
        manager.onQueueChange();
    }

    public void remove(List<Integer> indexes, Promise promise) {
        int currentIndex = player.getCurrentMediaItemIndex();
        // Sort the list so we can loop through sequentially
        Collections.sort(indexes);
        boolean refreshCurrentTrack = false;
        for (int i = indexes.size() - 1; i >= 0; i--) {
            int index = indexes.get(i);
            // Skip indexes that are the current track or are out of bounds
            if (index < 0 || index >= queue.size()) {
                continue;
            }
            if (index == currentIndex) {
                stop();
            }
            queue.remove(index);
            source.removeMediaSource(index);
            if (index <= currentIndex) {
                refreshCurrentTrack = true;
            }
        }
        if (refreshCurrentTrack) {
            manager.onTrackUpdate(lastKnownMediaIndex, lastKnownMediaPosition, -1, null);
            if (!queue.isEmpty()) {
                int newIndex = Math.min(queue.size() - 1, currentIndex);
                if (newIndex >= 0 && newIndex < queue.size()) {
                    manager.onTrackUpdate(-1, -1, newIndex, queue.get(newIndex));
                }
            }
        }
        manager.onQueueChange();
        promise.resolve(null);
    }

    public void removeUpcomingTracks() {
        int currentIndex = player.getCurrentMediaItemIndex();
        if (currentIndex == C.INDEX_UNSET) return;

        for (int i = queue.size() - 1; i > currentIndex; i--) {
            queue.remove(i);
            source.removeMediaSource(i);
        }
        manager.onQueueChange();
    }

    private void resetQueue() {
        queue.clear();

        source = new ConcatenatingMediaSource();
        player.setMediaSource(source, true);
        player.prepare();
        prepared = false; // We set it to false as the queue is now empty

        lastKnownMediaIndex = C.INDEX_UNSET;
        lastKnownMediaPosition = C.POSITION_UNSET;

        manager.onReset();
        manager.onQueueChange();
    }

    public void shuffle(final Promise promise) {
        Random rand = new Random();
        int startIndex = player.getCurrentMediaItemIndex();
        int length = queue.size();

        if (startIndex == C.INDEX_UNSET) {
            startIndex = 0;
        } else {
            startIndex++;
        }

        // Fisher-Yates shuffle
        for (int i = startIndex; i < length; i++) {
            int swapIndex = rand.nextInt(i + 1 - startIndex) + startIndex;

            Collections.swap(queue, i, swapIndex);

            if (length - 1 == i) {
                // Resolve the promise after the last move command
                source.moveMediaSource(i, swapIndex, manager.getHandler(), Utils.toRunnable(promise));
            } else {
                source.moveMediaSource(i, swapIndex);
            }
        }
        Log.w(Utils.LOG, "Shuffle");
        manager.onQueueChange();
    }

    public void clear(Promise promise) {
        queue.clear();
        source.clear();
        manager.onQueueChange();
    }

    public void setRepeatMode(int repeatMode) {
        player.setRepeatMode(repeatMode);
        manager.onRepeatModeChange(repeatMode);
    }

    public int getRepeatMode() {
        return player.getRepeatMode();
    }

    public void setPlaybackSpeed(float speed) {
        setPlaybackParameter(speed, getPlaybackPitch());
    }

    public void setPlaybackPitch(float pitch) {
        setPlaybackParameter(getPlaybackSpeed(), pitch);
    }

    public PlaybackParameters getPlaybackParameters() {
        return player.getPlaybackParameters();
    }

    public void setPlaybackParameter(float speed, float pitch) {
        player.setPlaybackParameters(new PlaybackParameters(speed, pitch));
        manager.onPlaybackParameterChange(speed, pitch);
    }

    public float getPlaybackSpeed() {
        return player.getPlaybackParameters().speed;
    }

    public float getPlaybackPitch() {
        return player.getPlaybackParameters().pitch;
    }

    public void setScrobble(boolean scrobble) {
        this.scrobble = scrobble;
    }

    public boolean hasNext() {
        return player.hasNextMediaItem();
    }

    public boolean hasPrevious() {
        return player.hasPreviousMediaItem();
    }

    public void updateTrack(int index, Track track) {
        int currentIndex = player.getCurrentMediaItemIndex();

        queue.set(index, track);

        if (currentIndex == index)
            manager.getMetadata().updateMetadata(this, track);
    }

    public Integer getCurrentTrackIndex() {
        int index = player.getCurrentMediaItemIndex();
        return index < 0 || index >= queue.size() ? null : index;
    }

    public Track getCurrentTrack() {
        int index = player.getCurrentMediaItemIndex();
        return index < 0 || index >= queue.size() ? null : queue.get(index);
    }

    public void skip(int index, Promise promise) {
        if (index < 0 || index >= queue.size()) {
            promise.reject("index_out_of_bounds", "The index is out of bounds");
            return;
        }
        snapShotMediaPosition();
        player.seekToDefaultPosition(index);
        promise.resolve(null);
    }

    public void skipToPrevious(Promise promise) {
        int prev = player.getPreviousMediaItemIndex();

        if (prev == C.INDEX_UNSET) {
            promise.reject("no_previous_track", "There is no previous track");
            return;
        }

        snapShotMediaPosition();
        player.seekToDefaultPosition(prev);
        promise.resolve(null);
    }

    public void skipToNext(Promise promise) {
        int next = player.getNextMediaItemIndex();

        if (next == C.INDEX_UNSET) {
            promise.reject("queue_exhausted", "There is no tracks left to play");
            return;
        }

        snapShotMediaPosition();
        player.seekToDefaultPosition(next);
        promise.resolve(null);
    }

    public void play() {
        prepare();
        player.setPlayWhenReady(true);
    }

    public void pause() {
        player.setPlayWhenReady(false);
    }

    public void stop() {
        snapShotMediaPosition();
        scrobbleTrackindex = C.INDEX_UNSET;
        prepared = false;
        player.stop();
        player.setPlayWhenReady(false);
        player.seekTo(lastKnownMediaIndex, 0);
    }

    public void reset() {
        Integer track = getCurrentTrackIndex();
        long position = player.getCurrentPosition();
        lastKnownMediaIndex = C.INDEX_UNSET;
        lastKnownMediaPosition = C.POSITION_UNSET;
        scrobbleTrackindex = C.INDEX_UNSET;
        player.stop();
        player.clearMediaItems();
        player.setPlayWhenReady(false);
        resetQueue();
        updateTrackPlayerState();
        manager.onTrackUpdate(track, position, null, null);
    }

    public void setShuffleModeEnabled(boolean shuffleModeEnabled) {
        player.setShuffleModeEnabled(shuffleModeEnabled);
        manager.onShuffleChange(player.getShuffleModeEnabled());
    }

    public boolean getShuffleModeEnabled() {
        return player.getShuffleModeEnabled();
    }

    public boolean isRemote() {
        return false;
    }

    public boolean shouldAutoUpdateMetadata() {
        return autoUpdateMetadata;
    }

    public long getPosition() {
        return player.getCurrentPosition();
    }

    public long getBufferedPosition() {
        return player.getBufferedPosition();
    }

    public long getDuration() {
        Track current = getCurrentTrack();

        if (current != null && current.duration > 0) {
            return current.duration;
        }

        long duration = player.getDuration();

        return duration == C.TIME_UNSET ? 0 : duration;
    }

    public void seekTo(long time) {
        snapShotMediaPosition();
        prepare();
        player.seekTo(time);
    }

    public float getVolume() {
        return getPlayerVolume() / volumeMultiplier;
    }

    public void setVolume(float volume) {
        setPlayerVolume(volume * volumeMultiplier);
    }

    public void setVolumeMultiplier(float multiplier) {
        setPlayerVolume(getVolume() * multiplier);
        this.volumeMultiplier = multiplier;
    }

    public float getPlayerVolume() {
        return player.getVolume();
    }

    public void setPlayerVolume(float volume) {
        player.setVolume(volume);
    }

    public int getState() {
        int playbackState = player.getPlaybackState();
        switch (playbackState) {
            case Player.STATE_BUFFERING:
                return player.getPlayWhenReady() ? PlaybackStateCompat.STATE_BUFFERING : PlaybackStateCompat.STATE_CONNECTING;
            case Player.STATE_ENDED:
            case Player.STATE_IDLE:
                return PlaybackStateCompat.STATE_STOPPED;
            case Player.STATE_READY:
                return player.getPlayWhenReady() ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED;
        }
        return PlaybackStateCompat.STATE_NONE;
    }

    public void destroy() {
        player.release();
        if (cache != null) {
            try {
                cache.release();
                cache = null;
            } catch (Exception ex) {
                Log.w(Utils.LOG, "Couldn't release the cache properly", ex);
            }
        }
    }

    private final Runnable updateScrobbleAction = new Runnable() {
        @Override
        public void run() {
            updateScrobble();
        }
    };

    private void resetScrobble() {
        scrobbleDuration = 0;
        scrobbleTrigger = 0;
        scrobbleTrackindex = C.INDEX_UNSET;
        scrobbleDone = false;
    }

    private void updateScrobble() {
        if (!scrobble) {
            return;
        }
        // Remove scheduled updates.
        handler.removeCallbacks(updateScrobbleAction);
        int state = getState();
        if (Utils.isPlaying(state)) {
            Integer trackIndex = getCurrentTrackIndex();
            if (trackIndex == null || trackIndex < 0) {
                return;
            }
            if (!trackIndex.equals(scrobbleTrackindex)) {
                resetScrobble();
                long duration = player.getDuration();
                scrobbleTrigger = Math.min(duration / 2, 4 * 60 * 60 * 1000);
                scrobbleTrackindex = trackIndex;
                handler.postDelayed(updateScrobbleAction, 1000);
                return;
            }
            if (scrobbleDone) {
                return;
            }
            scrobbleDuration = scrobbleDuration + 1000;
            if (scrobbleTrigger > 0 && scrobbleDuration > 0 && scrobbleDuration > scrobbleTrigger) {
                scrobbleDone = true;
                manager.onScrobble(trackIndex);
                return;
            }
            handler.postDelayed(updateScrobbleAction, 1000);
        }
    }

    private void updateTrackPlayerState() {
        int state = getState();
        updateScrobble();
        if (state != previousState) {
            Log.d(Utils.LOG, "onPlayerStateChanged: " + state);
            manager.onStateChange(state);
            if (Utils.isPlaying(state) && !Utils.isPlaying(previousState)) {
                manager.onPlay();
            } else if (Utils.isPaused(state) && !Utils.isPaused(previousState)) {
                manager.onPause();
            } else if (Utils.isStopped(state) && !Utils.isStopped(previousState)) {
                manager.onStop();
            }
            if (previousState != PlaybackStateCompat.STATE_CONNECTING && state == PlaybackStateCompat.STATE_STOPPED) {
                Integer previous = getCurrentTrackIndex();
                long position = getPosition();
                manager.onTrackUpdate(previous, position, null, null);
                manager.onEnd(getCurrentTrackIndex(), getPosition());
            }
            previousState = state;
        }
    }

    private void snapShotMediaPosition() {
        lastKnownMediaIndex = player.getCurrentMediaItemIndex();
        lastKnownMediaPosition = player.getCurrentPosition();
    }

    private void updatePositionDiscontinuity(int reason) {
        Log.d(Utils.LOG, "onPositionDiscontinuity: " + reason);

        if (lastKnownMediaIndex != player.getCurrentMediaItemIndex()) {
            Integer prevIndex = lastKnownMediaIndex == C.INDEX_UNSET ? null : lastKnownMediaIndex;
            Integer nextIndex = getCurrentTrackIndex();
            Track next = nextIndex == null ? null : queue.get(nextIndex);

            // Track changed because it ended
            // We'll use its duration instead of the last known position
            if (reason == Player.DISCONTINUITY_REASON_AUTO_TRANSITION && lastKnownMediaIndex != C.INDEX_UNSET) {
                if (lastKnownMediaIndex >= player.getCurrentTimeline().getWindowCount()) return;
                long duration = player.getCurrentTimeline().getWindow(lastKnownMediaIndex, new Window()).getDurationMs();
                if (duration != C.TIME_UNSET) lastKnownMediaPosition = duration;
            }

            manager.onTrackUpdate(prevIndex, lastKnownMediaPosition, nextIndex, next);
        } else if (reason == Player.DISCONTINUITY_REASON_AUTO_TRANSITION && lastKnownMediaIndex == player.getCurrentMediaItemIndex()) {
            Integer nextIndex = getCurrentTrackIndex();
            Track next = nextIndex == null ? null : queue.get(nextIndex);

            long duration = player.getCurrentTimeline().getWindow(lastKnownMediaIndex, new Window()).getDurationMs();
            if (duration != C.TIME_UNSET) lastKnownMediaPosition = duration;

            manager.onTrackUpdate(nextIndex, lastKnownMediaPosition, nextIndex, next);
        }
        snapShotMediaPosition();
    }

    private class ExoPlayerListener implements Player.Listener {

        @Override
        public void onTimelineChanged(@NonNull Timeline timeline, int reason) {
            Log.d(Utils.LOG, "onTimelineChanged: " + reason);

            if ((reason == Player.TIMELINE_CHANGE_REASON_PLAYLIST_CHANGED) && !timeline.isEmpty()) {
                updatePositionDiscontinuity(reason);
            }
        }

        @Override
        public void onPositionDiscontinuity(Player.PositionInfo oldPosition, Player.PositionInfo newPosition, int reason) {
            updatePositionDiscontinuity(reason);
        }

        @Override
        public void onTracksChanged(@NonNull Tracks tracks) {
            Log.d(Utils.LOG, "onTracksChanged");
            resetScrobble();
            updateScrobble();
            ;
        }

        @Override
        public void onPlayWhenReadyChanged(boolean playWhenReady, int reason) {
            Log.d(Utils.LOG, "onPlayWhenReadyChanged: " + playWhenReady + " reason: " + reason);
            updateTrackPlayerState();
        }

        @Override
        public void onIsPlayingChanged(boolean isPlaying) {
            Log.d(Utils.LOG, "onIsPlayingChanged: " + isPlaying);
            updateTrackPlayerState();
        }

        @Override
        public void onPlaybackStateChanged(int playbackState) {
            if (playbackState == Player.STATE_ENDED) {
                prepared = false;
            }
            int state = getState();
            Log.d(Utils.LOG, "onPlayerStateChanged: " + state + ", " + previousState);
            updateTrackPlayerState();
        }

        @Override
        public void onPlayerError(PlaybackException error) {
            prepared = false;
            manager.onError("playback", error.getCause().getMessage());
        }

        @Override
        public void onPlaybackParametersChanged(@NonNull PlaybackParameters playbackParameters) {
            // Speed or pitch changes
        }

        @Override
        public void onMetadata(@NonNull Metadata metadata) {
            SourceMetadata.handleMetadata(manager, metadata);
        }

    }
}
