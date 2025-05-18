
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

const PreferencesOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // In a real app, you would fetch the user's preferences data here
  const hasData = false; // This would be determined by your data fetch
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('preferences.overview')}</h1>
        <Button 
          onClick={() => navigate('/dashboard/subcontractor/selection/preferences/edit')}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          {t('selection.editButton')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('preferences.title')}</CardTitle>
          <CardDescription>
            {hasData 
              ? t('selection.overview')
              : t('selection.noData')}
          </CardDescription>
        </CardHeader>
        {hasData && (
          <CardContent>
            {/* Display preferences data here when available */}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PreferencesOverview;
