import { type EventPayloadByEvent, type EventPayloadByEventWithType } from "../interfaces/EventPayloadByEvent";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTrackPlayerEvent } from "./useTrackPlayerEvent";
import { Event } from "../constants";

export function useTrackPlayerDataEvent<T, E extends Event>(event: E, handler: (payload?: EventPayloadByEvent[E]) => Promise<T>,
                                                            defaultValue: T,
                                                            compareFunc?: (prev: T, next: T) => boolean,
                                                            filter?: (payload?: EventPayloadByEventWithType[E]) => boolean): T {
  const [data, setData] = useState<T>(defaultValue);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = useCallback((payload?: EventPayloadByEventWithType[E]) => {
    if (filter) {
      if (!filter(payload)) {
        return;
      }
    }
    handler(payload as EventPayloadByEvent[E])
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
  }, [compareFunc, data, filter, handler]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refresh(), []);
  useTrackPlayerEvent<E, (data: EventPayloadByEventWithType[E]) => void>(event, refresh);

  return data;
}
