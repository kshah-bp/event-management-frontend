'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/routes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Tag,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD },
  { icon: Users, label: 'User Management', href: ROUTES.ADMIN_USERS },
  { icon: Calendar, label: 'Event Management', href: ROUTES.ADMIN_EVENTS },
  { icon: Settings, label: 'Global Settings', href: ROUTES.ADMIN_SETTINGS },
  { icon: Tag, label: 'Pricing Rules', href: ROUTES.ADMIN_PRICING },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 w-64 h-screen bg-blue-900 text-white">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 mb-3 px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-blue-300 truncate">{user?.email || 'admin@mail.com'}</p>
            </div>
          </div>
          <Link
            href={ROUTES.USER_PROFILE}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white transition-colors mb-1"
          >
            <User className="h-5 w-5" />
            <span>View Profile</span>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
