"use strict";

import { useTrackPlayerPlaybackParameters } from "./useTrackPlayerPlaybackParameters.js";
export function useTrackPlayerPlaybackSpeed() {
  const params = useTrackPlayerPlaybackParameters();
  return params.speed;
}
//# sourceMappingURL=useTrackPlayerPlaybackSpeed.js.map