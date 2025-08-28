"use strict";

import { useEffect, useRef, useState } from "react";
import { useTrackPlayerProgress } from "./useTrackPlayerProgress.js";
export function useTrackPlayerProgressPercent(interval = 1000) {
  const [percent, setPercent] = useState({
    progress: 0,
    bufferProgress: 0
  });
  const progress = useTrackPlayerProgress(interval);
  const isUnmountedRef = useRef(true);
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
  useEffect(() => {
    if (isUnmountedRef.current) {
      return;
    }
    const {
      position,
      buffered,
      duration
    } = progress;
    setPercent({
      progress: duration ? position / duration : 0,
      bufferProgress: duration ? buffered / duration : 0
    });
  }, [progress]);
  return percent;
}
//# sourceMappingURL=useTrackPlayerProgressPercent.js.map