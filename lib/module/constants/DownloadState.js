"use strict";

import { Constants } from "../NativeTrackPlayer.js";
export let DownloadState = function (DownloadState) {
  DownloadState[DownloadState["Queued"] = Constants?.DOWNLOAD_STATE_QUEUED ?? 1] = "Queued";
  DownloadState[DownloadState["Stopped"] = Constants?.DOWNLOAD_STATE_STOPPED ?? 2] = "Stopped";
  DownloadState[DownloadState["Downloading"] = Constants?.DOWNLOAD_STATE_DOWNLOADING ?? 3] = "Downloading";
  DownloadState[DownloadState["Completed"] = Constants?.DOWNLOAD_STATE_COMPLETED ?? 4] = "Completed";
  DownloadState[DownloadState["Failed"] = Constants?.DOWNLOAD_STATE_FAILED ?? 5] = "Failed";
  DownloadState[DownloadState["Removing"] = Constants?.DOWNLOAD_STATE_REMOVING ?? 6] = "Removing";
  DownloadState[DownloadState["Restarting"] = Constants?.DOWNLOAD_STATE_RESTARTING ?? 7] = "Restarting";
  return DownloadState;
}({});
//# sourceMappingURL=DownloadState.js.map