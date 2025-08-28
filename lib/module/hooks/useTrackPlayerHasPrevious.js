"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvents } from "./useTrackPlayerDataEvents.js";
import { hasPrevious } from "../trackPlayer.js";
export function useTrackPlayerHasPrevious() {
  return useTrackPlayerDataEvents([Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged], async () => hasPrevious(), false);
}
//# sourceMappingURL=useTrackPlayerHasPrevious.js.map