'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { eventService } from '@/services/events/event.service';
import { Event } from '@/types';
import { Loader } from '@/components/ui/loader';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventById(Number(params.id));
      setEvent(data);
      // Fetch price
      try {
        // Note: price endpoint might not be implemented for all events
        const priceData = await eventService.getEventPrice(Number(params.id));
        setPrice(priceData.finalPrice);
      } catch (e) {
        setPrice(data.basePrice);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!event) return;
    try {
      await eventService.registerForEvent(event.id);
      setIsRegistered(true);
    } catch (error: any) {
      alert(error.message || 'Registration failed');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <Card>
          <CardContent className="pt-6">
            <p>Event not found</p>
            <Button onClick={() => router.push('/events')} className="mt-4">
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
              <CardDescription className="text-base mt-2">{event.description}</CardDescription>
            </div>
            <StatusBadge status={event.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-3" />
                <span className="text-lg">{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">From</p>
                  <p>{formatDate(event.fromTime)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-5" />
                <div>
                  <p className="font-medium">To</p>
                  <p>{formatDate(event.toTime)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-3" />
                <span>Capacity: {event.maxCapacity}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Ticket Information</h3>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Base Price</span>
                  <span className="text-xl font-bold">${event.basePrice}</span>
                </div>
                {price !== event.basePrice && price !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Final Price</span>
                    <span className="text-xl font-bold text-green-600">${price}</span>
                  </div>
                )}
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleRegister}
                disabled={isRegistered || event.status !== 'UPCOMING'}
              >
                {isRegistered ? 'Already Registered' : 'Register Now'}
              </Button>
              {event.status !== 'UPCOMING' && (
                <p className="text-center text-sm text-gray-500">
                  Registration closed for this event
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
