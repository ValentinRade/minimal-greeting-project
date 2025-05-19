import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Metric } from '@/components/ui/metric';
import { Skeleton } from '@/components/ui/skeleton';
import { TourStats as TourStatsType } from '@/types/tour';

interface TourStatsProps {
  stats: TourStatsType;
  isLoading: boolean;
}

const TourStats: React.FC<TourStatsProps> = ({ stats, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Card className="col-span-4 md:col-span-8 lg:col-span-4">
      <CardHeader>
        <CardTitle>{t('tours.stats.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Total Tours */}
        <Metric
          title={t('tours.stats.totalTours')}
          value={isLoading ? <Skeleton className="h-4 w-[60px]" /> : stats.total.toString()}
          isLoading={isLoading}
        />

        {/* Active Tours */}
        <Metric
          title={t('tours.stats.activeTours')}
          value={isLoading ? <Skeleton className="h-4 w-[60px]" /> : stats.active.toString()}
          isLoading={isLoading}
        />

        {/* Completed Tours */}
        <Metric
          title={t('tours.stats.completedTours')}
          value={isLoading ? <Skeleton className="h-4 w-[60px]" /> : stats.completed.toString()}
          isLoading={isLoading}
        />

        {/* Cancelled Tours */}
        <Metric
          title={t('tours.stats.cancelledTours')}
          value={isLoading ? <Skeleton className="h-4 w-[60px]" /> : stats.cancelled.toString()}
          isLoading={isLoading}
        />
        
        {/* Top Regions */}
        <div className="flex-1">
          <h3 className="mb-2 font-medium">{t('tours.stats.topRegions')}</h3>
          {isLoading ? (
            <Skeleton className="h-[120px] w-full" />
          ) : (
            <ul className="space-y-2">
              {stats.topRegions && stats.topRegions.length > 0 ? (
                stats.topRegions.map((region, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <span>{region.name}</span>
                    <span className="font-medium">{region.count}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-sm">{t('tours.stats.noRegionsData')}</li>
              )}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TourStats;
