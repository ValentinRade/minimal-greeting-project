
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/components/layout/AppLayout';
import { Search, Database, User, MapPin, Truck, Check, ExternalLink, Star } from 'lucide-react';
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

// Mock-Subunternehmerdaten
const mockSubcontractors = [
  {
    id: "sub-001",
    company_id: "com-001",
    company_name: "TransportExpress GmbH",
    city: "München",
    country: "Deutschland",
    languages: ["Deutsch", "Englisch"],
    vehicle_types: ["LKW", "Kühlfahrzeuge"],
    body_types: ["Planenaufbau", "Kofferaufbau"],
    specializations: ["Lebensmittellogistik", "Expresstransporte"],
    service_regions: ["Bayern", "Baden-Württemberg", "Österreich"],
    total_vehicles: 25,
    total_employees: 42,
    avg_rating: 4.8,
    has_eu_license: true,
    has_adr_certificate: true,
    has_pq_kep: true,
    profile_url_path: "transportexpress",
    has_public_profile: true,
    description: "Spezialist für temperaturgeführte Transporte und Just-in-time Lieferungen im süddeutschen Raum.",
    founded_year: 2005
  },
  {
    id: "sub-002",
    company_id: "com-002",
    company_name: "NordCargoLogistics",
    city: "Hamburg",
    country: "Deutschland",
    languages: ["Deutsch", "Englisch", "Dänisch"],
    vehicle_types: ["Sattelzug", "Wechselbrücke"],
    body_types: ["Curtainsider", "Containeraufbau"],
    specializations: ["Seefrachtlogistik", "Hafenlogistik"],
    service_regions: ["Hamburg", "Schleswig-Holstein", "Nordeuropa"],
    total_vehicles: 38,
    total_employees: 65,
    avg_rating: 4.5,
    has_eu_license: true,
    has_adr_certificate: false,
    has_pq_kep: false,
    profile_url_path: "nordcargo",
    has_public_profile: true,
    description: "Ihr Partner für alle Transportlösungen im Ostseeraum mit direkter Anbindung an die größten Häfen Nordeuropas.",
    founded_year: 1998
  },
  {
    id: "sub-003",
    company_id: "com-003",
    company_name: "Rhein Fracht AG",
    city: "Köln",
    country: "Deutschland",
    languages: ["Deutsch", "Französisch", "Niederländisch"],
    vehicle_types: ["Jumbo-LKW", "Gliederzug"],
    body_types: ["Planenaufbau", "Pritsche"],
    specializations: ["Schwerlasttransporte", "Projektlogistik"],
    service_regions: ["NRW", "Rheinland-Pfalz", "Benelux"],
    total_vehicles: 42,
    total_employees: 78,
    avg_rating: 4.7,
    has_eu_license: true,
    has_adr_certificate: true,
    has_pq_kep: true,
    profile_url_path: "rheinfracht",
    has_public_profile: true,
    description: "Seit über 25 Jahren Ihr zuverlässiger Partner für anspruchsvolle Schwerlast- und Sondertransporte entlang der Rheinachse.",
    founded_year: 1995
  },
  {
    id: "sub-004",
    company_id: "com-004",
    company_name: "AlpenTransLog",
    city: "Rosenheim",
    country: "Deutschland",
    languages: ["Deutsch", "Italienisch"],
    vehicle_types: ["Kühlfahrzeuge", "Pritschenwagen"],
    body_types: ["Kofferaufbau", "Kühlkofferaufbau"],
    specializations: ["Alpentransit", "Kühllogistik"],
    service_regions: ["Bayern", "Österreich", "Norditalien"],
    total_vehicles: 18,
    total_employees: 29,
    avg_rating: 4.6,
    has_eu_license: true,
    has_adr_certificate: true,
    has_pq_kep: false,
    profile_url_path: null,
    has_public_profile: false,
    description: "Spezialist für temperaturgeführte Transporte über die Alpen mit Schwerpunkt auf der Lebensmittelindustrie.",
    founded_year: 2010
  },
  {
    id: "sub-005",
    company_id: "com-005",
    company_name: "OstTrans GmbH & Co. KG",
    city: "Berlin",
    country: "Deutschland",
    languages: ["Deutsch", "Polnisch", "Tschechisch", "Russisch"],
    vehicle_types: ["LKW", "Sattelzug"],
    body_types: ["Planenaufbau", "Kofferaufbau"],
    specializations: ["Osteuropaverkehre", "Sammelgutverkehre"],
    service_regions: ["Berlin", "Brandenburg", "Polen", "Tschechien"],
    total_vehicles: 32,
    total_employees: 48,
    avg_rating: 4.3,
    has_eu_license: true,
    has_adr_certificate: false,
    has_pq_kep: false,
    profile_url_path: "osttrans",
    has_public_profile: true,
    description: "Ihr Spezialist für Osteuropa-Verkehre mit eigenen Niederlassungen in Warschau und Prag.",
    founded_year: 2008
  },
  {
    id: "sub-006",
    company_id: "com-006",
    company_name: "GreenLogistics",
    city: "Frankfurt",
    country: "Deutschland",
    languages: ["Deutsch", "Englisch"],
    vehicle_types: ["Elektro-LKW", "CNG-Fahrzeuge"],
    body_types: ["Kofferaufbau", "Citylogistik-Aufbau"],
    specializations: ["Nachhaltige Logistik", "Citylogistik"],
    service_regions: ["Hessen", "Rhein-Main-Gebiet"],
    total_vehicles: 15,
    total_employees: 23,
    avg_rating: 4.9,
    has_eu_license: true,
    has_adr_certificate: false,
    has_pq_kep: true,
    profile_url_path: "greenlogistics",
    has_public_profile: true,
    description: "Pionier für nachhaltige Transportlösungen mit einer zu 100% CO2-neutralen Flotte im städtischen Raum.",
    founded_year: 2015
  },
  {
    id: "sub-007",
    company_id: "com-007",
    company_name: "SafeTech Transport",
    city: "Stuttgart",
    country: "Deutschland",
    languages: ["Deutsch", "Englisch", "Französisch"],
    vehicle_types: ["Gefahrgut-LKW", "Tanklastzüge"],
    body_types: ["ADR-Aufbauten", "Tankaufbauten"],
    specializations: ["Gefahrguttransporte", "Chemielogistik"],
    service_regions: ["Baden-Württemberg", "Schweiz", "Frankreich"],
    total_vehicles: 22,
    total_employees: 36,
    avg_rating: 4.8,
    has_eu_license: true,
    has_adr_certificate: true,
    has_pq_kep: true,
    profile_url_path: null,
    has_public_profile: false,
    description: "Zertifizierter Spezialist für die sichere Beförderung von Gefahrgütern aller Klassen.",
    founded_year: 2003
  },
  {
    id: "sub-008",
    company_id: "com-008",
    company_name: "MedikalExpress",
    city: "Düsseldorf",
    country: "Deutschland",
    languages: ["Deutsch", "Englisch", "Türkisch"],
    vehicle_types: ["Sprinter", "Pharma-LKW"],
    body_types: ["GDP-zertifizierte Aufbauten", "Temperaturgeführte Aufbauten"],
    specializations: ["Pharmalogistik", "Medizintechnik-Transporte"],
    service_regions: ["NRW", "Benelux", "Deutschland"],
    total_vehicles: 12,
    total_employees: 20,
    avg_rating: 4.9,
    has_eu_license: true,
    has_adr_certificate: true,
    has_pq_kep: false,
    profile_url_path: "medikalexpress",
    has_public_profile: true,
    description: "GDP-zertifiziertes Logistikunternehmen für den Transport von Arzneimitteln und medizinischen Produkten.",
    founded_year: 2012
  }
];

type Subcontractor = typeof mockSubcontractors[0];

const SubcontractorDatabasePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter subcontractors based on search query
  const filteredSubcontractors = mockSubcontractors.filter(sub => {
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
  
  const handleViewProfile = (subcontractor: Subcontractor) => {
    if (subcontractor.profile_url_path) {
      // In einer richtigen App würden wir hier zur Profilseite navigieren
      console.log(`Navigiere zu Profil: /profile/${subcontractor.profile_url_path}`);
    }
  };
  
  const handleContactSubcontractor = (subcontractor: Subcontractor) => {
    toast({
      title: "Kontaktanfrage gesendet",
      description: `Ihre Anfrage an ${subcontractor.company_name} wurde erfolgreich übermittelt.`,
    });
  };
  
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
            ) : filteredSubcontractors.length === 0 ? (
              <div className="flex justify-center p-6">
                <p>Keine Subunternehmer gefunden, die Ihren Suchkriterien entsprechen</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unternehmen</TableHead>
                    <TableHead>Standort</TableHead>
                    <TableHead>Flotte</TableHead>
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
                            {subcontractor.avg_rating && (
                              <div className="flex items-center text-amber-500 ml-1">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-xs ml-0.5">{subcontractor.avg_rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          {subcontractor.has_public_profile && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 self-start">
                              Öffentliches Profil
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            Seit {subcontractor.founded_year}
                          </div>
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
                          {subcontractor.has_pq_kep && (
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              <Check className="mr-1 h-3 w-3" /> PQ KEP
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
                              onClick={() => handleViewProfile(subcontractor)}
                            >
                              Profil <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleContactSubcontractor(subcontractor)}
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
