
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import VehicleForm from '@/components/vehicles/VehicleForm';

const EditVehicle = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { company } = useAuth();
  const navigate = useNavigate();

  const fetchVehicleDetails = async () => {
    if (!id || !company) {
      return null;
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .eq('company_id', company.id)
      .single();

    if (error) {
      console.error('Error fetching vehicle:', error);
      throw new Error(error.message);
    }

    return data;
  };

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', id, company?.id],
    queryFn: fetchVehicleDetails,
    enabled: !!id && !!company?.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium text-destructive">
          {t('common.error')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {(error as Error)?.message || t('vehicles.notFound')}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/dashboard/subcontractor/vehicles')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('vehicles.list')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8"
        >
          <Link to={`/dashboard/subcontractor/vehicles/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('vehicles.edit')}</h1>
          <p className="text-muted-foreground">
            {`${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})`}
          </p>
        </div>
      </div>

      <VehicleForm defaultValues={vehicle} vehicleId={id} isEditing={true} />
    </div>
  );
};

export default EditVehicle;
