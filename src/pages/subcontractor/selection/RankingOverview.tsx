
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RankingOverview: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('selection.ranking', 'Ranking')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('ranking.overview', 'Ranking-Übersicht')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('ranking.comingSoon', 'Diese Funktion wird in Kürze verfügbar sein.')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingOverview;
