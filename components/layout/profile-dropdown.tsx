'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/routes';
import { useAuth } from '@/hooks/use-auth';

export function ProfileDropdown() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              {user.name}
            </div>
            <Link
              href={ROUTES.USER_PROFILE}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              View Profile
            </Link>
            {user.role !== 'ADMIN' && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
