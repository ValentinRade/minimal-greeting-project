
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
} from "@/components/ui/popover";

const ShipperHeader: React.FC = () => {
  const { company, signOut, profile } = useAuth();
  const { t } = useTranslation();
  
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              <span className="sr-only">Benachrichtigungen</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Benachrichtigungen</h4>
                <Button variant="ghost" size="sm">Alle markieren</Button>
              </div>
              <div className="h-[200px] flex flex-col items-center justify-center text-sm text-muted-foreground">
                <p>Keine neuen Benachrichtigungen</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <LanguageSelector currentLanguage={profile?.language || 'Deutsch'} />
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <User size={16} />
          </div>
          <span className="hidden text-sm font-medium md:block">
            {company?.name || 'Unternehmen'}
          </span>
        </div>
        
        <Button variant="outline" size="sm" onClick={signOut}>
          {t('profile.logOut')}
        </Button>
      </div>
    </header>
  );
};

export default ShipperHeader;
