"use strict";

import { AppRegistry, NativeEventEmitter, Platform } from "react-native";
import TrackPlayer from "./NativeTrackPlayer.js";
import { resolveImportedAssetOrPath } from "./helper/resolveImportedAssetOrPath.js";
const isAndroid = Platform.OS === "android";
const emitter = new NativeEventEmitter(TrackPlayer);

/**
 * Initializes the player with the specified options.
 */
export async function setupPlayer(options = {}) {
  return TrackPlayer.setupPlayer(options);
}

/**
 * Register the playback service. The service will run as long as the player runs.
 */
export function registerPlaybackService(factory) {
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
export function destroy() {
  return TrackPlayer.destroy();
}

/**
 * is the track player already started
 */
export async function isServiceRunning() {
  return await TrackPlayer.isServiceRunning();
}

/**
 * add an event listener
 */
export function addEventListener(event, listener) {
  return emitter.addListener(event, listener);
}

/**
 * Adds one or more tracks to the queue.
 */
export async function add(tracks, insertBeforeIndex) {
  const resolvedTracks = (Array.isArray(tracks) ? tracks : [tracks]).map(track => ({
    ...track,
    url: resolveImportedAssetOrPath(track.url),
    artwork: resolveImportedAssetOrPath(track.artwork)
  }));
  return resolvedTracks.length < 1 ? undefined : await TrackPlayer.add(resolvedTracks, insertBeforeIndex === undefined ? -1 : insertBeforeIndex);
}

/**
 * Removes one or more tracks from the queue.
 */
export async function remove(indexOrIndexes) {
  return await TrackPlayer.remove(Array.isArray(indexOrIndexes) ? indexOrIndexes : [indexOrIndexes]);
}

/**
 * Clears any upcoming tracks from the queue.
 */
export async function removeUpcomingTracks() {
  return await TrackPlayer.removeUpcomingTracks();
}

/**
 * Skips to a track in the queue.
 */
export async function skip(trackIndex) {
  return await TrackPlayer.skip(trackIndex);
}

/**
 * Skips to the next track in the queue.
 */
export async function skipToNext() {
  return await TrackPlayer.skipToNext();
}

/**
 * Skips to the previous track in the queue.
 */
export async function skipToPrevious() {
  return await TrackPlayer.skipToPrevious();
}

/**
 * Updates the configuration for the components.
 */
export async function updateOptions(options = {}) {
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
export async function updateMetadataForTrack(trackIndex, metadata) {
  return await TrackPlayer.updateMetadataForTrack(trackIndex, {
    ...metadata,
    artwork: resolveImportedAssetOrPath(metadata.artwork)
  });
}

/**
 * clear NowPlaying Metadata
 */
export async function clearNowPlayingMetadata() {
  return await TrackPlayer.clearNowPlayingMetadata();
}

/**
 * Updates the metadata of a NowPlaying track
 */
export async function updateNowPlayingMetadata(metadata) {
  return await TrackPlayer.updateNowPlayingMetadata({
    ...metadata,
    artwork: resolveImportedAssetOrPath(metadata.artwork)
  });
}

/**
 * Resets the player stopping the current track and clearing the queue.
 */
export async function reset() {
  return await TrackPlayer.reset();
}

/**
 * Plays or resumes the current track.
 */
export async function play() {
  return await TrackPlayer.play();
}

/**
 * Pauses the current track.
 */
export async function pause() {
  return await TrackPlayer.pause();
}

/**
 * Stops the current track.
 */
export async function stop() {
  return await TrackPlayer.stop();
}

/**
 * Seeks to a specified time position in the current track.
 */
export async function seekTo(position) {
  return await TrackPlayer.seekTo(position);
}

/**
 * Sets the volume of the player.
 */
export async function setVolume(level) {
  return await TrackPlayer.setVolume(level);
}

/**
 * Sets the repeat mode.
 */
export async function setRepeatMode(mode) {
  return await TrackPlayer.setRepeatMode(mode);
}

/**
 * Gets the volume of the player (a number between 0 and 1).
 */
export async function getVolume() {
  return await TrackPlayer.getVolume();
}

/**
 * Gets a track object from the queue.
 */
export async function getTrack(trackIndex) {
  return await TrackPlayer.getTrack(trackIndex);
}

/**
 * Gets the whole queue.
 */
export async function getQueue() {
  return await TrackPlayer.getQueue();
}

/**
 * Gets the index of the current track.
 */
export async function getCurrentTrack() {
  return (await TrackPlayer.getCurrentTrack()) ?? undefined;
}

/**
 * Gets the duration of the current track in seconds.
 */
export async function getDuration() {
  return await TrackPlayer.getDuration();
}

/**
 * Gets the buffered position of the player in seconds.
 */
export async function getBufferedPosition() {
  return await TrackPlayer.getBufferedPosition();
}

/**
 * Gets the position of the player in seconds.
 */
export async function getPosition() {
  return await TrackPlayer.getPosition();
}

/**
 * Gets the state of the player.
 */
export async function getState() {
  return await TrackPlayer.getState();
}

/**
 * Gets the repeat mode.
 */
export async function getRepeatMode() {
  return await TrackPlayer.getRepeatMode();
}

/**
 * Moves an item in the queue.
 */
export async function move(index, newIndex) {
  return await TrackPlayer.move(index, newIndex);
}

/**
 * Shuffle the queue.
 */
export async function shuffle() {
  return await TrackPlayer.shuffle();
}

/**
 * Clear the queue.
 */
export async function clear() {
  return await TrackPlayer.clear();
}

/**
 * Gets the shuffle mode.
 */
export async function getShuffleModeEnabled() {
  return await TrackPlayer.getShuffleModeEnabled();
}

/**
 * Sets the shuffle mode.
 */
export async function setShuffleModeEnabled(enabled) {
  return await TrackPlayer.setShuffleModeEnabled(enabled);
}

/**
 * Adds download requests.
 */
export async function addDownloads(requests) {
  return await TrackPlayer.addDownloads(requests);
}

/**
 * Remove all downloads.
 */
export async function clearDownloads() {
  return await TrackPlayer.clearDownloads();
}

/**
 * Gets all downloads.
 */
export async function getDownloadsPaused() {
  return await TrackPlayer.getDownloadsPaused();
}

/**
 * Gets all downloads.
 */
export async function getDownloads() {
  return await TrackPlayer.getDownloads();
}

/**
 * Gets all current downloads.
 */
export async function getCurrentDownloads() {
  return await TrackPlayer.getCurrentDownloads();
}

/**
 * Set the request headers.
 */
export async function setDownloadHeaders(header) {
  return TrackPlayer.setDownloadHeaders(header);
}

/**
 * Gets a download by id.
 */
export async function getDownload(id) {
  return (await TrackPlayer.getDownload(id)) ?? undefined;
}

/**
 * Removes a download by id.
 */
export async function removeDownload(id) {
  return await TrackPlayer.removeDownload(id);
}

/**
 * Toggle downloading.
 */
export async function toggleDownloadsPaused() {
  return await TrackPlayer.toggleDownloadsPaused();
}

/**
 * Resume downloading.
 */
export async function resumeDownloads() {
  return await TrackPlayer.resumeDownloads();
}

/**
 * Pause downloading.
 */
export async function pauseDownloads() {
  return await TrackPlayer.pauseDownloads();
}

/**
 * Gets Playback Parameters.
 */
export async function getPlaybackParameters() {
  return await TrackPlayer.getPlaybackParameters();
}

/**
 * Sets Playback Parameters.
 */
export async function setPlaybackParameters(speed, pitch) {
  return await TrackPlayer.setPlaybackParameters(speed, pitch);
}

/**
 * Gets Playback Speed.
 */
export async function getPlaybackSpeed() {
  return await TrackPlayer.getPlaybackSpeed();
}

/**
 * Sets Playback Speed.
 */
export async function setPlaybackSpeed(speed) {
  return await TrackPlayer.setPlaybackSpeed(speed);
}

/**
 * Gets Playback Pitch.
 */
export async function getPlaybackPitch() {
  return await TrackPlayer.getPlaybackPitch();
}

/**
 * Sets Playback Pitch.
 */
export async function setPlaybackPitch(pitch) {
  return await TrackPlayer.setPlaybackPitch(pitch);
}

/**
 * Gets the next item (with respecting shuffle mode)
 */
export async function hasNext() {
  return await TrackPlayer.hasNext();
}

/**
 * Gets the previous item (with respecting shuffle mode)
 */
export async function hasPrevious() {
  return await TrackPlayer.hasPrevious();
}
//# sourceMappingURL=trackPlayer.js.map