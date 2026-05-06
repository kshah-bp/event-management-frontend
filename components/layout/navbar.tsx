'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/routes';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ProfileDropdown } from '@/components/layout/profile-dropdown';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const hideNavbar = pathname === '/login' || pathname === '/signup';

  if (hideNavbar) {
    return null;
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={isAuthenticated ? (user?.role === 'ADMIN' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD) : '/'} className="text-xl font-bold text-blue-600">
              Event Management
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role !== 'ADMIN' && 
                  <Link href={ROUTES.USER_EVENTS} className="text-gray-700 hover:text-blue-600 transition-colors">
                    Events
                  </Link>
                }
                {user?.role !== 'ADMIN' && <ProfileDropdown />}
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
