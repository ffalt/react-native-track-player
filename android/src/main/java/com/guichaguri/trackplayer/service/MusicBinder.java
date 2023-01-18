package com.guichaguri.trackplayer.service;

import android.os.Binder;
import android.os.Bundle;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import com.guichaguri.trackplayer.downloader.AudioDownloadTracker;
import com.guichaguri.trackplayer.service.metadata.MetadataManager;
import com.guichaguri.trackplayer.service.models.NowPlayingMetadata;
import com.guichaguri.trackplayer.service.player.ExoPlayback;

/**
 * @author Guichaguri
 */
public class MusicBinder extends Binder {

    private final MusicService service;
    private final MusicManager manager;
    private final AudioDownloadTracker tracker;

    public MusicBinder(MusicService service, MusicManager manager, AudioDownloadTracker tracker) {
        this.service = service;
        this.manager = manager;
        this.tracker = tracker;
    }

    public void post(Runnable r) {
        service.handler.post(r);
    }

    public ExoPlayback getPlayback() {
        ExoPlayback playback = manager.getPlayback();

        // TODO remove?
        if (playback == null) {
            playback = manager.createPlayback(new Bundle());
            manager.switchPlayback(playback);
        }

        return playback;
    }

    public void setupPlayer(Bundle bundle, Promise promise) {
        manager.switchPlayback(manager.createPlayback(bundle));
        promise.resolve(null);
    }

    public void updateOptions(Bundle bundle) {
        manager.setScrobble(bundle.getBoolean("scrobble", false));
        manager.setStopWithApp(bundle.getBoolean("stopWithApp", false));
        manager.setAlwaysPauseOnInterruption(bundle.getBoolean("alwaysPauseOnInterruption", false));
        manager.getMetadata().updateOptions(bundle);
    }

    public void updateNowPlayingMetadata(NowPlayingMetadata nowPlaying) {
        MetadataManager metadata = manager.getMetadata();

        // TODO elapsedTime
        metadata.updateMetadata(getPlayback(), nowPlaying);
        metadata.setActive(true);
    }

    public void clearNowPlayingMetadata() {
        manager.getMetadata().setActive(false);
    }

    public int getRatingType() {
        return manager.getMetadata().getRatingType();
    }

    public void destroy() {
        service.destroy();
        service.stopSelf();
    }

    public AudioDownloadTracker getDownloadTracker() {
        return tracker;
    }
}
