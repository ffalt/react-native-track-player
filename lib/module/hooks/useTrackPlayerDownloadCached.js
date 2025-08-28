"use strict";

import { useEffect, useRef, useState } from "react";
export function useTrackPlayerDownloadCached(id, cache) {
  const [data, setData] = useState(undefined);
  const isUnmountedRef = useRef(true);
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
  useEffect(() => {
    const refresh = download => {
      const d = download ? download : cache.getDownload(id);
      if (isUnmountedRef.current) {
        return;
      }
      setData(d);
    };
    cache.subscribeDownloadChange(id, refresh);
    refresh();
    return () => {
      cache.unsubscribeDownloadChange(id, refresh);
    };
  }, [id, cache]);
  return data;
}
//# sourceMappingURL=useTrackPlayerDownloadCached.js.map