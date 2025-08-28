"use strict";

import { Constants } from "../NativeTrackPlayer.js";
export let RepeatMode = function (RepeatMode) {
  RepeatMode[RepeatMode["Off"] = Constants?.REPEAT_OFF ?? 1] = "Off";
  RepeatMode[RepeatMode["Track"] = Constants?.REPEAT_TRACK ?? 2] = "Track";
  RepeatMode[RepeatMode["Queue"] = Constants?.REPEAT_QUEUE ?? 3] = "Queue";
  return RepeatMode;
}({});
//# sourceMappingURL=RepeatMode.js.map