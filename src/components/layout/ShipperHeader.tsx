
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import UserNav from './UserNav';

const ShipperHeader: React.FC = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default ShipperHeader;
