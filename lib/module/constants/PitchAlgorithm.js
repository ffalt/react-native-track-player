"use strict";

import { Constants } from "../NativeTrackPlayer.js";
export let PitchAlgorithm = function (PitchAlgorithm) {
  PitchAlgorithm[PitchAlgorithm["Linear"] = Constants?.PITCH_ALGORITHM_LINEAR ?? 1] = "Linear";
  PitchAlgorithm[PitchAlgorithm["Music"] = Constants?.PITCH_ALGORITHM_MUSIC ?? 2] = "Music";
  PitchAlgorithm[PitchAlgorithm["Voice"] = Constants?.PITCH_ALGORITHM_VOICE ?? 3] = "Voice";
  return PitchAlgorithm;
}({});
//# sourceMappingURL=PitchAlgorithm.js.map