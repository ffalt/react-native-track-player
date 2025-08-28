import { type PlaybackParameters } from "../interfaces/PlaybackParameters";
import { Event } from "../constants/Event";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getPlaybackParameters } from "../trackPlayer";

export function useTrackPlayerPlaybackParameters(): PlaybackParameters {
  return useTrackPlayerDataEvent<PlaybackParameters, Event.PlaybackParametersChanged>(
    Event.PlaybackParametersChanged,
    async (payload) => payload ? payload : getPlaybackParameters(),
    { speed: 1, pitch: 1 }
  );
}
