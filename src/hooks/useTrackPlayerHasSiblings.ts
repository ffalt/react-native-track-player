import { Event } from "../constants/Event";
import { useTrackPlayerDataEvents } from "./useTrackPlayerDataEvents";
import { hasNext, hasPrevious } from "../trackPlayer";

export function useTrackPlayerHasSiblings(): { hasNext: boolean, hasPrevious: boolean } {
  return useTrackPlayerDataEvents<{ hasNext: boolean, hasPrevious: boolean }>(
    [Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged],
    async () => {
      return {
        hasNext: await hasNext(),
        hasPrevious: await hasPrevious()
      };
    },
    { hasNext: false, hasPrevious: false },
    (prev, next) => {
      return prev.hasNext === next.hasNext && prev.hasPrevious === next.hasPrevious;
    }
  );
}
