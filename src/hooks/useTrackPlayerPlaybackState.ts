import { Event } from "../constants/Event";
import { State } from "../constants/State";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getState } from "../trackPlayer";

export function useTrackPlayerPlaybackState(): State {
  return useTrackPlayerDataEvent<State, Event.PlaybackState>(
    Event.PlaybackState,
    async (payload) => payload ? payload.state : getState(),
    State.None
  );
}
