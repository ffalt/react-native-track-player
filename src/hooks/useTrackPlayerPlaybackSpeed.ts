import { useTrackPlayerPlaybackParameters } from "./useTrackPlayerPlaybackParameters";

export function useTrackPlayerPlaybackSpeed(): number {
  const params = useTrackPlayerPlaybackParameters();
  return params.speed;
}
