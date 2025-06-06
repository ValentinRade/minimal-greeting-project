
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Settings, FileText, Users, Route, Globe, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExtendedSubcontractorSidebar: React.FC<SidebarProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted"
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-xl flex items-center">
            <img
              src="/lovable-uploads/e1e17d41-ee90-43a7-9385-0f9c70f85639.png"
              alt={t('common.appName')}
              className="h-8 w-8 mr-2"
            />
            {t('common.appName')}
          </SheetTitle>
        </SheetHeader>
        <div className="px-3 py-4">
          <div className="mb-4">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground mb-2">
              {t('dashboard.navigation')}
            </h3>
            <nav className="space-y-1">
              <NavLink
                to="/dashboard/subcontractor"
                className={navLinkClass}
                end
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{t('dashboard.overview')}</span>
              </NavLink>
              <NavLink
                to="/dashboard/subcontractor/tours"
                className={navLinkClass}
              >
                <Route className="h-5 w-5" />
                <span>{t('dashboard.tours')}</span>
              </NavLink>
              <NavLink
                to="/dashboard/subcontractor/selection"
                className={navLinkClass}
              >
                <FileText className="h-5 w-5" />
                <span>{t('selection.title')}</span>
              </NavLink>
              <NavLink
                to="/dashboard/subcontractor/vehicles"
                className={navLinkClass}
              >
                <Truck className="h-5 w-5" />
                <span>{t('vehicles.title')}</span>
              </NavLink>
              <NavLink
                to="/dashboard/subcontractor/employees"
                className={navLinkClass}
              >
                <Users className="h-5 w-5" />
                <span>{t('employees.title')}</span>
              </NavLink>
              <NavLink
                to="/dashboard/subcontractor/preferences"
                className={navLinkClass}
              >
                <Heart className="h-5 w-5" />
                <span>{t('dashboard.preferences')}</span>
              </NavLink>
              <NavLink
                to="/dashboard/subcontractor/public-profile"
                className={navLinkClass}
              >
                <Globe className="h-5 w-5" />
                <span>{t('publicProfile.navTitle')}</span>
              </NavLink>
            </nav>
          </div>
          
          <div>
            <h3 className="px-4 text-xs font-semibold text-muted-foreground mb-2">
              {t('profile.settings')}
            </h3>
            <nav className="space-y-1">
              <NavLink
                to="/dashboard/subcontractor/settings"
                className={navLinkClass}
              >
                <Settings className="h-5 w-5" />
                <span>{t('profile.settings')}</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExtendedSubcontractorSidebar;
