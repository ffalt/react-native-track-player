import { Constants } from "../NativeTrackPlayer";

export enum PitchAlgorithm {
  Linear = Constants?.PITCH_ALGORITHM_LINEAR ?? 1,
  Music = Constants?.PITCH_ALGORITHM_MUSIC ?? 2,
  Voice = Constants?.PITCH_ALGORITHM_VOICE ?? 3
}
