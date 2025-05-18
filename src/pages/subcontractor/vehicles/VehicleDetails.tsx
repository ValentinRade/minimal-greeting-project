
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Edit, ArrowLeft, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const VehicleDetails = () => {
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
      .select(`
        *,
        vehicle_type:vehicle_type_id(name),
        body_type:body_type_id(name),
        financing_type:financing_type_id(name)
      `)
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium text-destructive">
          {t('common.error')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {(error as Error).message}
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

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium">{t('common.notFound')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('vehicles.notFound')}
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/subcontractor/vehicles')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </h1>
            <p className="text-muted-foreground">
              {vehicle.license_plate} - {vehicle.vehicle_type?.name || ''}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/dashboard/subcontractor/vehicles/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            {t('vehicles.edit')}
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="basics" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="basics">{t('vehicles.form.step1')}</TabsTrigger>
          <TabsTrigger value="technical">{t('vehicles.form.step2')}</TabsTrigger>
          <TabsTrigger value="maintenance">{t('vehicles.form.step3')}</TabsTrigger>
          <TabsTrigger value="costs">{t('vehicles.form.step4')}</TabsTrigger>
          <TabsTrigger value="additional">{t('vehicles.form.step5')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle>{t('vehicles.form.step1')}</CardTitle>
              <CardDescription>
                {t('vehicles.details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.vehicleType')}
                  </h3>
                  <p>{vehicle.vehicle_type?.name || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.bodyType')}
                  </h3>
                  <p>{vehicle.body_type?.name || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.brand')}
                  </h3>
                  <p>{vehicle.brand}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.model')}
                  </h3>
                  <p>{vehicle.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.year')}
                  </h3>
                  <p>{vehicle.year}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.fin')}
                  </h3>
                  <p>{vehicle.fin || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.licensePlate')}
                  </h3>
                  <p>{vehicle.license_plate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.totalWeight')}
                  </h3>
                  <p>{vehicle.total_weight ? `${vehicle.total_weight} kg` : '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.loadVolume')}
                  </h3>
                  <p>{vehicle.load_volume ? `${vehicle.load_volume} m³` : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>{t('vehicles.form.step2')}</CardTitle>
              <CardDescription>
                {t('vehicles.details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.enginePower')}
                  </h3>
                  <p>
                    {vehicle.engine_power 
                      ? `${vehicle.engine_power} ${vehicle.engine_power_unit || 'kW'}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.fuelConsumption')}
                  </h3>
                  <p>
                    {vehicle.fuel_consumption
                      ? `${vehicle.fuel_consumption} l/100km`
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.length')}
                  </h3>
                  <p>{vehicle.length ? `${vehicle.length} m` : '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.width')}
                  </h3>
                  <p>{vehicle.width ? `${vehicle.width} m` : '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.height')}
                  </h3>
                  <p>{vehicle.height ? `${vehicle.height} m` : '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.additionalTechInfo')}
                  </h3>
                  <p>{vehicle.additional_tech_info || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>{t('vehicles.form.step3')}</CardTitle>
              <CardDescription>
                {t('vehicles.details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.maintenanceInterval')}
                  </h3>
                  <p>
                    {vehicle.maintenance_interval
                      ? `${vehicle.maintenance_interval} km`
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.lastInspection')}
                  </h3>
                  <p>
                    {vehicle.last_inspection
                      ? new Date(vehicle.last_inspection).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.inspectionReport')}
                  </h3>
                  <p>
                    {vehicle.inspection_report_url ? (
                      <a
                        href={vehicle.inspection_report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {t('common.view')}
                      </a>
                    ) : (
                      '-'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>{t('vehicles.form.step4')}</CardTitle>
              <CardDescription>
                {t('vehicles.details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {t('vehicles.form.financingType')}
                </h3>
                <p>{vehicle.financing_type?.name || '-'}</p>
              </div>
              
              {vehicle.financing_details && Object.keys(vehicle.financing_details).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{t('vehicles.form.financingDetails')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(vehicle.financing_details).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground">{key}</p>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {vehicle.operational_costs && Object.keys(vehicle.operational_costs).length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">{t('vehicles.form.operationalCosts')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(vehicle.operational_costs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground">{key}</p>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>{t('vehicles.form.step5')}</CardTitle>
              <CardDescription>
                {t('vehicles.details')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicle.availability_schedule && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('vehicles.form.availability')}
                    </h3>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(vehicle.availability_schedule, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.location')}
                  </h3>
                  <p>{vehicle.location || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.driver')}
                  </h3>
                  <p>{vehicle.driver_id || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('vehicles.form.additionalInfo')}
                  </h3>
                  <p>{vehicle.additional_info || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetails;
