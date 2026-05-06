'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { useRequireAdmin } from '@/hooks/use-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useRequireAdmin();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}
