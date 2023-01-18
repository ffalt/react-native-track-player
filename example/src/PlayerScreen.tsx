import React from 'react';
import { ScrollView, View } from 'react-native';
import { PlayerStateComponent } from './PlayerStateComponent';
import { ProgressComponent } from './ProgressComponent';
import { CurrentTrackComponent } from './CurrentTrackComponent';
import { PlayerStripComponent } from './PlayerStripComponent';
import { PlaybackParamsComponent } from './PlaybackParamsComponent';

export function PlayerScreen(): JSX.Element {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ padding: 10, flex: 1 }}>
        <PlayerStripComponent />
        <ProgressComponent />
        <PlaybackParamsComponent />
        <PlayerStateComponent />
        <CurrentTrackComponent />
      </View>
    </ScrollView>
  );
}
