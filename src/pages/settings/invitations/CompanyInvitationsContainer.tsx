
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
  invited_by_email?: string;
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
      
      // 1. Get the invitations data
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
      
      // 2. Get all invited_by user IDs to fetch their emails
      const invitedByUserIds = invitationsData
        .map(invitation => invitation.invited_by)
        .filter(Boolean);
      
      console.log('Invited by user IDs:', invitedByUserIds);
      
      // Only fetch emails if we have valid user IDs
      if (invitedByUserIds.length === 0) {
        // No invited_by IDs to look up, just format and return the data we have
        const formattedInvitations = invitationsData.map(invitation => ({
          ...invitation,
          invited_by_email: ''
        } as CompanyInvitation));
        
        setInvitations(formattedInvitations);
        setLoading(false);
        return;
      }
      
      // 3. Use our PostgreSQL function to fetch user emails for the inviter
      try {
        console.log('Calling get_user_emails with user IDs:', invitedByUserIds);
        
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { 
            user_ids: invitedByUserIds 
          });
          
        console.log('Email data:', emailData);
          
        if (emailError) {
          console.error('Error fetching emails:', emailError);
          // Continue without email data
          const formattedInvitations = invitationsData.map(invitation => ({
            ...invitation,
            invited_by_email: ''
          } as CompanyInvitation));
          
          setInvitations(formattedInvitations);
          setLoading(false);
          return;
        }
        
        // Map emails to inviters
        const emailMap = new Map<string, string>();
        if (emailData && Array.isArray(emailData)) {
          emailData.forEach((item: { user_id: string, email: string }) => {
            emailMap.set(item.user_id, item.email);
          });
        }
        
        // 4. Combine all the data
        const formattedInvitations = invitationsData.map(invitation => ({
          ...invitation,
          invited_by_email: emailMap.get(invitation.invited_by) || ''
        } as CompanyInvitation));
        
        console.log('Formatted invitations:', formattedInvitations);
        
        setInvitations(formattedInvitations);
      } catch (innerError: any) {
        console.error('Unexpected error fetching emails:', innerError);
        // Continue without email data
        const formattedInvitations = invitationsData.map(invitation => ({
          ...invitation,
          invited_by_email: ''
        } as CompanyInvitation));
        
        setInvitations(formattedInvitations);
      }
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
