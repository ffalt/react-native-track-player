package com.guichaguri.trackplayer.downloader;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.Nullable;

import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.offline.Download;
import com.google.android.exoplayer2.offline.DownloadCursor;
import com.google.android.exoplayer2.offline.DownloadHelper;
import com.google.android.exoplayer2.offline.DownloadIndex;
import com.google.android.exoplayer2.offline.DownloadManager;
import com.google.android.exoplayer2.offline.DownloadRequest;
import com.google.android.exoplayer2.util.Util;
import com.guichaguri.trackplayer.service.MusicManager;
import com.guichaguri.trackplayer.service.Utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

public class AudioDownloadTracker implements DownloadManager.Listener {

    private static final String TAG = "AudioDownloadTracker";
    protected final Handler handler = new Handler();
    protected final int updateInterval = 1000;
    private boolean periodicUpdatesStarted;
    private final Context context;
    private final DownloadManager downloadManager;
    private final DownloadIndex downloadIndex;
    private final MusicManager manager;

    public AudioDownloadTracker(Context context, MusicManager manager) {
        this.context = context.getApplicationContext();
        this.manager = manager;
        downloadManager = DownloadUtils.getDownloadManager(context);
        downloadManager.setMaxParallelDownloads(2);
        downloadIndex = downloadManager.getDownloadIndex();
        downloadManager.addListener(new DownloadManagerListener());
    }

    public boolean isDownloaded(String id) {
        try {
            return downloadIndex.getDownload(id) != null;
        } catch (IOException e) {
            return false;
        }
    }

    public int countDownloads() {
        try (DownloadCursor loadedDownloads = downloadIndex.getDownloads()) {
            return loadedDownloads.getCount();
        } catch (IOException e) {
            Log.w(TAG, "Failed to query downloads", e);
        }
        return 0;
    }

    public boolean isPaused() {
        return downloadManager.getDownloadsPaused();
    }

    public void toggleDownloadsPaused() {
        if (downloadManager.getDownloadsPaused()) {
            downloadManager.resumeDownloads();
        } else {
            downloadManager.pauseDownloads();
        }
    }

    public void resumeDownloads() {
        downloadManager.resumeDownloads();
    }

    public void pauseDownloads() {
        downloadManager.pauseDownloads();
    }

    public Download getDownload(String id) {
        try {
            return downloadIndex.getDownload(id);
        } catch (IOException e) {
            return null;
        }
    }

    public List<Download> getDownloads() {
        List<Download> downloads = new ArrayList<>();
        try (DownloadCursor loadedDownloads = downloadIndex.getDownloads()) {
            while (loadedDownloads.moveToNext()) {
                Download download = loadedDownloads.getDownload();
                downloads.add(download);
            }
        } catch (IOException e) {
            Log.w(TAG, "Failed to query downloads", e);
        }
        return downloads;
    }

    public List<Download> getCurrentDownloads() {
        return downloadManager.getCurrentDownloads();
    }

    private void addRequest(String url, String id) {
        Download download = getDownload(id);
        if (download == null) {
            DownloadRequest downloadRequest = DownloadHelper.forMediaItem(context, MediaItem.fromUri(Uri.parse(url))).getDownloadRequest(id, Util.getUtf8Bytes(id));
            downloadManager.addDownload(downloadRequest);
        }
    }

    public void add(ArrayList bundleList) {
        for (Object o : bundleList) {
            if (o instanceof Bundle) {
                String url = Utils.getString((Bundle) o, "url");
                String id = Utils.getString((Bundle) o, "id");
                addRequest(url, id);
            }
        }
        manager.onDownloadsChange();
    }

    public void remove(String id) {
        downloadManager.removeDownload(id);
    }

    public void removeDownloads() {
        downloadManager.removeAllDownloads();
    }

    private void startPeriodicUpdates() {
        periodicUpdatesStarted = true;
        update();
    }

    private void stopPeriodicUpdates() {
        periodicUpdatesStarted = false;
        handler.removeCallbacksAndMessages(null);
    }

    private void update() {
        List<Download> list = downloadManager.getCurrentDownloads();
        if (list.isEmpty()) {
            stopPeriodicUpdates();
            return;
        }
        for (Download download : list) {
            manager.onDownloadProgressStateChange(
                    download.request.id,
                    download.contentLength,
                    download.getBytesDownloaded(),
                    download.getPercentDownloaded()
            );
        }
        if (periodicUpdatesStarted) {
            handler.removeCallbacksAndMessages(null);
            handler.postDelayed(this::update, updateInterval);
        }
    }

    private class DownloadManagerListener implements DownloadManager.Listener {
        @Override
        public void onDownloadChanged(DownloadManager downloadManager, Download download, @Nullable Exception finalException) {
            manager.onDownloadStateChange(download.request.id, download.state);
            if (download.state == Download.STATE_DOWNLOADING) {
                startPeriodicUpdates();
            } else if (download.state == Download.STATE_COMPLETED) {
                manager.onDownloadsChange();
            }
        }

        @Override
        public void onDownloadRemoved(DownloadManager downloadManager, Download download) {
            manager.onDownloadsChange();
        }

        @Override
        public void onDownloadsPausedChanged(DownloadManager downloadManager, boolean downloadsPaused) {
            manager.onDownloadsPausedChange(downloadsPaused);
        }

        @Override
        public void onIdle(DownloadManager downloadManager) {
            stopPeriodicUpdates();
        }

        @Override
        public void onInitialized(DownloadManager downloadManager) {
        }
    }

}

