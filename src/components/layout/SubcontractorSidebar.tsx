
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { Package, Truck, Users, Settings, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
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
  
  const menuItems = [
    { 
      icon: Home, 
      label: t('dashboard.overview'), 
      path: '/dashboard/subcontractor' 
    },
    { 
      icon: Package, 
      label: t('dashboard.assignments'), 
      path: '/dashboard/subcontractor/assignments' 
    },
    { 
      icon: Truck, 
      label: t('dashboard.vehicles'), 
      path: '/dashboard/subcontractor/vehicles' 
    },
    { 
      icon: Users, 
      label: t('dashboard.drivers'), 
      path: '/dashboard/subcontractor/drivers' 
    },
    { 
      icon: Settings, 
      label: t('profile.settings'), 
      path: '/dashboard/subcontractor/settings' 
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center px-2">
          <div className="text-xl font-bold text-blue-600">
            <img 
              src="/lovable-uploads/e1e17d41-ee90-43a7-9385-0f9c70f85639.png" 
              alt="CARRINEX" 
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
                    isActive={location.pathname === item.path}
                    asChild
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-2">
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} CARRINEX
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SubcontractorSidebar;
