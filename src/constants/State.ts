import { Constants } from "../NativeTrackPlayer";

export enum State {
  None = Constants?.STATE_NONE ?? 1,
  Ready = Constants?.STATE_READY ?? 2,
  Playing = Constants?.STATE_PLAYING ?? 3,
  Paused = Constants?.STATE_PAUSED ?? 4,
  Stopped = Constants?.STATE_STOPPED ?? 5,
  Buffering = Constants?.STATE_BUFFERING ?? 6,
  Connecting = Constants?.STATE_CONNECTING ?? 7
}
