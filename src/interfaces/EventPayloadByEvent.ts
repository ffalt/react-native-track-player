import { RepeatMode } from "../constants/RepeatMode";
import { Event } from "../constants/Event";
import { DownloadState } from "../constants/DownloadState";
import { State } from "../constants/State";
import { type PlaybackParameters } from "./PlaybackParameters";
import { type PlaybackMetadata } from "./PlaybackMetadata";
import { type Interval } from "./Interval";
import { type PlaySearch } from "./PlaySearch";

export type EventPayloadByEvent = {
  [Event.PlaybackState]: { state: State };
  [Event.PlaybackError]: { code?: string; message: string };
  [Event.PlaybackQueueEnded]: { track?: number | null; position: number };
  [Event.PlaybackTrackChanged]: { track?: number | null; nextTrack?: number | null; position: number };
  [Event.PlaybackParametersChanged]: PlaybackParameters;
  [Event.QueueChanged]: void;
  [Event.DownloadsChanged]: void;
  [Event.DownloadsPausedChanged]: { paused: boolean };
  [Event.DownloadChanged]: { id: string; state: DownloadState };
  [Event.DownloadProgressChanged]: { id: string; contentLength: number; bytesDownloaded: number; percentDownloaded: number };
  [Event.ShuffleModeChanged]: { enabled: boolean };
  [Event.RepeatModeChanged]: { mode: RepeatMode };
  [Event.Scrobble]: { trackIndex: number };
  [Event.PlaybackMetadataReceived]: PlaybackMetadata;
  [Event.RemotePlay]: void;
  [Event.RemotePlayId]: { id: string };
  [Event.RemotePlaySearch]: PlaySearch;
  [Event.RemotePause]: void;
  [Event.RemoteStop]: void;
  [Event.RemoteSkip]: { index: number };
  [Event.RemoteNext]: void;
  [Event.RemotePrevious]: void;
  [Event.RemoteJumpForward]: Interval;
  [Event.RemoteJumpBackward]: Interval;
  [Event.RemoteSeek]: { position: number };
  [Event.RemoteSetRating]: { rating: boolean | number, type: number };
  [Event.RemoteDuck]: { permanent?: boolean; paused: boolean };
  [Event.RemoteLike]: void;
  [Event.RemoteDislike]: void;
  [Event.RemoteBookmark]: void;
}

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type EventPayloadByEventWithType = {
  [K in keyof EventPayloadByEvent]: EventPayloadByEvent[K] extends never
    ? { type: K }
    : Simplify<EventPayloadByEvent[K] & { type: K }>;
};
