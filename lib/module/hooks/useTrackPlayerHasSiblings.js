"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvents } from "./useTrackPlayerDataEvents.js";
import { hasNext, hasPrevious } from "../trackPlayer.js";
export function useTrackPlayerHasSiblings() {
  return useTrackPlayerDataEvents([Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged], async () => {
    return {
      hasNext: await hasNext(),
      hasPrevious: await hasPrevious()
    };
  }, {
    hasNext: false,
    hasPrevious: false
  }, (prev, next) => {
    return prev.hasNext === next.hasNext && prev.hasPrevious === next.hasPrevious;
  });
}
//# sourceMappingURL=useTrackPlayerHasSiblings.js.map