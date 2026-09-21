import { apiClient } from './client';

function paginateLocal(users, limit, skip) {
  return {
    users: users.slice(skip, skip + limit),
    total: users.length,
  };
}

export async function fetchUsers({
  limit = 12,
  skip = 0,
  q = '',
  gender = '',
  role = '',
  signal,
} = {}) {
  const query = q.trim();
  const needsClientFilter = Boolean((query && (gender || role)) || (gender && role));

  if (needsClientFilter) {
    const params = query
      ? { q: query, limit: 0 }
      : { key: gender ? 'gender' : 'role', value: gender || role, limit: 0 };
    const url = query ? '/users/search' : '/users/filter';
    const { data } = await apiClient.get(url, { params, signal });
    let users = data.users ?? [];
    if (gender) users = users.filter((user) => user.gender === gender);
    if (role) users = users.filter((user) => user.role === role);
    return paginateLocal(users, limit, skip);
  }

  if (query) {
    const { data } = await apiClient.get('/users/search', {
      params: { q: query, limit, skip },
      signal,
    });
    return { users: data.users ?? [], total: data.total ?? 0 };
  }

  if (gender || role) {
    const key = gender ? 'gender' : 'role';
    const value = gender || role;
    const { data } = await apiClient.get('/users/filter', {
      params: { key, value, limit, skip },
      signal,
    });
    return { users: data.users ?? [], total: data.total ?? 0 };
  }

  const { data } = await apiClient.get('/users', {
    params: { limit, skip },
    signal,
  });
  return { users: data.users ?? [], total: data.total ?? 0 };
}

export async function fetchUserById(id, { signal } = {}) {
  const { data } = await apiClient.get(`/users/${id}`, { signal });
  return data;
}

export async function createUser(user, { signal } = {}) {
  const { data } = await apiClient.post('/users/add', user, { signal });
  return data;
}

export async function updateUser(id, user, { signal } = {}) {
  const { data } = await apiClient.put(`/users/${id}`, user, { signal });
  return data;
}

export async function deleteUser(id, { signal } = {}) {
  const { data } = await apiClient.delete(`/users/${id}`, { signal });
  return data;
}
