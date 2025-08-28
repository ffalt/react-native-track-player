"use strict";

import { useEffect, useRef } from "react";
import { addEventListener } from "../trackPlayer.js";
export function useTrackPlayerEvents(events, handler) {
  const savedHandler = useRef(undefined);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const subs = events.map(event => {
      return addEventListener(event, payload => {
        if (savedHandler?.current) {
          savedHandler.current({
            ...payload,
            type: event
          });
        }
      });
    });
    return () => subs.forEach(sub => sub.remove());
  }, [events]);
}
//# sourceMappingURL=useTrackPlayerEvents.js.map