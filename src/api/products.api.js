import { apiClient } from './client';

export async function fetchProducts({ signal } = {}) {
  const { data } = await apiClient.get('/products', {
    params: { limit: 0 },
    signal,
  });
  return data.products ?? [];
}

export async function fetchProductById(id, { signal } = {}) {
  const { data } = await apiClient.get(`/products/${id}`, { signal });
  return data;
}

export async function fetchProductCategories({ signal } = {}) {
  const { data } = await apiClient.get('/products/categories', { signal });
  return data;
}
