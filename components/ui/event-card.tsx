import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import { StatusBadge } from './status-badge';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: Event;
  showRegister?: boolean;
  onRegister?: (eventId: number) => Promise<void>;
  isRegistered?: boolean;
}

export function EventCard({ event, showRegister, onRegister, isRegistered }: EventCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <StatusBadge status={event.status} />
        </div>
        <CardDescription className="text-gray-600">
          {event.description?.substring(0, 120)}...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {formatDate(event.fromTime)} - {formatDate(event.toTime)}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">Capacity: {event.maxCapacity}</span>
          </div>
          <div className="pt-2">
            <span className="text-lg font-semibold text-blue-600">${event.basePrice}</span>
            <span className="text-sm text-gray-500 ml-1">per person</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/events/${event.id}`)}
        >
          View Details
        </Button>
        {showRegister && (
          <Button
            size="sm"
            onClick={() => onRegister?.(event.id)}
            disabled={isRegistered}
          >
            {isRegistered ? 'Registered' : 'Register'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
