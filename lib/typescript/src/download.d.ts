import { type Download } from './interfaces/Download';
import { type DownloadRequest } from './interfaces/DownloadRequest';
export declare class TrackPlayerDownloadManager {
    private downloadChangeSubscriptions;
    private downloadsChangeSubscriptions;
    private downloads;
    private subscriptions;
    init(): Promise<void>;
    destroy(): Promise<void>;
    connect(): void;
    getDownload(id: string): Download | undefined;
    getDownloads(): Array<Download>;
    getCurrentDownloads(): Array<Download>;
    private updateDownload;
    private updateDownloadProgress;
    private load;
    clear(): Promise<void>;
    setHeaders(headers: {
        [key: string]: string;
    }): Promise<void>;
    download(requests: Array<DownloadRequest>): Promise<void>;
    remove(ids: Array<string>): Promise<void>;
    subscribeDownloadsChanges(listen: () => void): void;
    unsubscribeDownloadsChanges(listen: () => void): void;
    private notifyDownloadsChange;
    subscribeDownloadChange(id: string, update: (download: Download) => void): void;
    unsubscribeDownloadChange(id: string, update: (download: Download) => void): void;
    private notifyDownloadChange;
}
//# sourceMappingURL=download.d.ts.map