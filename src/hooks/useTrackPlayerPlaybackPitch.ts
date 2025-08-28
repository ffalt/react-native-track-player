import { useTrackPlayerPlaybackParameters } from "./useTrackPlayerPlaybackParameters";

export function useTrackPlayerPlaybackPitch(): number {
  const params = useTrackPlayerPlaybackParameters();
  return params.pitch;
}
