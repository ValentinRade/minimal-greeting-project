
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Building2, 
  Users, 
  UserPlus, 
  Shield
} from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SettingsSidebar = () => {
  const { t } = useTranslation();
  const { company, hasCompany, user } = useAuth();
  const isCompanyAdmin = company?.role === 'company_admin';
  const isSubcontractor = company?.company_type_id === 1;
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted"
    );

  return (
    <Card className="lg:w-64 mb-6 lg:mb-0 lg:mr-6 shrink-0">
      <CardHeader>
        <CardTitle>{t('settings.title')}</CardTitle>
        <CardDescription>{t('settings.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="flex flex-col gap-1 px-2 pb-4">
          {/* Personal settings */}
          <div className="px-3 pt-4 pb-1">
            <h3 className="text-xs font-medium text-muted-foreground">{t('settings.personalSettings')}</h3>
          </div>
          <NavLink 
            to={isSubcontractor ? "/dashboard/subcontractor/settings/profile" : "/dashboard/shipper/settings/profile"} 
            className={navLinkClass}
          >
            <User className="h-4 w-4" />
            <span>{t('settings.profile')}</span>
          </NavLink>
          
          {/* Company settings - visible only for company admins */}
          {hasCompany && isCompanyAdmin && (
            <>
              <div className="px-3 pt-4 pb-1">
                <h3 className="text-xs font-medium text-muted-foreground">{t('settings.companySettings')}</h3>
              </div>
              <NavLink 
                to={isSubcontractor ? "/dashboard/subcontractor/settings/company" : "/dashboard/shipper/settings/company"} 
                className={navLinkClass}
              >
                <Building2 className="h-4 w-4" />
                <span>{t('settings.companyProfile')}</span>
              </NavLink>
              <NavLink 
                to={isSubcontractor ? "/dashboard/subcontractor/settings/users" : "/dashboard/shipper/settings/users"} 
                className={navLinkClass}
              >
                <Users className="h-4 w-4" />
                <span>{t('settings.users')}</span>
              </NavLink>
              <NavLink 
                to={isSubcontractor ? "/dashboard/subcontractor/settings/invitations" : "/dashboard/shipper/settings/invitations"} 
                className={navLinkClass}
              >
                <UserPlus className="h-4 w-4" />
                <span>{t('settings.invitations')}</span>
              </NavLink>
              <NavLink 
                to={isSubcontractor ? "/dashboard/subcontractor/settings/roles" : "/dashboard/shipper/settings/roles"} 
                className={navLinkClass}
              >
                <Shield className="h-4 w-4" />
                <span>{t('settings.roles')}</span>
              </NavLink>
            </>
          )}
        </nav>
      </CardContent>
    </Card>
  );
};

export default SettingsSidebar;
