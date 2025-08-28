"use strict";

import { useTrackPlayerPlaybackState } from "./useTrackPlayerPlaybackState.js";
export function useTrackPlayerPlaybackStateIs(...states) {
  const state = useTrackPlayerPlaybackState();
  return states.includes(state);
}
//# sourceMappingURL=useTrackPlayerPlaybackStateIs.js.map