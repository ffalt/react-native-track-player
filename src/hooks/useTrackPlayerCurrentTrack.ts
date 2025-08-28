import { type Track } from "../interfaces/Track";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTrackPlayerCurrentTrackNr } from "./useTrackPlayerCurrentTrackNr";
import { getTrack } from "../trackPlayer";

function noNull<T>(value: T | undefined | null): T | undefined {
  return value === null ? undefined : value;
}

export function useTrackPlayerCurrentTrack(): Track | undefined {
  const trackNr = useTrackPlayerCurrentTrackNr();
  const [track, setTrack] = useState<Track | undefined>(undefined);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = useCallback(() => {
    if (trackNr === undefined) {
      if (isUnmountedRef.current) {
        return;
      }
      setTrack(undefined);
      return;
    }
    if (isUnmountedRef.current) {
      return;
    }
    getTrack(trackNr)
      .then(value => {
        if (isUnmountedRef.current) {
          return;
        }
        setTrack(noNull(value));
      })
      .catch(console.error);
  }, [trackNr]);

  useEffect(() => {
    refresh();
  }, [trackNr]);

  useEffect(() => {
    refresh();
  }, []);

  return track;
}
