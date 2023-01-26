import { Download, Event, EventMap, PlaybackParameters, RepeatMode, State, Track } from "./interfaces";
type Handler<E extends keyof EventMap> = (payload: EventMap[E]) => void;
/**
 * Attaches a handler to the given TrackPlayer event and performs cleanup on unmount
 * @param event - TrackPlayer event to subscribe to
 * @param handler - callback invoked when the event fires
 */
export declare function useTrackPlayerEvent<E extends keyof EventMap>(event: E, handler: (payload: EventMap[E]) => void): void;
/**
 * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 */
export declare function useTrackPlayerEvents(events: Event[], handler: Handler<any>): void;
/**
 * Attaches a handler to the given TrackPlayer event, stores data, updates data (if not equal) and performs cleanup on unmount
 * @param event - TrackPlayer event to subscribe to
 * @param handler - callback invoked when the event fires
 * @param defaultValue - the default value of the data
 * @param compareFunc - optional callback to compare for equal (=== default)
 * @param filter - optional callback to check if should be updated
 */
export declare function useTrackPlayerDataEvent<T, E extends keyof EventMap>(event: E, handler: (payload?: EventMap[E]) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean, filter?: (payload?: EventMap[E]) => boolean): T;
/**
 * Attaches a handler to the given TrackPlayer events, stores data, updates data (if not equal) and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 * @param defaultValue - the default value of the data
 * @param compareFunc - optional callback to compare for equal (=== default)
 */
export declare function useTrackPlayerDataEvents<T, S = void>(events: Array<Event>, handler: (payload?: S) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean): T;
/** Get current playback state and subsequent updates  */
export declare function useTrackPlayerPlaybackState(): State;
export interface ProgressState {
    position: number;
    duration: number;
    buffered: number;
}
/**
 * Poll for track progress for the given interval (in milliseconds)
 * @param updateInterval - ms interval
 */
export declare function useTrackPlayerProgress(updateInterval?: number): ProgressState;
export declare function useTrackPlayerCurrentTrackNr(): number | undefined;
export declare function useTrackPlayerCurrentTrack(): Track | undefined;
export declare function useTrackPlayerQueue(): Array<Track> | undefined;
export declare function useTrackPlayerDownloads(): Array<Download> | undefined;
export declare function useTrackPlayerDownloadsPaused(): boolean;
export declare function useTrackPlayerCurrentDownloads(): Array<Download> | undefined;
export declare function useTrackPlayerDownload(id: string): Download | undefined;
export declare const useTrackPlayerPlaybackStateIs: (...states: Array<State>) => boolean;
export declare const useTrackPlayerPlaybackStateIsPlaying: () => boolean;
export declare const useTrackPlayerProgressPercent: (interval?: number) => {
    progress: number;
    bufferProgress: number;
};
export declare const useTrackPlayerProgressMS: (interval?: number) => {
    duration: number;
    position: number;
};
export declare function useTrackPlayerShuffleModeEnabled(): boolean;
export declare function useTrackPlayerRepeatMode(): RepeatMode;
export declare function useTrackPlayerPlaybackParameters(): PlaybackParameters;
export declare const useTrackPlayerPlaybackSpeed: () => number;
export declare const useTrackPlayerPlaybackPitch: () => number;
export declare const useTrackPlayerHasNext: () => boolean;
export declare const useTrackPlayerHasPrevious: () => boolean;
export declare const useTrackPlayerHasSiblings: () => {
    hasNext: boolean;
    hasPrevious: boolean;
};
export {};
