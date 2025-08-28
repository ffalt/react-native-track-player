import { Event } from "../constants/Event";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getShuffleModeEnabled } from "../trackPlayer";

export function useTrackPlayerShuffleModeEnabled(): boolean {
  return useTrackPlayerDataEvent<boolean, Event.ShuffleModeChanged>(
    Event.ShuffleModeChanged,
    async (payload) => payload ? payload.enabled : getShuffleModeEnabled(),
    false
  );
}
