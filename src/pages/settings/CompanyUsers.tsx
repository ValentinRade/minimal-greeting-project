
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
import { Shield, UserPlus, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

interface CompanyUser {
  id: string;
  company_id: string;
  user_id: string;
  role: string;
  invited_at: string | null;
  accepted_at: string | null;
  email?: string;
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

const CompanyUsers = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddUserSheetOpen, setIsAddUserSheetOpen] = useState(false);
  
  useEffect(() => {
    if (company) {
      fetchCompanyUsers();
    }
  }, [company]);
  
  const fetchCompanyUsers = async () => {
    try {
      setLoading(true);
      
      // 1. Get company users data
      const { data: companyUsersData, error: companyUsersError } = await supabase
        .from('company_users')
        .select(`
          id,
          company_id,
          user_id,
          role,
          invited_at,
          accepted_at
        `)
        .eq('company_id', company?.id);
      
      if (companyUsersError) throw companyUsersError;
      
      console.log('Raw company users data:', companyUsersData);
      
      if (!companyUsersData || companyUsersData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // 2. Get all user IDs from the results to use in subsequent queries
      const userIds = companyUsersData.map(user => user.user_id);
      
      // 3. Fetch profiles data for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue with processing the data we have
      }
      
      // Create a profiles map
      const profilesMap = new Map();
      if (profilesData && Array.isArray(profilesData)) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // 4. Use our PostgreSQL function to fetch user emails
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_user_emails', { user_ids: userIds });
        
      if (emailError) {
        console.error('Error fetching user emails:', emailError);
        // Continue with processing the data we have
      } else {
        console.log('Email data:', emailData);
      }
      
      // Map emails to users
      const emailMap = new Map();
      if (emailData && Array.isArray(emailData)) {
        emailData.forEach((item: { user_id: string, email: string }) => {
          emailMap.set(item.user_id, item.email);
        });
      }
      
      // 5. Combine all the data
      const formattedUsers = companyUsersData.map(user => {
        return {
          ...user,
          email: emailMap.get(user.user_id) || '',
          profile: profilesMap.get(user.user_id) || {}
        };
      });
      
      console.log('Formatted users:', formattedUsers);
      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching company users:', error.message);
      toast({
        title: t('settings.fetchError'),
        description: error.message,
        variant: 'destructive'
      });
      setUsers([]);
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
  
  const handleRefresh = () => {
    fetchCompanyUsers();
  };
  
  // Return placeholder if company is not loaded
  if (!company) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('settings.users')}</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? t('loading') : t('settings.refresh')}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsAddUserSheetOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            {t('settings.inviteUser')}
          </Button>
        </div>
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
            <div className="overflow-x-auto">
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
                    const profile = userItem.profile || {};
                    const email = userItem.email || '';
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
                            : <Badge variant="outline">{t('settings.pending')}</Badge>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Sheet */}
      <Sheet open={isAddUserSheetOpen} onOpenChange={setIsAddUserSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('settings.inviteUser')}</SheetTitle>
            <SheetDescription>{t('settings.inviteUserDesc')}</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {/* Add user form would go here */}
            <p className="text-sm text-muted-foreground">
              {t('settings.inviteUserDesc')}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CompanyUsers;
