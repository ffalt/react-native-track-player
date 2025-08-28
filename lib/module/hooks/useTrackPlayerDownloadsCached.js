"use strict";

import { useEffect, useRef, useState } from "react";
export function useTrackPlayerDownloadsCached(cache) {
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
      const ds = downloads ? downloads : cache.getDownloads();
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
//# sourceMappingURL=useTrackPlayerDownloadsCached.js.map