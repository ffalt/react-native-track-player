import { type Download } from "../interfaces/Download";
import { useEffect, useRef, useState } from "react";
import { TrackPlayerDownloadManager } from "../download";
import { DownloadState } from "../constants/DownloadState";

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
