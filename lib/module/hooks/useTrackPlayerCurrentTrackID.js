"use strict";

import { useEffect, useState } from "react";
import { useTrackPlayerCurrentTrack } from "./useTrackPlayerCurrentTrack.js";
export function useTrackPlayerCurrentTrackID() {
  const [trackId, setTrackId] = useState(undefined);
  const track = useTrackPlayerCurrentTrack();
  useEffect(() => {
    setTrackId(track?.id);
  }, [track]);
  return trackId;
}
//# sourceMappingURL=useTrackPlayerCurrentTrackID.js.map