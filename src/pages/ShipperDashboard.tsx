
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Users } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const ShipperDashboard = () => {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">{t('dashboard.shipments')}</CardTitle>
              <Package className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeShipments')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">{t('dashboard.contractors')}</CardTitle>
              <Truck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">7</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeContractors')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">{t('dashboard.customers')}</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeCustomers')}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('dashboard.shipmentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentShipments')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">SHP-{2023000 + item}</p>
                    <p className="text-sm text-gray-500">Berlin → Hamburg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{t('dashboard.inTransit')}</p>
                    <p className="text-sm text-gray-500">ETA: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">{t('dashboard.viewAllShipments')}</Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ShipperDashboard;
