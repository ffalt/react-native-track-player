import { useCallback, useEffect, useRef, useState } from "react";
import { useTrackPlayerEvents } from "./useTrackPlayerEvents";
import { type EventPayload } from "../interfaces/EventPayload";
import { Event } from "../constants/Event";

export function useTrackPlayerDataEvents<T, S = void>(events: Array<Event>, handler: (payload?: S) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean): T {
  const [data, setData] = useState<T>(defaultValue);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = useCallback((payload?: EventPayload) => {
    handler(payload as S)
      .then(value => {
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
      })
      .catch(console.error);
  }, [compareFunc, data, handler]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refresh(), []);
  useTrackPlayerEvents(events, refresh);

  return data;
}
