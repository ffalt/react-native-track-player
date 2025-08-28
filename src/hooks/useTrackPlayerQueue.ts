import { useEffect, useRef, useState } from "react";
import { Event } from "../constants/Event";
import { useTrackPlayerEvent } from "./useTrackPlayerEvent";
import { getQueue } from "../trackPlayer";
import { type Track } from "../interfaces/Track";

export function useTrackPlayerQueue(): Array<Track> | undefined {
  const [queue, setQueueState] = useState<Array<Track> | undefined>();
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = () => {
    getQueue()
      .then(value => {
        if (isUnmountedRef.current) {
          return;
        }
        setQueueState(value);
      })
      .catch(console.error);
  };

  useEffect(() => refresh(), []);
  useTrackPlayerEvent(Event.QueueChanged, refresh);

  return queue;
}
