import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T = any> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Table<T = any>({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  isLoading,
  emptyMessage = 'No data found',
  className,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <div className="h-16 animate-pulse bg-gray-100 rounded mb-4"></div>
        <div className="h-16 animate-pulse bg-gray-100 rounded mb-4"></div>
        <div className="h-16 animate-plate bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return <div className={cn('text-center py-8 text-gray-500', className)}>{emptyMessage}</div>;
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border', className)}>
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100',
                  column.sortable && onSort && 'select-none',
                  column.className
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  <span>{column.header}</span>
                  {column.sortable && sortKey === column.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                  {column.render ? column.render(row) : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
