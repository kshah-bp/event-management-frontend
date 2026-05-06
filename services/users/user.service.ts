import { apiClient } from '../api/client';
import { User, UserFilters, PaginatedResponse } from '@/types';

export class UserService {
  async getUsers(filters?: UserFilters): Promise<User[]> {
    return apiClient.get<User[]>('/users', { params: filters });
  }

  async getUserById(id: number): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }

  async createUser(data: Partial<User>): Promise<User> {
    return apiClient.post<User>('/users', data);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, data);
  }

  async updateUserRole(id: number, role: 'ADMIN' | 'USER'): Promise<User> {
    return apiClient.patch<User>(`/users/${id}/role`, { role });
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
