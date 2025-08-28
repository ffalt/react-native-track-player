import { Event } from "../constants";
import { type HookEventHandler } from "../interfaces";
import { useEffect, useRef } from "react";
import { addEventListener } from "../trackPlayer";

export function useTrackPlayerEvents(events: Event[], handler: HookEventHandler<any>) {
  const savedHandler = useRef<HookEventHandler<any>>(undefined);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const subs = events.map((event) => {
      return addEventListener<any>(event, (payload) => {
        if (savedHandler?.current) {
          savedHandler.current({ ...payload, type: event });
        }
      });
    });

    return () => subs.forEach((sub) => sub.remove());
  }, [events]);
}
