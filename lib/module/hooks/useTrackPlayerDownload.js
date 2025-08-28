"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getDownload } from "../trackPlayer.js";
export function useTrackPlayerDownload(id) {
  return useTrackPlayerDataEvent(Event.DownloadChanged, async () => getDownload(id), undefined, () => false,
  // always update
  payload => payload?.id === id);
}
//# sourceMappingURL=useTrackPlayerDownload.js.map