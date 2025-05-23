
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

import InvitationForm from './InvitationForm';
import InvitationsList from './InvitationsList';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// Define type for company role using the Database type
type CompanyRole = Database['public']['Enums']['company_role'];

interface CompanyInvitation {
  id: string;
  company_id: string;
  email: string;
  role: CompanyRole;
  invited_by: string;
  invited_at: string | null;
  accepted_at: string | null;
  expires_at: string;
  token: string;
}

const CompanyInvitationsContainer = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<CompanyInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchInvitations();
    }
  }, [company]);

  const fetchInvitations = async () => {
    if (!company || !company.id) {
      console.error('No company found or company has no ID');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      console.log('Fetching invitations for company:', company.id);
      
      // Log the current user JWT role for debugging - TEST METHOD #3
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Current user JWT role:', session.user.role);
        console.log('Current user email:', session.user.email);
      }
      
      // Fetch invitations from the company_invitations table
      const { data: invitationsData, error } = await supabase
        .from('company_invitations')
        .select('*')
        .eq('company_id', company.id)
        .order('invited_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }
      
      console.log('Raw invitations data:', invitationsData);
      
      if (!invitationsData || invitationsData.length === 0) {
        setInvitations([]);
        setLoading(false);
        return;
      }
      
      // Simply use the data as is - no need to join with user table
      setInvitations(invitationsData);
    } catch (error: any) {
      console.error('Error in fetchInvitations:', error);
      toast({
        title: t('settings.fetchError'),
        description: error.message || 'An error occurred while fetching invitations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Return placeholder if company is not loaded
  if (!company) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('settings.invitations')}</h1>
        <InvitationForm onInvitationSent={fetchInvitations} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.companyInvitations')}</CardTitle>
          <CardDescription>{t('settings.companyInvitationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationsList 
            invitations={invitations} 
            loading={loading} 
            onRefresh={fetchInvitations} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyInvitationsContainer;
