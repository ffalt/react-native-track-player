"use strict";

import { Event } from "../constants/Event.js";
import { State } from "../constants/State.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getState } from "../trackPlayer.js";
export function useTrackPlayerPlaybackState() {
  return useTrackPlayerDataEvent(Event.PlaybackState, async payload => payload ? payload.state : getState(), State.None);
}
//# sourceMappingURL=useTrackPlayerPlaybackState.js.map