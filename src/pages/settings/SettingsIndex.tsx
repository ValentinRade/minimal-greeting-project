
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  User, 
  Building2, 
  Users, 
  UserPlus,
  Shield
} from 'lucide-react';

const SettingsIndex = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  
  const isCompanyAdmin = company?.role === 'company_admin';
  const isSubcontractor = company?.company_type_id === 1;
  const basePath = isSubcontractor ? '/dashboard/subcontractor/settings' : '/dashboard/shipper/settings';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>
      <p className="text-muted-foreground mb-8">{t('settings.description')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <User className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>{t('settings.profile')}</CardTitle>
              <CardDescription>{t('settings.profileDescription')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link 
              to={`${basePath}/profile`}
              className="text-sm text-primary hover:underline"
            >
              {t('settings.manageProfile')} →
            </Link>
          </CardContent>
        </Card>
        
        {isCompanyAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{t('settings.companyProfile')}</CardTitle>
                  <CardDescription>{t('settings.companyProfileDescription')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`${basePath}/company`}
                  className="text-sm text-primary hover:underline"
                >
                  {t('settings.manageCompany')} →
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{t('settings.users')}</CardTitle>
                  <CardDescription>{t('settings.usersDescription')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`${basePath}/users`}
                  className="text-sm text-primary hover:underline"
                >
                  {t('settings.manageUsers')} →
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <UserPlus className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{t('settings.invitations')}</CardTitle>
                  <CardDescription>{t('settings.invitationsDescription')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`${basePath}/invitations`}
                  className="text-sm text-primary hover:underline"
                >
                  {t('settings.manageInvitations')} →
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{t('settings.roles')}</CardTitle>
                  <CardDescription>{t('settings.rolesDescription')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link 
                  to={`${basePath}/roles`}
                  className="text-sm text-primary hover:underline"
                >
                  {t('settings.viewRolesInfo')} →
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsIndex;
