import { State, Event, Track, Download, RepeatMode, PlaybackParameters } from "./interfaces";
/** Get current playback state and subsequent updatates  */
export declare const useTrackPlayerPlaybackState: () => State;
type Handler = (payload: {
    type: Event;
    [key: string]: any;
}) => void;
/**
 * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 */
export declare const useTrackPlayerEvents: (events: Event[], handler: Handler) => void;
export declare const useTrackPlayerEvent: (event: Event, handler: Handler) => void;
export interface ProgressState {
    position: number;
    duration: number;
    buffered: number;
}
/**
 * Poll for track progress for the given interval (in miliseconds)
 * @param interval - ms interval
 */
export declare function useTrackPlayerProgress(updateInterval?: number): ProgressState;
export declare function useTrackPlayerCurrentTrackNr(): number | undefined;
export declare function useTrackPlayerCurrentTrack(): Track | undefined;
export declare function useTrackPlayerQueue(): Array<Track> | undefined;
export declare function useTrackPlayerDownloads(): Array<Download> | undefined;
export declare function useTrackPlayerDownloadsPaused(): boolean;
export declare function useTrackPlayerCurrentDownloads(): Array<Download> | undefined;
export declare function useTrackPlayerDownload(url: string): Download | undefined;
export declare const useTrackPlayerPlaybackStateIs: (...states: Array<State>) => boolean;
export declare const useTrackPlayerPlaybackStateIsPlaying: () => boolean;
export declare const useTrackPlayerProgressPercent: (interval?: number) => {
    progress: number;
    bufferProgress: number;
};
export declare const useTrackPlayerProgressMS: () => {
    duration: number;
    position: number;
};
export declare const useTrackPlayerShuffleModeEnabled: () => boolean;
export declare const useTrackPlayerRepeatMode: () => RepeatMode;
export declare const useTrackPlayerPlaybackParameters: () => PlaybackParameters;
export declare const useTrackPlayerPlaybackSpeed: () => number;
export declare const useTrackPlayerPlaybackPitch: () => number;
export {};
