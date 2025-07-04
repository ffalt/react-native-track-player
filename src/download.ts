import { useEffect, useRef, useState } from 'react';
import { EmitterSubscription } from 'react-native';
import { Download, DownloadState, DownloadRequest, Event } from './interfaces';
import TrackPlayer from './trackPlayer';

export class TrackPlayerDownloadManager {
  private downloadChangeSubscriptions = new Map<string, Array<(download: Download) => void>>();
  private downloadsChangeSubscriptions: Array<(downloads: Array<Download>) => void> = [];
  private downloads = new Map<string, Download>();
  private subscriptions: Array<EmitterSubscription> = [];

  async init(): Promise<void> {
    this.connect();
    await this.load();
  }

  async destroy(): Promise<void> {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }

  connect(): void {
    this.subscriptions.push(
      TrackPlayer.addEventListener(Event.DownloadChanged, ({ id, state }) => {
        this.updateDownload(id, state).catch(console.error);
      })
    );
    this.subscriptions.push(
      TrackPlayer.addEventListener(Event.DownloadProgressChanged, ({ id, contentLength, bytesDownloaded, percentDownloaded }) => {
        this.updateDownloadProgress(id, contentLength, bytesDownloaded, percentDownloaded).catch(console.error);
      })
    );
  }

  getDownload(id: string): Download | undefined {
    return this.downloads.get(id);
  }

  getDownloads(): Array<Download> {
    return Array.from(this.downloads.values());
  }

  getCurrentDownloads(): Array<Download> {
    return this.getDownloads().filter(d => d.state !== DownloadState.Completed);
  }

  private async updateDownload(id: string, state: DownloadState): Promise<void> {
    if (state === DownloadState.Removing) {
      this.downloads.delete(id);
      this.notifyDownloadsChange();
    } else {
      const download = await TrackPlayer.getDownload(id);
      if (!download) {
        this.downloads.delete(id);
      } else {
        this.downloads.set(id, download);
      }
      this.notifyDownloadsChange();
    }
  }

  private async updateDownloadProgress(id: string, contentLength: number, bytesDownloaded: number, percentDownloaded: number): Promise<void> {
    const download = this.downloads.get(id);
    if (download) {
      download.contentLength = contentLength;
      download.bytesDownloaded = bytesDownloaded;
      download.percentDownloaded = percentDownloaded;
      this.notifyDownloadChange(download);
    }
  }

  private async load(): Promise<void> {
    const downloads = await TrackPlayer.getDownloads();
    this.downloads.clear();
    for (const download of downloads) {
      this.downloads.set(download.id, download);
    }
  }

  async clear(): Promise<void> {
    await TrackPlayer.clearDownloads();
    this.notifyDownloadsChange();
  }

  async setHeaders(headers: { [key: string]: string }): Promise<void> {
    await TrackPlayer.setDownloadHeaders(headers);
  }

  async download(requests: Array<DownloadRequest>): Promise<void> {
    await TrackPlayer.addDownloads(requests);
  }

  async remove(ids: Array<string>): Promise<void> {
    for (const id of ids) {
      await TrackPlayer.removeDownload(id);
    }
    this.notifyDownloadsChange();
  }

  subscribeDownloadsChanges(listen: () => void): void {
    this.downloadsChangeSubscriptions.push(listen);
  }

  unsubscribeDownloadsChanges(listen: () => void): void {
    this.downloadsChangeSubscriptions = this.downloadsChangeSubscriptions.filter(u => u !== listen);
  }

  private notifyDownloadsChange(): void {
    const list = this.getDownloads();
    this.downloadsChangeSubscriptions.forEach(update => update(list));
  }

  subscribeDownloadChange(id: string, update: (download: Download) => void): void {
    const array = this.downloadChangeSubscriptions.get(id) || [];
    array.push(update);
    this.downloadChangeSubscriptions.set(id, array);
  }

  unsubscribeDownloadChange(id: string, update: (download: Download) => void): void {
    let array = this.downloadChangeSubscriptions.get(id) || [];
    array = array.splice(array.indexOf(update), 1);
    if (array.length === 0) {
      this.downloadChangeSubscriptions.delete(id);
    } else {
      this.downloadChangeSubscriptions.set(id, array);
    }
  }

  private notifyDownloadChange(download: Download): void {
    const listeners = this.downloadChangeSubscriptions.get(download.id);
    if (listeners) {
      listeners.forEach(update => update(download));
    }
  }

}

export function useTrackPlayerCurrentDownloadsCached(cache: TrackPlayerDownloadManager): Array<Download> | undefined {
  const [data, setData] = useState<Array<Download> | undefined>(undefined);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useEffect(() => {

    const refresh = (downloads?: Array<Download>): void => {
      const ds = downloads ?
        downloads.filter(d => d.state !== DownloadState.Completed)
        : cache.getCurrentDownloads();
      if (isUnmountedRef.current) {
        return;
      }
      setData(ds);
    };

    cache.subscribeDownloadsChanges(refresh);
    refresh();
    return (): void => {
      cache.unsubscribeDownloadsChanges(refresh);
    };
  }, [cache]);

  return data;
}

export function useTrackPlayerDownloadCached(id: string, cache: TrackPlayerDownloadManager): Download | undefined {
  const [data, setData] = useState<Download | undefined>(undefined);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);


  useEffect(() => {
    const refresh = (download?: Download): void => {
      const d = download ? download : cache.getDownload(id);
      if (isUnmountedRef.current) {
        return;
      }
      setData(d);
    };

    cache.subscribeDownloadChange(id, refresh);
    refresh();

    return (): void => {
      cache.unsubscribeDownloadChange(id, refresh);
    };
  }, [id, cache]);

  return data;
}

export function useTrackPlayerDownloadsCached(cache: TrackPlayerDownloadManager): Array<Download> | undefined {
  const [data, setData] = useState<Array<Download> | undefined>(undefined);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useEffect(() => {

    const refresh = (downloads?: Array<Download>): void => {
      const ds = downloads ?
        downloads
        : cache.getDownloads();
      if (isUnmountedRef.current) {
        return;
      }
      setData(ds);
    };

    cache.subscribeDownloadsChanges(refresh);
    refresh();
    return (): void => {
      cache.unsubscribeDownloadsChanges(refresh);
    };
  }, [cache]);

  return data;
}
