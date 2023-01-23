import { useEffect, useState, useRef } from "react";

import TrackPlayer from "./trackPlayer";
import { State, Event, Track, Download, RepeatMode, DownloadState, PlaybackParameters } from "./interfaces";

/** Get current playback state and subsequent updatates  */
export const useTrackPlayerPlaybackState = () => {
  const [state, setState] = useState(State.None);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, [TrackPlayer]);

  useEffect(() => {
    async function setPlayerState() {
      const playerState = await TrackPlayer.getState();

      // If the component has been unmounted, exit
      if (isUnmountedRef.current) return;

      setState(playerState);
    }

    // Set initial state
    setPlayerState();

    const sub = TrackPlayer.addEventListener(Event.PlaybackState, (data) => {
      setState(data.state);
    });

    return () => sub.remove();
  }, []);

  return state;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (payload: { type: Event; [key: string]: any }) => void;

/**
 * Attaches a handler to the given TrackPlayer events and performs cleanup on unmount
 * @param events - TrackPlayer events to subscribe to
 * @param handler - callback invoked when the event fires
 */
export const useTrackPlayerEvents = (events: Event[], handler: Handler) => {
  const savedHandler = useRef<Handler>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const subs = events.map((event) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TrackPlayer.addEventListener(event, (payload) => savedHandler.current!({ ...payload, type: event }))
    );

    return () => subs.forEach((sub) => sub.remove());
  }, [events]);
};
export const useTrackPlayerEvent = (event: Event, handler: Handler) => {
  const savedHandler = useRef<Handler>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const sub = TrackPlayer.addEventListener(event, (payload) => savedHandler.current!({ ...payload, type: event }));

    return () => sub.remove();
  }, [event]);
};

export interface ProgressState {
  position: number;
  duration: number;
  buffered: number;
}

/**
 * Poll for track progress for the given interval (in miliseconds)
 * @param interval - ms interval
 */
export function useTrackPlayerProgress(updateInterval?: number) {
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
    if (isUnmountedRef.current) return;

    // If there is no change in properties, exit
    if (
      position === stateRef.current.position &&
      duration === stateRef.current.duration &&
      buffered === stateRef.current.buffered
    )
      return;

    const state = { position, duration, buffered };
    stateRef.current = state;
    setState(state);
  };

  useEffect(() => {
    if (playerState === State.None) {
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

function noNull<T>(value: T | undefined | null): T | undefined {
  return value === null ? undefined : value;
}

export function useTrackPlayerCurrentTrackNr(): number | undefined {
  const [trackNr, setTrackNr] = useState<number | undefined>(undefined);
  const isUnmountedRef = useRef(true);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  useTrackPlayerEvent(Event.PlaybackTrackChanged, (event) => {
    const nextNr = noNull(event.nextTrack);
    if (trackNr !== nextNr) {
      setTrackNr(nextNr);
    }
  });

  useEffect(() => {
    TrackPlayer.getCurrentTrack().then((tnr) => {
      if (isUnmountedRef.current) return;
      setTrackNr(noNull(tnr));
    });
  }, [trackNr]);
  return trackNr;
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

  useEffect(() => {
    if (trackNr === undefined) {
      if (isUnmountedRef.current) return;
      setTrack(undefined);
    } else {
      TrackPlayer.getTrack(trackNr).then((t) => {
        if (isUnmountedRef.current) return;
        setTrack(noNull(t));
      });
    }
  }, [trackNr]);

  return track;
}

export function useTrackPlayerQueue(): Array<Track> | undefined {
  const [queue, setQueueState] = useState<Array<Track> | undefined>();

  useEffect(() => {
    let didCancel = false;
    const fetchQueue = async (): Promise<void> => {
      const fetched = await TrackPlayer.getQueue();
      if (!didCancel) {
        setQueueState(fetched);
      }
    };
    fetchQueue().catch(console.error);
    return (): void => {
      didCancel = true;
    };
  }, []);

  useTrackPlayerEvent(Event.QueueChanged, async () => {
    setQueueState(await TrackPlayer.getQueue());
  });

  return queue;
}

export function useTrackPlayerDownloads(): Array<Download> | undefined {
  const [downloads, setDownloads] = useState<Array<Download> | undefined>();

  useEffect(() => {
    let didCancel = false;
    const fetchDownloads = async (): Promise<void> => {
      const fetched = await TrackPlayer.getDownloads();
      if (!didCancel) {
        setDownloads(fetched);
      }
    };
    fetchDownloads().catch(console.error);
    return (): void => {
      didCancel = true;
    };
  }, []);

  useTrackPlayerEvent(Event.DownloadsChanged, async () => {
    setDownloads(await TrackPlayer.getDownloads());
  });

  return downloads;
}

export function useTrackPlayerDownloadsPaused(): boolean {
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    let didCancel = false;
    const fetchpaused = async (): Promise<void> => {
      const fetched = await TrackPlayer.getDownloadsPaused();
      if (!didCancel) {
        setPaused(fetched);
      }
    };
    fetchpaused().catch(console.error);
    return (): void => {
      didCancel = true;
    };
  }, []);

  useTrackPlayerEvent(Event.DownloadsPausedChanged, async (event) => {
    setPaused(event.paused);
  });

  return paused;
}

export function useTrackPlayerCurrentDownloads(): Array<Download> | undefined {
  const [downloads, setDownloads] = useState<Array<Download> | undefined>();

  useEffect(() => {
    let didCancel = false;
    const fetchDownloads = async (): Promise<void> => {
      const fetched = await TrackPlayer.getCurrentDownloads();
      if (!didCancel) {
        setDownloads(fetched);
      }
    };
    fetchDownloads().catch(console.error);
    return (): void => {
      didCancel = true;
    };
  }, []);

  useTrackPlayerEvent(Event.DownloadsChanged, async () => {
    setDownloads(await TrackPlayer.getCurrentDownloads());
  });

  return downloads;
}

export function useTrackPlayerDownload(id: string): Download | undefined {
  const [download, setDownload] = useState<Download | undefined>();

  useEffect(() => {
    let didCancel = false;
    const fetchDownloads = async (): Promise<void> => {
      const fetched = await TrackPlayer.getDownload(id);
      if (!didCancel) {
        setDownload(fetched);
      }
    };
    fetchDownloads().catch(console.error);
    return (): void => {
      didCancel = true;
    };
  }, []);

  useTrackPlayerEvent(Event.DownloadChanged, async () => {
    setDownload(await TrackPlayer.getDownload(id));
  });

  return download;
}

function useTrackPlayerWhenPlaybackStateChanges(callback: (state: State) => void): void {
  useTrackPlayerEvent(Event.PlaybackState, (event) => callback(event.state));

  useEffect(() => {
    let didCancel = false;

    async function fetchPlaybackState(): Promise<void> {
      const playbackState = await TrackPlayer.getState();
      if (!didCancel) {
        callback(playbackState);
      }
    }

    fetchPlaybackState().catch(console.error);

    return (): void => {
      didCancel = true;
    };
  }, [callback]);
}

// export function useTrackPlayerPlaybackState(): State | undefined {
//   const [playbackState, setPlaybackState] = useState<State | undefined>();
//   useWhenPlaybackStateChanges(setPlaybackState);
//   return playbackState;
// }

export const useTrackPlayerPlaybackStateIs = (...states: Array<State>): boolean => {
  const [is, setIs] = useState<boolean>(false);
  useTrackPlayerWhenPlaybackStateChanges((state) => {
    setIs(states.includes(state));
  });
  return is;
};

export const useTrackPlayerPlaybackStateIsPlaying = (): boolean => {
  const [is, setIs] = useState<boolean>(false);
  useTrackPlayerWhenPlaybackStateChanges((state) => {
    setIs(state === State.Playing);
  });
  return is;
};

export const useTrackPlayerProgressPercent = (interval = 1000): { progress: number; bufferProgress: number } => {
  const [percent, setPercent] = useState<{ progress: number; bufferProgress: number }>({
    progress: 0,
    bufferProgress: 0
  });
  const { position, buffered, duration } = useTrackPlayerProgress(interval);

  useTrackPlayerWhenPlaybackStateChanges((state) => {
    if (state === State.Stopped) {
      setPercent({ progress: 0, bufferProgress: 0 });
    }
  });

  useEffect(() => {
    const progress = duration ? position / duration : 0;
    const bufferProgress = duration ? buffered / duration : 0;
    setPercent({ progress, bufferProgress });
  }, [position, buffered, duration]);

  return percent;
};

export const useTrackPlayerProgressMS = (): { duration: number; position: number } => {
  const [now, setNow] = useState<{ duration: number; position: number }>({ duration: 0, position: 0 });
  const { duration, position } = useTrackPlayerProgress();

  useTrackPlayerWhenPlaybackStateChanges((state) => {
    if (state === State.Stopped) {
      setNow({ duration: 0, position: 0 });
    }
  });

  useEffect(() => {
    let isSubscribed = true;

    async function fetchData(): Promise<void> {
      const d = await TrackPlayer.getDuration();
      const p = await TrackPlayer.getPosition();
      if (isSubscribed) {
        setNow({ duration: d * 1000, position: p * 1000 });
      }
    }

    fetchData();
    return (): void => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    setNow({ duration: duration * 1000, position: position * 1000 });
  }, [duration, position]);

  return now;
};

export const useTrackPlayerShuffleModeEnabled = (): boolean => {
  const [is, setIs] = useState<boolean>(false);

  useTrackPlayerEvent(Event.ShuffleModeChanged, async (event) => {
    setIs(event.enabled);
  });

  useEffect(() => {
    let isSubscribed = true;
    TrackPlayer.getShuffleModeEnabled().then((value) => {
      if (isSubscribed) {
        setIs(value);
      }
    });
    return (): void => {
      isSubscribed = false;
    };
  }, []);

  return is;
};

export const useTrackPlayerRepeatMode = (): RepeatMode => {
  const [mode, setMode] = useState<RepeatMode>(RepeatMode.Off);

  useTrackPlayerEvent(Event.RepeatModeChanged, async (event) => {
    setMode(event.mode);
  });

  useEffect(() => {
    let isSubscribed = true;
    TrackPlayer.getRepeatMode().then((value) => {
      if (isSubscribed) {
        setMode(value);
      }
    });
    return (): void => {
      isSubscribed = false;
    };
  }, []);

  return mode;
};

export const useTrackPlayerPlaybackParameters = (): PlaybackParameters => {
  const [params, setParams] = useState<PlaybackParameters>({ speed: 1, pitch: 1 });

  useTrackPlayerEvent(Event.PlaybackParametersChanged, async (event) => {
    setParams({ speed: event.speed, pitch: event.pitch });
  });

  useEffect(() => {
    let isSubscribed = true;
    TrackPlayer.getPlaybackParameters().then((value) => {
      if (isSubscribed) {
        setParams({ speed: value.speed, pitch: value.pitch });
      }
    });
    return (): void => {
      isSubscribed = false;
    };
  }, []);

  return params;
};

export const useTrackPlayerPlaybackSpeed = (): number => {
  const [speed, setSpeed] = useState<number>(1);

  useTrackPlayerEvent(Event.PlaybackParametersChanged, async (event) => {
    setSpeed(event.speed);
  });

  useEffect(() => {
    let isSubscribed = true;
    TrackPlayer.getPlaybackSpeed().then((value) => {
      if (isSubscribed) {
        setSpeed(value);
      }
    });
    return (): void => {
      isSubscribed = false;
    };
  }, []);

  return speed;
};

export const useTrackPlayerPlaybackPitch = (): number => {
  const [pitch, setPitch] = useState<number>(1);

  useTrackPlayerEvent(Event.PlaybackParametersChanged, async (event) => {
    setPitch(event.pitch);
  });

  useEffect(() => {
    let isSubscribed = true;
    TrackPlayer.getPlaybackPitch().then((value) => {
      if (isSubscribed) {
        setPitch(value);
      }
    });
    return (): void => {
      isSubscribed = false;
    };
  }, []);

  return pitch;
};
