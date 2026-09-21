import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../api/products.api';
import { getApiErrorMessage } from '../api/client';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({ signal: controller.signal });
        if (!cancelled) setProducts(data);
      } catch (requestError) {
        const message = getApiErrorMessage(requestError);
        if (!cancelled && message) {
          setProducts([]);
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
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((value) => value + 1), []);
  return { products, loading, error, retry };
}
