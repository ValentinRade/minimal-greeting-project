
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Shield } from 'lucide-react';

const CompanyUsers = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (company) {
      fetchCompanyUsers();
    }
  }, [company]);
  
  const fetchCompanyUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('company_users')
        .select(`
          *,
          user:user_id (
            id,
            email,
            profiles:profiles (
              first_name,
              last_name,
              phone
            )
          )
        `)
        .eq('company_id', company?.id)
        .order('role', { ascending: true });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: t('settings.fetchError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'company_admin':
        return 'bg-red-500';
      case 'logistics_manager':
        return 'bg-blue-500';
      case 'finance_manager':
        return 'bg-green-500';
      case 'employee':
        return 'bg-yellow-500';
      case 'driver':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
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
  
  // Return placeholder if company is not loaded
  if (!company) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('settings.users')}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.companyUsers')}</CardTitle>
          <CardDescription>{t('settings.companyUsersDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">{t('loading')}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">{t('settings.noUsers')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('settings.name')}</TableHead>
                  <TableHead>{t('settings.email')}</TableHead>
                  <TableHead>{t('settings.phone')}</TableHead>
                  <TableHead>{t('settings.role')}</TableHead>
                  <TableHead>{t('settings.joinedAt')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userItem) => {
                  const profile = userItem.user?.profiles?.[0] || {};
                  const email = userItem.user?.email || '';
                  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
                  
                  return (
                    <TableRow key={userItem.id}>
                      <TableCell>{fullName || email}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell>{profile.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(userItem.role)}>
                          {getRoleTranslation(userItem.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {userItem.accepted_at 
                          ? formatDistanceToNow(new Date(userItem.accepted_at), { addSuffix: true })
                          : t('settings.pending')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyUsers;
