
import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, FileCheck, TrendingUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectionCriteriaLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted"
    );

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row w-full">
        <Card className="lg:w-64 mb-6 lg:mb-0 lg:mr-6 shrink-0">
          <CardHeader>
            <CardTitle>{t('selection.title')}</CardTitle>
            <CardDescription>{t('selection.description')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col gap-1 px-2 pb-4">
              <div className="px-3 pt-4 pb-1">
                <h3 className="text-xs font-medium text-muted-foreground">{t('selection.categories')}</h3>
              </div>
              <NavLink 
                to="/dashboard/subcontractor/selection/preferences"
                className={navLinkClass}
              >
                <Heart className="h-4 w-4" />
                <span>{t('selection.preferences')}</span>
              </NavLink>
              <NavLink 
                to="/dashboard/subcontractor/selection/prequalifications"
                className={navLinkClass}
              >
                <FileCheck className="h-4 w-4" />
                <span>{t('selection.prequalifications')}</span>
              </NavLink>
              <NavLink 
                to="/dashboard/subcontractor/selection/references"
                className={navLinkClass}
              >
                <FileText className="h-4 w-4" />
                <span>{t('selection.references')}</span>
              </NavLink>
              <NavLink 
                to="/dashboard/subcontractor/selection/ranking"
                className={navLinkClass}
              >
                <TrendingUp className="h-4 w-4" />
                <span>{t('selection.ranking')}</span>
              </NavLink>
            </nav>
          </CardContent>
        </Card>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
};

export default SelectionCriteriaLayout;
