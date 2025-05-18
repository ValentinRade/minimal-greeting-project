
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Users, ArrowRight, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const SubcontractorDashboard = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t('dashboard.subcontractorWelcome')}</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.todayDate', { date: new Date().toLocaleDateString() })}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern bg-gradient-primary text-white border-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.assignments')}</CardTitle>
              <Package className="h-5 w-5 text-white/70" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">8</div>
              <p className="text-sm text-white/70">{t('dashboard.activeAssignments')}</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.vehicles')}</CardTitle>
              <Truck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">5</div>
              <p className="text-sm text-gray-500">{t('dashboard.registeredVehicles')}</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.drivers')}</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">7</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeDrivers')}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{t('dashboard.transportActivity')}</CardTitle>
                  <CardDescription>{t('dashboard.recentTransports')}</CardDescription>
                </div>
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">TRA-{2023000 + item}</p>
                      <p className="text-sm text-gray-500">München → Stuttgart</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">{t('dashboard.assigned')}</p>
                      <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full btn-modern flex items-center justify-center gap-2">
                {t('dashboard.viewAllTransports')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">{t('dashboard.vehicleStatus')}</CardTitle>
                  <CardDescription>{t('dashboard.fleetOverview')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">MAN TGX</p>
                    <p className="text-sm text-gray-500">M-TR-1234</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{t('dashboard.active')}</p>
                    <p className="text-sm text-gray-500">Klaus Müller</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Mercedes Actros</p>
                    <p className="text-sm text-gray-500">M-TR-5678</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-yellow-600">{t('dashboard.maintenance')}</p>
                    <p className="text-sm text-gray-500">{t('dashboard.availableSoon')}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Volvo FH</p>
                    <p className="text-sm text-gray-500">M-TR-9012</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{t('dashboard.active')}</p>
                    <p className="text-sm text-gray-500">Michael Schmidt</p>
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

export default SubcontractorDashboard;
