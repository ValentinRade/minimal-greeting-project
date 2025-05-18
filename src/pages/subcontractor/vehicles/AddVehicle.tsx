
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VehicleForm from '@/components/vehicles/VehicleForm';

const AddVehicle = () => {
  const { t } = useTranslation();

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
          <h1 className="text-3xl font-bold">{t('vehicles.addNew')}</h1>
          <p className="text-muted-foreground">
            {t('vehicles.description')}
          </p>
        </div>
      </div>

      <VehicleForm />
    </div>
  );
};

export default AddVehicle;
