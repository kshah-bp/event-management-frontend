import React from 'react';
import { Badge, badgeVariants } from './badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'confirmed';
      case 'PENDING':
        return 'pending';
      case 'CANCELLED':
        return 'cancelled';
      case 'EXPIRED':
        return 'expired';
      case 'UPCOMING':
        return 'default';
      case 'ONGOING':
        return 'warning';
      case 'COMPLETED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant()} className={cn(className)}>
      {status}
    </Badge>
  );
}
