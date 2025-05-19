
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const SubcontractorHeader: React.FC = () => {
  const { company, signOut, profile } = useAuth();
  const { t } = useTranslation();
  
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-4">
        <LanguageSelector currentLanguage={profile?.language || 'Deutsch'} />
        
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">{t('dashboard.notifications')}</h4>
              <div className="text-center py-6 text-muted-foreground">
                {t('dashboard.noNotifications')}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <User size={16} />
          </div>
          <span className="hidden text-sm font-medium md:block">
            {company?.name || t('dashboard.companyName')}
          </span>
        </div>
        
        <Button variant="outline" size="sm" onClick={signOut}>
          {t('profile.logOut')}
        </Button>
      </div>
    </header>
  );
};

export default SubcontractorHeader;
