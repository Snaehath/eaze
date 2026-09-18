import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

/**
 * A thin haptics wrapper with graceful fallback.
 * All calls are fire-and-forget; errors are silently ignored
 * so the UX is never blocked on devices without haptic hardware.
 */
export function useHaptics() {
  const light = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const medium = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, []);

  const heavy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }, []);

  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const warning = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  }, []);

  /**
   * Countdown haptic — escalating intensity per tick.
   * tick: 5 = lightest, 1 = heaviest
   */
  const countdown = useCallback((tick: number) => {
    if (tick >= 4) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }
  }, []);

  const transition = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, []);

  return { light, medium, heavy, success, warning, transition, countdown };
}

