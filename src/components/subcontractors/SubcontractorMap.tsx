
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubcontractorSearchResult } from '@/hooks/useSubcontractorSearch';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface SubcontractorMapProps {
  subcontractors: SubcontractorSearchResult[];
}

const SubcontractorMap: React.FC<SubcontractorMapProps> = ({ subcontractors }) => {
  const { t } = useTranslation();

  return (
    <Card className="h-[calc(100vh-330px)]">
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t('map.comingSoon')}</h3>
        <p className="text-muted-foreground text-center mt-2 max-w-md">
          {t('map.description')}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          {t('map.subcontractorsFound', { count: subcontractors.length })}
        </p>
      </div>
    </Card>
  );
};

export default SubcontractorMap;
