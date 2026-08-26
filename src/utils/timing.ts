import { useEffect, useRef } from 'react';

/**
 * Returns a safe setTimeout that is automatically cleared when the
 * component unmounts. Prevents the classic "can't update state on unmounted
 * component" crash in the middle of a timed sequence.
 */
export function useSafeTimeout() {
  const ids = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      ids.current.forEach(clearTimeout);
      ids.current = [];
    };
  }, []);

  const set = (fn: () => void, ms: number): ReturnType<typeof setTimeout> => {
    const id = setTimeout(fn, ms);
    ids.current.push(id);
    return id;
  };

  const clear = (id: ReturnType<typeof setTimeout>) => {
    clearTimeout(id);
    ids.current = ids.current.filter((i) => i !== id);
  };

  return { set, clear };
}

/**
 * Returns a safe setInterval that is automatically cleared when the
 * component unmounts.
 */
export function useSafeInterval() {
  const ids = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    return () => {
      ids.current.forEach(clearInterval);
      ids.current = [];
    };
  }, []);

  const set = (fn: () => void, ms: number): ReturnType<typeof setInterval> => {
    const id = setInterval(fn, ms);
    ids.current.push(id);
    return id;
  };

  const clear = (id: ReturnType<typeof setInterval>) => {
    clearInterval(id);
    ids.current = ids.current.filter((i) => i !== id);
  };

  return { set, clear };
}
