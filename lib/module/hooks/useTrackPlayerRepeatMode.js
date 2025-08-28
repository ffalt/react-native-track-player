"use strict";

import { Event } from "../constants/Event.js";
import { RepeatMode } from "../constants/RepeatMode.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getRepeatMode } from "../trackPlayer.js";
export function useTrackPlayerRepeatMode() {
  return useTrackPlayerDataEvent(Event.RepeatModeChanged, async payload => payload ? payload.mode : getRepeatMode(), RepeatMode.Off);
}
//# sourceMappingURL=useTrackPlayerRepeatMode.js.map