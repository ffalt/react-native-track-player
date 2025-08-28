export interface Download {
  id: string;
  url: string;
  state: number;
  contentLength: number;
  bytesDownloaded: number;
  percentDownloaded: number;
  failureReason: number;
  stopReason: number;
  startTimeMs: number;
  updateTimeMs: number;
}
