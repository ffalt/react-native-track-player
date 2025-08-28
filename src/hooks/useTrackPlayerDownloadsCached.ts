import { TrackPlayerDownloadManager } from "../download";
import { type Download } from "../interfaces/Download";
import { useEffect, useRef, useState } from "react";

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
