import TrackPlayer, {
  useTrackPlayerProgress,
  useTrackPlayerProgressMS,
  useTrackPlayerProgressPercent,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Info } from './InfoComponent';
import { Text } from 'react-native';
import { demoStyles } from './utils';

export function ProgressComponent(): JSX.Element {
  const progress = useTrackPlayerProgress();
  const progressPC = useTrackPlayerProgressPercent();
  const progressMS = useTrackPlayerProgressMS();
  return (
    <>
      <Text style={demoStyles.infoLabel}>Position</Text>
      <Slider
        style={{ height: 40, flexdirection: 'row' }}
        value={progress.position}
        minimumValue={0}
        maximumValue={progress.duration}
        onSlidingComplete={async (value: number) => {
          await TrackPlayer.seekTo(value);
        }}
      />
      <Info label="Progress.position" value={`${progress.position}`} />
      <Info label="Progress.duration" value={`${progress.duration}`} />
      <Info label="Progress.buffered" value={`${progress.buffered}`} />
      <Info label="Progress.percent" value={`${progressPC.progress.toFixed(4)}`} />
      <Info label="Progress.percent.buffer" value={`${progressPC.bufferProgress.toFixed(4)}`} />
      <Info label="Progress.ms.position" value={`${progressMS.position}`} />
      <Info label="Progress.ms.duration" value={`${progressMS.duration}`} />
    </>
  );
}
