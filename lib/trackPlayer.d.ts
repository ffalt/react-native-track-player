import { MetadataOptions, PlayerOptions, Track, State, TrackMetadataBase, NowPlayingMetadata, RepeatMode, DownloadRequest, Download, PlaybackParameters, EventMap } from './interfaces';
/**
 * Initializes the player with the specified options.
 */
declare function setupPlayer(options?: PlayerOptions): Promise<void>;
/**
 * Destroys the player, cleaning up its resources.
 */
declare function destroy(): any;
type ServiceHandler = () => Promise<void>;
/**
 * Register the playback service. The service will run as long as the player runs.
 */
declare function registerPlaybackService(factory: () => ServiceHandler): void;
declare function addEventListener<E extends keyof EventMap>(event: E, listener: (data: EventMap[E]) => void): import("react-native").EmitterSubscription;
declare function isServiceRunning(): Promise<boolean>;
/**
 * Adds one or more tracks to the queue.
 */
declare function add(tracks: Track | Track[], insertBeforeIndex?: number): Promise<void>;
/**
 * Removes one or more tracks from the queue.
 */
declare function remove(tracks: number | number[]): Promise<void>;
/**
 * Clears any upcoming tracks from the queue.
 */
declare function removeUpcomingTracks(): Promise<void>;
/**
 * Skips to a track in the queue.
 */
declare function skip(trackIndex: number): Promise<void>;
/**
 * Skips to the next track in the queue.
 */
declare function skipToNext(): Promise<void>;
/**
 * Skips to the previous track in the queue.
 */
declare function skipToPrevious(): Promise<void>;
/**
 * Updates the configuration for the components.
 */
declare function updateOptions(options?: MetadataOptions): Promise<void>;
/**
 * Updates the metadata of a track in the queue. If the current track is updated,
 * the notification and the Now Playing Center will be updated accordingly.
 */
declare function updateMetadataForTrack(trackIndex: number, metadata: TrackMetadataBase): Promise<void>;
declare function clearNowPlayingMetadata(): Promise<void>;
declare function updateNowPlayingMetadata(metadata: NowPlayingMetadata): Promise<void>;
/**
 * Resets the player stopping the current track and clearing the queue.
 */
declare function reset(): Promise<void>;
/**
 * Plays or resumes the current track.
 */
declare function play(): Promise<void>;
/**
 * Pauses the current track.
 */
declare function pause(): Promise<void>;
/**
 * Stops the current track.
 */
declare function stop(): Promise<void>;
/**
 * Seeks to a specified time position in the current track.
 */
declare function seekTo(position: number): Promise<void>;
/**
 * Sets the volume of the player.
 */
declare function setVolume(level: number): Promise<void>;
/**
 * Sets the repeat mode.
 */
declare function setRepeatMode(mode: RepeatMode): Promise<RepeatMode>;
/**
 * Gets the volume of the player (a number between 0 and 1).
 */
declare function getVolume(): Promise<number>;
/**
 * Gets a track object from the queue.
 */
declare function getTrack(trackIndex: number): Promise<Track | null>;
/**
 * Gets the whole queue.
 */
declare function getQueue(): Promise<Track[]>;
/**
 * Gets the index of the current track.
 */
declare function getCurrentTrack(): Promise<number>;
/**
 * Gets the duration of the current track in seconds.
 */
declare function getDuration(): Promise<number>;
/**
 * Gets the buffered position of the player in seconds.
 */
declare function getBufferedPosition(): Promise<number>;
/**
 * Gets the position of the player in seconds.
 */
declare function getPosition(): Promise<number>;
/**
 * Gets the state of the player.
 */
declare function getState(): Promise<State>;
/**
 * Gets the repeat mode.
 */
declare function getRepeatMode(): Promise<RepeatMode>;
/**
 * Moves an item in the queue.
 */
declare function move(index: number, newIndex: number): Promise<void>;
/**
 * Shuffle the queue.
 */
declare function shuffle(): Promise<void>;
/**
 * Clear the queue.
 */
declare function clear(): Promise<void>;
/**
 * Gets the shuffle mode.
 */
declare function getShuffleModeEnabled(): Promise<boolean>;
/**
 * Sets the shuffle mode.
 */
declare function setShuffleModeEnabled(enabled: boolean): Promise<boolean>;
/**
 * Adds download requests.
 */
declare function addDownloads(requests: DownloadRequest[]): Promise<void>;
/**
 * Remove all downloads.
 */
declare function clearDownloads(): Promise<void>;
/**
 * Gets all downloads.
 */
declare function getDownloadsPaused(): Promise<boolean>;
/**
 * Gets all downloads.
 */
declare function getDownloads(): Promise<Download[]>;
/**
 * Gets all current downloads.
 */
declare function getCurrentDownloads(): Promise<Download[]>;
/**
 * Set the request headers.
 */
declare function setDownloadHeaders(header: {
    [key: string]: string;
}): Promise<void>;
/**
 * Gets an download by id.
 */
declare function getDownload(id: string): Promise<Download | undefined>;
/**
 * Removes an download by id.
 */
declare function removeDownload(id: string): Promise<Download | undefined>;
/**
 * Toggle downloading.
 */
declare function toggleDownloadsPaused(): Promise<void>;
/**
 * Resume downloading.
 */
declare function resumeDownloads(): Promise<void>;
/**
 * Pause downloading.
 */
declare function pauseDownloads(): Promise<void>;
/**
 * Gets Playback Parameters.
 */
declare function getPlaybackParameters(): Promise<PlaybackParameters>;
/**
 * Sets Playback Parameters.
 */
declare function setPlaybackParameters(paybackParameters: PlaybackParameters): Promise<void>;
/**
 * Gets Playback Speed.
 */
declare function getPlaybackSpeed(): Promise<number>;
/**
 * Sets Playback Speed.
 */
declare function setPlaybackSpeed(speed: number): Promise<void>;
/**
 * Gets Playback Pitch.
 */
declare function getPlaybackPitch(): Promise<number>;
/**
 * Sets Playback Pitch.
 */
declare function setPlaybackPitch(pitch: number): Promise<void>;
/**
 * Gets the next item (with respecting shuffle mode)
 */
declare function hasNext(): Promise<boolean>;
/**
 * Gets the previous item (with respecting shuffle mode)
 */
declare function hasPrevious(): Promise<boolean>;
declare const _default: {
    add: typeof add;
    addDownloads: typeof addDownloads;
    addEventListener: typeof addEventListener;
    clear: typeof clear;
    clearDownloads: typeof clearDownloads;
    clearNowPlayingMetadata: typeof clearNowPlayingMetadata;
    destroy: typeof destroy;
    getBufferedPosition: typeof getBufferedPosition;
    getCurrentDownloads: typeof getCurrentDownloads;
    getCurrentTrack: typeof getCurrentTrack;
    getDownload: typeof getDownload;
    getDownloads: typeof getDownloads;
    getDownloadsPaused: typeof getDownloadsPaused;
    getDuration: typeof getDuration;
    getPlaybackParameters: typeof getPlaybackParameters;
    getPlaybackPitch: typeof getPlaybackPitch;
    getPlaybackSpeed: typeof getPlaybackSpeed;
    getPosition: typeof getPosition;
    getQueue: typeof getQueue;
    getRepeatMode: typeof getRepeatMode;
    getShuffleModeEnabled: typeof getShuffleModeEnabled;
    getState: typeof getState;
    getTrack: typeof getTrack;
    getVolume: typeof getVolume;
    hasNext: typeof hasNext;
    hasPrevious: typeof hasPrevious;
    isServiceRunning: typeof isServiceRunning;
    move: typeof move;
    pause: typeof pause;
    pauseDownloads: typeof pauseDownloads;
    play: typeof play;
    registerPlaybackService: typeof registerPlaybackService;
    remove: typeof remove;
    removeDownload: typeof removeDownload;
    removeUpcomingTracks: typeof removeUpcomingTracks;
    reset: typeof reset;
    resumeDownloads: typeof resumeDownloads;
    seekTo: typeof seekTo;
    setDownloadHeaders: typeof setDownloadHeaders;
    setPlaybackParameters: typeof setPlaybackParameters;
    setPlaybackPitch: typeof setPlaybackPitch;
    setPlaybackSpeed: typeof setPlaybackSpeed;
    setRepeatMode: typeof setRepeatMode;
    setShuffleModeEnabled: typeof setShuffleModeEnabled;
    setVolume: typeof setVolume;
    setupPlayer: typeof setupPlayer;
    shuffle: typeof shuffle;
    skip: typeof skip;
    skipToNext: typeof skipToNext;
    skipToPrevious: typeof skipToPrevious;
    stop: typeof stop;
    toggleDownloadsPaused: typeof toggleDownloadsPaused;
    updateMetadataForTrack: typeof updateMetadataForTrack;
    updateNowPlayingMetadata: typeof updateNowPlayingMetadata;
    updateOptions: typeof updateOptions;
};
export default _default;
