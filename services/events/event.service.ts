import { apiClient } from '../api/client';
import { Event, EventFilters, PaginatedResponse, PriceCalculation, CreateEventDto, UpdateEventDto } from '@/types';

export class EventService {
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    return apiClient.get<Event[]>('/events', { params: filters });
  }

  async getEventById(id: number): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  }

  async createEvent(data: CreateEventDto): Promise<Event> {
    return apiClient.post<Event>('/events', data);
  }

  async updateEvent(id: number, data: UpdateEventDto): Promise<Event> {
    return apiClient.patch<Event>(`/events/${id}`, data);
  }

  async deleteEvent(id: number): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  }

  async getEventPrice(id: number): Promise<PriceCalculation> {
    return apiClient.get<PriceCalculation>(`/events/${id}/price`);
  }

  async registerForEvent(eventId: number): Promise<any> {
    return apiClient.post(`/events/${eventId}/register`);
  }
}

export const eventService = new EventService();
