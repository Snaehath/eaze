import * as Haptics from 'expo-haptics';

/**
 * eaze Haptic Vocabulary
 *
 * light       -> Micro button taps, subtle ticks
 * medium      -> Confirmation actions, stage advancements
 * heavy       -> Grounding impact, hold milestones
 * success     -> Reset complete, ready state reached
 * transition  -> Mode shifts (Discharge -> Breathe)
 */

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'transition';

export const hapticPatterns = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
  transition: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
};
