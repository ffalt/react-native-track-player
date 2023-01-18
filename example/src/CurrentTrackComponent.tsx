import { useTrackPlayerCurrentTrack, useTrackPlayerCurrentTrackNr } from 'react-native-track-player';
import { Info } from './InfoComponent';
import { Text, View } from 'react-native';
import { demoStyles } from './utils';

export function CurrentTrackComponent(): JSX.Element {
  const trackNr = useTrackPlayerCurrentTrackNr();
  const track = useTrackPlayerCurrentTrack();
  const value = track ? JSON.stringify(track, null, '  ') : 'No Track';
  return (
    <>
      <Info label="Current Track Nr" value={`${trackNr === undefined ? 'No Track' : trackNr}`} />
      <View style={[demoStyles.info, { flexDirection: 'column' }]}>
        <Text style={demoStyles.infoLabel}>Current Track:</Text>
        <Text style={{ fontSize: 9 }}>{value}</Text>
      </View>
    </>
  );
}
