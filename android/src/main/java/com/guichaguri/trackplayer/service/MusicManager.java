package com.guichaguri.trackplayer.service;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.media.AudioManager.OnAudioFocusChangeListener;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiManager.WifiLock;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.util.Log;

import androidx.annotation.RequiresApi;

import androidx.media3.common.C;
import androidx.media3.exoplayer.DefaultLoadControl;
import androidx.media3.exoplayer.LoadControl;
import androidx.media3.exoplayer.ExoPlayer;

import com.guichaguri.trackplayer.module.MusicEvents;
import com.guichaguri.trackplayer.service.metadata.MetadataManager;
import com.guichaguri.trackplayer.service.models.Track;
import com.guichaguri.trackplayer.service.player.ExoPlayback;

import static androidx.media3.exoplayer.DefaultLoadControl.DEFAULT_MIN_BUFFER_MS;
import static androidx.media3.exoplayer.DefaultLoadControl.DEFAULT_MAX_BUFFER_MS;
import static androidx.media3.exoplayer.DefaultLoadControl.DEFAULT_BUFFER_FOR_PLAYBACK_MS;
import static androidx.media3.exoplayer.DefaultLoadControl.DEFAULT_BACK_BUFFER_DURATION_MS;
import static androidx.media3.exoplayer.DefaultLoadControl.DEFAULT_BUFFER_FOR_PLAYBACK_AFTER_REBUFFER_MS;

/**
 * @author Guichaguri
 */
public class MusicManager implements OnAudioFocusChangeListener {

    private final MusicService service;

    private final WakeLock wakeLock;
    private final WifiLock wifiLock;

    private MetadataManager metadata;
    private ExoPlayback playback;

    @RequiresApi(26)
    private AudioFocusRequest focus = null;
    private boolean hasAudioFocus = false;
    private boolean wasDucking = false;

    private BroadcastReceiver noisyReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            service.emit(MusicEvents.BUTTON_PAUSE, null);
        }
    };
    private boolean receivingNoisyEvents = false;

    private boolean stopWithApp = false;
    private boolean alwaysPauseOnInterruption = false;
    private boolean scrobble = false;

    @SuppressLint("InvalidWakeLockTag")
    public MusicManager(MusicService service) {
        this.service = service;
        this.metadata = new MetadataManager(service, this);

        PowerManager powerManager = (PowerManager) service.getSystemService(Context.POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "track-player-wake-lock");
        wakeLock.setReferenceCounted(false);

        // Android 7: Use the application context here to prevent any memory leaks
        WifiManager wifiManager = (WifiManager) service.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        wifiLock = wifiManager.createWifiLock(WifiManager.WIFI_MODE_FULL, "track-player-wifi-lock");
        wifiLock.setReferenceCounted(false);
    }

    public ExoPlayback getPlayback() {
        return playback;
    }

    public boolean shouldStopWithApp() {
        return stopWithApp;
    }

    public void setStopWithApp(boolean stopWithApp) {
        this.stopWithApp = stopWithApp;
    }

    public void setScrobble(boolean scrobble) {
        this.scrobble = scrobble;
        if (this.playback != null) {
            this.playback.setScrobble(scrobble);
        }
    }

    public void setAlwaysPauseOnInterruption(boolean alwaysPauseOnInterruption) {
        this.alwaysPauseOnInterruption = alwaysPauseOnInterruption;
    }

    public MetadataManager getMetadata() {
        return metadata;
    }

    public Handler getHandler() {
        return service.handler;
    }

    public void switchPlayback(ExoPlayback playback) {
        if (this.playback != null) {
            this.playback.stop();
            this.playback.destroy();
        }

        this.playback = playback;

        if (this.playback != null) {
            this.playback.initialize();
        }
    }

    public ExoPlayback createPlayback(Bundle options) {
        boolean autoUpdateMetadata = options.getBoolean("autoUpdateMetadata", true);
        int minBuffer = (int) Utils.toMillis(options.getDouble("minBuffer", Utils.toSeconds(DEFAULT_MIN_BUFFER_MS)));
        int maxBuffer = (int) Utils.toMillis(options.getDouble("maxBuffer", Utils.toSeconds(DEFAULT_MAX_BUFFER_MS)));
        int playBuffer = (int) Utils.toMillis(options.getDouble("playBuffer", Utils.toSeconds(DEFAULT_BUFFER_FOR_PLAYBACK_MS)));
        int backBuffer = (int) Utils.toMillis(options.getDouble("backBuffer", Utils.toSeconds(DEFAULT_BACK_BUFFER_DURATION_MS)));
        long cacheMaxSize = (long) (options.getDouble("maxCacheSize", 0) * 1024);
        int multiplier = DEFAULT_BUFFER_FOR_PLAYBACK_AFTER_REBUFFER_MS / DEFAULT_BUFFER_FOR_PLAYBACK_MS;

        LoadControl control = new DefaultLoadControl.Builder()
                .setBufferDurationsMs(minBuffer, maxBuffer, playBuffer, playBuffer * multiplier)
                .setBackBuffer(backBuffer, false)
                .build();

        ExoPlayer player = new ExoPlayer.Builder(service)
                .setLoadControl(control)
                .build();

        player.setAudioAttributes(new androidx.media3.common.AudioAttributes.Builder()
                .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC).setUsage(C.USAGE_MEDIA).build(), false);

        return new ExoPlayback(service, this, player, cacheMaxSize, autoUpdateMetadata, scrobble);
    }

    @SuppressLint("WakelockTimeout")
    public void onPlay() {
        if (playback == null) return;

        Track track = playback.getCurrentTrack();
        if (track == null) return;

        if (!playback.isRemote()) {
            requestFocus();

            if (!receivingNoisyEvents) {
                receivingNoisyEvents = true;
                service.registerReceiver(noisyReceiver, new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY));
            }

            if (!wakeLock.isHeld()) wakeLock.acquire();

            if (!Utils.isLocal(track.uri)) {
                if (!wifiLock.isHeld()) wifiLock.acquire();
            }
        }

        if (playback.shouldAutoUpdateMetadata())
            metadata.setActive(true);
    }

    public void onPause() {
        // Unregisters the noisy receiver
        if (receivingNoisyEvents) {
            service.unregisterReceiver(noisyReceiver);
            receivingNoisyEvents = false;
        }

        // Release the wake and the wifi locks
        if (wakeLock.isHeld()) wakeLock.release();
        if (wifiLock.isHeld()) wifiLock.release();

        if (playback.shouldAutoUpdateMetadata())
            metadata.setActive(true);
    }

    public void onStop() {
        // Unregisters the noisy receiver
        if (receivingNoisyEvents) {
            service.unregisterReceiver(noisyReceiver);
            receivingNoisyEvents = false;
        }

        // Release the wake and the wifi locks
        if (wakeLock.isHeld()) wakeLock.release();
        if (wifiLock.isHeld()) wifiLock.release();

        abandonFocus();

        if (playback.shouldAutoUpdateMetadata())
            metadata.setActive(false);
    }

    public void onStateChange(int state) {
        Bundle bundle = new Bundle();
        bundle.putInt("state", state);
        service.emit(MusicEvents.PLAYBACK_STATE, bundle);

        if (playback.shouldAutoUpdateMetadata())
            metadata.updatePlayback(playback);
    }

    public void onQueueChange() {
        service.emit(MusicEvents.QUEUE_CHANGED, null);
    }

    public void onShuffleChange(boolean value) {
        Bundle bundle = new Bundle();
        bundle.putBoolean("enabled", value);
        service.emit(MusicEvents.SHUFFLE_CHANGED, bundle);
    }

    public void onRepeatModeChange(int repeatMode) {
        Bundle bundle = new Bundle();
        bundle.putInt("mode", repeatMode);
        service.emit(MusicEvents.REPEATMODE_CHANGED, bundle);
    }

    public void onDownloadsPausedChange(boolean downloadsPaused) {
        Bundle bundle = new Bundle();
        bundle.putBoolean("paused", downloadsPaused);
        service.emit(MusicEvents.DOWNLOADS_PAUSED_CHANGED, bundle);
    }

    public void onDownloadStateChange(String id, int state) {
        Bundle bundle = new Bundle();
        bundle.putString("id", id);
        bundle.putInt("state", state);
        service.emit(MusicEvents.DOWNLOAD_CHANGED, bundle);
    }

    public void onDownloadProgressStateChange(String id, long contentLength, long bytesDownloaded, float percentDownloaded) {
        Bundle bundle = new Bundle();
        bundle.putString("id", id);
        bundle.putLong("contentLength", contentLength);
        bundle.putLong("bytesDownloaded", bytesDownloaded);
        bundle.putFloat("percentDownloaded", percentDownloaded);
        service.emit(MusicEvents.DOWNLOAD_PROGRESS_CHANGED, bundle);
    }

    public void onDownloadsChange() {
        service.emit(MusicEvents.DOWNLOADS_CHANGED, null);
    }

    public void onPlaybackParameterChange(float speed, float pitch) {
        Bundle bundle = new Bundle();
        bundle.putFloat("speed", speed);
        bundle.putFloat("pitch", pitch);
        service.emit(MusicEvents.PLAYBACK_PARAMETERS_CHANGED, bundle);
    }

    public void onScrobble(Integer trackIndex) {
        Bundle bundle = new Bundle();
        if (trackIndex != null) bundle.putInt("trackIndex", trackIndex);
        service.emit(MusicEvents.SCROBBLE, bundle);
    }

    public void onTrackUpdate(Integer prevIndex, long prevPos, Integer nextIndex, Track next) {
        if (playback.shouldAutoUpdateMetadata() && next != null)
            metadata.updateMetadata(playback, next);

        Bundle bundle = new Bundle();
        if (prevIndex != null) bundle.putInt("track", prevIndex);
        bundle.putDouble("position", Utils.toSeconds(prevPos));
        if (nextIndex != null) bundle.putInt("nextTrack", nextIndex);
        service.emit(MusicEvents.PLAYBACK_TRACK_CHANGED, bundle);
    }

    public void onReset() {
        metadata.removeNotifications();
    }

    public void onEnd(Integer previousIndex, long prevPos) {
        Bundle bundle = new Bundle();
        if (previousIndex != null) bundle.putInt("track", previousIndex);
        bundle.putDouble("position", Utils.toSeconds(prevPos));
        service.emit(MusicEvents.PLAYBACK_QUEUE_ENDED, bundle);
    }

    public void onMetadataReceived(String source, String title, String url, String artist, String album, String date, String genre) {
        Bundle bundle = new Bundle();
        bundle.putString("source", source);
        bundle.putString("title", title);
        bundle.putString("url", url);
        bundle.putString("artist", artist);
        bundle.putString("album", album);
        bundle.putString("date", date);
        bundle.putString("genre", genre);
        service.emit(MusicEvents.PLAYBACK_METADATA, bundle);
    }

    public void onError(String code, String error) {
        Log.e(Utils.LOG, "Playback error: " + code + " - " + error);
        Bundle bundle = new Bundle();
        bundle.putString("code", code);
        bundle.putString("message", error);
        service.emit(MusicEvents.PLAYBACK_ERROR, bundle);
    }

    @Override
    public void onAudioFocusChange(int focus) {
        boolean permanent = false;
        boolean paused = false;
        boolean ducking = false;

        switch (focus) {
            case AudioManager.AUDIOFOCUS_LOSS:
                permanent = true;
                abandonFocus();
            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
                paused = true;
                break;
            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
                if (alwaysPauseOnInterruption)
                    paused = true;
                else
                    ducking = true;
                break;
            default:
                break;
        }

        if (ducking) {
            playback.setVolumeMultiplier(0.5F);
            wasDucking = true;
        } else if (wasDucking) {
            playback.setVolumeMultiplier(1.0F);
            wasDucking = false;
        }

        Bundle bundle = new Bundle();
        bundle.putBoolean("permanent", permanent);
        bundle.putBoolean("paused", paused);
        service.emit(MusicEvents.BUTTON_DUCK, bundle);
    }

    private void requestFocus() {
        if (hasAudioFocus) return;
        hasAudioFocus = true;

        AudioManager manager = (AudioManager) service.getSystemService(Context.AUDIO_SERVICE);
        int r;

        if (manager == null) {
            r = AudioManager.AUDIOFOCUS_REQUEST_FAILED;
        } else if (Build.VERSION.SDK_INT >= 26) {
            focus = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                    .setAudioAttributes(new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .build())
                    .setOnAudioFocusChangeListener(this)
                    .setWillPauseWhenDucked(alwaysPauseOnInterruption)
                    .build();

            r = manager.requestAudioFocus(focus);
        } else {
            //noinspection deprecation
            r = manager.requestAudioFocus(this, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        }
        hasAudioFocus = r == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
    }

    private void abandonFocus() {
        if (!hasAudioFocus) return;
        AudioManager manager = (AudioManager) service.getSystemService(Context.AUDIO_SERVICE);
        int r;

        if (manager == null) {
            r = AudioManager.AUDIOFOCUS_REQUEST_FAILED;
        } else if (Build.VERSION.SDK_INT >= 26) {
            r = manager.abandonAudioFocusRequest(focus);
        } else {
            //noinspection deprecation
            r = manager.abandonAudioFocus(this);
        }

        hasAudioFocus = r != AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
    }

    public void destroy() {
        // Disable audio focus
        abandonFocus();

        // Stop receiving audio becoming noisy events
        if (receivingNoisyEvents) {
            service.unregisterReceiver(noisyReceiver);
            receivingNoisyEvents = false;
        }

        // Release the playback resources
        if (playback != null) playback.destroy();

        // Release the metadata resources
        metadata.destroy();

        // Release the locks
        if (wifiLock.isHeld()) wifiLock.release();
        if (wakeLock.isHeld()) wakeLock.release();
    }

}
