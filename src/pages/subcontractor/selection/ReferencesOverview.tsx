
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';

interface Reference {
  id: string;
  customer_name: string | null;
  industry: string;
  category: string;
  start_date: string;
  end_date: string | null;
  until_today: boolean;
  allow_publication: boolean;
  anonymize: boolean;
  created_at: string;
}

const ReferencesOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchReferences() {
      try {
        const { data, error } = await supabase
          .from('subcontractor_references')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setReferences(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching references:', error);
        setLoading(false);
      }
    }
    
    fetchReferences();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd.MM.yyyy');
  };
  
  const handleEditReference = (id: string) => {
    navigate(`/dashboard/subcontractor/selection/references/edit/${id}`);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('references.overview')}</h1>
        <Button 
          onClick={() => navigate('/dashboard/subcontractor/selection/references/edit')}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          {t('selection.editButton')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('references.title')}</CardTitle>
          <CardDescription>
            {references.length > 0 
              ? t('references.showCount', { count: references.length })
              : t('selection.noData')}
          </CardDescription>
        </CardHeader>
        {references.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('references.customerName')}</TableHead>
                  <TableHead>{t('references.industry')}</TableHead>
                  <TableHead>{t('references.category')}</TableHead>
                  <TableHead>{t('references.startDate')}</TableHead>
                  <TableHead>{t('references.endDate')}</TableHead>
                  <TableHead>{t('references.publication')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {references.map((reference) => (
                  <TableRow key={reference.id}>
                    <TableCell>
                      {reference.allow_publication && reference.anonymize 
                        ? `${t('references.anonymized')}`
                        : reference.allow_publication 
                          ? reference.customer_name || '-' 
                          : '-'}
                    </TableCell>
                    <TableCell>{reference.industry}</TableCell>
                    <TableCell>{reference.category}</TableCell>
                    <TableCell>{formatDate(reference.start_date)}</TableCell>
                    <TableCell>
                      {reference.until_today 
                        ? t('references.untilToday') 
                        : formatDate(reference.end_date)}
                    </TableCell>
                    <TableCell>
                      {reference.allow_publication ? (
                        <div className="flex items-center text-green-600">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('common.yes')}
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <EyeOff className="h-4 w-4 mr-1" />
                          {t('common.no')}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditReference(reference.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('common.edit')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ReferencesOverview;
