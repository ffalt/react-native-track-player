/*
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.guichaguri.trackplayer.downloader;

import static com.guichaguri.trackplayer.downloader.DownloadUtils.DOWNLOAD_NOTIFICATION_CHANNEL_ID;

import android.app.Notification;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.offline.Download;
import androidx.media3.exoplayer.offline.DownloadManager;
import androidx.media3.exoplayer.offline.DownloadService;
import androidx.media3.exoplayer.scheduler.Requirements;
import androidx.media3.exoplayer.scheduler.Scheduler;
import androidx.media3.exoplayer.offline.DownloadNotificationHelper;
import androidx.media3.common.util.NotificationUtil;
import androidx.media3.common.util.Util;

import com.guichaguri.trackplayer.R;

import java.util.List;

/**
 * A service for downloading media.
 */
@UnstableApi public class AudioDownloadService extends DownloadService {

    private static final int FOREGROUND_NOTIFICATION_ID = 1;

    public AudioDownloadService() {
        super(
                FOREGROUND_NOTIFICATION_ID,
                DEFAULT_FOREGROUND_NOTIFICATION_UPDATE_INTERVAL,
                DOWNLOAD_NOTIFICATION_CHANNEL_ID,
                0, //R.string.exo_download_notification_channel_name,
                /* channelDescriptionResourceId= */ 0);
    }

    @NonNull
    @Override
    protected DownloadManager getDownloadManager() {
        // This will only happen once, because getDownloadManager is guaranteed to be called only once
        // in the life cycle of the process.
        DownloadManager downloadManager = DownloadUtils.getDownloadManager(/* context= */ this);
        DownloadNotificationHelper downloadNotificationHelper =
                DownloadUtils.getDownloadNotificationHelper(/* context= */ this);
        downloadManager.addListener(
                new TerminalStateNotificationHelper(
                        this, downloadNotificationHelper, FOREGROUND_NOTIFICATION_ID + 1));
        return downloadManager;
    }

    @Override
    protected Scheduler getScheduler() {
        return null;
    }

    @NonNull
    @Override
    protected Notification getForegroundNotification(
            @NonNull List<Download> downloads, @Requirements.RequirementFlags int notMetRequirements) {
        // Log.d(Utils.LOG, "getForegroundNotification");
        return DownloadUtils.getDownloadNotificationHelper(/* context= */ this)
                .buildProgressNotification(
                        /* context= */ this,
                        R.drawable.play, //R.drawable.ic_download,
                        /* contentIntent= */ null,
                        /* message= */ null,
                        downloads,
                        notMetRequirements);
    }

    /**
     * Creates and displays notifications for downloads when they complete or fail.
     *
     * <p>This helper will outlive the lifespan of a single instance of {@link AudioDownloadService}.
     * It is static to avoid leaking the first {@link AudioDownloadService} instance.
     */
    private static final class TerminalStateNotificationHelper implements DownloadManager.Listener {

        private final Context context;
        private final DownloadNotificationHelper notificationHelper;

        private int nextNotificationId;

        public TerminalStateNotificationHelper(
                Context context, DownloadNotificationHelper notificationHelper, int firstNotificationId) {
            this.context = context.getApplicationContext();
            this.notificationHelper = notificationHelper;
            nextNotificationId = firstNotificationId;
        }

        @Override
        public void onDownloadChanged(
                @NonNull DownloadManager downloadManager,
                Download download, @Nullable Exception finalException
        ) {
            Notification notification;
            if (download.state == Download.STATE_COMPLETED) {
                notification =
                        notificationHelper.buildDownloadCompletedNotification(
                                context,
                                R.drawable.stop, //R.drawable.ic_download_done,
                                /* contentIntent= */ null,
                                Util.fromUtf8Bytes(download.request.data));
            } else if (download.state == Download.STATE_FAILED) {
                notification =
                        notificationHelper.buildDownloadFailedNotification(
                                context,
                                R.drawable.stop, // R.drawable.ic_download_done,
                                /* contentIntent= */ null,
                                Util.fromUtf8Bytes(download.request.data));
            } else {
                return;
            }
            NotificationUtil.setNotification(context, nextNotificationId++, notification);
        }
    }
}

