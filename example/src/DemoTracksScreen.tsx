import { FlatList, Text, View } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { demoStyles, demoTracks } from './utils';
import { Button } from './Button';

const Item: React.FC<{ track: Track }> = ({ track }) => (
  <View style={demoStyles.item}>
    <View style={demoStyles.itemContent}>
      <Text>
        <Text style={demoStyles.infoLabel}>ID:</Text> {track.id}&nbsp;
        <Text style={demoStyles.infoLabel}>TITLE:</Text> {track.title}&nbsp;
        <Text style={demoStyles.infoLabel}>ARTIST:</Text> {track.artist}&nbsp;
        <Text style={demoStyles.infoLabel}>INFO:</Text> <Text style={{ fontSize: 9 }}>{track.description}</Text>
      </Text>
    </View>
    <View style={demoStyles.itemButtons}>
      <Button label="Add to Queue" onPress={() => TrackPlayer.add(track).catch(console.error)} />
      <Button
        label="Download"
        onPress={() =>
          TrackPlayer.addDownload({ id: track.url as string, url: track.url as string }).catch(console.error)
        }
      />
    </View>
  </View>
);

const Header: React.FC = () => (
  <View style={demoStyles.buttonBar}>
    <Button label="Add all to Queue" onPress={() => TrackPlayer.add(demoTracks).catch(console.error)} />
    <Button
      label="Download all"
      onPress={() =>
        TrackPlayer.addDownloads(demoTracks.map((track) => ({ id: track.id, url: track.url as string }))).catch(
          console.error,
        )
      }
    />
  </View>
);

export function DemoTracksScreen(): JSX.Element {
  return (
    <FlatList
      ListHeaderComponent={Header}
      data={demoTracks}
      renderItem={({ item }) => <Item track={item} />}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
