import { useCallback, useEffect, useState } from 'react';
import { fetchProductById } from '../api/products.api';
import { getApiErrorMessage } from '../api/client';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return undefined;
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id, { signal: controller.signal });
        if (!cancelled) setProduct(data);
      } catch (requestError) {
        const message = getApiErrorMessage(requestError);
        if (!cancelled && message) {
          setProduct(null);
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id, reloadKey]);

  const retry = useCallback(() => setReloadKey((value) => value + 1), []);
  return { product, loading, error, retry };
}
