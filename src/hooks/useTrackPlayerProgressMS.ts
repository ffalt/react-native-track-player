import { useEffect, useRef, useState } from "react";
import { useTrackPlayerProgress } from "./useTrackPlayerProgress";

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
