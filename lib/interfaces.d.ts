export declare enum IOSCategory {
    Playback = "playback",
    PlayAndRecord = "playAndRecord",
    MultiRoute = "multiRoute",
    Ambient = "ambient",
    SoloAmbient = "soloAmbient",
    Record = "record"
}
export declare enum IOSCategoryMode {
    Default = "default",
    GameChat = "gameChat",
    Measurement = "measurement",
    MoviePlayback = "moviePlayback",
    SpokenAudio = "spokenAudio",
    VideoChat = "videoChat",
    VideoRecording = "videoRecording",
    VoiceChat = "voiceChat",
    VoicePrompt = "voicePrompt"
}
export declare enum IOSCategoryOptions {
    MixWithOthers = "mixWithOthers",
    DuckOthers = "duckOthers",
    InterruptSpokenAudioAndMixWithOthers = "interruptSpokenAudioAndMixWithOthers",
    AllowBluetooth = "allowBluetooth",
    AllowBluetoothA2DP = "allowBluetoothA2DP",
    AllowAirPlay = "allowAirPlay",
    DefaultToSpeaker = "defaultToSpeaker"
}
export interface PlayerOptions {
    /**
     * Minimum time in seconds that needs to be buffered.
     */
    minBuffer?: number;
    /**
     * Maximum time in seconds that needs to be buffered
     */
    maxBuffer?: number;
    /**
     * Time in seconds that should be kept in the buffer behind the current playhead time.
     */
    backBuffer?: number;
    /**
     * Minimum time in seconds that needs to be buffered to start playing.
     */
    playBuffer?: number;
    /**
     * Maximum cache size in kilobytes.
     */
    maxCacheSize?: number;
    /**
     * [AVAudioSession.Category](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616615-category) for iOS.
     * Sets on `play()`.
     */
    iosCategory?: IOSCategory;
    /**
     * [AVAudioSession.Mode](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616508-mode) for iOS.
     * Sets on `play()`.
     */
    iosCategoryMode?: IOSCategoryMode;
    /**
     * [AVAudioSession.CategoryOptions](https://developer.apple.com/documentation/avfoundation/avaudiosession/1616503-categoryoptions) for iOS.
     * Sets on `play()`.
     */
    iosCategoryOptions?: IOSCategoryOptions[];
    /**
     * Indicates whether the player should automatically delay playback in order to minimize stalling.
     * Defaults to `false`.
     */
    waitForBuffer?: boolean;
    /**
     * Indicates whether the player should automatically update now playing metadata data in control center / notification.
     * Defaults to `true`.
     */
    autoUpdateMetadata?: boolean;
}
export declare enum RatingType {
    Heart,
    ThumbsUpDown,
    ThreeStars,
    FourStars,
    FiveStars,
    Percentage
}
export interface FeedbackOptions {
    /** Marks wether the option should be marked as active or "done" */
    isActive: boolean;
    /** The title to give the action (relevant for iOS) */
    title: string;
}
export declare enum Capability {
    Play,
    PlayFromId,
    PlayFromSearch,
    Pause,
    Stop,
    SeekTo,
    Skip,
    SkipToNext,
    SkipToPrevious,
    JumpForward,
    JumpBackward,
    SetRating,
    Like,
    Dislike,
    Bookmark
}
export type ResourceObject = number;
export interface MetadataOptions {
    ratingType?: RatingType;
    forwardJumpInterval?: number;
    backwardJumpInterval?: number;
    scrobble?: boolean;
    likeOptions?: FeedbackOptions;
    dislikeOptions?: FeedbackOptions;
    bookmarkOptions?: FeedbackOptions;
    capabilities?: Capability[];
    stopWithApp?: boolean;
    alwaysPauseOnInterruption?: boolean;
    notificationCapabilities?: Capability[];
    compactCapabilities?: Capability[];
    icon?: ResourceObject;
    playIcon?: ResourceObject;
    pauseIcon?: ResourceObject;
    stopIcon?: ResourceObject;
    previousIcon?: ResourceObject;
    nextIcon?: ResourceObject;
    rewindIcon?: ResourceObject;
    forwardIcon?: ResourceObject;
    color?: number;
}
export declare enum Event {
    PlaybackState = "playback-state",
    PlaybackError = "playback-error",
    PlaybackQueueEnded = "playback-queue-ended",
    PlaybackTrackChanged = "playback-track-changed",
    PlaybackParametersChanged = "playback-parameters-changed",
    QueueChanged = "queue-changed",
    DownloadsChanged = "downloads-changed",
    DownloadsPausedChanged = "downloads-paused-changed",
    DownloadChanged = "download-changed",
    DownloadProgressChanged = "download-progress-changed",
    ShuffleModeChanged = "shuffle-changed",
    RepeatModeChanged = "repeat-changed",
    Scrobble = "scrobble",
    PlaybackMetadataReceived = "playback-metadata-received",
    RemotePlay = "remote-play",
    RemotePlayId = "remote-play-id",
    RemotePlaySearch = "remote-play-search",
    RemotePause = "remote-pause",
    RemoteStop = "remote-stop",
    RemoteSkip = "remote-skip",
    RemoteNext = "remote-next",
    RemotePrevious = "remote-previous",
    RemoteJumpForward = "remote-jump-forward",
    RemoteJumpBackward = "remote-jump-backward",
    RemoteSeek = "remote-seek",
    RemoteSetRating = "remote-set-rating",
    RemoteDuck = "remote-duck",
    RemoteLike = "remote-like",
    RemoteDislike = "remote-dislike",
    RemoteBookmark = "remote-bookmark"
}
export interface EventMap {
    [Event.PlaybackState]: {
        state: State;
    };
    [Event.PlaybackError]: {
        code?: string;
        message: string;
    };
    [Event.PlaybackQueueEnded]: {
        track?: number | null;
        position: number;
    };
    [Event.PlaybackTrackChanged]: {
        track?: number | null;
        nextTrack?: number | null;
        position: number;
    };
    [Event.PlaybackParametersChanged]: PlaybackParameters;
    [Event.QueueChanged]: void;
    [Event.DownloadsChanged]: void;
    [Event.DownloadsPausedChanged]: {
        paused: boolean;
    };
    [Event.DownloadChanged]: {
        id: string;
        state: DownloadState;
    };
    [Event.DownloadProgressChanged]: {
        id: string;
        contentLength: number;
        bytesDownloaded: number;
        percentDownloaded: number;
    };
    [Event.ShuffleModeChanged]: {
        enabled: boolean;
    };
    [Event.RepeatModeChanged]: {
        mode: RepeatMode;
    };
    [Event.Scrobble]: {
        trackIndex: number;
    };
    [Event.PlaybackMetadataReceived]: {
        source: string;
        url: string;
        date: string;
        title: string;
        artist: string;
        album: string;
        genre: string;
    };
    [Event.RemotePlay]: void;
    [Event.RemotePlayId]: {
        id: string;
    };
    [Event.RemotePlaySearch]: {
        query: string;
        focus?: string;
        title?: string;
        artist?: string;
        album?: string;
        genre?: string;
        playlist?: string;
    };
    [Event.RemotePause]: void;
    [Event.RemoteStop]: void;
    [Event.RemoteSkip]: {
        index: number;
    };
    [Event.RemoteNext]: void;
    [Event.RemotePrevious]: void;
    [Event.RemoteJumpForward]: {
        interval: number;
    };
    [Event.RemoteJumpBackward]: {
        interval: number;
    };
    [Event.RemoteSeek]: {
        position: number;
    };
    [Event.RemoteSetRating]: {
        rating: boolean | number;
        type: number;
    };
    [Event.RemoteDuck]: {
        permanent?: boolean;
        paused: boolean;
    };
    [Event.RemoteLike]: void;
    [Event.RemoteDislike]: void;
    [Event.RemoteBookmark]: void;
}
export declare enum TrackType {
    Default = "default",
    Dash = "dash",
    HLS = "hls",
    SmoothStreaming = "smoothstreaming"
}
export declare enum RepeatMode {
    Off,
    Track,
    Queue
}
export declare enum PitchAlgorithm {
    Linear,
    Music,
    Voice
}
export declare enum State {
    None,
    Ready,
    Playing,
    Paused,
    Stopped,
    Buffering,
    Connecting
}
export declare enum DownloadState {
    Queued,
    Stopped,
    Downloading,
    Completed,
    Failed,
    Removing,
    Restarting
}
export interface TrackMetadataBase {
    title?: string;
    album?: string;
    artist?: string;
    duration?: number;
    artwork?: string | ResourceObject;
    description?: string;
    genre?: string;
    date?: string;
    rating?: number | boolean;
    isLiveStream?: boolean;
}
export interface NowPlayingMetadata extends TrackMetadataBase {
    elapsedTime?: number;
}
export interface DownloadRequest {
    url: string;
    id: string;
}
export interface Download {
    id: string;
    url: string;
    state: number;
    contentLength: number;
    bytesDownloaded: number;
    percentDownloaded: number;
    failureReason: number;
    stopReason: number;
    startTimeMs: number;
    updateTimeMs: number;
}
export interface PlaybackParameters {
    speed: number;
    pitch: number;
}
export interface Track extends TrackMetadataBase {
    url: string | ResourceObject;
    type?: TrackType;
    userAgent?: string;
    contentType?: string;
    pitchAlgorithm?: PitchAlgorithm;
    headers?: {
        [key: string]: any;
    };
    [key: string]: any;
}
