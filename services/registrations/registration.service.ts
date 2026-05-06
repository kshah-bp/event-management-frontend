import { apiClient } from '../api/client';
import { EventRegistration, PaginatedResponse } from '@/types';

export class RegistrationService {
  async getMyRegistrations(): Promise<EventRegistration[]> {
    return apiClient.get<EventRegistration[]>('/registrations/my');
  }

  async getRegistrationsByUser(userId: number): Promise<EventRegistration[]> {
    return apiClient.get<EventRegistration[]>(`/registrations/user/${userId}`);
  }

  async confirmRegistration(id: number): Promise<EventRegistration> {
    return apiClient.post<EventRegistration>(`/registrations/${id}/confirm`);
  }

  async registerForEvent(eventId: number): Promise<EventRegistration> {
    return apiClient.post<EventRegistration>(`/events/${eventId}/register`);
  }
}

export const registrationService = new RegistrationService();
