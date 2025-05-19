
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User } from 'lucide-react';

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
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <User size={16} />
          </div>
          <span className="hidden text-sm font-medium md:block">
            {company?.name}
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
