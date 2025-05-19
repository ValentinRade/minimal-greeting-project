
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubcontractorSearchResult } from '@/hooks/useSubcontractorSearch';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Star, Truck, MapPin, Users } from 'lucide-react';

interface SubcontractorCardProps {
  subcontractor: SubcontractorSearchResult;
  onClick: () => void;
}

const SubcontractorCard: React.FC<SubcontractorCardProps> = ({
  subcontractor,
  onClick,
}) => {
  const { t } = useTranslation();

  // Function to render star rating
  const renderRating = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
        <span>{rating.toFixed(1)}</span>
        <span className="text-muted-foreground text-xs ml-1">
          ({subcontractor.total_ratings})
        </span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{subcontractor.company_name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {subcontractor.city}, {subcontractor.country}
            </div>
          </div>
          {subcontractor.avg_rating && renderRating(subcontractor.avg_rating)}
        </div>
        
        {/* Key facts */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
          <div className="flex items-center">
            <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{t('subcontractors.vehicles', { count: subcontractor.total_vehicles })}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{t('subcontractors.employees', { count: subcontractor.total_employees })}</span>
          </div>
        </div>

        {/* Specializations & Certificates */}
        <div className="mt-4 space-y-2">
          {/* Specializations */}
          {subcontractor.specializations && subcontractor.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subcontractor.specializations.slice(0, 3).map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {subcontractor.specializations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{subcontractor.specializations.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Service Regions */}
          {subcontractor.service_regions && subcontractor.service_regions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subcontractor.service_regions.slice(0, 3).map((region, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {region}
                </Badge>
              ))}
              {subcontractor.service_regions.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{subcontractor.service_regions.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Certificates row */}
          {(subcontractor.has_adr_certificate || 
            subcontractor.has_eu_license || 
            subcontractor.has_gdp || 
            subcontractor.has_other_certificates) && (
              <div className="flex flex-wrap gap-1 mt-1">
                {subcontractor.has_adr_certificate && (
                  <Badge variant="outline" className="text-xs bg-green-50">
                    ADR
                  </Badge>
                )}
                {subcontractor.has_eu_license && (
                  <Badge variant="outline" className="text-xs bg-blue-50">
                    EU
                  </Badge>
                )}
                {subcontractor.has_gdp && (
                  <Badge variant="outline" className="text-xs bg-purple-50">
                    GDP
                  </Badge>
                )}
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between">
        <Button variant="ghost" size="sm">
          {t('common.contact')}
        </Button>
        <Button size="sm" onClick={onClick}>
          {t('common.viewDetails')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubcontractorCard;
