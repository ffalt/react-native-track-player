import TrackPlayer, { Event, State } from 'react-native-track-player';

let wasPausedByDuck = false;

module.exports = async function setup() {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, async () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, async () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteStop, async () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteSeek, async (data) => TrackPlayer.seekTo(data.position));
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    await TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 10);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
    await TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 10);
  });
  TrackPlayer.addEventListener(Event.RemoteDuck, async (e) => {
    if (e.permanent === true) {
      await TrackPlayer.stop();
    } else {
      if (e.paused === true) {
        const playerState = await TrackPlayer.getState();
        wasPausedByDuck = playerState !== State.Paused;
        await TrackPlayer.pause();
      } else {
        if (wasPausedByDuck === true) {
          await TrackPlayer.play();
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
