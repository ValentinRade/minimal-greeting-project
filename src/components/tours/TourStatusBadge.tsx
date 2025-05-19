
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
