import { FlatList, Text, View } from "react-native";
import TrackPlayer, {
  Download,
  DownloadState,
  Event,
  useTrackPlayerCurrentDownloads,
  useTrackPlayerDownloadsPaused,
  useTrackPlayerEvent
} from "react-native-track-player";
import { useState } from "react";
import { Button } from "./Button";
import { demoStyles } from "./utils";

const downloadStateToString = (mode: DownloadState): string => {
  switch (mode) {
    case DownloadState.Completed:
      return "Completed";
    case DownloadState.Downloading:
      return "Downloading";
    case DownloadState.Failed:
      return "Failed";
    case DownloadState.Queued:
      return "Queued";
    case DownloadState.Removing:
      return "Removing";
    case DownloadState.Restarting:
      return "Restarting";
    case DownloadState.Stopped:
      return "Stopped";
    default:
      return "Unknown";
  }
};

const Header: React.FC = () => {
  const paused = useTrackPlayerDownloadsPaused();
  return (
    <View style={demoStyles.buttonBar}>
      <Button
        label={`Downloading (${paused ? "paused" : "enabled"})`}
        onPress={() => TrackPlayer.toggleDownloadsPaused().catch(console.error)}
      />
      <Button label="Resume" onPress={() => TrackPlayer.resumeDownloads().catch(console.error)} />
      <Button label="Pause" onPress={() => TrackPlayer.pauseDownloads().catch(console.error)} />
    </View>
  );
};

const ItemProgress: React.FC<{ id: string; state: DownloadState }> = ({ id, state }) => {
  const [progress, setProgress] = useState<{
    percent: number;
    bytes: number;
  }>({ percent: 0, bytes: 0 });

  useTrackPlayerEvent(Event.DownloadProgressChanged, async (event) => {
    if (id === event.id) {
      setProgress({ percent: event.percentDownloaded, bytes: event.bytesDownloaded });
    }
  });

  let width = "0%";
  if (state === DownloadState.Completed) {
    width = "100%";
  } else if (progress?.percent > 0) {
    width = `${progress.percent}%`;
  }
  return (
    <View style={{ height: 2, backgroundColor: "#c0bfbf", padding: 0, marginTop: 2, marginBottom: 2 }}>
      <View style={{ height: 2, backgroundColor: "#60b208", width: width as any }} />
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
        <ItemProgress id={download.id} state={downloadState} />
      </View>
      <View style={demoStyles.itemButtons}>
        <Button label="Remove" onPress={() => TrackPlayer.removeDownload(download.id).catch(console.error)} />
      </View>
    </View>
  );
};

export function CurrentDownloadsScreen(): JSX.Element {
  const downloads = useTrackPlayerCurrentDownloads();
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
