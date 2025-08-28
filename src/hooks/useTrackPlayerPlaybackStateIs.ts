import { State } from "../constants";
import { useTrackPlayerPlaybackState } from "./useTrackPlayerPlaybackState";

export function useTrackPlayerPlaybackStateIs(...states: Array<State>): boolean {
  const state = useTrackPlayerPlaybackState();
  return states.includes(state);
}
