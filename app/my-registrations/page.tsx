'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { registrationService } from '@/services/registrations/registration.service';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/ui/loader';
import { StatusBadge } from '@/components/ui/status-badge';
import { ROUTES } from '@/routes';
import Link from 'next/link';

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'event',
      header: 'Event',
      render: (item: any) => (
        <Link href={`/events/${item.event?.id || ''}`} className="text-blue-600 hover:underline">
          {item.event?.title || 'N/A'}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: 'registrationDate',
      header: 'Registered On',
      render: (item: any) => new Date(item.registrationDate).toLocaleDateString(),
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">Please sign in to view your registrations</p>
            <Link href={ROUTES.LOGIN}>
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Registrations</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : registrations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No registrations found
          </CardContent>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={registrations}
          emptyMessage="No registrations found"
        />
      )}
    </div>
  );
}
