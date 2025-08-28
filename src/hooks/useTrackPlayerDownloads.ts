import { type Download } from "../interfaces/Download";
import { Event } from "../constants/Event";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getDownloads } from "../trackPlayer";

export function useTrackPlayerDownloads(): Array<Download> | undefined {
  return useTrackPlayerDataEvent<Array<Download> | undefined, Event.DownloadsChanged>(
    Event.DownloadsChanged,
    async () => getDownloads(),
    undefined
  );
}
