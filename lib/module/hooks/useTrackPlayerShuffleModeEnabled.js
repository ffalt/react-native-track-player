"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getShuffleModeEnabled } from "../trackPlayer.js";
export function useTrackPlayerShuffleModeEnabled() {
  return useTrackPlayerDataEvent(Event.ShuffleModeChanged, async payload => payload ? payload.enabled : getShuffleModeEnabled(), false);
}
//# sourceMappingURL=useTrackPlayerShuffleModeEnabled.js.map