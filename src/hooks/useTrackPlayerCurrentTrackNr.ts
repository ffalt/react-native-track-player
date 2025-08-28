import { Event } from "../constants/Event";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getCurrentTrack } from "../trackPlayer";

function noNull<T>(value: T | undefined | null): T | undefined {
  return value === null ? undefined : value;
}

export function useTrackPlayerCurrentTrackNr(): number | undefined {
  return useTrackPlayerDataEvent<number | undefined, Event.PlaybackTrackChanged>(
    Event.PlaybackTrackChanged,
    async (payload) => noNull(payload ? payload?.nextTrack : await getCurrentTrack()),
    undefined,
    () => false // always update, even if trackNr did not change (the track itself may have changed)
  );
}
