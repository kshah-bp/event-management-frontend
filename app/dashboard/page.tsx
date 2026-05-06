'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/routes';
import { useAuth } from '@/hooks/use-auth';
import { useAppSelector } from '@/hooks/use-auth';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Hello, <span className="font-semibold">{user?.name}</span>!</p>
            <p className="text-sm text-gray-500">Role: <span className="text-blue-600 font-medium">{user?.role}</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={ROUTES.USER_EVENTS}>
              <Button className="w-full">Browse Events</Button>
            </Link>
            <Link href={ROUTES.USER_MY_REGISTRATIONS}>
              <Button variant="outline" className="w-full">My Registrations</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">Email: {user?.email}</p>
            <p className="text-sm text-gray-600 mb-2">Joined: {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

