"use strict";

import { State } from "../constants/State.js";
import { useTrackPlayerPlaybackState } from "./useTrackPlayerPlaybackState.js";
export function useTrackPlayerPlaybackStateIsPlaying() {
  const state = useTrackPlayerPlaybackState();
  return state === State.Playing;
}
//# sourceMappingURL=useTrackPlayerPlaybackStateIsPlaying.js.map