
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { Settings, Home, Contact, Database, FileText } from 'lucide-react';
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

const ShipperSidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: Home, 
      label: 'Übersicht', 
      path: '/dashboard/shipper' 
    },
    { 
      icon: Contact, 
      label: 'CRM', 
      path: '/dashboard/shipper/crm' 
    },
    { 
      icon: FileText, 
      label: 'Ausschreibungen', 
      path: '/dashboard/shipper/tenders' 
    },
    { 
      icon: Database, 
      label: 'Subunternehmerdatenbank', 
      path: '/dashboard/shipper/subcontractor-database' 
    },
    { 
      icon: Settings, 
      label: t('profile.settings'), 
      path: '/dashboard/shipper/settings' 
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center px-2">
          <div className="text-xl font-bold text-red-600">
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
                    isActive={location.pathname.startsWith(item.path)}
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

export default ShipperSidebar;
