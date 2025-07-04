/*
 * Copyright (C) 2016 The Android Open Source Project
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

import android.content.Context;
import android.os.Bundle;

import androidx.media3.common.util.UnstableApi;
import androidx.media3.exoplayer.DefaultRenderersFactory;
import androidx.media3.exoplayer.RenderersFactory;
import androidx.media3.database.DatabaseProvider;
import androidx.media3.database.StandaloneDatabaseProvider;
import androidx.media3.exoplayer.offline.Download;
import androidx.media3.exoplayer.offline.DownloadManager;
import androidx.media3.exoplayer.offline.DownloadNotificationHelper;
import androidx.media3.datasource.DataSource;
import androidx.media3.datasource.DefaultDataSource;
import androidx.media3.datasource.DefaultHttpDataSource;
import androidx.media3.datasource.cache.Cache;
import androidx.media3.datasource.cache.CacheDataSource;
import androidx.media3.datasource.cache.NoOpCacheEvictor;
import androidx.media3.datasource.cache.SimpleCache;
import java.io.File;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.Map;
import java.util.concurrent.Executors;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

@UnstableApi public final class DownloadUtils {

  public static final String DOWNLOAD_NOTIFICATION_CHANNEL_ID = "download_channel";

  private static final String TAG = "DemoUtil";
  private static final String DOWNLOAD_CONTENT_DIRECTORY = "downloads";

  private static @NonNull DataSource.Factory dataSourceFactory;
  private static @NonNull DefaultHttpDataSource.Factory httpDataSourceFactory;
  private static @NonNull DatabaseProvider databaseProvider;
  private static @NonNull File downloadDirectory;
  private static @NonNull Cache downloadCache;
  private static @NonNull DownloadManager downloadManager;
  private static @NonNull DownloadNotificationHelper downloadNotificationHelper;

  // ** Returns whether extension renderers should be used. */
  public static boolean useExtensionRenderers() {return false; //BuildConfig.USE_DECODER_EXTENSIONS;
  }

  public static RenderersFactory buildRenderersFactory(
      Context context, boolean preferExtensionRenderer) {
    @DefaultRenderersFactory.ExtensionRendererMode
    int extensionRendererMode =
        useExtensionRenderers()
            ? (preferExtensionRenderer
                ? DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER
                : DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON)
            : DefaultRenderersFactory.EXTENSION_RENDERER_MODE_OFF;
    return new DefaultRenderersFactory(context.getApplicationContext())
        .setExtensionRendererMode(extensionRendererMode);
  }

  public static synchronized DefaultHttpDataSource.Factory getHttpDataSourceFactory() {
    if (httpDataSourceFactory == null) {
        // We don't want to use Cronet, or we failed to instantiate a CronetEngine.
        CookieManager cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER);
        CookieHandler.setDefault(cookieManager);
        httpDataSourceFactory = new DefaultHttpDataSource.Factory();
    }
    return httpDataSourceFactory;
  }

  public static synchronized void setDownloadHeaders(Map<String, String> headers) {
    getHttpDataSourceFactory().setDefaultRequestProperties(headers);
  }

  // ** Returns a {@link DataSource.Factory}. */
  public static synchronized DataSource.Factory getDataSourceFactory(Context context) {
    if (dataSourceFactory == null) {
      context = context.getApplicationContext();
      DefaultDataSource.Factory upstreamFactory =
          new DefaultDataSource.Factory(context, getHttpDataSourceFactory());
      dataSourceFactory = buildReadOnlyCacheDataSource(upstreamFactory, getDownloadCache(context));
    }
    return dataSourceFactory;
  }

  public static synchronized DownloadNotificationHelper getDownloadNotificationHelper(
      Context context) {
    if (downloadNotificationHelper == null) {
      downloadNotificationHelper =
          new DownloadNotificationHelper(context, DOWNLOAD_NOTIFICATION_CHANNEL_ID);
    }
    return downloadNotificationHelper;
  }

  public static synchronized DownloadManager getDownloadManager(Context context) {
    ensureDownloadManagerInitialized(context);
    return downloadManager;
  }

  public static synchronized Cache getDownloadCache(Context context) {
    if (downloadCache == null) {
      File downloadContentDirectory =
          new File(getDownloadDirectory(context), DOWNLOAD_CONTENT_DIRECTORY);
      downloadCache =
          new SimpleCache(
              downloadContentDirectory, new NoOpCacheEvictor(), getDatabaseProvider(context));
    }
    return downloadCache;
  }

  private static synchronized void ensureDownloadManagerInitialized(Context context) {
    if (downloadManager == null) {
      downloadManager =
          new DownloadManager(
              context,
              getDatabaseProvider(context),
              getDownloadCache(context),
              getHttpDataSourceFactory(),
              Executors.newFixedThreadPool(/* nThreads= */ 6));
    }
  }

  private static synchronized DatabaseProvider getDatabaseProvider(Context context) {
    if (databaseProvider == null) {
      databaseProvider = new StandaloneDatabaseProvider(context);
    }
    return databaseProvider;
  }

  private static synchronized File getDownloadDirectory(Context context) {
    if (downloadDirectory == null) {
      downloadDirectory = context.getExternalFilesDir(/* type= */ null);
      if (downloadDirectory == null) {
        downloadDirectory = context.getFilesDir();
      }
    }
    return downloadDirectory;
  }

  private static CacheDataSource.Factory buildReadOnlyCacheDataSource(
      DataSource.Factory upstreamFactory, Cache cache) {
    return new CacheDataSource.Factory()
        .setCache(cache)
        .setUpstreamDataSourceFactory(upstreamFactory)
        .setCacheWriteDataSinkFactory(null)
        .setFlags(CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR);
  }


  public static Bundle getDownloadBundle(Download download) {
    if (download == null) {
      return null;
    }
    Bundle bundle = new Bundle();
    bundle.putString("id", download.request.id);
    bundle.putInt("state", download.state);
    bundle.putString("url", download.request.uri.toString());
    bundle.putLong("contentLength", download.contentLength);
    bundle.putLong("bytesDownloaded", download.getBytesDownloaded());
    bundle.putFloat("percentDownloaded", download.getPercentDownloaded());
    bundle.putInt("failureReason", download.failureReason);
    bundle.putInt("stopReason", download.stopReason);
    bundle.putLong("startTimeMs", download.startTimeMs);
    bundle.putLong("updateTimeMs", download.updateTimeMs);
    return bundle;
  }

  private DownloadUtils() {}
}
