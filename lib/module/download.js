"use strict";

import { Event } from "./constants/Event.js";
import { DownloadState } from "./constants/DownloadState.js";
import { addDownloads, addEventListener, clearDownloads, getDownload, getDownloads, removeDownload, setDownloadHeaders } from "./trackPlayer.js";
export class TrackPlayerDownloadManager {
  downloadChangeSubscriptions = new Map();
  downloadsChangeSubscriptions = [];
  downloads = new Map();
  subscriptions = [];
  async init() {
    this.connect();
    await this.load();
  }
  async destroy() {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }
  connect() {
    this.subscriptions.push(addEventListener(Event.DownloadChanged, ({
      id,
      state
    }) => {
      this.updateDownload(id, state).catch(console.error);
    }));
    this.subscriptions.push(addEventListener(Event.DownloadProgressChanged, ({
      id,
      contentLength,
      bytesDownloaded,
      percentDownloaded
    }) => {
      this.updateDownloadProgress(id, contentLength, bytesDownloaded, percentDownloaded).catch(console.error);
    }));
  }
  getDownload(id) {
    return this.downloads.get(id);
  }
  getDownloads() {
    return Array.from(this.downloads.values());
  }
  getCurrentDownloads() {
    return this.getDownloads().filter(d => d.state !== DownloadState.Completed);
  }
  async updateDownload(id, state) {
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
  async updateDownloadProgress(id, contentLength, bytesDownloaded, percentDownloaded) {
    const download = this.downloads.get(id);
    if (download) {
      download.contentLength = contentLength;
      download.bytesDownloaded = bytesDownloaded;
      download.percentDownloaded = percentDownloaded;
      this.notifyDownloadChange(download);
    }
  }
  async load() {
    const downloads = await getDownloads();
    this.downloads.clear();
    for (const download of downloads) {
      this.downloads.set(download.id, download);
    }
  }
  async clear() {
    await clearDownloads();
    this.notifyDownloadsChange();
  }
  async setHeaders(headers) {
    await setDownloadHeaders(headers);
  }
  async download(requests) {
    await addDownloads(requests);
  }
  async remove(ids) {
    for (const id of ids) {
      await removeDownload(id);
    }
    this.notifyDownloadsChange();
  }
  subscribeDownloadsChanges(listen) {
    this.downloadsChangeSubscriptions.push(listen);
  }
  unsubscribeDownloadsChanges(listen) {
    this.downloadsChangeSubscriptions = this.downloadsChangeSubscriptions.filter(u => u !== listen);
  }
  notifyDownloadsChange() {
    const list = this.getDownloads();
    this.downloadsChangeSubscriptions.forEach(update => update(list));
  }
  subscribeDownloadChange(id, update) {
    const array = this.downloadChangeSubscriptions.get(id) || [];
    array.push(update);
    this.downloadChangeSubscriptions.set(id, array);
  }
  unsubscribeDownloadChange(id, update) {
    let array = this.downloadChangeSubscriptions.get(id) || [];
    array = array.splice(array.indexOf(update), 1);
    if (array.length === 0) {
      this.downloadChangeSubscriptions.delete(id);
    } else {
      this.downloadChangeSubscriptions.set(id, array);
    }
  }
  notifyDownloadChange(download) {
    const listeners = this.downloadChangeSubscriptions.get(download.id);
    if (listeners) {
      listeners.forEach(update => update(download));
    }
  }
}
//# sourceMappingURL=download.js.map