import { useEffect, useState } from "react";
import { useTrackPlayerCurrentTrack } from "./useTrackPlayerCurrentTrack";

export function useTrackPlayerCurrentTrackID(): string | undefined {
  const [trackId, setTrackId] = useState<string | undefined>(undefined);
  const track = useTrackPlayerCurrentTrack();

  useEffect(() => {
    setTrackId(track?.id);
  }, [track]);

  return trackId;
}
