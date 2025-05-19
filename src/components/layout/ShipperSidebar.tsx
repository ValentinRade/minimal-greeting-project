
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BoxIcon, TruckIcon, UserIcon, SettingsIcon, SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ShipperSidebar = () => {
  const { t } = useTranslation();

  const links = [
    {
      title: t('navigation.dashboard'),
      href: '/dashboard/shipper',
      icon: HomeIcon
    },
    {
      title: t('navigation.tours'),
      href: '/dashboard/shipper/tours',
      icon: BoxIcon
    },
    {
      title: t('subcontractors.findSubcontractors'),
      href: '/dashboard/shipper/subcontractors',
      icon: SearchIcon
    },
    {
      title: t('navigation.drivers'),
      href: '/dashboard/shipper/drivers',
      icon: TruckIcon
    },
    {
      title: t('navigation.customers'),
      href: '/dashboard/shipper/customers',
      icon: UserIcon
    },
    {
      title: t('navigation.settings'),
      href: '/dashboard/settings',
      icon: SettingsIcon
    }
  ];

  return (
    <nav className="space-y-1 px-2">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          end={link.href === '/dashboard/shipper'}
          className={({ isActive }) => 
            cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <link.icon className="mr-3 h-5 w-5" />
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default ShipperSidebar;
