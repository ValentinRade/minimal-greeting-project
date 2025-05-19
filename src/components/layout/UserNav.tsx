
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserNav: React.FC = () => {
  const { company, signOut, profile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    signOut();
  };
  
  const handleSettingsClick = () => {
    navigate('/dashboard/settings');
  };
  
  // Get initials for avatar
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return company?.name ? company.name.substring(0, 2).toUpperCase() : 'U';
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:block">
            {company?.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{company?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('profile.settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('profile.logOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
