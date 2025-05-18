
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, FileCheck, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Prequalification {
  id: string;
  company_id: string;
  pq_kep: boolean;
  pq_kep_document: string | null;
  bna_registration: boolean;
  bna_registration_document: string | null;
  adr_certificate: boolean;
  adr_certificate_document: string | null;
  adr_1000_points: boolean;
  adr_1000_points_document: string | null;
  eu_license: boolean;
  eu_license_document: string | null;
  other_qualification: boolean;
  other_qualification_name: string | null;
  other_qualification_document: string | null;
  created_at: string;
  updated_at: string;
}

const PrequalificationsOverview: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { company } = useAuth();
  
  const fetchPrequalifications = async (): Promise<Prequalification | null> => {
    if (!company?.id) return null;
    
    const { data, error } = await supabase
      .from('subcontractor_prequalifications')
      .select('*')
      .eq('company_id', company.id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching prequalifications:', error);
      return null;
    }
    
    return data as Prequalification;
  };
  
  const { data: prequalifications, isLoading } = useQuery({
    queryKey: ['prequalifications', company?.id],
    queryFn: fetchPrequalifications,
    enabled: !!company?.id
  });

  const handleEdit = () => {
    navigate('/dashboard/subcontractor/selection/prequalifications/edit');
  };

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === true) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-gray-300" />;
  };

  const getDocumentStatus = (documentPath: string | null) => {
    if (!documentPath) return t('prequalifications.notUploaded', 'Nicht hochgeladen');
    return t('prequalifications.uploaded', 'Hochgeladen');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('selection.prequalifications', 'Präqualifikationen')}</h1>
        <Button onClick={handleEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          {t('common.edit', 'Bearbeiten')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('prequalifications.overview', 'Übersicht der Präqualifikationen')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>{t('common.loading', 'Wird geladen...')}</p>
          ) : !prequalifications ? (
            <p>{t('prequalifications.noData', 'Keine Präqualifikationen gefunden. Klicken Sie auf "Bearbeiten", um Präqualifikationen anzugeben.')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">{t('prequalifications.qualification', 'Qualifikation')}</TableHead>
                  <TableHead>{t('prequalifications.status', 'Status')}</TableHead>
                  <TableHead>{t('prequalifications.document', 'Dokument')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>PQ KEP</TableCell>
                  <TableCell><StatusIcon status={prequalifications.pq_kep} /></TableCell>
                  <TableCell>{getDocumentStatus(prequalifications.pq_kep_document)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('prequalifications.bnaRegistration', 'Registrierung bei der Bundesnetzagentur (KEP)')}</TableCell>
                  <TableCell><StatusIcon status={prequalifications.bna_registration} /></TableCell>
                  <TableCell>{getDocumentStatus(prequalifications.bna_registration_document)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('prequalifications.adrCertificate', 'ADR-Schein')}</TableCell>
                  <TableCell><StatusIcon status={prequalifications.adr_certificate} /></TableCell>
                  <TableCell>{getDocumentStatus(prequalifications.adr_certificate_document)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('prequalifications.adr1000', 'ADR bis 1000 Punkte')}</TableCell>
                  <TableCell><StatusIcon status={prequalifications.adr_1000_points} /></TableCell>
                  <TableCell>{getDocumentStatus(prequalifications.adr_1000_points_document)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('prequalifications.euLicense', 'EU-Lizenz')}</TableCell>
                  <TableCell><StatusIcon status={prequalifications.eu_license} /></TableCell>
                  <TableCell>{getDocumentStatus(prequalifications.eu_license_document)}</TableCell>
                </TableRow>
                {prequalifications.other_qualification && (
                  <TableRow>
                    <TableCell>
                      {t('prequalifications.other', 'Weitere Präqualifikation')}: {prequalifications.other_qualification_name || ''}
                    </TableCell>
                    <TableCell><StatusIcon status={prequalifications.other_qualification} /></TableCell>
                    <TableCell>{getDocumentStatus(prequalifications.other_qualification_document)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrequalificationsOverview;
