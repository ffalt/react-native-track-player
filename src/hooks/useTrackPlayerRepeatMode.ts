import { Event } from "../constants/Event";
import { RepeatMode } from "../constants/RepeatMode";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getRepeatMode } from "../trackPlayer";

export function useTrackPlayerRepeatMode(): RepeatMode {
  return useTrackPlayerDataEvent<RepeatMode, Event.RepeatModeChanged>(
    Event.RepeatModeChanged,
    async (payload) => payload ? payload.mode : getRepeatMode(),
    RepeatMode.Off
  );
}
