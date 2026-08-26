import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SESSIONS_COMPLETED: '@eaze/sessions_completed',
  LAST_SESSION_DATE: '@eaze/last_session_date',
} as const;

export async function getSessionsCompleted(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEYS.SESSIONS_COMPLETED);
    return val != null ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function incrementSessionsCompleted(): Promise<number> {
  try {
    const current = await getSessionsCompleted();
    const next = current + 1;
    await AsyncStorage.setItem(KEYS.SESSIONS_COMPLETED, String(next));
    return next;
  } catch {
    return 0;
  }
}

export async function getLastSessionDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_SESSION_DATE);
  } catch {
    return null;
  }
}

export async function setLastSessionDate(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_SESSION_DATE, new Date().toISOString());
  } catch {
    // silently fail
  }
}

export function formatLastSessionDate(isoDate: string | null): string {
  if (!isoDate) return 'Never';
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
