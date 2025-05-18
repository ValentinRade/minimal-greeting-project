
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Users, ArrowRight, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const ShipperDashboard = () => {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t('dashboard.shipperWelcome')}</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.todayDate', { date: new Date().toLocaleDateString() })}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern bg-gradient-primary text-white border-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.shipments')}</CardTitle>
              <Package className="h-5 w-5 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">24</div>
              <p className="text-sm text-white/70">{t('dashboard.activeShipments')}</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.contractors')}</CardTitle>
              <Truck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">7</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeContractors')}</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.customers')}</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">15</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeCustomers')}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{t('dashboard.shipmentActivity')}</CardTitle>
                  <CardDescription>{t('dashboard.recentShipments')}</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
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
              <Button variant="outline" className="w-full btn-modern flex items-center justify-center gap-2">
                {t('dashboard.viewAllShipments')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{t('dashboard.performanceMetrics')}</CardTitle>
                  <CardDescription>{t('dashboard.monthlyOverview')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t('dashboard.deliveryRate')}</p>
                    <p className="text-sm font-medium">98%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t('dashboard.onTimeDelivery')}</p>
                    <p className="text-sm font-medium">87%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t('dashboard.customerSatisfaction')}</p>
                    <p className="text-sm font-medium">92%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShipperDashboard;
