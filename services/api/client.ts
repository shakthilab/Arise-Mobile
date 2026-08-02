import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import type { ApiResponse } from '@/types/api';

import { tokenStorage } from './tokenStorage';

export class ApiError extends Error {
  code: string;
  status?: number;
  response?: any;

  constructor(code: string, message: string, status?: number, response?: any) {
    super(message);
    this.code = code;
    this.status = status;
    this.response = response;
  }
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
});

if (__DEV__) {
  apiClient.interceptors.request.use((config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`, config.data || '');
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => {
      console.log(`[API Response Success] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status, response.data);
      return response;
    },
    (error) => {
      console.log(
        `[API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.status || 'Network/Timeout',
        error.response?.data || error.message
      );
      return Promise.reject(error);
    }
  );
}

apiClient.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${env.apiUrl}/auth/refresh`,
      { refreshToken }
    );
    if (!data.success) return null;

    const accessToken = (data.data as any).access_token || (data.data as any).accessToken;
    const refToken = (data.data as any).refresh_token || (data.data as any).refreshToken;
    if (accessToken && refToken) {
      await tokenStorage.setTokens(accessToken, refToken);
      return accessToken;
    }
    return null;
  } catch {
    await tokenStorage.clearTokens();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried) {
      originalRequest._retried = true;

      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
      }
    }

    const body = error.response?.data;
    if (body) {
      if (typeof body === 'string') {
        throw new ApiError('api_error', body, error.response?.status, error.response);
      }
      if (typeof body === 'object') {
        const msg = (body as any).message || (body as any).error?.message || (body as any).error;
        if (msg && typeof msg === 'string') {
          throw new ApiError((body as any).error?.code || 'api_error', msg, error.response?.status, error.response);
        }
      }
    }
    throw new ApiError('network_error', error.message, error.response?.status, error.response);
  }
);
