import {
  State,
  useTrackPlayerPlaybackState,
  useTrackPlayerPlaybackStateIs,
  useTrackPlayerPlaybackStateIsPlaying,
} from 'react-native-track-player';
import { stateToString } from './utils';
import { Info } from './InfoComponent';

export function PlayerStateComponent(): JSX.Element {
  const playbackState = useTrackPlayerPlaybackState();
  const playbackStateStoppedPause = useTrackPlayerPlaybackStateIs(State.Stopped, State.Paused);
  const playbackStateBuffering = useTrackPlayerPlaybackStateIs(State.Buffering);
  const playbackStateIsPlaying = useTrackPlayerPlaybackStateIsPlaying();
  return (
    <>
      <Info label="Player.State" value={stateToString(playbackState)} />
      <Info label="Player.State is buffering" value={`${playbackStateBuffering}`} />
      <Info label="Player.State is stopped or paused" value={`${playbackStateStoppedPause}`} />
      <Info label="Player.State is playing" value={`${playbackStateIsPlaying}`} />
    </>
  );
}
