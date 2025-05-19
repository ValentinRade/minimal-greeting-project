
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Package, Truck, Users, Settings, Home, FileCheck, Heart, Route, Globe } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

const SubcontractorSidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      icon: Home, 
      label: t('dashboard.overview'), 
      path: '/dashboard/subcontractor' 
    },
    { 
      icon: Route, 
      label: t('dashboard.tours'), 
      path: '/dashboard/subcontractor/tours' 
    },
    { 
      icon: Truck, 
      label: t('dashboard.vehicles'), 
      path: '/dashboard/subcontractor/vehicles' 
    },
    { 
      icon: Users, 
      label: t('dashboard.employees'), 
      path: '/dashboard/subcontractor/employees' 
    },
    { 
      icon: Users, 
      label: t('dashboard.drivers'), 
      path: '/dashboard/subcontractor/drivers' 
    },
    {
      icon: Heart,
      label: t('dashboard.preferences'),
      path: '/dashboard/subcontractor/preferences'
    },
    {
      icon: FileCheck,
      label: t('dashboard.selectionCriteria'),
      path: '/dashboard/subcontractor/selection'
    },
    {
      icon: Globe,
      label: t('publicProfile.navTitle'),
      path: '/dashboard/subcontractor/public-profile'
    },
    { 
      icon: Settings, 
      label: t('profile.settings'), 
      path: '/dashboard/subcontractor/settings' 
    }
  ];

  // Helper function to check if a path is active
  const isPathActive = (path: string) => {
    // For exact matches
    if (location.pathname === path) return true;
    
    // For nested pages that should keep parent menu item active
    if (path !== '/dashboard/subcontractor/settings' && 
        location.pathname.startsWith(path)) {
      return true;
    }
    
    // For settings path to be active when on settings pages
    if (path === '/dashboard/subcontractor/settings' && 
        location.pathname.startsWith(path + '/')) {
      return true;
    }
    
    return false;
  };

  // Handle menu item click
  const handleMenuItemClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center px-2">
          <div className="text-xl font-bold text-blue-600">
            <img 
              src="/lovable-uploads/e1e17d41-ee90-43a7-9385-0f9c70f85639.png" 
              alt={t('common.appName')} 
              className="h-12 w-auto" 
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('dashboard.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={isPathActive(item.path)}
                    onClick={handleMenuItemClick(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-2">
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t('common.appName')}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SubcontractorSidebar;
