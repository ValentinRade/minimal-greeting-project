
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TourFilterOptions } from '@/types/tour';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Filter, SortAsc, SortDesc, Calendar, MapPin, Truck, User } from 'lucide-react';

interface TourFilterBarProps {
  filterOptions: TourFilterOptions;
  onFilterChange: (key: keyof TourFilterOptions, value: any) => void;
  // Allow for alternative prop name for backward compatibility
  filters?: TourFilterOptions;
}

const TourFilterBar: React.FC<TourFilterBarProps> = ({ 
  filterOptions, 
  onFilterChange,
  filters
}) => {
  const { t } = useTranslation();
  
  // Use filters prop as fallback if filterOptions is not provided
  const actualFilters = filterOptions || filters;
  
  if (!actualFilters) {
    console.error('No filter options provided to TourFilterBar');
    return null;
  }
  
  const timeframeOptions = [
    { value: 'all', label: t('filters.allTime') },
    { value: 'today', label: t('filters.today') },
    { value: 'week', label: t('filters.thisWeek') },
    { value: 'month', label: t('filters.thisMonth') },
  ];

  const statusOptions = [
    { value: 'all', label: t('filters.allStatuses') },
    { value: 'active', label: t('status.active') },
    { value: 'pending', label: t('status.pending') },
    { value: 'completed', label: t('status.completed') },
    { value: 'cancelled', label: t('status.cancelled') },
    { value: 'paused', label: t('status.paused') },
  ];

  const sortOptions = [
    { value: 'date', label: t('filters.sortByDate') },
    { value: 'status', label: t('filters.sortByStatus') },
    { value: 'price', label: t('filters.sortByPrice') },
  ];

  const handleSortDirectionToggle = () => {
    onFilterChange('sortDirection', actualFilters.sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Timeframe filter */}
      <Select
        value={actualFilters.timeframe}
        onValueChange={(value) => onFilterChange('timeframe', value)}
      >
        <SelectTrigger className="w-[140px] h-9">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder={t('filters.timeframe')} />
        </SelectTrigger>
        <SelectContent>
          {timeframeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select
        value={actualFilters.status}
        onValueChange={(value) => onFilterChange('status', value)}
      >
        <SelectTrigger className="w-[140px] h-9">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder={t('filters.status')} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Vehicle type filter */}
      <div className="relative">
        <Truck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('filters.vehicleType')}
          className="w-[140px] h-9 pl-8"
          value={actualFilters.vehicleType}
          onChange={(e) => onFilterChange('vehicleType', e.target.value)}
        />
      </div>

      {/* Regions filter - dropdown with checkboxes */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <MapPin className="mr-2 h-4 w-4" />
            {t('filters.regions')}
            {actualFilters.regions.length > 0 && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
                {actualFilters.regions.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {/* This would be populated with actual regions */}
          <DropdownMenuCheckboxItem
            checked={actualFilters.regions.includes('berlin')}
            onCheckedChange={(checked) => {
              const newRegions = checked 
                ? [...actualFilters.regions, 'berlin']
                : actualFilters.regions.filter(r => r !== 'berlin');
              onFilterChange('regions', newRegions);
            }}
          >
            Berlin
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={actualFilters.regions.includes('hamburg')}
            onCheckedChange={(checked) => {
              const newRegions = checked 
                ? [...actualFilters.regions, 'hamburg']
                : actualFilters.regions.filter(r => r !== 'hamburg');
              onFilterChange('regions', newRegions);
            }}
          >
            Hamburg
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={actualFilters.regions.includes('munich')}
            onCheckedChange={(checked) => {
              const newRegions = checked 
                ? [...actualFilters.regions, 'munich']
                : actualFilters.regions.filter(r => r !== 'munich');
              onFilterChange('regions', newRegions);
            }}
          >
            Munich
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Employee filter */}
      <div className="relative">
        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('filters.employee')}
          className="w-[140px] h-9 pl-8"
          value={actualFilters.employeeId}
          onChange={(e) => onFilterChange('employeeId', e.target.value)}
        />
      </div>

      {/* Sort options */}
      <div className="flex ml-auto">
        <Select
          value={actualFilters.sortBy}
          onValueChange={(value) => onFilterChange('sortBy', value)}
        >
          <SelectTrigger className="w-[140px] h-9 rounded-r-none border-r-0">
            <SelectValue placeholder={t('filters.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="h-9 rounded-l-none"
          onClick={handleSortDirectionToggle}
        >
          {actualFilters.sortDirection === 'asc' ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TourFilterBar;
