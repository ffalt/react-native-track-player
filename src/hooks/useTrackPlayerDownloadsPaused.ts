import { Event } from "../constants";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getDownloadsPaused } from "../trackPlayer";

export function useTrackPlayerDownloadsPaused(): boolean {
  return useTrackPlayerDataEvent<boolean, Event.DownloadsPausedChanged>(
    Event.DownloadsPausedChanged,
    async (payload) => payload ? payload.paused : getDownloadsPaused(),
    false
  );
}
