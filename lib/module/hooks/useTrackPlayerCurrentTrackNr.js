"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getCurrentTrack } from "../trackPlayer.js";
function noNull(value) {
  return value === null ? undefined : value;
}
export function useTrackPlayerCurrentTrackNr() {
  return useTrackPlayerDataEvent(Event.PlaybackTrackChanged, async payload => noNull(payload ? payload?.nextTrack : await getCurrentTrack()), undefined, () => false // always update, even if trackNr did not change (the track itself may have changed)
  );
}
//# sourceMappingURL=useTrackPlayerCurrentTrackNr.js.map