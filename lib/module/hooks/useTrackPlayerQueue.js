"use strict";

import { useEffect, useRef, useState } from "react";
import { Event } from "../constants/Event.js";
import { useTrackPlayerEvent } from "./useTrackPlayerEvent.js";
import { getQueue } from "../trackPlayer.js";
export function useTrackPlayerQueue() {
  const [queue, setQueueState] = useState();
  const isUnmountedRef = useRef(true);
  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);
  const refresh = () => {
    getQueue().then(value => {
      if (isUnmountedRef.current) {
        return;
      }
      setQueueState(value);
    }).catch(console.error);
  };
  useEffect(() => refresh(), []);
  useTrackPlayerEvent(Event.QueueChanged, refresh);
  return queue;
}
//# sourceMappingURL=useTrackPlayerQueue.js.map