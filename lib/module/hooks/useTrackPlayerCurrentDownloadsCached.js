"use strict";

import { useEffect, useRef, useState } from "react";
import { DownloadState } from "../constants/DownloadState.js";
export function useTrackPlayerCurrentDownloadsCached(cache) {
  const [data, setData] = useState(undefined);
  const isUnmountedRef = useRef(true);
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
  useEffect(() => {
    const refresh = downloads => {
      const ds = downloads ? downloads.filter(d => d.state !== DownloadState.Completed) : cache.getCurrentDownloads();
      if (isUnmountedRef.current) {
        return;
      }
      setData(ds);
    };
    cache.subscribeDownloadsChanges(refresh);
    refresh();
    return () => {
      cache.unsubscribeDownloadsChanges(refresh);
    };
  }, [cache]);
  return data;
}
//# sourceMappingURL=useTrackPlayerCurrentDownloadsCached.js.map