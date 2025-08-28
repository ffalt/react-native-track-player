import { useEffect, useRef } from "react";
import { type EventPayloadByEventWithType } from "../interfaces/EventPayloadByEvent";
import { Event } from "../constants/Event";
import { addEventListener } from "../trackPlayer";

export function useTrackPlayerEvent<
  E extends Event,
  H extends (data: EventPayloadByEventWithType[E]) => void,
>(event: E, handler: H) {
  const savedHandler = useRef<H>(undefined);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const sub = addEventListener<any>(event, payload => {
      if (savedHandler?.current) {
        savedHandler.current({ ...payload, type: event });
      }
    });
    return () => sub.remove();
  }, [event]);
}
