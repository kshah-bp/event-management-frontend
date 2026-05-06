'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Settings, Tag } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { userService } from '@/services/users/user.service';
import { eventService } from '@/services/events/event.service';
import { pricingService } from '@/services/pricing/pricing.service';
import { settingsService } from '@/services/settings/settings.service';

export default function AdminDashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    pricingRules: 0,
    settings: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, events, pricing, settings] = await Promise.all([
        userService.getUsers().then((u) => u.length),
        eventService.getEvents().then((e) => e.length),
        pricingService.getPricingRules().then((p) => p.length),
        settingsService.getAllSettings().then((s) => s.length),
      ]);
      setStats({ users, events, pricingRules: pricing, settings });
    } catch (error) {
      console.log('Failed to fetch stats:', error);
      // console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pricing Rules</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pricingRules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Settings</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.settings}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Welcome back, {user?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">System operational. All services running normally.</p>
        </CardContent>
      </Card>
    </div>
  );
}
