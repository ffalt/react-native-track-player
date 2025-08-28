"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getDownloads } from "../trackPlayer.js";
export function useTrackPlayerDownloads() {
  return useTrackPlayerDataEvent(Event.DownloadsChanged, async () => getDownloads(), undefined);
}
//# sourceMappingURL=useTrackPlayerDownloads.js.map