
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { VehicleFormData } from '@/components/vehicles/VehicleForm';

const EditVehicle: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { company } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState<VehicleFormData | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id || !company) return;

      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .eq('company_id', company.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          // Convert JSON fields to plain objects to match VehicleFormData type
          const formattedData = {
            ...data,
            financing_details: data.financing_details ? 
              (typeof data.financing_details === 'string' ? 
                JSON.parse(data.financing_details) : data.financing_details) : {},
            operational_costs: data.operational_costs ? 
              (typeof data.operational_costs === 'string' ? 
                JSON.parse(data.operational_costs) : data.operational_costs) : {},
            availability_schedule: data.availability_schedule ? 
              (typeof data.availability_schedule === 'string' ? 
                JSON.parse(data.availability_schedule) : data.availability_schedule) : {},
          };
          
          setVehicleData(formattedData as VehicleFormData);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error(t('vehicles.errorFetchingVehicle'));
        navigate('/dashboard/subcontractor/vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, company, navigate, t]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8"
        >
          <Link to="/dashboard/subcontractor/vehicles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('vehicles.edit')}</h1>
          <p className="text-muted-foreground">
            {t('vehicles.editDescription')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        vehicleData ? (
          <VehicleForm defaultValues={vehicleData} vehicleId={id} isEditing />
        ) : (
          <div className="text-center py-8">
            <p>{t('vehicles.vehicleNotFound')}</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/dashboard/subcontractor/vehicles')}
            >
              {t('common.back')}
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default EditVehicle;
