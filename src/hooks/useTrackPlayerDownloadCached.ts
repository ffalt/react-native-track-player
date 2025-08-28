import { type Download } from "../interfaces/Download";
import { useEffect, useRef, useState } from "react";
import { TrackPlayerDownloadManager } from "../download";

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
