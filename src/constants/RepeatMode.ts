import { Constants } from "../NativeTrackPlayer";

export enum RepeatMode {
  Off = Constants?.REPEAT_OFF ?? 1,
  Track = Constants?.REPEAT_TRACK ?? 2,
  Queue = Constants?.REPEAT_QUEUE ?? 3
}
