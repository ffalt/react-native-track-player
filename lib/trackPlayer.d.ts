import { MetadataOptions, PlayerOptions, Event, Track, State, TrackMetadataBase, NowPlayingMetadata, RepeatMode, DownloadRequest, Download, PlaybackParameters } from "./interfaces";
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
declare function addEventListener(event: Event, listener: (data: any) => void): import("react-native").EmitterSubscription;
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
declare function removeDownloads(): Promise<void>;
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
declare const _default: {
    setupPlayer: typeof setupPlayer;
    destroy: typeof destroy;
    registerPlaybackService: typeof registerPlaybackService;
    addEventListener: typeof addEventListener;
    isServiceRunning: typeof isServiceRunning;
    add: typeof add;
    remove: typeof remove;
    removeUpcomingTracks: typeof removeUpcomingTracks;
    move: typeof move;
    clear: typeof clear;
    shuffle: typeof shuffle;
    skip: typeof skip;
    skipToNext: typeof skipToNext;
    skipToPrevious: typeof skipToPrevious;
    setShuffleModeEnabled: typeof setShuffleModeEnabled;
    updateOptions: typeof updateOptions;
    updateMetadataForTrack: typeof updateMetadataForTrack;
    clearNowPlayingMetadata: typeof clearNowPlayingMetadata;
    updateNowPlayingMetadata: typeof updateNowPlayingMetadata;
    reset: typeof reset;
    play: typeof play;
    pause: typeof pause;
    stop: typeof stop;
    seekTo: typeof seekTo;
    setVolume: typeof setVolume;
    setRepeatMode: typeof setRepeatMode;
    setPlaybackParameters: typeof setPlaybackParameters;
    setPlaybackSpeed: typeof setPlaybackSpeed;
    setPlaybackPitch: typeof setPlaybackPitch;
    getVolume: typeof getVolume;
    getTrack: typeof getTrack;
    getQueue: typeof getQueue;
    getCurrentTrack: typeof getCurrentTrack;
    getDuration: typeof getDuration;
    getBufferedPosition: typeof getBufferedPosition;
    getPosition: typeof getPosition;
    getState: typeof getState;
    getShuffleModeEnabled: typeof getShuffleModeEnabled;
    getRepeatMode: typeof getRepeatMode;
    getPlaybackParameters: typeof getPlaybackParameters;
    getPlaybackSpeed: typeof getPlaybackSpeed;
    getPlaybackPitch: typeof getPlaybackPitch;
    addDownloads: typeof addDownloads;
    removeDownload: typeof removeDownload;
    removeDownloads: typeof removeDownloads;
    getDownloadsPaused: typeof getDownloadsPaused;
    getCurrentDownloads: typeof getCurrentDownloads;
    getDownloads: typeof getDownloads;
    getDownload: typeof getDownload;
    toggleDownloadsPaused: typeof toggleDownloadsPaused;
    resumeDownloads: typeof resumeDownloads;
    pauseDownloads: typeof pauseDownloads;
};
export default _default;
