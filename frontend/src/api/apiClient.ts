import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenPair } from '../types';

export const API_URL = 'http://localhost:8082/api/v1';
export const MEDIA_URL = 'http://localhost:8082/api/v1/media';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token!);
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && !(config as any).skipAuthRefresh) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (refresh-token logic)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config) return Promise.reject(error);

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      skipAuthRefresh?: boolean;
    };

    // If unauthorized and this is NOT refresh-request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        // Backend возвращает TokenPair напрямую
        const accessToken = res.data.accessToken;
        const newRefresh = res.data.refreshToken;

        localStorage.setItem('accessToken', accessToken);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

        apiClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

