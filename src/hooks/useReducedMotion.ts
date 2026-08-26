import { useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Returns true if the user has enabled Reduce Motion in system accessibility settings.
 * When true, replace complex animations with simple opacity fades.
 */
export function useReducedMotion(): boolean {
  const ref = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((val) => {
      ref.current = val;
    });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (val) => {
      ref.current = val;
    });

    return () => sub.remove();
  }, []);

  return ref.current;
}
