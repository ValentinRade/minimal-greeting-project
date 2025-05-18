
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Prequalifications = {
  pq_kep: boolean;
  bna_registration: boolean;
  adr_certificate: boolean;
  adr_1000_points: boolean;
  eu_license: boolean;
  other_qualification: boolean;
  other_qualification_name: string | null;
};

const PrequalificationsOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { company } = useAuth();
  const [data, setData] = useState<Prequalifications | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!company?.id) return;
      
      try {
        const { data: prequalifications, error } = await supabase
          .from('subcontractor_prequalifications')
          .select('*')
          .eq('company_id', company.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error fetching prequalifications:', error);
        }
        
        setData(prequalifications as Prequalifications);
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [company?.id]);
  
  if (loading) {
    return <div>{t('loading')}</div>;
  }
  
  const hasData = !!data;
  
  const StatusIcon = ({ isActive }: { isActive: boolean }) => (
    isActive ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('prequalifications.overview')}</h1>
        <Button 
          onClick={() => navigate('/dashboard/subcontractor/selection/prequalifications/edit')}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          {t('selection.editButton')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('prequalifications.title')}</CardTitle>
          <CardDescription>
            {hasData 
              ? t('selection.overview') 
              : t('selection.noData')}
          </CardDescription>
        </CardHeader>
        {hasData && (
          <CardContent className="divide-y">
            <div className="py-2 flex justify-between items-center">
              <span>PQ KEP</span>
              <StatusIcon isActive={data.pq_kep} />
            </div>
            <div className="py-2 flex justify-between items-center">
              <span>{t('prequalifications.bnaRegistration')}</span>
              <StatusIcon isActive={data.bna_registration} />
            </div>
            <div className="py-2 flex justify-between items-center">
              <span>{t('prequalifications.adrCertificate')}</span>
              <StatusIcon isActive={data.adr_certificate} />
            </div>
            <div className="py-2 flex justify-between items-center">
              <span>{t('prequalifications.adr1000')}</span>
              <StatusIcon isActive={data.adr_1000_points} />
            </div>
            <div className="py-2 flex justify-between items-center">
              <span>{t('prequalifications.euLicense')}</span>
              <StatusIcon isActive={data.eu_license} />
            </div>
            {data.other_qualification && (
              <div className="py-2 flex justify-between items-center">
                <div>
                  <span>{t('prequalifications.other')}</span>
                  {data.other_qualification_name && (
                    <p className="text-sm text-muted-foreground">{data.other_qualification_name}</p>
                  )}
                </div>
                <StatusIcon isActive={data.other_qualification} />
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PrequalificationsOverview;
