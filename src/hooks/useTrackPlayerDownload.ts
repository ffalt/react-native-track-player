import { type Download } from "../interfaces/Download";
import { Event } from "../constants/Event";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getDownload } from "../trackPlayer";

export function useTrackPlayerDownload(id: string): Download | undefined {
  return useTrackPlayerDataEvent<Download | undefined, Event.DownloadChanged>(
    Event.DownloadChanged,
    async () => getDownload(id),
    undefined,
    () => false, // always update
    (payload) => payload?.id === id
  );
}
