import { View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { demoStyles } from './utils';
import { Button } from './Button';

export function PlayerStripComponent(): JSX.Element {
  return (
    <View style={demoStyles.buttonBar}>
      <Button label="Reset" onPress={() => TrackPlayer.reset().catch(console.error)} />
      <Button label="Stop" onPress={() => TrackPlayer.stop().catch(console.error)} />
      <Button label="Pause" onPress={() => TrackPlayer.pause().catch(console.error)} />
      <Button label="Play" onPress={() => TrackPlayer.play().catch(console.error)} />
      <Button label="Prev" onPress={() => TrackPlayer.skipToPrevious().catch(console.error)} />
      <Button label="Next" onPress={() => TrackPlayer.skipToNext().catch(console.error)} />
    </View>
  );
}
