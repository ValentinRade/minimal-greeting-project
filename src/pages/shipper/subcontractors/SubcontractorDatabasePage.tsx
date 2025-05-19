
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubcontractorSearch } from '@/hooks/useSubcontractorSearch';
import SubcontractorSearchFilters from '@/components/subcontractors/SubcontractorSearchFilters';
import SubcontractorList from '@/components/subcontractors/SubcontractorList';
import SubcontractorMap from '@/components/subcontractors/SubcontractorMap';
import { Button } from '@/components/ui/button';
import { MapIcon, ListIcon } from 'lucide-react';

// View mode type
type ViewMode = 'list' | 'map';

const SubcontractorDatabasePage: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const {
    subcontractors,
    isLoading,
    isError,
    filters,
    updateFilters,
    resetFilters
  } = useSubcontractorSearch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('subcontractors.find')}</h1>
          <p className="text-muted-foreground">{t('subcontractors.findDescription')}</p>
        </div>
        
        {/* View toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            {t('common.listView')}
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="mr-2 h-4 w-4" />
            {t('common.mapView')}
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <SubcontractorSearchFilters 
        filters={filters} 
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />

      {/* Results display */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center">
          <p className="text-destructive">{t('errors.loadFailed')}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {t('common.refresh')}
          </Button>
        </div>
      ) : (
        <>
          {/* Show appropriate view */}
          {viewMode === 'list' ? (
            <SubcontractorList subcontractors={subcontractors} />
          ) : (
            <SubcontractorMap subcontractors={subcontractors} />
          )}

          {/* No results state */}
          {subcontractors.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{t('subcontractors.noResults')}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={resetFilters}
              >
                {t('filters.clearAll')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubcontractorDatabasePage;
