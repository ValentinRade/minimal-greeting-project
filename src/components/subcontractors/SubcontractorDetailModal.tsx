
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubcontractorSearchResult } from '@/hooks/useSubcontractorSearch';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Star,
  Truck,
  Users,
  Languages,
  Calendar,
  Award,
  MessageSquare
} from 'lucide-react';

interface SubcontractorDetailModalProps {
  subcontractor: SubcontractorSearchResult | undefined;
  open: boolean;
  onClose: () => void;
}

const SubcontractorDetailModal: React.FC<SubcontractorDetailModalProps> = ({
  subcontractor,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!subcontractor) return null;

  // Function to render star rating
  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground text-sm ml-1">
          ({subcontractor.total_ratings})
        </span>
      </div>
    );
  };

  // Handle profile navigation
  const goToProfile = () => {
    // Navigate to the subcontractor's public profile
    navigate(`/public/profile/${subcontractor.company_id}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subcontractor.company_name}</DialogTitle>
        </DialogHeader>
        
        {/* Location and rating */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-2">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {subcontractor.city}, {subcontractor.country}
            </span>
          </div>
          {renderRating(subcontractor.avg_rating)}
        </div>
        
        {/* Key stats */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div className="flex items-center">
            <Truck className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">{t('common.vehicles')}</div>
              <div className="font-medium">{subcontractor.total_vehicles}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">{t('common.team')}</div>
              <div className="font-medium">{subcontractor.total_employees}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Languages className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">{t('common.languages')}</div>
              <div className="font-medium">
                {subcontractor.languages && subcontractor.languages.length > 0
                  ? subcontractor.languages
                      .slice(0, 2)
                      .map((lang) => t(`languages.${lang}`))
                      .join(', ') +
                    (subcontractor.languages.length > 2
                      ? ` +${subcontractor.languages.length - 2}`
                      : '')
                  : t('common.notSpecified')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">{t('common.availability')}</div>
              <div className="font-medium">
                {t(`availability.${subcontractor.availability_type}`)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Specializations */}
        {subcontractor.specializations && subcontractor.specializations.length > 0 && (
          <div className="py-3">
            <h4 className="text-sm font-medium mb-2">{t('common.specializations')}</h4>
            <div className="flex flex-wrap gap-1">
              {subcontractor.specializations.map((spec, index) => (
                <Badge key={index} className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Service regions */}
        {subcontractor.service_regions && subcontractor.service_regions.length > 0 && (
          <div className="py-3">
            <h4 className="text-sm font-medium mb-2">{t('common.serviceRegions')}</h4>
            <div className="flex flex-wrap gap-1">
              {subcontractor.service_regions.map((region, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Vehicle types & body types */}
        <div className="py-3 grid grid-cols-2 gap-6">
          {/* Vehicle types */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t('common.vehicleTypes')}</h4>
            <div className="flex flex-wrap gap-1">
              {subcontractor.vehicle_types && subcontractor.vehicle_types.length > 0 ? (
                subcontractor.vehicle_types.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t('common.notSpecified')}
                </span>
              )}
            </div>
          </div>
          
          {/* Body types */}
          <div>
            <h4 className="text-sm font-medium mb-2">{t('common.bodyTypes')}</h4>
            <div className="flex flex-wrap gap-1">
              {subcontractor.body_types && subcontractor.body_types.length > 0 ? (
                subcontractor.body_types.map((type, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {t(`bodyTypes.${type}`)}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  {t('common.notSpecified')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Certificates */}
        {(subcontractor.has_adr_certificate || 
          subcontractor.has_eu_license || 
          subcontractor.has_gdp || 
          subcontractor.has_other_certificates) && (
          <div className="py-3">
            <h4 className="text-sm font-medium mb-2">{t('common.certificates')}</h4>
            <div className="flex flex-wrap gap-1">
              {subcontractor.has_adr_certificate && (
                <div className="flex items-center border rounded-md px-2 py-1 text-xs">
                  <Award className="h-3 w-3 mr-1 text-amber-500" />
                  ADR
                </div>
              )}
              {subcontractor.has_eu_license && (
                <div className="flex items-center border rounded-md px-2 py-1 text-xs">
                  <Award className="h-3 w-3 mr-1 text-blue-500" />
                  {t('certificates.euLicense')}
                </div>
              )}
              {subcontractor.has_gdp && (
                <div className="flex items-center border rounded-md px-2 py-1 text-xs">
                  <Award className="h-3 w-3 mr-1 text-purple-500" />
                  GDP
                </div>
              )}
              {subcontractor.has_other_certificates && (
                <div className="flex items-center border rounded-md px-2 py-1 text-xs">
                  <Award className="h-3 w-3 mr-1 text-gray-500" />
                  {t('certificates.other')}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Special capabilities */}
        {(subcontractor.has_dangerous_goods_capability ||
          subcontractor.has_temperature_control ||
          subcontractor.has_express_capability) && (
          <div className="py-3">
            <h4 className="text-sm font-medium mb-2">{t('common.capabilities')}</h4>
            <div className="flex flex-wrap gap-1">
              {subcontractor.has_dangerous_goods_capability && (
                <Badge variant="outline" className="text-xs bg-orange-50">
                  {t('capabilities.dangerousGoods')}
                </Badge>
              )}
              {subcontractor.has_temperature_control && (
                <Badge variant="outline" className="text-xs bg-blue-50">
                  {t('capabilities.temperatureControl')}
                </Badge>
              )}
              {subcontractor.has_express_capability && (
                <Badge variant="outline" className="text-xs bg-green-50">
                  {t('capabilities.express')}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">{t('common.close')}</Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('common.contact')}
            </Button>
            <Button onClick={goToProfile}>
              {t('common.viewProfile')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubcontractorDetailModal;
