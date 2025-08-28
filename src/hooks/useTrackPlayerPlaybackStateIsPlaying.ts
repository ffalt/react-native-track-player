import { State } from "../constants/State";
import { useTrackPlayerPlaybackState } from "./useTrackPlayerPlaybackState";

export function useTrackPlayerPlaybackStateIsPlaying(): boolean {
  const state = useTrackPlayerPlaybackState();
  return state === State.Playing;
}
