import { useCallback, useEffect, useRef, useState } from "react";

import TrackPlayer from "./trackPlayer";
import { Download, Event, EventMap, PlaybackParameters, RepeatMode, State, Track } from "./interfaces";

function noNull<T>(value: T | undefined | null): T | undefined {
  return value === null ? undefined : value;
}

interface Payload {
  type: Event;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type Handler<E extends keyof EventMap> = (payload: EventMap[E]) => void;

/**
 * Attaches a handler to the given TrackPlayer event and performs cleanup on unmount
 * @param event - TrackPlayer event to subscribe to
 * @param handler - callback invoked when the event fires
 */
export function useTrackPlayerEvent<E extends keyof EventMap>(event: E, handler: (payload: EventMap[E]) => void) {
  const savedHandler = useRef<Handler<E>>(undefined);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const sub = TrackPlayer.addEventListener(event, (payload) => {
      if (savedHandler?.current) {
        savedHandler.current({ ...payload, type: event });
      }
    });
    return () => sub.remove();
  }, [event]);
}

/**
 * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTrackPlayerEvents(events: Event[], handler: Handler<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedHandler = useRef<Handler<any>>(undefined);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const subs = events.map((event) => {
      return TrackPlayer.addEventListener(event, (payload) => {
        if (savedHandler?.current) {
          savedHandler.current({ ...payload, type: event });
        }
      });
    });

    return () => subs.forEach((sub) => sub.remove());
  }, [events]);
}


// , EventMap[Event.PlaybackState]
/**
 * Attaches a handler to the given TrackPlayer event, stores data, updates data (if not equal) and performs cleanup on unmount
 * @param event - TrackPlayer event to subscribe to
 * @param handler - callback invoked when the event fires
 * @param defaultValue - the default value of the data
 * @param compareFunc - optional callback to compare for equal (=== default)
 * @param filter - optional callback to check if should be updated
 */
export function useTrackPlayerDataEvent<T, E extends keyof EventMap>(event: E, handler: (payload?: EventMap[E]) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean, filter?: (payload?: EventMap[E]) => boolean): T {
  const [data, setData] = useState<T>(defaultValue);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = useCallback((payload?: EventMap[E]) => {
    if (filter) {
      if (!filter(payload)) {
        return;
      }
    }
    handler(payload as EventMap[E])
      .then(value => {
        if (isUnmountedRef.current) {
          return;
        }
        if (compareFunc) {
          if (compareFunc(data, value)) {
            return;
          }
        } else {
          if (data === value) {
            return;
          }
        }
        setData(value);
      })
      .catch(console.error);
  }, [compareFunc, data, filter, handler]);

  useEffect(() => refresh(), []);
  useTrackPlayerEvent<E>(event, refresh);

  return data;
}

/**
 * Attaches a handler to the given TrackPlayer events, stores data, updates data (if not equal) and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 * @param defaultValue - the default value of the data
 * @param compareFunc - optional callback to compare for equal (=== default)
 */
export function useTrackPlayerDataEvents<T, S = void>(events: Array<Event>, handler: (payload?: S) => Promise<T>, defaultValue: T, compareFunc?: (prev: T, next: T) => boolean): T {
  const [data, setData] = useState<T>(defaultValue);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = useCallback((payload?: Payload) => {
    handler(payload as S)
      .then(value => {
        if (isUnmountedRef.current) {
          return;
        }
        if (compareFunc) {
          if (compareFunc(data, value)) {
            return;
          }
        } else {
          if (data === value) {
            return;
          }
        }
        setData(value);
      })
      .catch(console.error);
  }, [compareFunc, data, handler]);

  useEffect(() => refresh(), []);
  useTrackPlayerEvents(events, refresh);

  return data;
}

/** Get current playback state and subsequent updates  */
export function useTrackPlayerPlaybackState(): State {
  return useTrackPlayerDataEvent<State, Event.PlaybackState>(
    Event.PlaybackState,
    async (payload) => payload ? payload.state : TrackPlayer.getState(),
    State.None
  );
}

export interface ProgressState {
  position: number;
  duration: number;
  buffered: number;
}

/**
 * Poll for track progress for the given interval (in milliseconds)
 * @param updateInterval - ms interval
 */
export function useTrackPlayerProgress(updateInterval?: number): ProgressState {
  const [state, setState] = useState<ProgressState>({ position: 0, duration: 0, buffered: 0 });
  const playerState = useTrackPlayerPlaybackState();
  const stateRef = useRef(state);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const getProgress = async () => {
    const [position, duration, buffered] = await Promise.all([
      TrackPlayer.getPosition(),
      TrackPlayer.getDuration(),
      TrackPlayer.getBufferedPosition()
    ]);

    // If the component has been unmounted, exit
    if (isUnmountedRef.current) {
      return;
    }

    // If there is no change in properties, exit
    if (
      position === stateRef.current.position &&
      duration === stateRef.current.duration &&
      buffered === stateRef.current.buffered
    ) {
      return;
    }

    const newState = { position, duration, buffered };
    stateRef.current = newState;
    setState(newState);
  };

  useEffect(() => {
    if (isUnmountedRef.current) {
      return;
    }

    if ([State.None, State.Stopped].includes(playerState)) {
      setState({ position: 0, duration: 0, buffered: 0 });
      return;
    }

    // Set initial state
    getProgress().catch(console.error);

    // Create interval to update state periodically
    const poll = setInterval(getProgress, updateInterval || 1000);
    return () => clearInterval(poll);
  }, [playerState, updateInterval]);

  return state;
}

export function useTrackPlayerCurrentTrackNr(): number | undefined {
  return useTrackPlayerDataEvent<number | undefined, Event.PlaybackTrackChanged>(
    Event.PlaybackTrackChanged,
    async (payload) => noNull(payload ? payload?.nextTrack : await TrackPlayer.getCurrentTrack()),
    undefined,
    () => false // always update, even if trackNr did not change (the track itself may have changed)
  );
}

export function useTrackPlayerCurrentTrack(): Track | undefined {
  const trackNr = useTrackPlayerCurrentTrackNr();
  const [track, setTrack] = useState<Track | undefined>(undefined);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = useCallback(() => {
    if (trackNr === undefined) {
      if (isUnmountedRef.current) {
        return;
      }
      setTrack(undefined);
      return;
    }
    if (isUnmountedRef.current) {
      return;
    }
    TrackPlayer.getTrack(trackNr)
      .then(value => {
        if (isUnmountedRef.current) {
          return;
        }
        setTrack(noNull(value));
      })
      .catch(console.error);
  }, [trackNr]);

  useEffect(() => {
    refresh();
  }, [trackNr]);

  useEffect(() => {
    refresh();
  }, []);

  return track;
}

export function useTrackPlayerQueue(): Array<Track> | undefined {
  const [queue, setQueueState] = useState<Array<Track> | undefined>();
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  const refresh = () => {
    TrackPlayer.getQueue()
      .then(value => {
        if (isUnmountedRef.current) {
          return;
        }
        setQueueState(value);
      })
      .catch(console.error);
  };

  useEffect(() => refresh(), []);
  useTrackPlayerEvent(Event.QueueChanged, refresh);

  return queue;
}

export function useTrackPlayerDownloads(): Array<Download> | undefined {
  return useTrackPlayerDataEvent<Array<Download> | undefined, Event.DownloadsChanged>(
    Event.DownloadsChanged,
    async () => TrackPlayer.getDownloads(),
    undefined
  );
}

export function useTrackPlayerDownloadsPaused(): boolean {
  return useTrackPlayerDataEvent<boolean, Event.DownloadsPausedChanged>(
    Event.DownloadsPausedChanged,
    async (payload) => payload ? payload.paused : TrackPlayer.getDownloadsPaused(),
    false
  );
}

export function useTrackPlayerCurrentDownloads(): Array<Download> | undefined {
  return useTrackPlayerDataEvent<Array<Download> | undefined, Event.DownloadsChanged>(
    Event.DownloadsChanged,
    async () => TrackPlayer.getCurrentDownloads(),
    undefined
  );
}

export function useTrackPlayerDownload(id: string): Download | undefined {
  return useTrackPlayerDataEvent<Download | undefined, Event.DownloadChanged>(
    Event.DownloadChanged,
    async () => TrackPlayer.getDownload(id),
    undefined,
    () => false, // always update
    (payload) => payload?.id === id
  );
}

export function useTrackPlayerPlaybackStateIs(...states: Array<State>): boolean {
  const state = useTrackPlayerPlaybackState();
  return states.includes(state);
}

export function useTrackPlayerPlaybackStateIsPlaying(): boolean {
  const state = useTrackPlayerPlaybackState();
  return state === State.Playing;
}

export function useTrackPlayerProgressPercent(interval = 1000): { progress: number; bufferProgress: number } {
  const [percent, setPercent] = useState<{ progress: number; bufferProgress: number }>({
    progress: 0,
    bufferProgress: 0
  });
  const progress = useTrackPlayerProgress(interval);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (isUnmountedRef.current) {
      return;
    }
    const { position, buffered, duration } = progress;
    setPercent({
      progress: duration ? position / duration : 0,
      bufferProgress: duration ? buffered / duration : 0
    });
  }, [progress]);

  return percent;
}

export function useTrackPlayerProgressMS(interval = 1000): { duration: number; position: number } {
  const [ms, setMs] = useState<{ duration: number; position: number }>({
    duration: 0,
    position: 0
  });
  const progress = useTrackPlayerProgress(interval);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (isUnmountedRef.current) {
      return;
    }
    const { duration, position } = progress;
    setMs({
      duration: duration * 1000,
      position: position * 1000
    });
  }, [progress]);

  return ms;
}

export function useTrackPlayerShuffleModeEnabled(): boolean {
  return useTrackPlayerDataEvent<boolean, Event.ShuffleModeChanged>(
    Event.ShuffleModeChanged,
    async (payload) => payload ? payload.enabled : TrackPlayer.getShuffleModeEnabled(),
    false
  );
}

export function useTrackPlayerRepeatMode(): RepeatMode {
  return useTrackPlayerDataEvent<RepeatMode, Event.RepeatModeChanged>(
    Event.RepeatModeChanged,
    async (payload) => payload ? payload.mode : TrackPlayer.getRepeatMode(),
    RepeatMode.Off
  );
}

export function useTrackPlayerPlaybackParameters(): PlaybackParameters {
  return useTrackPlayerDataEvent<PlaybackParameters, Event.PlaybackParametersChanged>(
    Event.PlaybackParametersChanged,
    async (payload) => payload ? payload : TrackPlayer.getPlaybackParameters(),
    { speed: 1, pitch: 1 }
  );
}

export function useTrackPlayerPlaybackSpeed(): number {
  const params = useTrackPlayerPlaybackParameters();
  return params.speed;
}

export function useTrackPlayerPlaybackPitch(): number {
  const params = useTrackPlayerPlaybackParameters();
  return params.pitch;
}

export function useTrackPlayerHasNext(): boolean {
  return useTrackPlayerDataEvents<boolean>(
    [Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged],
    async () => TrackPlayer.hasNext(),
    false
  );
}

export function useTrackPlayerHasPrevious(): boolean {
  return useTrackPlayerDataEvents<boolean>(
    [Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged],
    async () => TrackPlayer.hasPrevious(),
    false
  );
}

export function useTrackPlayerHasSiblings(): { hasNext: boolean, hasPrevious: boolean } {
  return useTrackPlayerDataEvents<{ hasNext: boolean, hasPrevious: boolean }>(
    [Event.PlaybackTrackChanged, Event.ShuffleModeChanged, Event.QueueChanged],
    async () => {
      return {
        hasNext: await TrackPlayer.hasNext(),
        hasPrevious: await TrackPlayer.hasPrevious()
      };
    },
    { hasNext: false, hasPrevious: false },
    (prev, next) => {
      return prev.hasNext === next.hasNext && prev.hasPrevious === next.hasPrevious;
    }
  );
}
