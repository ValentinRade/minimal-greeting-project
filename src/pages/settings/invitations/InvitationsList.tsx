
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow, addDays, isPast } from 'date-fns';
import { RefreshCw, Trash2, UserPlus, Copy } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

interface InvitationsListProps {
  invitations: CompanyInvitation[];
  loading: boolean;
  onRefresh: () => void;
}

const InvitationsList = ({ invitations, loading, onRefresh }: InvitationsListProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copyTimeouts, setCopyTimeouts] = useState<{[key: string]: boolean}>({});

  const handleDeleteInvitation = async (id: string) => {
    try {
      console.log('Deleting invitation with ID:', id);
      
      const { error } = await supabase
        .from('company_invitations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting invitation:', error);
        throw error;
      }
      
      toast({
        title: t('settings.invitationDeleted'),
        description: t('settings.invitationDeletedDesc'),
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error in handleDeleteInvitation:', error);
      toast({
        title: t('settings.deleteError'),
        description: error.message || 'An error occurred while deleting the invitation',
        variant: 'destructive'
      });
    }
  };

  const handleResendInvitation = async (invitation: CompanyInvitation) => {
    try {
      console.log('Resending invitation with ID:', invitation.id);
      
      // Update the expiration date to 7 days from now
      const expiresAt = addDays(new Date(), 7).toISOString();
      
      const { error } = await supabase
        .from('company_invitations')
        .update({
          invited_at: new Date().toISOString(),
          expires_at: expiresAt
        })
        .eq('id', invitation.id);
      
      if (error) {
        console.error('Error resending invitation:', error);
        throw error;
      }
      
      toast({
        title: t('settings.invitationResent'),
        description: t('settings.invitationResentDesc'),
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error in handleResendInvitation:', error);
      toast({
        title: t('settings.resendError'),
        description: error.message || 'An error occurred while resending the invitation',
        variant: 'destructive'
      });
    }
  };

  const getRegistrationLink = (invitation: CompanyInvitation) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register-invited?token=${invitation.token}`;
  };

  const copyToClipboard = (invitation: CompanyInvitation) => {
    const link = getRegistrationLink(invitation);
    navigator.clipboard.writeText(link);
    
    // Show copied status for 2 seconds
    setCopyTimeouts(prev => ({ ...prev, [invitation.id]: true }));
    setTimeout(() => {
      setCopyTimeouts(prev => ({ ...prev, [invitation.id]: false }));
    }, 2000);
    
    toast({
      title: t('settings.linkCopied'),
      description: t('settings.invitationLinkCopied'),
    });
  };

  const getRoleTranslation = (role: string) => {
    switch (role) {
      case 'company_admin':
        return t('roles.companyAdmin');
      case 'logistics_manager':
        return t('roles.logisticsManager');
      case 'finance_manager':
        return t('roles.financeManager');
      case 'employee':
        return t('roles.employee');
      case 'driver':
        return t('roles.driver');
      default:
        return role;
    }
  };

  const getInvitationStatus = (invitation: CompanyInvitation) => {
    if (invitation.accepted_at) {
      return {
        label: t('settings.accepted'),
        color: 'bg-green-500'
      };
    }
    
    if (isPast(new Date(invitation.expires_at))) {
      return {
        label: t('settings.expired'),
        color: 'bg-red-500'
      };
    }
    
    return {
      label: t('settings.pending'),
      color: 'bg-yellow-500'
    };
  };

  if (loading) {
    return <div className="flex justify-center py-4">{t('loading')}</div>;
  }

  if (invitations.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">{t('settings.noInvitations')}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('settings.email')}</TableHead>
          <TableHead>{t('settings.role')}</TableHead>
          <TableHead>{t('settings.status')}</TableHead>
          <TableHead>{t('settings.sentAt')}</TableHead>
          <TableHead>{t('settings.expiresAt')}</TableHead>
          <TableHead className="text-right">{t('settings.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const status = getInvitationStatus(invitation);
          const isAccepted = !!invitation.accepted_at;
          const isExpired = isPast(new Date(invitation.expires_at));
          const isActive = !isAccepted && !isExpired;
          
          return (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>{getRoleTranslation(invitation.role)}</TableCell>
              <TableCell>
                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </TableCell>
              <TableCell>
                {invitation.invited_at 
                  ? formatDistanceToNow(new Date(invitation.invited_at), { addSuffix: true })
                  : '-'}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {isActive && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(invitation)}
                            >
                              {copyTimeouts[invitation.id] ? (
                                <span className="text-green-500 text-xs">✓</span>
                              ) : (
                                <UserPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t('settings.copyInvitationLink')}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResendInvitation(invitation)}
                        title={t('settings.resendInvitation')}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvitation(invitation.id)}
                        title={t('settings.deleteInvitation')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default InvitationsList;
