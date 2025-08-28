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
/**
 * Initializes the player with the specified options.
 */
export declare function setupPlayer(options?: PlayerOptions): Promise<void>;
/**
 * Register the playback service. The service will run as long as the player runs.
 */
export declare function registerPlaybackService(factory: () => ServiceHandler): void;
/**
 * Destroys the player, cleaning up its resources.
 */
export declare function destroy(): void;
/**
 * is the track player already started
 */
export declare function isServiceRunning(): Promise<boolean>;
/**
 * add an event listener
 */
export declare function addEventListener<T extends Event>(event: T, listener: EventPayloadByEvent[T] extends never ? () => void : (event: EventPayloadByEvent[T]) => void): import("react-native").EventSubscription;
/**
 * Adds one or more tracks to the queue.
 */
export declare function add(tracks: AddTrack | AddTrack[], insertBeforeIndex?: number): Promise<void>;
/**
 * Removes one or more tracks from the queue.
 */
export declare function remove(indexOrIndexes: number | number[]): Promise<void>;
/**
 * Clears any upcoming tracks from the queue.
 */
export declare function removeUpcomingTracks(): Promise<void>;
/**
 * Skips to a track in the queue.
 */
export declare function skip(trackIndex: number): Promise<void>;
/**
 * Skips to the next track in the queue.
 */
export declare function skipToNext(): Promise<void>;
/**
 * Skips to the previous track in the queue.
 */
export declare function skipToPrevious(): Promise<void>;
/**
 * Updates the configuration for the components.
 */
export declare function updateOptions(options?: MetadataOptions): Promise<void>;
/**
 * Updates the metadata of a track in the queue. If the current track is updated,
 * the notification and the Now Playing Center will be updated accordingly.
 */
export declare function updateMetadataForTrack(trackIndex: number, metadata: TrackMetadataBase): Promise<void>;
/**
 * clear NowPlaying Metadata
 */
export declare function clearNowPlayingMetadata(): Promise<void>;
/**
 * Updates the metadata of a NowPlaying track
 */
export declare function updateNowPlayingMetadata(metadata: NowPlayingMetadata): Promise<void>;
/**
 * Resets the player stopping the current track and clearing the queue.
 */
export declare function reset(): Promise<void>;
/**
 * Plays or resumes the current track.
 */
export declare function play(): Promise<void>;
/**
 * Pauses the current track.
 */
export declare function pause(): Promise<void>;
/**
 * Stops the current track.
 */
export declare function stop(): Promise<void>;
/**
 * Seeks to a specified time position in the current track.
 */
export declare function seekTo(position: number): Promise<void>;
/**
 * Sets the volume of the player.
 */
export declare function setVolume(level: number): Promise<void>;
/**
 * Sets the repeat mode.
 */
export declare function setRepeatMode(mode: RepeatMode): Promise<void>;
/**
 * Gets the volume of the player (a number between 0 and 1).
 */
export declare function getVolume(): Promise<number>;
/**
 * Gets a track object from the queue.
 */
export declare function getTrack(trackIndex: number): Promise<Track | null>;
/**
 * Gets the whole queue.
 */
export declare function getQueue(): Promise<Track[]>;
/**
 * Gets the index of the current track.
 */
export declare function getCurrentTrack(): Promise<number | undefined>;
/**
 * Gets the duration of the current track in seconds.
 */
export declare function getDuration(): Promise<number>;
/**
 * Gets the buffered position of the player in seconds.
 */
export declare function getBufferedPosition(): Promise<number>;
/**
 * Gets the position of the player in seconds.
 */
export declare function getPosition(): Promise<number>;
/**
 * Gets the state of the player.
 */
export declare function getState(): Promise<State>;
/**
 * Gets the repeat mode.
 */
export declare function getRepeatMode(): Promise<RepeatMode>;
/**
 * Moves an item in the queue.
 */
export declare function move(index: number, newIndex: number): Promise<void>;
/**
 * Shuffle the queue.
 */
export declare function shuffle(): Promise<void>;
/**
 * Clear the queue.
 */
export declare function clear(): Promise<void>;
/**
 * Gets the shuffle mode.
 */
export declare function getShuffleModeEnabled(): Promise<boolean>;
/**
 * Sets the shuffle mode.
 */
export declare function setShuffleModeEnabled(enabled: boolean): Promise<void>;
/**
 * Adds download requests.
 */
export declare function addDownloads(requests: DownloadRequest[]): Promise<void>;
/**
 * Remove all downloads.
 */
export declare function clearDownloads(): Promise<void>;
/**
 * Gets all downloads.
 */
export declare function getDownloadsPaused(): Promise<boolean>;
/**
 * Gets all downloads.
 */
export declare function getDownloads(): Promise<Download[]>;
/**
 * Gets all current downloads.
 */
export declare function getCurrentDownloads(): Promise<Download[]>;
/**
 * Set the request headers.
 */
export declare function setDownloadHeaders(header: {
    [key: string]: string;
}): Promise<void>;
/**
 * Gets a download by id.
 */
export declare function getDownload(id: string): Promise<Download | undefined>;
/**
 * Removes a download by id.
 */
export declare function removeDownload(id: string): Promise<void>;
/**
 * Toggle downloading.
 */
export declare function toggleDownloadsPaused(): Promise<void>;
/**
 * Resume downloading.
 */
export declare function resumeDownloads(): Promise<void>;
/**
 * Pause downloading.
 */
export declare function pauseDownloads(): Promise<void>;
/**
 * Gets Playback Parameters.
 */
export declare function getPlaybackParameters(): Promise<PlaybackParameters>;
/**
 * Sets Playback Parameters.
 */
export declare function setPlaybackParameters(speed: number, pitch: number): Promise<void>;
/**
 * Gets Playback Speed.
 */
export declare function getPlaybackSpeed(): Promise<number>;
/**
 * Sets Playback Speed.
 */
export declare function setPlaybackSpeed(speed: number): Promise<void>;
/**
 * Gets Playback Pitch.
 */
export declare function getPlaybackPitch(): Promise<number>;
/**
 * Sets Playback Pitch.
 */
export declare function setPlaybackPitch(pitch: number): Promise<void>;
/**
 * Gets the next item (with respecting shuffle mode)
 */
export declare function hasNext(): Promise<boolean>;
/**
 * Gets the previous item (with respecting shuffle mode)
 */
export declare function hasPrevious(): Promise<boolean>;
//# sourceMappingURL=trackPlayer.d.ts.map