
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Search, Database, User, MapPin, Truck, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Define the subcontractor data type based on the database structure
type Subcontractor = {
  id: string;
  company_id: string;
  company_name: string;
  city: string;
  country: string;
  languages: string[];
  vehicle_types: string[];
  body_types: string[];
  specializations: string[];
  service_regions: string[];
  total_vehicles: number;
  total_employees: number;
  avg_rating: number | null;
  has_eu_license: boolean;
  has_adr_certificate: boolean;
  // Add public profile fields
  profile_url_path?: string | null;
  has_public_profile?: boolean;
};

const SubcontractorDatabasePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch subcontractors from Supabase with public profile info
  const { data: subcontractors, isLoading, error } = useQuery({
    queryKey: ['subcontractors'],
    queryFn: async () => {
      console.log('===== Starting fetch of subcontractor data... =====');
      
      // Check if we can access the search data table at all
      try {
        // First, try to fetch a single row just to test access
        const testAccess = await supabase
          .from('subcontractor_search_data')
          .select('id')
          .limit(1);
          
        console.log('Test access response:', testAccess);
        
        if (testAccess.error) {
          console.error('Access error:', testAccess.error);
          toast({
            title: "Zugriffsfehler",
            description: "Keine Zugriffsrechte auf die Subunternehmer-Daten. Bitte kontaktieren Sie den Administrator.",
            variant: "destructive",
          });
          throw new Error(`Zugriffsfehler: ${testAccess.error.message}`);
        }
        
        // Try to fetch profiles table access as well
        const profilesTest = await supabase
          .from('subcontractor_public_profiles')
          .select('id')
          .limit(1);
          
        console.log('Profiles test access:', profilesTest);
      } catch (e) {
        console.error('Error testing table access:', e);
      }
      
      // Now fetch all search data
      const { data: searchData, error: searchError } = await supabase
        .from('subcontractor_search_data')
        .select('*')
        .order('company_name');
      
      if (searchError) {
        console.error('Error fetching search data:', searchError);
        toast({
          title: "Fehler beim Laden",
          description: `Konnte Subunternehmer nicht laden: ${searchError.message}`,
          variant: "destructive",
        });
        throw searchError;
      }
      
      console.log('Search data result count:', searchData ? searchData.length : 0);
      console.log('First few search records:', searchData ? searchData.slice(0, 3) : 'No data');
      
      if (!searchData || searchData.length === 0) {
        console.log('No subcontractor search data found');
        return [];
      }
      
      // Get all public profiles without filtering
      const { data: allProfiles, error: profilesError } = await supabase
        .from('subcontractor_public_profiles')
        .select('*');
        
      console.log('All profiles count:', allProfiles ? allProfiles.length : 0);
      console.log('First few profiles:', allProfiles ? allProfiles.slice(0, 3) : 'No profiles');
      
      if (profilesError) {
        console.error('Error fetching all profiles:', profilesError);
      }
      
      // Now specifically get enabled profiles for comparison
      const { data: profileData, error: profileError } = await supabase
        .from('subcontractor_public_profiles')
        .select('*')
        .eq('enabled', true);
      
      if (profileError) {
        console.error('Error fetching enabled profiles:', profileError);
        // Continue anyway, we want to show subcontractors even without profiles
      }
      
      console.log('Enabled profiles count:', profileData ? profileData.length : 0);
      
      // Create a map of company_id to profile data for easy lookup
      const profileMap = {};
      if (profileData && profileData.length > 0) {
        profileData.forEach(profile => {
          profileMap[profile.company_id] = profile;
        });
      }
      
      console.log('Profile map created with keys:', Object.keys(profileMap).length);
      
      // Combine the data
      const result = searchData.map(sub => {
        const profile = profileMap[sub.company_id];
        console.log(`Company ${sub.company_name} (${sub.company_id}):`, 
          'Has profile:', !!profile, 
          profile ? `URL: ${profile.profile_url_path}, Enabled: ${profile.enabled}` : '');
        
        return {
          ...sub,
          profile_url_path: profile ? profile.profile_url_path : null,
          has_public_profile: !!profile,
        };
      }) as Subcontractor[];
      
      console.log('Final result count:', result.length);
      if (result.length > 0) {
        console.log('Sample result item:', result[0]);
      }
      
      return result;
    },
    staleTime: 60000, // Cache for 1 minute
    retry: 2, // Retry twice if there's a failure
  });
  
  console.log('Render state - isLoading:', isLoading, 'error:', !!error, 'subcontractors count:', subcontractors?.length);
  
  // Filter subcontractors based on search query
  const filteredSubcontractors = subcontractors?.filter(sub => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      sub.company_name.toLowerCase().includes(query) ||
      sub.city.toLowerCase().includes(query) ||
      sub.country.toLowerCase().includes(query) ||
      sub.specializations.some(s => s && s.toLowerCase().includes(query)) ||
      sub.service_regions.some(r => r && r.toLowerCase().includes(query)) ||
      sub.vehicle_types.some(v => v && v.toLowerCase().includes(query))
    );
  });
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subunternehmerdatenbank</h1>
            <p className="text-muted-foreground">
              Finden und vergleichen Sie Subunternehmer und kontaktieren Sie diese gezielt.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nach Subunternehmer suchen..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Registrierte Subunternehmer</CardTitle>
            <CardDescription>
              Übersicht aller auf der Plattform registrierten Subunternehmer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <p>Daten werden geladen...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center p-6 text-red-500">
                <p>Fehler beim Laden der Daten: {(error as Error).message}</p>
              </div>
            ) : !subcontractors || subcontractors.length === 0 ? (
              <div className="flex justify-center p-6">
                <p>Keine Subunternehmer gefunden</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4"
                  onClick={() => {
                    console.log('Refreshing data...');
                    // The invalidateQueries method is available on the QueryClient
                    // You can get it using the useQueryClient hook
                  }}
                >
                  Daten aktualisieren
                </Button>
              </div>
            ) : !filteredSubcontractors || filteredSubcontractors.length === 0 ? (
              <div className="flex justify-center p-6">
                <p>Keine Subunternehmer gefunden, die Ihren Suchkriterien entsprechen</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unternehmen</TableHead>
                    <TableHead>Standort</TableHead>
                    <TableHead>Flottengröße</TableHead>
                    <TableHead>Spezialisierung</TableHead>
                    <TableHead>Zertifizierungen</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubcontractors.map((subcontractor) => (
                    <TableRow key={subcontractor.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {subcontractor.company_name}
                          </div>
                          {subcontractor.has_public_profile && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 self-start">
                              Öffentliches Profil
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {subcontractor.city}, {subcontractor.country}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          {subcontractor.total_vehicles} Fahrzeuge
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subcontractor.specializations
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((spec, index) => (
                              <Badge key={index} variant="outline">
                                {spec}
                              </Badge>
                            ))}
                          {subcontractor.vehicle_types
                            .filter(Boolean)
                            .slice(0, 1)
                            .map((type, index) => (
                              <Badge key={`vt-${index}`} variant="outline">
                                {type}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subcontractor.has_eu_license && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <Check className="mr-1 h-3 w-3" /> EU-Lizenz
                            </Badge>
                          )}
                          {subcontractor.has_adr_certificate && (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              <Check className="mr-1 h-3 w-3" /> ADR
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {subcontractor.has_public_profile && subcontractor.profile_url_path && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              asChild
                            >
                              <Link to={`/profile/${subcontractor.profile_url_path}`} target="_blank">
                                Profil <ExternalLink className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => console.log("Kontakt zu", subcontractor.company_name)}
                          >
                            Kontakt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SubcontractorDatabasePage;
