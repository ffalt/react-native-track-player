import TrackPlayer, { Event, State } from 'react-native-track-player';

let wasPausedByDuck = false;

export default async function setup() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());

  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());

  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());

  TrackPlayer.addEventListener(Event.RemoteSeek, (data) => TrackPlayer.seekTo(data.position));

  TrackPlayer.addEventListener(Event.RemoteJumpForward, (data) => {
    TrackPlayer.getPosition().then((position) => {
      TrackPlayer.seekTo(position + (data.interval || 10));
    });
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, (data) => {
    TrackPlayer.getPosition().then((position) => {
      TrackPlayer.seekTo(position - (data.interval || 10));
    });
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, (data) => {
    if (data.permanent === true) {
      TrackPlayer.stop();
    } else {
      if (data.paused === true) {
        TrackPlayer.getState().then((playerState) => {
          wasPausedByDuck = playerState !== State.Paused;
          TrackPlayer.pause();
        });
      } else {
        if (wasPausedByDuck) {
          TrackPlayer.play();
          wasPausedByDuck = false;
        }
      }
    }
  });

  TrackPlayer.addEventListener(Event.Scrobble, ({ trackIndex }) => {
    console.log(`Scrobble ${trackIndex}`);
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error(error);
  });
};
