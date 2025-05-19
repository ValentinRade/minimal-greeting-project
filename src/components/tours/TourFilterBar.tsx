
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TourFilterOptions } from '@/types/tour';
import { Filter } from 'lucide-react';

interface TourFilterBarProps {
  filters: TourFilterOptions;
  onFilterChange: (key: keyof TourFilterOptions, value: any) => void;
}

const TourFilterBar: React.FC<TourFilterBarProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-card p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{t('tours.filters')}</span>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <Select 
            value={filters.timeframe} 
            onValueChange={(value) => onFilterChange('timeframe', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('tours.selectTimeframe')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t('tours.today')}</SelectItem>
              <SelectItem value="this_week">{t('tours.thisWeek')}</SelectItem>
              <SelectItem value="this_month">{t('tours.thisMonth')}</SelectItem>
              <SelectItem value="all">{t('tours.allTime')}</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.status} 
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('tours.selectStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tours.allStatuses')}</SelectItem>
              <SelectItem value="pending">{t('tours.pending')}</SelectItem>
              <SelectItem value="in_progress">{t('tours.inProgress')}</SelectItem>
              <SelectItem value="completed">{t('tours.completed')}</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => onFilterChange('sortBy', value as any)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('tours.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t('tours.date')}</SelectItem>
              <SelectItem value="region">{t('tours.region')}</SelectItem>
              <SelectItem value="status">{t('tours.status')}</SelectItem>
              <SelectItem value="resources">{t('tours.resources')}</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.sortDirection} 
            onValueChange={(value) => onFilterChange('sortDirection', value as any)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t('tours.sortDirection')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">{t('tours.ascending')}</SelectItem>
              <SelectItem value="desc">{t('tours.descending')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              onFilterChange('timeframe', 'all');
              onFilterChange('status', 'all');
              onFilterChange('sortBy', 'date');
              onFilterChange('sortDirection', 'asc');
            }}
          >
            {t('tours.resetFilters')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourFilterBar;
