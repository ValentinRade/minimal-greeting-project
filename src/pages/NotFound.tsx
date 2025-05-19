import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card-modern p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-primary">{t('ui.pageNotFound.title')}</h1>
          <p className="text-xl text-gray-600 mb-8">{t('ui.pageNotFound.message')}</p>
          <Button asChild className="btn-modern bg-gradient-primary">
            <a href="/" className="inline-flex items-center gap-2">
              <ChevronLeft size={16} />
              {t('ui.pageNotFound.backToHome')}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
