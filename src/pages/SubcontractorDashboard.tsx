
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Users } from 'lucide-react';

const SubcontractorDashboard = () => {
  const { company, signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.subcontractorWelcome')}</h1>
            <p className="text-slate-600">{company?.name}</p>
          </div>
          <Button variant="outline" onClick={signOut}>{t('profile.logOut')}</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">{t('dashboard.assignments')}</CardTitle>
              <Package className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeAssignments')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">{t('dashboard.vehicles')}</CardTitle>
              <Truck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-sm text-gray-500">{t('dashboard.registeredVehicles')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">{t('dashboard.drivers')}</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">7</div>
              <p className="text-sm text-gray-500">{t('dashboard.activeDrivers')}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('dashboard.transportActivity')}</CardTitle>
            <CardDescription>{t('dashboard.recentTransports')}</CardDescription>
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
            <Button variant="outline" className="w-full">{t('dashboard.viewAllTransports')}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubcontractorDashboard;
