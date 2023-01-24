import TrackPlayer, {
  useTrackPlayerPlaybackParameters,
  useTrackPlayerPlaybackPitch,
  useTrackPlayerPlaybackSpeed
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { demoStyles } from "./utils";
import React from "react";

const minSpeed = 0.1;
const maxSpeed = 4;
const minPitch = 0.1;
const maxPitch = 4;

export function PlaybackParamsComponent(): JSX.Element {
  const speed = useTrackPlayerPlaybackSpeed();
  const pitch = useTrackPlayerPlaybackPitch();
  const params = useTrackPlayerPlaybackParameters();
  return (
    <>
      <View>
        <View style={demoStyles.info}>
          <Text style={demoStyles.infoLabel}>Speed:</Text>
          <Text>{params.speed.toFixed(3)}</Text>
        </View>
        <Slider
          style={{ height: 40, flexdirection: "row" }}
          value={speed}
          minimumValue={minSpeed}
          maximumValue={maxSpeed}
          onSlidingComplete={async (value: number) => {
            await TrackPlayer.setPlaybackSpeed(value);
          }}
        />
      </View>
      <View>
        <View style={demoStyles.info}>
          <Text style={demoStyles.infoLabel}>Pitch:</Text>
          <Text>{params.pitch.toFixed(3)}</Text>
        </View>
        <Slider
          style={{ height: 40, flexdirection: "row" }}
          value={pitch}
          minimumValue={minPitch}
          maximumValue={maxPitch}
          onSlidingComplete={async (value: number) => {
            await TrackPlayer.setPlaybackPitch(value);
          }}
        />
      </View>
    </>
  );
}
