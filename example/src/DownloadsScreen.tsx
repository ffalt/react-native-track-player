import { FlatList, Text, View } from 'react-native';
import TrackPlayer, {
  Download,
  DownloadState,
  Event,
  useTrackPlayerDownloads,
  useTrackPlayerEvent,
} from 'react-native-track-player';
import { useState } from 'react';
import { demoStyles, downloadStateToString } from './utils';
import { Button } from './Button';

const Header: React.FC = () => {
  return (
    <View style={demoStyles.buttonBar}>
      <Button label="Remove All" onPress={() => TrackPlayer.clearDownloads().catch(console.error)} />
    </View>
  );
};

const Item: React.FC<{ download: Download }> = ({ download }) => {
  const [downloadState, setDownloadState] = useState<DownloadState>(download.state);

  useTrackPlayerEvent(Event.DownloadChanged, async (event) => {
    if (download.id === event.id) {
      setDownloadState(event.state);
    }
  });

  return (
    <View style={demoStyles.item}>
      <View style={demoStyles.itemContent}>
        <Text>
          <Text style={demoStyles.infoLabel}>ID:</Text> {download.id}&nbsp;
          <Text style={demoStyles.infoLabel}>STATE:</Text> {downloadStateToString(downloadState)}&nbsp;
          <Text style={demoStyles.infoLabel}>URL:</Text> <Text style={{ fontSize: 9 }}>{download.url}</Text>
        </Text>
      </View>
      <View style={demoStyles.itemButtons}>
        <Button label="Remove" onPress={() => TrackPlayer.removeDownload(download.id).catch(console.error)} />
      </View>
    </View>
  );
};

export function DownloadsScreen(): JSX.Element {
  const downloads = useTrackPlayerDownloads();
  return (
    <FlatList
      data={downloads}
      ListHeaderComponent={Header}
      ListEmptyComponent={<Text style={demoStyles.listEmpty}>List empty</Text>}
      renderItem={({ item }) => <Item download={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
