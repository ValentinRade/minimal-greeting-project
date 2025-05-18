
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, TrendingUp } from 'lucide-react';

const RankingOverview: React.FC = () => {
  const { t } = useTranslation();
  
  // In a real app, you would fetch the ranking data from your API
  const rankingData = {
    rank: 85,
    total: 100,
    factors: [
      { name: t('prequalifications.title'), value: 80 },
      { name: t('preferences.title'), value: 90 },
      { name: 'Performance', value: 75 },
    ],
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('ranking.overview')}</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('ranking.yourRank')}</CardTitle>
            <CardDescription>{t('ranking.description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-primary/10 p-8 mb-4">
              <TrendingUp className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-4xl font-bold">
              {rankingData.rank} <span className="text-muted-foreground text-xl">{t('ranking.outOf')} {rankingData.total}</span>
            </h2>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('ranking.factors')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rankingData.factors.map((factor, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{factor.name}</span>
                  <span className="text-sm font-medium">{factor.value}%</span>
                </div>
                <Progress value={factor.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RankingOverview;
