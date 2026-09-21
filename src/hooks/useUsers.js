import { useCallback, useEffect, useState } from 'react';
import { fetchUsers } from '../api/users.api';
import { getApiErrorMessage } from '../api/client';
import { USERS_PAGE_SIZE } from '../constants/users';

export function useUsers({ q = '', gender = '', role = '', page = 1 } = {}) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const skip = (page - 1) * USERS_PAGE_SIZE;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchUsers({
          limit: USERS_PAGE_SIZE,
          skip,
          q,
          gender,
          role,
          signal: controller.signal,
        });
        if (cancelled) return;
        setUsers(data.users);
        setTotal(data.total);
      } catch (err) {
        const message = getApiErrorMessage(err);
        if (cancelled || !message) return;
        setUsers([]);
        setTotal(0);
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [q, gender, role, skip, reloadKey]);

  const retry = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE));

  return {
    users,
    total,
    loading,
    error,
    retry,
    pageSize: USERS_PAGE_SIZE,
    totalPages,
  };
}
