import { useCallback, useEffect, useState } from 'react';
import { fetchUserById } from '../api/users.api';
import { getApiErrorMessage } from '../api/client';

export function useUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchUserById(id, { signal: controller.signal });
        if (cancelled) return;
        setUser(data);
      } catch (err) {
        const message = getApiErrorMessage(err);
        if (cancelled || !message) return;
        setUser(null);
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id, reloadKey]);

  const retry = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  if (!id) {
    return {
      user: null,
      loading: false,
      error: 'A valid user id is required.',
      retry,
    };
  }

  return { user, loading, error, retry };
}
