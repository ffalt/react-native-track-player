"use strict";

import { Constants } from "../NativeTrackPlayer.js";
export let State = function (State) {
  State[State["None"] = Constants?.STATE_NONE ?? 1] = "None";
  State[State["Ready"] = Constants?.STATE_READY ?? 2] = "Ready";
  State[State["Playing"] = Constants?.STATE_PLAYING ?? 3] = "Playing";
  State[State["Paused"] = Constants?.STATE_PAUSED ?? 4] = "Paused";
  State[State["Stopped"] = Constants?.STATE_STOPPED ?? 5] = "Stopped";
  State[State["Buffering"] = Constants?.STATE_BUFFERING ?? 6] = "Buffering";
  State[State["Connecting"] = Constants?.STATE_CONNECTING ?? 7] = "Connecting";
  return State;
}({});
//# sourceMappingURL=State.js.map