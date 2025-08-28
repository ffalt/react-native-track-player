import { type Download } from "../interfaces";
import { Event } from "../constants";
import { useTrackPlayerDataEvent } from "./useTrackPlayerDataEvent";
import { getCurrentDownloads } from "../trackPlayer";

export function useTrackPlayerCurrentDownloads(): Array<Download> | undefined {
  return useTrackPlayerDataEvent<Array<Download> | undefined, Event.DownloadsChanged>(
    Event.DownloadsChanged,
    async () => getCurrentDownloads(),
    undefined
  );
}
