"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvents } from "./useTrackPlayerDataEvents.js";
import { hasNext } from "../trackPlayer.js";
export function useTrackPlayerHasNext() {
  return useTrackPlayerDataEvents([Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged], async () => hasNext(), false);
}
//# sourceMappingURL=useTrackPlayerHasNext.js.map