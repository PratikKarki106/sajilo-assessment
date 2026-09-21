import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 12000,
  headers: {
    Accept: 'application/json',
  },
});

export function getApiErrorMessage(error) {
  if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
    return null;
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }

  if (error?.response) {
    const status = error.response.status;
    if (status === 404) return 'The requested resource was not found.';
    if (status >= 500) return 'The server is unavailable. Please try again later.';
    return error.response.data?.message || 'Something went wrong. Please try again.';
  }

  if (error?.request) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  return error?.message || 'An unexpected error occurred.';
}
