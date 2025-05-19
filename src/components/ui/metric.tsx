
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricProps {
  title: string;
  value: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({ 
  title, 
  value, 
  isLoading = false,
  className
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-1">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </div>
  );
};
