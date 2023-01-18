import { FlatList, Text, View } from 'react-native';
import TrackPlayer, {
  RepeatMode,
  Track,
  useTrackPlayerCurrentTrackNr,
  useTrackPlayerQueue,
  useTrackPlayerRepeatMode,
  useTrackPlayerShuffleModeEnabled,
} from 'react-native-track-player';
import { demoStyles, repeatModeToString } from './utils';
import { Button } from './Button';

const incRepeatMode = (mode: RepeatMode): void => {
  let newMode = RepeatMode.Off;
  switch (mode) {
    case RepeatMode.Off: {
      newMode = RepeatMode.Track;
      break;
    }
    case RepeatMode.Track: {
      newMode = RepeatMode.Queue;
      break;
    }
  }
  TrackPlayer.setRepeatMode(newMode).catch(console.error);
};

const Header: React.FC = () => {
  const shuffleEnabled = useTrackPlayerShuffleModeEnabled();
  const repeatMode = useTrackPlayerRepeatMode();
  return (
    <View style={demoStyles.buttonBar}>
      <Button label="Clear" onPress={() => TrackPlayer.clear().catch(console.error)} />
      <Button label="Shuffle Tracks" onPress={() => TrackPlayer.shuffle().catch(console.error)} />
      <Button
        label={`Shuffle Mode (${shuffleEnabled ? 'Enabled' : 'Disabled'})`}
        onPress={() => TrackPlayer.setShuffleModeEnabled(!shuffleEnabled).catch(console.error)}
      />
      <Button label={`Repeat Mode (${repeatModeToString(repeatMode)})`} onPress={() => incRepeatMode(repeatMode)} />
    </View>
  );
};

const Item: React.FC<{ track: Track; index: number; isPlaying: boolean }> = ({ track, index, isPlaying }) => (
  <View style={[demoStyles.item, isPlaying ? demoStyles.itemActive : undefined]}>
    <View style={demoStyles.itemContent}>
      <Text>
        <Text style={demoStyles.infoLabel}>INDEX:</Text> {index}&nbsp;
        <Text style={demoStyles.infoLabel}>ID:</Text> {track.id}&nbsp;
        <Text style={demoStyles.infoLabel}>TITLE:</Text> {track.title}&nbsp;
        <Text style={demoStyles.infoLabel}>ARTIST:</Text> {track.artist}&nbsp;
        <Text style={demoStyles.infoLabel}>URL:</Text> <Text style={{ fontSize: 9 }}>{track.url}</Text>
      </Text>
    </View>
    <View style={demoStyles.itemButtons}>
      <Button label="Set Current" onPress={() => TrackPlayer.skip(index).catch(console.error)} />
      <Button label="Remove" onPress={() => TrackPlayer.remove(index).catch(console.error)} />
      <Button label="Down" onPress={() => TrackPlayer.move(index, index - 1).catch(console.error)} />
      <Button label="Up" onPress={() => TrackPlayer.move(index, index + 1).catch(console.error)} />
    </View>
  </View>
);

export function QueueScreen(): JSX.Element {
  const queue = useTrackPlayerQueue();
  const trackNr = useTrackPlayerCurrentTrackNr();
  return (
    <FlatList
      data={queue}
      ListHeaderComponent={Header}
      ListEmptyComponent={<Text style={demoStyles.listEmpty}>List empty</Text>}
      renderItem={({ item, index }) => <Item track={item} index={index} isPlaying={index === trackNr} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
