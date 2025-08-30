"use strict";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTrackPlayerCurrentTrackNr } from "./useTrackPlayerCurrentTrackNr.js";
import { getTrack } from "../trackPlayer.js";
function noNull(value) {
  return value === null ? undefined : value;
}
export function useTrackPlayerCurrentTrack() {
  const trackNr = useTrackPlayerCurrentTrackNr();
  const [track, setTrack] = useState(undefined);
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
    getTrack(trackNr).then(value => {
      if (isUnmountedRef.current) {
        return;
      }
      setTrack(noNull(value));
    }).catch(console.error);
  }, [trackNr]);
  useEffect(() => refresh(), [refresh, trackNr]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refresh(), []);
  return track;
}
//# sourceMappingURL=useTrackPlayerCurrentTrack.js.map