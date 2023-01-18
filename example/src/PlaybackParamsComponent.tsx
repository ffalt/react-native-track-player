import TrackPlayer, {
  useTrackPlayerPlaybackParameters,
  useTrackPlayerPlaybackPitch,
  useTrackPlayerPlaybackSpeed,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';
import { demoStyles } from './utils';
import React from 'react';

const minSpeed = 0.1;
const maxSpeed = 4;
const minPitch = 0.1;
const maxPitch = 4;

function formatSliderValue(value: number): number {
  return Math.round(value * 100);
}

function getSliderValue(value: number): number {
  return value / 100;
}

export function PlaybackParamsComponent(): JSX.Element {
  const speed = useTrackPlayerPlaybackSpeed();
  const pitch = useTrackPlayerPlaybackPitch();
  const params = useTrackPlayerPlaybackParameters();
  return (
    <>
      <View>
        <View style={demoStyles.info}>
          <Text style={demoStyles.infoLabel}>Speed:</Text>
          <Text>{params.speed}</Text>
        </View>
        <Slider
          style={{ height: 40, flexdirection: 'row' }}
          value={formatSliderValue(speed)}
          minimumValue={formatSliderValue(minSpeed)}
          maximumValue={formatSliderValue(maxSpeed)}
          onSlidingComplete={async (value: number) => {
            await TrackPlayer.setPlaybackSpeed(getSliderValue(value));
          }}
        />
      </View>
      <View>
        <View style={demoStyles.info}>
          <Text style={demoStyles.infoLabel}>Pitch:</Text>
          <Text>{params.pitch}</Text>
        </View>
        <Slider
          style={{ height: 40, flexdirection: 'row' }}
          value={formatSliderValue(pitch)}
          minimumValue={formatSliderValue(minPitch)}
          maximumValue={formatSliderValue(maxPitch)}
          onSlidingComplete={async (value: number) => {
            await TrackPlayer.setPlaybackPitch(getSliderValue(value));
          }}
        />
      </View>
    </>
  );
}
