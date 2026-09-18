import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Returns true if the user has enabled Reduce Motion in system accessibility settings.
 * When true, replace complex animations with simple opacity fades.
 */
export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((val) => {
      if (isMounted) {
        setReduceMotion(val);
      }
    });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (val) => {
      if (isMounted) {
        setReduceMotion(val);
      }
    });

    return () => {
      isMounted = false;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}

