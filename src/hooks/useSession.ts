import { useCallback } from 'react';
import {
  incrementSessionsCompleted,
  setLastSessionDate,
} from '../utils/storage';

/**
 * useSession — manages persisting a completed session.
 * Call recordSession() when the user completes a reset.
 */
export function useSession() {
  const recordSession = useCallback(async () => {
    await incrementSessionsCompleted();
    await setLastSessionDate();
  }, []);

  return { recordSession };
}
