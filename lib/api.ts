import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => { accessToken = token; };
export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const url = original?.url ?? '';

    // Never attempt token refresh for auth endpoints — avoids infinite loops
    const isAuthEndpoint = url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/logout');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (original.headers) original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }).catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        accessToken = data.data.accessToken;
        processQueue(null, accessToken);
        if (original.headers) original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        accessToken = null;
        // Only redirect if not already on an auth page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/forgot')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// Typed API helpers
export const apiGet = <T>(url: string, params?: Record<string, unknown>) =>
  api.get<{ success: boolean; data: T; meta?: unknown }>(url, { params }).then((r) => r.data);

export const apiPost = <T>(url: string, data?: unknown) =>
  api.post<{ success: boolean; data: T; message: string }>(url, data).then((r) => r.data);

export const apiPut = <T>(url: string, data?: unknown) =>
  api.put<{ success: boolean; data: T; message: string }>(url, data).then((r) => r.data);

export const apiDelete = <T>(url: string) =>
  api.delete<{ success: boolean; data: T; message: string }>(url).then((r) => r.data);
