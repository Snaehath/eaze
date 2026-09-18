/**
 * eaze Motion Vocabulary
 *
 * Rules:
 * - Animation must communicate state, not decorate the screen.
 * - Prefer animating transform and opacity for 60fps UI performance.
 * - Provide immediate zero-duration or opacity fallbacks when reduced-motion is enabled.
 */

export const motionDurations = {
  instant: 0,
  micro: 100,
  quick: 180,
  normal: 260,
  gentle: 400,
  deliberate: 600,
  breatheInhale: 4000,
  breatheExhale: 6000,
} as const;

export const motionSprings = {
  /** Subtle compression on button press */
  press: {
    speed: 45,
    bounciness: 4,
    scaleDown: 0.97,
  },
  /** Snappy release */
  release: {
    speed: 30,
    bounciness: 6,
    scaleUp: 1,
  },
  /** Screen entry or card arrival */
  appear: {
    speed: 16,
    bounciness: 3,
  },
  /** Settling after kinetic inertia */
  settle: {
    speed: 12,
    bounciness: 2,
  },
} as const;

export const motion = {
  durations: motionDurations,
  springs: motionSprings,
} as const;
