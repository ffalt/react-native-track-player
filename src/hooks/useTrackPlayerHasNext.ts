import { Event } from "../constants/Event";
import { useTrackPlayerDataEvents } from "./useTrackPlayerDataEvents";
import { hasNext } from "../trackPlayer";

export function useTrackPlayerHasNext(): boolean {
  return useTrackPlayerDataEvents<boolean>(
    [Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged],
    async () => hasNext(),
    false
  );
}
