"use strict";

import { Event } from "../constants/index.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getDownloadsPaused } from "../trackPlayer.js";
export function useTrackPlayerDownloadsPaused() {
  return useTrackPlayerDataEvent(Event.DownloadsPausedChanged, async payload => payload ? payload.paused : getDownloadsPaused(), false);
}
//# sourceMappingURL=useTrackPlayerDownloadsPaused.js.map