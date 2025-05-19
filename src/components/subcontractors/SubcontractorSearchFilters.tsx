
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SubcontractorFilters } from '@/hooks/useSubcontractorSearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, Filter } from 'lucide-react';

interface SubcontractorSearchFiltersProps {
  filters: SubcontractorFilters;
  updateFilters: (filters: Partial<SubcontractorFilters>) => void;
  resetFilters: () => void;
}

const SubcontractorSearchFilters: React.FC<SubcontractorSearchFiltersProps> = ({
  filters,
  updateFilters,
  resetFilters,
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(filters.searchText || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Update search text with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ searchText });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchText, updateFilters]);

  // Count active filters (excluding search text)
  const countActiveFilters = () => {
    let count = 0;
    if (filters.region && filters.region.length > 0) count++;
    if (filters.vehicleTypes && filters.vehicleTypes.length > 0) count++;
    if (filters.bodyTypes && filters.bodyTypes.length > 0) count++;
    if (filters.languages && filters.languages.length > 0) count++;
    if (filters.specializations && filters.specializations.length > 0) count++;
    if (filters.serviceRegions && filters.serviceRegions.length > 0) count++;
    if (filters.availability) count++;
    if (filters.minRating) count++;
    if (filters.certificates) {
      if (filters.certificates.adr) count++;
      if (filters.certificates.eu) count++;
      if (filters.certificates.gdp) count++;
      if (filters.certificates.other) count++;
    }
    return count;
  };

  const activeFilterCount = countActiveFilters();

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('subcontractors.searchPlaceholder')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchText && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setSearchText('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Filter button */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('filters.filter')}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 md:w-96 p-0" align="start">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t('filters.filter')}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetFilters();
                    setSearchText('');
                  }}
                >
                  {t('filters.clearAll')}
                </Button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-auto p-0">
              <Accordion type="multiple" className="w-full">
                {/* Region filter */}
                <AccordionItem value="region">
                  <AccordionTrigger className="px-4">
                    {t('filters.region')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2">
                      {['Deutschland', 'Österreich', 'Schweiz', 'BENELUX'].map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region}`}
                            checked={(filters.region || []).includes(region)}
                            onCheckedChange={(checked) => {
                              const currentRegions = filters.region || [];
                              updateFilters({
                                region: checked
                                  ? [...currentRegions, region]
                                  : currentRegions.filter((r) => r !== region),
                              });
                            }}
                          />
                          <label
                            htmlFor={`region-${region}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {region}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Vehicle Types filter */}
                <AccordionItem value="vehicleTypes">
                  <AccordionTrigger className="px-4">
                    {t('filters.vehicleTypes')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2">
                      {['Sprinter', '3.5t', '7.5t', '12t', '40t'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`vehicle-${type}`}
                            checked={(filters.vehicleTypes || []).includes(type)}
                            onCheckedChange={(checked) => {
                              const currentTypes = filters.vehicleTypes || [];
                              updateFilters({
                                vehicleTypes: checked
                                  ? [...currentTypes, type]
                                  : currentTypes.filter((t) => t !== type),
                              });
                            }}
                          />
                          <label
                            htmlFor={`vehicle-${type}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Body Types filter */}
                <AccordionItem value="bodyTypes">
                  <AccordionTrigger className="px-4">
                    {t('filters.bodyTypes')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2">
                      {['box', 'curtain', 'refrigerated', 'tanker', 'flatbed', 'other'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`body-${type}`}
                            checked={(filters.bodyTypes || []).includes(type)}
                            onCheckedChange={(checked) => {
                              const currentTypes = filters.bodyTypes || [];
                              updateFilters({
                                bodyTypes: checked
                                  ? [...currentTypes, type]
                                  : currentTypes.filter((t) => t !== type),
                              });
                            }}
                          />
                          <label
                            htmlFor={`body-${type}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t(`bodyTypes.${type}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Languages filter */}
                <AccordionItem value="languages">
                  <AccordionTrigger className="px-4">
                    {t('filters.languages')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2">
                      {['german', 'english', 'french', 'italian', 'spanish'].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={(filters.languages || []).includes(lang)}
                            onCheckedChange={(checked) => {
                              const currentLangs = filters.languages || [];
                              updateFilters({
                                languages: checked
                                  ? [...currentLangs, lang]
                                  : currentLangs.filter((l) => l !== lang),
                              });
                            }}
                          />
                          <label
                            htmlFor={`lang-${lang}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t(`languages.${lang}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Specializations filter */}
                <AccordionItem value="specializations">
                  <AccordionTrigger className="px-4">
                    {t('filters.specializations')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2">
                      {['pharma', 'express', 'dangerous', 'valuable'].map((spec) => (
                        <div key={spec} className="flex items-center space-x-2">
                          <Checkbox
                            id={`spec-${spec}`}
                            checked={(filters.specializations || []).includes(spec)}
                            onCheckedChange={(checked) => {
                              const currentSpecs = filters.specializations || [];
                              updateFilters({
                                specializations: checked
                                  ? [...currentSpecs, spec]
                                  : currentSpecs.filter((s) => s !== spec),
                              });
                            }}
                          />
                          <label
                            htmlFor={`spec-${spec}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t(`specializations.${spec}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Availability filter */}
                <AccordionItem value="availability">
                  <AccordionTrigger className="px-4">
                    {t('filters.availability')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <Select
                      value={filters.availability || ""}
                      onValueChange={(value) => 
                        updateFilters({ 
                          availability: value ? (value as 'immediate' | 'scheduled') : null 
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('filters.selectAvailability')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {t('filters.any')}
                        </SelectItem>
                        <SelectItem value="immediate">
                          {t('availability.immediate')}
                        </SelectItem>
                        <SelectItem value="scheduled">
                          {t('availability.scheduled')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                {/* Rating filter */}
                <AccordionItem value="rating">
                  <AccordionTrigger className="px-4">
                    {t('filters.rating')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <Select
                      value={filters.minRating?.toString() || ""}
                      onValueChange={(value) => 
                        updateFilters({ 
                          minRating: value ? parseInt(value, 10) : undefined
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('filters.selectRating')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {t('filters.any')}
                        </SelectItem>
                        <SelectItem value="3">3+ {t('common.stars')}</SelectItem>
                        <SelectItem value="4">4+ {t('common.stars')}</SelectItem>
                        <SelectItem value="5">5 {t('common.stars')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                {/* Certificates filter */}
                <AccordionItem value="certificates">
                  <AccordionTrigger className="px-4">
                    {t('filters.certificates')}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2 pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cert-adr"
                          checked={!!filters.certificates?.adr}
                          onCheckedChange={(checked) => {
                            updateFilters({
                              certificates: {
                                ...filters.certificates,
                                adr: !!checked
                              }
                            });
                          }}
                        />
                        <label
                          htmlFor="cert-adr"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('certificates.adr')}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cert-eu"
                          checked={!!filters.certificates?.eu}
                          onCheckedChange={(checked) => {
                            updateFilters({
                              certificates: {
                                ...filters.certificates,
                                eu: !!checked
                              }
                            });
                          }}
                        />
                        <label
                          htmlFor="cert-eu"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('certificates.euLicense')}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cert-gdp"
                          checked={!!filters.certificates?.gdp}
                          onCheckedChange={(checked) => {
                            updateFilters({
                              certificates: {
                                ...filters.certificates,
                                gdp: !!checked
                              }
                            });
                          }}
                        />
                        <label
                          htmlFor="cert-gdp"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('certificates.gdp')}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cert-other"
                          checked={!!filters.certificates?.other}
                          onCheckedChange={(checked) => {
                            updateFilters({
                              certificates: {
                                ...filters.certificates,
                                other: !!checked
                              }
                            });
                          }}
                        />
                        <label
                          htmlFor="cert-other"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('certificates.other')}
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="p-4 border-t">
              <Button 
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                {t('common.apply')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active filter badges */}
        <div className="flex flex-wrap gap-2">
          {filters.region?.map((region) => (
            <Badge key={region} variant="secondary" className="flex items-center gap-1">
              {region}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  updateFilters({
                    region: filters.region?.filter((r) => r !== region),
                  })
                }
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubcontractorSearchFilters;
