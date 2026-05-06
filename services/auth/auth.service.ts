import { apiClient } from '../api/client';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', credentials);
    const token = response.access_token || response.token;
    this.setToken(token);
    return {
      token,
      user: response.user,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/signup', credentials);
    const token = response.access_token || response.token;
    this.setToken(token);
    return {
      token,
      user: response.user,
    };
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me');
  }

  logout() {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}

export const authService = new AuthService();
