"use strict";

import { Event } from "../constants/index.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getCurrentDownloads } from "../trackPlayer.js";
export function useTrackPlayerCurrentDownloads() {
  return useTrackPlayerDataEvent(Event.DownloadsChanged, async () => getCurrentDownloads(), undefined);
}
//# sourceMappingURL=useTrackPlayerCurrentDownloads.js.map