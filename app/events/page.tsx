'use client';

import { useState, useEffect } from 'react';
import { EventCard } from '@/components/ui/event-card';
import { Event } from '@/types';
import { eventService } from '@/services/events/event.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/ui/loader';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [search, location]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (search) filters.search = search;
      if (location) filters.location = location;
      const data = await eventService.getEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number) => {
    try {
      await eventService.registerForEvent(eventId);
      await fetchEvents();
    } catch (error: any) {
      alert(error.message || 'Registration failed');
    }
  };

  const isRegistered = (eventId: number) => {
    return false;
  };

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
      </div>

      <form onSubmit={searchHandler} className="flex gap-4 mb-8">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No events found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showRegister={isAuthenticated}
              onRegister={handleRegister}
              isRegistered={isRegistered(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
