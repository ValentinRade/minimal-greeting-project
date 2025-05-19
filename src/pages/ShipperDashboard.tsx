
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FileText, Truck, Plus, MessageSquare } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTenders } from '@/services/tenderService';
import { supabase } from '@/integrations/supabase/client';
import { Metric } from '@/components/ui/metric';

const ShipperDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Query to fetch tenders count
  const { data: tenders, isLoading: isLoadingTenders } = useQuery({
    queryKey: ['tenders'],
    queryFn: getTenders,
  });

  // Query to fetch subcontractors count
  const { data: subcontractorsCount, isLoading: isLoadingSubcontractors } = useQuery({
    queryKey: ['subcontractorsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('company_type_id', 1); // 1 is for subcontractors
      
      if (error) throw error;
      return count || 0;
    },
  });

  const handleCreateTender = () => {
    navigate('/dashboard/shipper/tenders', { state: { createNew: true } });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t('dashboard.shipperWelcome')}</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.todayIsDate', { date: new Date().toLocaleDateString() })}</p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="card-modern bg-gradient-primary border-0 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold text-white">{t('dashboard.tenders')}</CardTitle>
              <FileText className="h-5 w-5 text-white/70" />
            </CardHeader>
            <CardContent>
              <Metric 
                title={t('dashboard.activeTenders')}
                value={isLoadingTenders ? '...' : tenders?.length || 0}
                isLoading={isLoadingTenders}
                className="text-white"
              />
            </CardContent>
          </Card>
          
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-semibold">{t('dashboard.subcontractors')}</CardTitle>
              <Truck className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <Metric 
                title={t('dashboard.registeredSubcontractors')}
                value={isLoadingSubcontractors ? '...' : subcontractorsCount || 0}
                isLoading={isLoadingSubcontractors}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreateTender} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.createNewTender')}
            </Button>
          </div>
        </div>
        
        {/* Messages Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('dashboard.messages')}</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t('dashboard.viewAllMessages')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-10 text-muted-foreground border border-dashed rounded-md">
                {t('dashboard.noNewMessages')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShipperDashboard;
