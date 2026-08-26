import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export type BreathPhase = 'inhale' | 'exhale' | 'idle';

type UseBreathingOptions = {
  /** Inhale duration in ms. Default 4000. */
  inhaleDuration?: number;
  /** Exhale duration in ms. Default 6000. */
  exhaleDuration?: number;
  /** Total session duration in ms. Default 60000. */
  totalDuration?: number;
  /** Whether to use native driver (can't be true if size changes layout). Default true. */
  useNativeDriver?: boolean;
  /** Called when the session completes. */
  onComplete?: () => void;
  /** If true, skips scale animation (reduced motion). */
  reduceMotion?: boolean;
};

type UseBreathingReturn = {
  phase: BreathPhase;
  animatedValue: Animated.Value;
  timeRemaining: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
};

/**
 * Drives the breathing animation state machine.
 *
 * animatedValue goes 0 → 1 on inhale and 1 → 0 on exhale.
 * Callers interpolate this into scale or opacity.
 */
export function useBreathing({
  inhaleDuration = 4000,
  exhaleDuration = 6000,
  totalDuration = 60000,
  onComplete,
  reduceMotion = false,
}: UseBreathingOptions = {}): UseBreathingReturn {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(Math.floor(totalDuration / 1000));

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const stopAll = useCallback(() => {
    animationRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    isRunningRef.current = false;
    setIsRunning(false);
    setPhase('idle');
  }, []);

  const runCycle = useCallback(() => {
    if (!isRunningRef.current) return;

    const cycleDuration = inhaleDuration + exhaleDuration;
    const elapsed = Date.now() - startTimeRef.current;

    if (elapsed >= totalDuration) {
      stopAll();
      onComplete?.();
      return;
    }

    // Inhale
    setPhase('inhale');
    const inhaleAnim = reduceMotion
      ? Animated.timing(animatedValue, {
          toValue: 1,
          duration: inhaleDuration,
          useNativeDriver: true,
        })
      : Animated.timing(animatedValue, {
          toValue: 1,
          duration: inhaleDuration,
          useNativeDriver: true,
        });

    const exhaleAnim = Animated.timing(animatedValue, {
      toValue: 0,
      duration: exhaleDuration,
      useNativeDriver: true,
    });

    animationRef.current = Animated.sequence([
      inhaleAnim,
      Animated.delay(0),
    ]);

    animationRef.current.start(({ finished }) => {
      if (!finished || !isRunningRef.current) return;
      setPhase('exhale');
      animationRef.current = exhaleAnim;
      exhaleAnim.start(({ finished: f2 }) => {
        if (!f2 || !isRunningRef.current) return;
        // Recurse for next cycle
        runCycle();
      });
    });

    void cycleDuration; // suppress unused warning
  }, [inhaleDuration, exhaleDuration, totalDuration, onComplete, stopAll, animatedValue, reduceMotion]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    startTimeRef.current = Date.now();
    setIsRunning(true);
    setTimeRemaining(Math.floor(totalDuration / 1000));

    // Countdown timer
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, Math.floor((totalDuration - elapsed) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 500);

    runCycle();
  }, [totalDuration, runCycle]);

  const stop = useCallback(() => {
    stopAll();
  }, [stopAll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      animationRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { phase, animatedValue, timeRemaining, isRunning, start, stop };
}
