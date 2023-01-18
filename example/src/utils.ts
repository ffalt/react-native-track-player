import { DownloadState, RepeatMode, State, Track, TrackType } from 'react-native-track-player';
import { StyleSheet } from 'react-native';

export const demoStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
    borderColor: '#b4b4b4',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    padding: 4,
    marginBottom: 4,
  },
  itemActive: {
    backgroundColor: '#ffe8d2',
  },
  itemContent: {
    flex: 1,
  },
  button: {
    fontSize: 12,
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: '#bdbdbd',
    borderRadius: 3,
    borderWidth: 1,
    textAlign: 'center',
  },
  itemButtons: {},
  listEmpty: { color: '#a6a6a6', textAlign: 'center' },
  buttonBar: {
    padding: 4,
    flexDirection: 'row',
    columnGap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  info: {
    borderTopColor: '#d7d7d7',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
  },
  infoLabel: { fontSize: 10, fontWeight: '800' },
  tabBarIconStyle: { display: "none", height: 0 },
  tabBarLabelStyle:  {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    textAlignVertical: 'center'
  }
});

export function downloadStateToString(mode: DownloadState): string {
  switch (mode) {
    case DownloadState.Completed:
      return 'Completed';
    case DownloadState.Downloading:
      return 'Downloading';
    case DownloadState.Failed:
      return 'Failed';
    case DownloadState.Queued:
      return 'Queued';
    case DownloadState.Removing:
      return 'Removing';
    case DownloadState.Restarting:
      return 'Restarting';
    case DownloadState.Stopped:
      return 'Stopped';
    default:
      return 'Unknown';
  }
}

export function repeatModeToString(mode: RepeatMode): string {
  switch (mode) {
    case RepeatMode.Off:
      return 'Off';
    case RepeatMode.Track:
      return 'Track';
    case RepeatMode.Queue:
      return 'Queue';
    default:
      return 'Unknown';
  }
}

export function stateToString(state: State): string {
  switch (state) {
    case State.Buffering:
      return 'Buffering';
    case State.Connecting:
      return 'Connecting';
    case State.None:
      return 'None';
    case State.Paused:
      return 'Paused';
    case State.Playing:
      return 'Playing';
    case State.Ready:
      return 'Ready';
    case State.Stopped:
      return 'Stopped';
    default:
      return 'Undefined';
  }
}

function buildDemoTracks(): Array<Track> {
  return [
    {
      folder: '78_louisiana_duke-ellington-and-his-orchestra-razaf-schafer-johnson_gbia0064586b',
      media: 'Louisiana - Duke Ellington and His Orchestra-restored.mp3',
      img: '78_louisiana_duke-ellington-and-his-orchestra-razaf-schafer-johnson_gbia0064586b.jpg',
      title: 'Louisiana',
      album: 'Louisiana',
      artist: 'Duke Ellington and His Orchestra; Razaf; Schafer; Johnson',
      genre: 'Dance',
      date: '1938',
    },
    {
      folder: '78_love-for-scale_big-sid-catletts-band-fiorito-kahn-bumps-myers-illinois-jacquet-ban_gbia0020246',
      media: '06 - Mean Old World - T-Bone Walker - Freddie Slack.mp3',
      img: '78_love-for-scale_big-sid-catletts-band-fiorito-kahn-bumps-myers-illinois-jacquet-ban_gbia0020246_itemimage.jpg',
      title: 'Mean Old World',
      album: 'The History of Jazz - Vol. 3',
      artist: 'T-Bone Walker; Freddie Slack',
      genre: 'Swing',
      date: '1945',
    },
    {
      folder: '78_la-vie-en-rose_edith-piaf-louiguy-luypaerts_gbia0011638b',
      media: 'La Vie en Rose - Edith Piaf - Louiguy - Luypaerts-restored.mp3',
      img: '78_la-vie-en-rose_edith-piaf-louiguy-luypaerts_gbia0011638b.jpg',
      title: 'La Vie en Rose',
      album: 'La Vie en Rose',
      artist: 'Edith Piaf; Louiguy; Luypaerts',
      genre: 'Popular Music',
      date: '1950',
    },
    {
      folder: '78_mr-sandman_the-chordettes-archie-bleyer-pat-ballard-archie-ballard_gbia0017988b',
      media: 'Mr. Sandman - The Chordettes - Archie Bleyer.mp3',
      img: '78_mr-sandman_the-chordettes-archie-bleyer-pat-ballard-archie-ballard_gbia0017988b.jpg',
      title: 'Mr. Sandman',
      album: 'Mr. Sandman',
      artist: 'The Chordettes; Archie Bleyer; Pat Ballard; Archie Ballard',
      genre: 'Popular Music',
      date: '1954',
    },
    {
      folder: '78_cuban-rhythms_hotel-nacional-orchestra-beltran_gbia0002479',
      media: 'Blen Blen Blen - Hotel Nacional Orchestra-restored.mp3',
      img: '78_cuban-rhythms_hotel-nacional-orchestra-beltran_gbia0002479_itemimage.jpg',
      title: 'Blen Blen Blen',
      album: 'Cuban Rhythms',
      artist: 'Hotel Nacional Orchestra',
      genre: 'Latin',
      date: '1942',
    },
    {
      folder: '78_mambo-no.-5_perez-prado-and-his-orchestra-d.-perez-prado_gbia0009774b',
      media: 'Mambo No. 5 - Perez Prado and his Orchestra-restored.mp3',
      img: '78_mambo-no.-5_perez-prado-and-his-orchestra-d.-perez-prado_gbia0009774b_itemimage.jpg',
      title: 'Mambo No. 5',
      album: 'Mambo No. 5',
      artist: 'Perez Prado and his Orchestra',
      genre: 'Latin Mambo',
      date: '1950',
    },
  ].map((entry, index) => {
    return {
      id: `${index}`,
      url: 'https://archive.org/download/' + entry.folder + '/' + entry.media,
      artwork: 'https://archive.org/download/' + entry.folder + '/' + entry.img,
      description: 'find out more at https://archive.org/details/' + entry.folder,
      album: entry.album,
      artist: entry.artist,
      date: entry.date,
      isLiveStream: false,
      genre: 'genre',
      title: entry.title,
      type: TrackType.Default,
      userAgent: 'TrackPlayerDemo',
      contentType: 'audio/mpeg',
    };
  });
}

export const demoTracks = buildDemoTracks();
