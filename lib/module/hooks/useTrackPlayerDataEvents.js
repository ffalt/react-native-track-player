"use strict";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTrackPlayerEvents } from "./useTrackPlayerEvents.js";
export function useTrackPlayerDataEvents(events, handler, defaultValue, compareFunc) {
  const [data, setData] = useState(defaultValue);
  const isUnmountedRef = useRef(true);
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
  const refresh = useCallback(payload => {
    handler(payload).then(value => {
      if (isUnmountedRef.current) {
        return;
      }
      if (compareFunc) {
        if (compareFunc(data, value)) {
          return;
        }
      } else {
        if (data === value) {
          return;
        }
      }
      setData(value);
    }).catch(console.error);
  }, [compareFunc, data, handler]);
  useEffect(() => refresh(), []);
  useTrackPlayerEvents(events, refresh);
  return data;
}
//# sourceMappingURL=useTrackPlayerDataEvents.js.map