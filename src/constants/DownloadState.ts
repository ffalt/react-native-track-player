import { Constants } from "../NativeTrackPlayer";

export enum DownloadState {
  Queued = Constants?.DOWNLOAD_STATE_QUEUED ?? 1,
  Stopped = Constants?.DOWNLOAD_STATE_STOPPED ?? 2,
  Downloading = Constants?.DOWNLOAD_STATE_DOWNLOADING ?? 3,
  Completed = Constants?.DOWNLOAD_STATE_COMPLETED ?? 4,
  Failed = Constants?.DOWNLOAD_STATE_FAILED ?? 5,
  Removing = Constants?.DOWNLOAD_STATE_REMOVING ?? 6,
  Restarting = Constants?.DOWNLOAD_STATE_RESTARTING ?? 7
}
