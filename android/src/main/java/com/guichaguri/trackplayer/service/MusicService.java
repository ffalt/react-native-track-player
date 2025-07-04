package com.guichaguri.trackplayer.service;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.content.pm.ServiceInfo;
import android.os.Build;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;
import androidx.media.session.MediaButtonReceiver;

import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.offline.DownloadService;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import com.guichaguri.trackplayer.downloader.AudioDownloadService;
import com.guichaguri.trackplayer.downloader.AudioDownloadTracker;
import com.guichaguri.trackplayer.service.Utils;
import com.guichaguri.trackplayer.R;

import static android.app.Service.START_NOT_STICKY;

@UnstableApi /**
 * @author Guichaguri
 */
public class MusicService extends HeadlessJsTaskService {

    MusicManager manager;
    Handler handler;
    AudioDownloadTracker tracker;

    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        return new HeadlessJsTaskConfig("TrackPlayer", Arguments.createMap(), 0, true);
    }

    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        // Overridden to prevent the service from being terminated
    }

    public void emit(String event, Bundle data) {
        Intent intent = new Intent(Utils.EVENT_INTENT);

        intent.putExtra("event", event);
        if(data != null) intent.putExtra("data", data);

        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
    }

    public void destroy() {
        if(handler != null) {
            handler.removeMessages(0);
            handler = null;
        }

        if(manager != null) {
            manager.destroy();
            manager = null;
        }
    }

    private void onStartForeground() {
        boolean serviceForeground = false;

        if(manager != null) {
            // The session is only active when the service is on foreground
            serviceForeground = manager.getMetadata().getSession().isActive();
        }

        if(!serviceForeground) {
            ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

            // Checks whether there is a React activity
            if(reactContext == null || !reactContext.hasCurrentActivity()) {
                String channel = Utils.getNotificationChannel((Context) this);
                NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channel).setSmallIcon(R.drawable.play);

                // Sets the service to foreground with an empty notification
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                    startForeground(1, builder.build());
                } else {
                    startForeground(1, builder.build(), ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
                }
                // Stops the service right after
                stopSelf();
            }
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        if(Utils.CONNECT_INTENT.equals(intent.getAction())) {
            return new MusicBinder(this, manager, tracker);
        }

        return super.onBind(intent);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if(intent != null && Intent.ACTION_MEDIA_BUTTON.equals(intent.getAction())) {
            // Check if the app is on background, then starts a foreground service and then ends it right after
            onStartForeground();

            if(manager != null) {
                MediaButtonReceiver.handleIntent(manager.getMetadata().getSession(), intent);
            }

            return START_NOT_STICKY;
        }

        manager = new MusicManager(this);
        handler = new Handler();
        tracker = new AudioDownloadTracker((Context) this, manager);

        super.onStartCommand(intent, flags, startId);
        return START_NOT_STICKY;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        String channel = Utils.getNotificationChannel((Context) this);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channel).setSmallIcon(R.drawable.play);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            startForeground(1, builder.build());
        } else {
            startForeground(1, builder.build(), ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        }
    }

    private void startDownloadService() {
        // Starting the service in the foreground causes notification flicker if there is no scheduled
        // action. Starting it in the background throws an exception if the app is in the background too
        // (e.g. if device screen is locked).
        Log.d(Utils.LOG, "startDownloadService");
        try {
            DownloadService.start((Context)this, AudioDownloadService.class);
        } catch (IllegalStateException e) {
            Log.e(Utils.LOG, e.toString());
            DownloadService.startForeground((Context)this, AudioDownloadService.class);
        }
    }


    @Override
    public void onDestroy() {
        super.onDestroy();

        destroy();
        stopForeground(true);
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);

        if (manager == null || manager.shouldStopWithApp()) {
            if (manager != null && manager.getPlayback() != null) {
                manager.getPlayback().stop();
            }
            destroy();
            stopSelf();
        }
    }
}
