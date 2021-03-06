import { MetadataOptions, PlayerOptions, Event, Track, State, TrackMetadataBase, NowPlayingMetadata, RepeatMode } from './interfaces';
declare function setupPlayer(options?: PlayerOptions): Promise<void>;
declare function destroy(): any;
declare type ServiceHandler = () => Promise<void>;
declare function registerPlaybackService(factory: () => ServiceHandler): void;
declare function addEventListener(event: Event, listener: (data: any) => void): import("react-native").EmitterSubscription;
declare function add(tracks: Track | Track[], insertBeforeIndex?: number): Promise<void>;
declare function move(index: number, newIndex: number): Promise<void>;
declare function remove(index: number | number[]): Promise<void>;
declare function removeUpcomingTracks(): Promise<void>;
declare function skip(index: number): Promise<void>;
declare function skipToNext(): Promise<void>;
declare function skipToPrevious(): Promise<void>;
declare function shuffle(): Promise<void>;
declare function clear(): Promise<void>;
declare function isServiceRunning(): Promise<boolean>;
declare function updateOptions(options?: MetadataOptions): Promise<void>;
declare function updateMetadataForTrack(index: number, metadata: TrackMetadataBase): Promise<void>;
declare function clearNowPlayingMetadata(): Promise<void>;
declare function updateNowPlayingMetadata(metadata: NowPlayingMetadata): Promise<void>;
declare function reset(): Promise<void>;
declare function play(): Promise<void>;
declare function pause(): Promise<void>;
declare function stop(): Promise<void>;
declare function seekTo(position: number): Promise<void>;
declare function setVolume(level: number): Promise<void>;
declare function setRate(rate: number): Promise<void>;
declare function getVolume(): Promise<number>;
declare function getRate(): Promise<number>;
declare function getTrack(trackId: string): Promise<Track>;
declare function getTrackAt(index: number): Promise<Track | undefined>;
declare function getQueue(): Promise<Track[]>;
declare function getCurrentTrack(): Promise<string>;
declare function getCurrentTrackIndex(): Promise<number>;
declare function getDuration(): Promise<number>;
declare function getBufferedPosition(): Promise<number>;
declare function getPosition(): Promise<number>;
declare function getState(): Promise<State>;
declare function setRepeatMode(repeatMode: number): Promise<void>;
declare function getShuffleModeEnabled(): Promise<boolean>;
declare function setShuffleModeEnabled(enabled: boolean): Promise<boolean>;
declare function getRepeatMode(): Promise<RepeatMode>;
declare const _default: {
    setupPlayer: typeof setupPlayer;
    destroy: typeof destroy;
    registerPlaybackService: typeof registerPlaybackService;
    addEventListener: typeof addEventListener;
    isServiceRunning: typeof isServiceRunning;
    add: typeof add;
    move: typeof move;
    remove: typeof remove;
    removeUpcomingTracks: typeof removeUpcomingTracks;
    clear: typeof clear;
    shuffle: typeof shuffle;
    skip: typeof skip;
    skipToNext: typeof skipToNext;
    skipToPrevious: typeof skipToPrevious;
    getRepeatMode: typeof getRepeatMode;
    setRepeatMode: typeof setRepeatMode;
    getShuffleModeEnabled: typeof getShuffleModeEnabled;
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
    setRate: typeof setRate;
    getVolume: typeof getVolume;
    getRate: typeof getRate;
    getTrack: typeof getTrack;
    getTrackAt: typeof getTrackAt;
    getQueue: typeof getQueue;
    getCurrentTrack: typeof getCurrentTrack;
    getCurrentTrackIndex: typeof getCurrentTrackIndex;
    getDuration: typeof getDuration;
    getBufferedPosition: typeof getBufferedPosition;
    getPosition: typeof getPosition;
    getState: typeof getState;
};
export default _default;
