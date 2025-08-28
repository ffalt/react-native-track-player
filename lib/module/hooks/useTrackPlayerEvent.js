"use strict";

import { useEffect, useRef } from "react";
import { addEventListener } from "../trackPlayer.js";
export function useTrackPlayerEvent(event, handler) {
  const savedHandler = useRef(undefined);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const sub = addEventListener(event, payload => {
      if (savedHandler?.current) {
        savedHandler.current({
          ...payload,
          type: event
        });
      }
    });
    return () => sub.remove();
  }, [event]);
}
//# sourceMappingURL=useTrackPlayerEvent.js.map