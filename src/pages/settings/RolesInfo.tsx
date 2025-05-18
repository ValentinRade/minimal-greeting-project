
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, Check, X } from 'lucide-react';

const RolesInfo = () => {
  const { t } = useTranslation();
  const { company } = useAuth();
  
  const isSubcontractor = company?.company_type_id === 1;
  
  // Return placeholder if company is not loaded
  if (!company) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('settings.roles')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.rolesInfo')}</CardTitle>
          <CardDescription>{t('settings.rolesInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-500" />
                  {t('roles.companyAdmin')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t('roles.companyAdminDesc')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">{t('roles.permissions')}</div>
                    <ul className="space-y-1">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.companySettings')}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.manageUsers')}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.sendInvitations')}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.accessAllData')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  {t('roles.logisticsManager')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t('roles.logisticsManagerDesc')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">{t('roles.permissions')}</div>
                    <ul className="space-y-1">
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.companySettings')}
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.manageUsers')}
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.sendInvitations')}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.manageLogistics')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  {t('roles.financeManager')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t('roles.financeManagerDesc')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">{t('roles.permissions')}</div>
                    <ul className="space-y-1">
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.companySettings')}
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.manageUsers')}
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.sendInvitations')}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.manageFinances')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-yellow-500" />
                  {t('roles.employee')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t('roles.employeeDesc')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium">{t('roles.permissions')}</div>
                    <ul className="space-y-1">
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.companySettings')}
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.manageUsers')}
                      </li>
                      <li className="flex items-center text-sm">
                        <X className="h-4 w-4 mr-2 text-red-500" />
                        {t('roles.perm.sendInvitations')}
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        {t('roles.perm.basicAccess')}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {isSubcontractor && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-purple-500" />
                    {t('roles.driver')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{t('roles.driverDesc')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-medium">{t('roles.permissions')}</div>
                      <ul className="space-y-1">
                        <li className="flex items-center text-sm">
                          <X className="h-4 w-4 mr-2 text-red-500" />
                          {t('roles.perm.companySettings')}
                        </li>
                        <li className="flex items-center text-sm">
                          <X className="h-4 w-4 mr-2 text-red-500" />
                          {t('roles.perm.manageUsers')}
                        </li>
                        <li className="flex items-center text-sm">
                          <X className="h-4 w-4 mr-2 text-red-500" />
                          {t('roles.perm.sendInvitations')}
                        </li>
                        <li className="flex items-center text-sm">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          {t('roles.perm.accessDriverFeatures')}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesInfo;
