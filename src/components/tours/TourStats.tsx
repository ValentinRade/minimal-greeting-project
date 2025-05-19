
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TourStats as TourStatsType } from '@/types/tour';

interface TourStatsProps {
  stats: TourStatsType;
  isLoading: boolean;
}

const TourStats: React.FC<TourStatsProps> = ({ stats, isLoading }) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('tours.totalTours')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('tours.averageDuration')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('tours.statusDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('tours.topRegions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('tours.totalTours')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('tours.averageDuration')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {Math.floor(stats.averageDuration / 60)}h {stats.averageDuration % 60}m
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('tours.statusDistribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">{t('tours.pending')}</span>
              <span className="text-xs">{stats.statusDistribution.pendingPercent}%</span>
            </div>
            <Progress value={stats.statusDistribution.pendingPercent} className="h-2 bg-muted" />
            <div className="bg-amber-500 h-1 w-3 rounded-full ml-1"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs">{t('tours.inProgress')}</span>
              <span className="text-xs">{stats.statusDistribution.inProgressPercent}%</span>
            </div>
            <Progress value={stats.statusDistribution.inProgressPercent} className="h-2 bg-muted" />
            <div className="bg-blue-500 h-1 w-3 rounded-full ml-1"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs">{t('tours.completed')}</span>
              <span className="text-xs">{stats.statusDistribution.completedPercent}%</span>
            </div>
            <Progress value={stats.statusDistribution.completedPercent} className="h-2 bg-muted" />
            <div className="bg-green-500 h-1 w-3 rounded-full ml-1"></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('tours.topRegions')}</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topRegions.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t('tours.noRegionsData')}</div>
          ) : (
            <ul className="space-y-2">
              {stats.topRegions.slice(0, 5).map((region, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm truncate max-w-[70%]" title={region.region}>
                    {region.region || t('tours.unnamedRegion')}
                  </span>
                  <span className="text-sm font-medium">{region.count}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TourStats;
