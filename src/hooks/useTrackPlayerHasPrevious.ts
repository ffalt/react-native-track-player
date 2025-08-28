import { Event } from "../constants/Event";
import { useTrackPlayerDataEvents } from "./useTrackPlayerDataEvents";
import { hasPrevious } from "../trackPlayer";

export function useTrackPlayerHasPrevious(): boolean {
  return useTrackPlayerDataEvents<boolean>(
    [Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged],
    async () => hasPrevious(),
    false
  );
}
