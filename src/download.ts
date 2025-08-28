import { type EmitterSubscription } from 'react-native';
import { type Download } from './interfaces/Download';
import { type DownloadRequest } from './interfaces/DownloadRequest';
import { Event } from './constants/Event';
import { DownloadState } from "./constants/DownloadState";
import { addDownloads, addEventListener, clearDownloads, getDownload, getDownloads, removeDownload, setDownloadHeaders } from "./trackPlayer";

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
      addEventListener(Event.DownloadChanged, ({ id, state }) => {
        this.updateDownload(id, state).catch(console.error);
      })
    );
    this.subscriptions.push(
      addEventListener(Event.DownloadProgressChanged, ({ id, contentLength, bytesDownloaded, percentDownloaded }) => {
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
      const download = await getDownload(id);
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
    const downloads = await getDownloads();
    this.downloads.clear();
    for (const download of downloads) {
      this.downloads.set(download.id, download);
    }
  }

  async clear(): Promise<void> {
    await clearDownloads();
    this.notifyDownloadsChange();
  }

  async setHeaders(headers: { [key: string]: string }): Promise<void> {
    await setDownloadHeaders(headers);
  }

  async download(requests: Array<DownloadRequest>): Promise<void> {
    await addDownloads(requests);
  }

  async remove(ids: Array<string>): Promise<void> {
    for (const id of ids) {
      await removeDownload(id);
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
