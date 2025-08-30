"use strict";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTrackPlayerEvent } from "./useTrackPlayerEvent.js";
export function useTrackPlayerDataEvent(event, handler, defaultValue, compareFunc, filter) {
  const [data, setData] = useState(defaultValue);
  const isUnmountedRef = useRef(true);
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
  const refresh = useCallback(payload => {
    if (filter) {
      if (!filter(payload)) {
        return;
      }
    }
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
  }, [compareFunc, data, filter, handler]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refresh(), []);
  useTrackPlayerEvent(event, refresh);
  return data;
}
//# sourceMappingURL=useTrackPlayerDataEvent.js.map