"use strict";

import { useEffect, useRef, useState } from "react";
import { State } from "../constants/State.js";
import { useTrackPlayerPlaybackState } from "./useTrackPlayerPlaybackState.js";
import { getBufferedPosition, getDuration, getPosition } from "../trackPlayer.js";
export function useTrackPlayerProgress(updateIntervalMs) {
  const [state, setState] = useState({
    position: 0,
    duration: 0,
    buffered: 0
  });
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
    const [position, duration, buffered] = await Promise.all([getPosition(), getDuration(), getBufferedPosition()]);

    // If the component has been unmounted, exit
    if (isUnmountedRef.current) {
      return;
    }

    // If there is no change in properties, exit
    if (position === stateRef.current.position && duration === stateRef.current.duration && buffered === stateRef.current.buffered) {
      return;
    }
    const newState = {
      position,
      duration,
      buffered
    };
    stateRef.current = newState;
    setState(newState);
  };
  useEffect(() => {
    if (isUnmountedRef.current) {
      return;
    }
    if ([State.None, State.Stopped].includes(playerState)) {
      setState({
        position: 0,
        duration: 0,
        buffered: 0
      });
      return;
    }

    // Set initial state
    getProgress().catch(console.error);

    // Create interval to update state periodically
    const poll = setInterval(getProgress, updateIntervalMs || 1000);
    return () => clearInterval(poll);
  }, [playerState, updateIntervalMs]);
  return state;
}
//# sourceMappingURL=useTrackPlayerProgress.js.map