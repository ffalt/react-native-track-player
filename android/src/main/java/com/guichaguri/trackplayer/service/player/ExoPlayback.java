package com.guichaguri.trackplayer.service.player;

import android.content.Context;
import android.support.v4.media.session.PlaybackStateCompat;
import android.util.Log;
import android.os.Handler;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.PlaybackException;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.Player.Listener;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.Timeline;
import com.google.android.exoplayer2.Timeline.Window;
import com.google.android.exoplayer2.Tracks;
import com.google.android.exoplayer2.metadata.Metadata;
import com.google.android.exoplayer2.metadata.MetadataOutput;
import com.guichaguri.trackplayer.service.MusicManager;
import com.guichaguri.trackplayer.service.Utils;
import com.guichaguri.trackplayer.service.models.Track;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * @author Guichaguri
 */
public abstract class ExoPlayback<T extends ExoPlayer> implements Listener, MetadataOutput {

    protected final Context context;
    protected final MusicManager manager;
    protected final T player;

    protected List<Track> queue = Collections.synchronizedList(new ArrayList<>());

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

    public ExoPlayback(Context context, MusicManager manager, T player, boolean autoUpdateMetadata, boolean scrobble) {
        this.context = context;
        this.manager = manager;
        this.player = player;
        this.autoUpdateMetadata = autoUpdateMetadata;
        this.scrobble = scrobble;
    }

    public void initialize() {
        player.addListener(this);
    }

    public List<Track> getQueue() {
        return queue;
    }

    public abstract void add(Track track, int index, Promise promise);

    public abstract void add(Collection<Track> tracks, int index, Promise promise);

    public abstract void move(int index, int newIndex, Promise promise);

    public abstract void remove(List<Integer> indexes, Promise promise);

    public abstract void removeUpcomingTracks();

    public abstract void shuffle(final Promise promise);

    public abstract void clear(final Promise promise);

    public abstract void setRepeatMode(int repeatMode);

    public abstract int getRepeatMode();

    public void setScrobble(boolean scrobble) {
        this.scrobble = scrobble;
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

    protected void snapShotMediaPosition() {
        lastKnownMediaIndex = player.getCurrentMediaItemIndex();
        lastKnownMediaPosition = player.getCurrentPosition();
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
        player.setPlayWhenReady(true);
    }

    public void pause() {
        player.setPlayWhenReady(false);
    }

    public void stop() {
        snapShotMediaPosition();
        scrobbleTrackindex = C.INDEX_UNSET;
        player.stop();
        player.setPlayWhenReady(false);
        player.seekTo(lastKnownMediaIndex, 0);
    }

    public void reset() {
        snapShotMediaPosition();
        scrobbleTrackindex = C.INDEX_UNSET;
        player.stop();
        player.clearMediaItems();
        player.setPlayWhenReady(false);
    }

    public void setShuffleModeEnabled(boolean shuffleModeEnabled) {
        player.setShuffleModeEnabled(shuffleModeEnabled);
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

    public abstract float getPlayerVolume();

    public abstract void setPlayerVolume(float volume);

    public float getRate() {
        return player.getPlaybackParameters().speed;
    }

    public void setRate(float rate) {
        player.setPlaybackParameters(new PlaybackParameters(rate, player.getPlaybackParameters().pitch));
    }

    public int getState() {
        switch (player.getPlaybackState()) {
            case Player.STATE_BUFFERING:
                return player.getPlayWhenReady() ? PlaybackStateCompat.STATE_BUFFERING : PlaybackStateCompat.STATE_CONNECTING;
            case Player.STATE_ENDED:
                return PlaybackStateCompat.STATE_STOPPED;
            case Player.STATE_IDLE:
                return PlaybackStateCompat.STATE_NONE;
            case Player.STATE_READY:
                return player.getPlayWhenReady() ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED;
        }
        return PlaybackStateCompat.STATE_NONE;
    }

    public void destroy() {
        player.release();
    }

    @Override
    public void onTimelineChanged(@NonNull Timeline timeline, int reason) {
        Log.d(Utils.LOG, "onTimelineChanged: " + reason);

        if ((reason == Player.TIMELINE_CHANGE_REASON_PLAYLIST_CHANGED) && !timeline.isEmpty()) {
            onPositionDiscontinuity(Player.DISCONTINUITY_REASON_INTERNAL);
        }
    }

    @Override
    public void onPositionDiscontinuity(Player.PositionInfo oldPosition, Player.PositionInfo newPosition, int reason) {
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

    @Override
    public void onTracksChanged(@NonNull Tracks tracks) {
        Log.d(Utils.LOG, "onTracksChanged");
        resetScrobble();
        updateScrobble();;
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

    @Override
    public void onPlayWhenReadyChanged(boolean playWhenReady, int reason) {
        Log.d(Utils.LOG, "onPlayWhenReadyChanged: " + playWhenReady + " reason: " + reason);
    }

    @Override
    public void onPlaybackStateChanged(int playbackState) {
        int state = getState();
        Log.d(Utils.LOG, "onPlayerStateChanged: " + state + ", " + previousState);
        if (scrobble) {
            updateScrobble();
        }
        if (state != previousState) {
            if (Utils.isPlaying(state) && !Utils.isPlaying(previousState)) {
                manager.onPlay();
            } else if (Utils.isPaused(state) && !Utils.isPaused(previousState)) {
                manager.onPause();
            } else if (Utils.isStopped(state) && !Utils.isStopped(previousState)) {
                manager.onStop();
            }

            manager.onStateChange(state);

            if (previousState != PlaybackStateCompat.STATE_CONNECTING && state == PlaybackStateCompat.STATE_STOPPED) {
                Integer previous = getCurrentTrackIndex();
                long position = getPosition();
                manager.onTrackUpdate(previous, position, null, null);
                manager.onEnd(getCurrentTrackIndex(), getPosition());
            }

            previousState = state;
        }
    }

    @Override
    public void onPlayerError(PlaybackException error) {
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
