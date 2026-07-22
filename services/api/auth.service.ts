import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

import { apiClient } from './client';
import { tokenStorage } from './tokenStorage';

type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export async function login(email: string, password: string): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
    email,
    password,
  });
  if (!data.success) throw new Error(data.error.message);

  await tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.user;
}

export async function signup(email: string, password: string, displayName: string): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/signup', {
    email,
    password,
    displayName,
  });
  if (!data.success) throw new Error(data.error.message);

  await tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data.user;
}

export async function logout(): Promise<void> {
  await tokenStorage.clearTokens();
}
