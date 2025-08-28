"use strict";

import { Event } from "../constants/Event.js";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent.js";
import { getPlaybackParameters } from "../trackPlayer.js";
export function useTrackPlayerPlaybackParameters() {
  return useTrackPlayerDataEvent(Event.PlaybackParametersChanged, async payload => payload ? payload : getPlaybackParameters(), {
    speed: 1,
    pitch: 1
  });
}
//# sourceMappingURL=useTrackPlayerPlaybackParameters.js.map