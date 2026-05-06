import { apiClient } from '../api/client';
import { GlobalSetting } from '@/types';

export class SettingsService {
  async getAllSettings(): Promise<GlobalSetting[]> {
    return apiClient.get<GlobalSetting[]>('/admin/settings');
  }

  async getSetting(key: string): Promise<GlobalSetting> {
    return apiClient.get<GlobalSetting>(`/admin/settings/${key}`);
  }

  async setSetting(key: string, value: string, description?: string): Promise<GlobalSetting> {
    return apiClient.post<GlobalSetting>(`/admin/settings/${key}`, { value, description });
  }
}

export const settingsService = new SettingsService();
