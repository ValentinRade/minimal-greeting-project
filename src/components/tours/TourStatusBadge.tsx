
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { TourStatus } from '@/types/tour';

interface TourStatusBadgeProps {
  status: TourStatus;
  className?: string;
}

const TourStatusBadge: React.FC<TourStatusBadgeProps> = ({ status, className }) => {
  const { t } = useTranslation();
  
  const getVariant = () => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100/80';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80';
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80';
      case 'paused':
        return 'bg-slate-100 text-slate-800 hover:bg-slate-100/80';
      case 'awarded':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80';
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
      default:
        return '';
    }
  };
  
  const getLabel = () => {
    switch (status) {
      case 'pending':
        return t('tours.pending');
      case 'in_progress':
        return t('tours.inProgress');
      case 'completed':
        return t('tours.completed');
      case 'active':
        return t('tours.active');
      case 'cancelled':
        return t('tours.cancelled');
      case 'paused':
        return t('tours.paused');
      case 'awarded':
        return t('tours.awarded');
      case 'draft':
        return t('tours.draft');
      default:
        return status;
    }
  };
  
  return (
    <Badge
      className={cn(getVariant(), className)}
      variant="outline"
    >
      {getLabel()}
    </Badge>
  );
};

export default TourStatusBadge;
