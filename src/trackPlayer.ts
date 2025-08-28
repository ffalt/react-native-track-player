import { AppRegistry, NativeEventEmitter, Platform } from "react-native";
import TrackPlayer from "./NativeTrackPlayer";
import { resolveImportedAssetOrPath } from "./helper/resolveImportedAssetOrPath";

import { type PlayerOptions } from "./interfaces/PlayerOptions";
import { type ServiceHandler } from "./interfaces/ServiceHandler";
import { type MetadataOptions } from "./interfaces/MetadataOptions";
import { type NowPlayingMetadata } from "./interfaces/NowPlayingMetadata";
import { type Download } from "./interfaces/Download";
import { type DownloadRequest } from "./interfaces/DownloadRequest";
import { type EventPayloadByEvent } from "./interfaces/EventPayloadByEvent";
import { type PlaybackParameters } from "./interfaces/PlaybackParameters";
import { type Track } from "./interfaces/Track";
import { type TrackMetadataBase } from "./interfaces/TrackMetadataBase";
import { type AddTrack } from "./interfaces/AddTrack";

import { RepeatMode } from "./constants/RepeatMode";
import { State } from "./constants/State";
import { Event } from "./constants/Event";

const isAndroid = Platform.OS === "android";
const emitter = new NativeEventEmitter(TrackPlayer);

/**
 * Initializes the player with the specified options.
 */
export async function setupPlayer(options: PlayerOptions = {}): Promise<void> {
  return TrackPlayer.setupPlayer(options);
}

/**
 * Register the playback service. The service will run as long as the player runs.
 */
export function registerPlaybackService(factory: () => ServiceHandler) {
  if (isAndroid) {
    // Registers the headless task
    AppRegistry.registerHeadlessTask("TrackPlayer", factory);
  } else {
    // Initializes and runs the service in the next tick
    setImmediate(factory());
  }
}

/**
 * Destroys the player, cleaning up its resources.
 */
export function destroy(): void {
  return TrackPlayer.destroy();
}

/**
 * is the track player already started
 */
export async function isServiceRunning(): Promise<boolean> {
  return await TrackPlayer.isServiceRunning();
}

/**
 * add an event listener
 */
export function addEventListener<T extends Event>(
  event: T,
  listener: EventPayloadByEvent[T] extends never
    ? () => void
    : (event: EventPayloadByEvent[T]) => void
) {
  return emitter.addListener(event, listener as unknown as (event: any) => void);
}

/**
 * Adds one or more tracks to the queue.
 */
export async function add(tracks: AddTrack | AddTrack[], insertBeforeIndex?: number): Promise<void> {
  const resolvedTracks = (Array.isArray(tracks) ? tracks : [tracks]).map(
    (track) => ({
      ...track,
      url: resolveImportedAssetOrPath(track.url),
      artwork: resolveImportedAssetOrPath(track.artwork)
    })
  );
  return resolvedTracks.length < 1
    ? undefined
    : await TrackPlayer.add(resolvedTracks, insertBeforeIndex === undefined ? -1 : insertBeforeIndex);
}

/**
 * Removes one or more tracks from the queue.
 */
export async function remove(indexOrIndexes: number | number[]): Promise<void> {
  return await TrackPlayer.remove(Array.isArray(indexOrIndexes) ? indexOrIndexes : [indexOrIndexes]);
}

/**
 * Clears any upcoming tracks from the queue.
 */
export async function removeUpcomingTracks(): Promise<void> {
  return await TrackPlayer.removeUpcomingTracks();
}

/**
 * Skips to a track in the queue.
 */
export async function skip(trackIndex: number): Promise<void> {
  return await TrackPlayer.skip(trackIndex);
}

/**
 * Skips to the next track in the queue.
 */
export async function skipToNext(): Promise<void> {
  return await TrackPlayer.skipToNext();
}

/**
 * Skips to the previous track in the queue.
 */
export async function skipToPrevious(): Promise<void> {
  return await TrackPlayer.skipToPrevious();
}

/**
 * Updates the configuration for the components.
 */
export async function updateOptions(options: MetadataOptions = {}): Promise<void> {
  options = {
    ...options,
    icon: resolveImportedAssetOrPath(options.icon),
    playIcon: resolveImportedAssetOrPath(options.playIcon),
    pauseIcon: resolveImportedAssetOrPath(options.pauseIcon),
    stopIcon: resolveImportedAssetOrPath(options.stopIcon),
    previousIcon: resolveImportedAssetOrPath(options.previousIcon),
    nextIcon: resolveImportedAssetOrPath(options.nextIcon),
    rewindIcon: resolveImportedAssetOrPath(options.rewindIcon),
    forwardIcon: resolveImportedAssetOrPath(options.forwardIcon)
  };
  return await TrackPlayer.updateOptions(options);
}

/**
 * Updates the metadata of a track in the queue. If the current track is updated,
 * the notification and the Now Playing Center will be updated accordingly.
 */
export async function updateMetadataForTrack(trackIndex: number, metadata: TrackMetadataBase): Promise<void> {
  return await TrackPlayer.updateMetadataForTrack(trackIndex, {
    ...metadata,
    artwork: resolveImportedAssetOrPath(metadata.artwork)
  });
}

/**
 * clear NowPlaying Metadata
 */
export async function clearNowPlayingMetadata(): Promise<void> {
  return await TrackPlayer.clearNowPlayingMetadata();
}

/**
 * Updates the metadata of a NowPlaying track
 */
export async function updateNowPlayingMetadata(metadata: NowPlayingMetadata): Promise<void> {
  return await TrackPlayer.updateNowPlayingMetadata({
    ...metadata,
    artwork: resolveImportedAssetOrPath(metadata.artwork)
  });
}

/**
 * Resets the player stopping the current track and clearing the queue.
 */
export async function reset(): Promise<void> {
  return await TrackPlayer.reset();
}

/**
 * Plays or resumes the current track.
 */
export async function play(): Promise<void> {
  return await TrackPlayer.play();
}

/**
 * Pauses the current track.
 */
export async function pause(): Promise<void> {
  return await TrackPlayer.pause();
}

/**
 * Stops the current track.
 */
export async function stop(): Promise<void> {
  return await TrackPlayer.stop();
}

/**
 * Seeks to a specified time position in the current track.
 */
export async function seekTo(position: number): Promise<void> {
  return await TrackPlayer.seekTo(position);
}

/**
 * Sets the volume of the player.
 */
export async function setVolume(level: number): Promise<void> {
  return await TrackPlayer.setVolume(level);
}

/**
 * Sets the repeat mode.
 */
export async function setRepeatMode(mode: RepeatMode): Promise<void> {
  return await TrackPlayer.setRepeatMode(mode);
}

/**
 * Gets the volume of the player (a number between 0 and 1).
 */
export async function getVolume(): Promise<number> {
  return await TrackPlayer.getVolume();
}

/**
 * Gets a track object from the queue.
 */
export async function getTrack(trackIndex: number): Promise<Track | null> {
  return await TrackPlayer.getTrack(trackIndex) as unknown as Track;
}

/**
 * Gets the whole queue.
 */
export async function getQueue(): Promise<Track[]> {
  return await TrackPlayer.getQueue() as unknown as Track[];
}

/**
 * Gets the index of the current track.
 */
export async function getCurrentTrack(): Promise<number | undefined> {
  return await TrackPlayer.getCurrentTrack() ?? undefined;
}

/**
 * Gets the duration of the current track in seconds.
 */
export async function getDuration(): Promise<number> {
  return await TrackPlayer.getDuration();
}

/**
 * Gets the buffered position of the player in seconds.
 */
export async function getBufferedPosition(): Promise<number> {
  return await TrackPlayer.getBufferedPosition();
}

/**
 * Gets the position of the player in seconds.
 */
export async function getPosition(): Promise<number> {
  return await TrackPlayer.getPosition();
}

/**
 * Gets the state of the player.
 */
export async function getState(): Promise<State> {
  return await TrackPlayer.getState();
}

/**
 * Gets the repeat mode.
 */
export async function getRepeatMode(): Promise<RepeatMode> {
  return await TrackPlayer.getRepeatMode();
}

/**
 * Moves an item in the queue.
 */
export async function move(index: number, newIndex: number): Promise<void> {
  return await TrackPlayer.move(index, newIndex);
}

/**
 * Shuffle the queue.
 */
export async function shuffle(): Promise<void> {
  return await TrackPlayer.shuffle();
}

/**
 * Clear the queue.
 */
export async function clear(): Promise<void> {
  return await TrackPlayer.clear();
}

/**
 * Gets the shuffle mode.
 */
export async function getShuffleModeEnabled(): Promise<boolean> {
  return await TrackPlayer.getShuffleModeEnabled();
}

/**
 * Sets the shuffle mode.
 */
export async function setShuffleModeEnabled(enabled: boolean): Promise<void> {
  return await TrackPlayer.setShuffleModeEnabled(enabled);
}

/**
 * Adds download requests.
 */
export async function addDownloads(requests: DownloadRequest[]): Promise<void> {
  return await TrackPlayer.addDownloads(requests);
}

/**
 * Remove all downloads.
 */
export async function clearDownloads(): Promise<void> {
  return await TrackPlayer.clearDownloads();
}

/**
 * Gets all downloads.
 */
export async function getDownloadsPaused(): Promise<boolean> {
  return await TrackPlayer.getDownloadsPaused();
}

/**
 * Gets all downloads.
 */
export async function getDownloads(): Promise<Download[]> {
  return await TrackPlayer.getDownloads() as unknown as Download[];
}

/**
 * Gets all current downloads.
 */
export async function getCurrentDownloads(): Promise<Download[]> {
  return await TrackPlayer.getCurrentDownloads() as unknown as Download[];
}

/**
 * Set the request headers.
 */
export async function setDownloadHeaders(header: { [key: string]: string }): Promise<void> {
  return TrackPlayer.setDownloadHeaders(header);
}

/**
 * Gets a download by id.
 */
export async function getDownload(id: string): Promise<Download | undefined> {
  return (await TrackPlayer.getDownload(id) as unknown as Download) ?? undefined;
}

/**
 * Removes a download by id.
 */
export async function removeDownload(id: string): Promise<void> {
  return await TrackPlayer.removeDownload(id);
}

/**
 * Toggle downloading.
 */
export async function toggleDownloadsPaused(): Promise<void> {
  return await TrackPlayer.toggleDownloadsPaused();
}

/**
 * Resume downloading.
 */
export async function resumeDownloads(): Promise<void> {
  return await TrackPlayer.resumeDownloads();
}

/**
 * Pause downloading.
 */
export async function pauseDownloads(): Promise<void> {
  return await TrackPlayer.pauseDownloads();
}

/**
 * Gets Playback Parameters.
 */
export async function getPlaybackParameters(): Promise<PlaybackParameters> {
  return await TrackPlayer.getPlaybackParameters() as unknown as PlaybackParameters;
}

/**
 * Sets Playback Parameters.
 */
export async function setPlaybackParameters(speed: number, pitch: number): Promise<void> {
  return await TrackPlayer.setPlaybackParameters(speed, pitch);
}

/**
 * Gets Playback Speed.
 */
export async function getPlaybackSpeed(): Promise<number> {
  return await TrackPlayer.getPlaybackSpeed();
}

/**
 * Sets Playback Speed.
 */
export async function setPlaybackSpeed(speed: number): Promise<void> {
  return await TrackPlayer.setPlaybackSpeed(speed);
}

/**
 * Gets Playback Pitch.
 */
export async function getPlaybackPitch(): Promise<number> {
  return await TrackPlayer.getPlaybackPitch();
}

/**
 * Sets Playback Pitch.
 */
export async function setPlaybackPitch(pitch: number): Promise<void> {
  return await TrackPlayer.setPlaybackPitch(pitch);
}

/**
 * Gets the next item (with respecting shuffle mode)
 */
export async function hasNext(): Promise<boolean> {
  return await TrackPlayer.hasNext();
}

/**
 * Gets the previous item (with respecting shuffle mode)
 */
export async function hasPrevious(): Promise<boolean> {
  return await TrackPlayer.hasPrevious();
}
