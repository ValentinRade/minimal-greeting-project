
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Users, 
  Truck, 
  Star, 
  FileText, 
  ShieldCheck, 
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Building,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/components/ui/use-toast";
import AppLayout from '@/components/layout/AppLayout';

// Mock data for detailed subcontractor profiles (same as in CrmPage)
const subcontractorDetails = {
  1: {
    company: "Schnell Transport GmbH",
    contactPerson: "Max Müller",
    email: "m.mueller@schnell-transport.de",
    phone: "+49 89 12345678",
    website: "www.schnell-transport.de",
    address: "Industriestr. 45, 80939 München",
    foundedYear: 2008,
    rating: 4.2,
    summary: "Zuverlässiger mittelständischer Logistikpartner mit Schwerpunkt im süddeutschen Raum. Spezialisiert auf Express- und Just-in-Time Lieferungen mit einer modernen Flotte und erfahrenen Fahrern. Bekannt für Pünktlichkeit und guten Service.",
    employees: {
      total: 28,
      drivers: 22,
      office: 4,
      management: 2
    },
    fleet: {
      total: 25,
      types: [
        { type: "Sattelschlepper", count: 12 },
        { type: "Wechselbrücken-LKW", count: 8 },
        { type: "Sprinter", count: 5 }
      ],
      averageAge: 3.2
    },
    references: [
      { customer: "LogiTech AG", since: "2020", industry: "Elektronik" },
      { customer: "FoodExpress GmbH", since: "2018", industry: "Lebensmittel" }
    ],
    prequalifications: {
      eu_license: true,
      adr_certificate: true,
      pq_kep: true,
      iso_9001: true,
      gdp_certified: false
    },
    preferences: {
      regions: ["Bayern", "Baden-Württemberg", "Österreich"],
      specializations: ["Express", "Just-in-Time Lieferungen"],
      minContractDuration: "6 Monate"
    }
  },
  2: {
    company: "LogTech AG",
    contactPerson: "Sarah Schmidt",
    email: "s.schmidt@logtech-ag.de",
    phone: "+49 30 98765432",
    website: "www.logtech-ag.de",
    address: "Logistikpark 12, 12347 Berlin",
    foundedYear: 2015,
    rating: 3.8,
    summary: "Innovatives Logistikunternehmen mit Fokus auf technologiegestützte Transportlösungen. Spezialisiert auf temperaturgeführte Pharmatransporte und Hightech-Güter. Ein junges Team mit modernem Fuhrpark und digitalen Prozessen.",
    employees: {
      total: 42,
      drivers: 35,
      office: 5,
      management: 2
    },
    fleet: {
      total: 15,
      types: [
        { type: "Sattelschlepper", count: 8 },
        { type: "Kühl-LKW", count: 5 },
        { type: "Kastenwagen", count: 2 }
      ],
      averageAge: 2.5
    },
    references: [
      { customer: "Pharma Plus GmbH", since: "2019", industry: "Pharmazeutik" },
      { customer: "TechLogistics", since: "2021", industry: "Elektronik" },
      { customer: "Anonymisierter Kunde", since: "2017", industry: "Automobil" }
    ],
    prequalifications: {
      eu_license: true,
      adr_certificate: false,
      pq_kep: true,
      iso_9001: true,
      gdp_certified: true
    },
    preferences: {
      regions: ["Berlin", "Brandenburg", "Sachsen", "Polen"],
      specializations: ["Pharma-Logistik", "Temperaturgeführte Transporte"],
      minContractDuration: "12 Monate"
    }
  },
  3: {
    company: "Cargo Express",
    contactPerson: "Lisa Weber",
    email: "l.weber@cargo-express.de",
    phone: "+49 40 44556677",
    website: "www.cargo-express.de",
    address: "Hafenstraße 78, 20457 Hamburg",
    foundedYear: 2012,
    rating: 4.7,
    summary: "Langjährig etablierter Partner für internationale Containertransporte mit Schwerpunkt auf Hafenlogistik. Erfahrener Partner für Import/Export-Unternehmen mit kurzen Reaktionszeiten und flexiblen Lösungen für die Seefracht-Logistik.",
    employees: {
      total: 53,
      drivers: 45,
      office: 6,
      management: 2
    },
    fleet: {
      total: 38,
      types: [
        { type: "Container-LKW", count: 22 },
        { type: "Sattelschlepper", count: 10 },
        { type: "Wechselbrücken-LKW", count: 6 }
      ],
      averageAge: 4.1
    },
    references: [
      { customer: "Global Shipping Inc.", since: "2016", industry: "Import/Export" },
      { customer: "SeaTrade GmbH", since: "2018", industry: "Seefrachtlogistik" }
    ],
    prequalifications: {
      eu_license: true,
      adr_certificate: true,
      pq_kep: false,
      iso_9001: true,
      gdp_certified: false
    },
    preferences: {
      regions: ["Hamburg", "Bremen", "Niedersachsen", "Skandinavien"],
      specializations: ["Hafenlogistik", "Containerverladung"],
      minContractDuration: "3 Monate"
    }
  },
  4: {
    company: "SpeedTrans GmbH",
    contactPerson: "Klaus Fischer",
    email: "k.fischer@speedtrans.de",
    phone: "+49 211 33445566",
    website: "www.speedtrans.de",
    address: "Stadtring 123, 40468 Düsseldorf",
    foundedYear: 2017,
    rating: 3.5,
    summary: "Agiles KEP-Unternehmen mit Fokus auf Stadtlogistik und Last-Mile-Delivery. Moderner, emissionsarmer Fuhrpark aus Transportern und Sprintern. Spezialisiert auf zeitkritische Lieferungen in urbanen Räumen.",
    employees: {
      total: 18,
      drivers: 14,
      office: 3,
      management: 1
    },
    fleet: {
      total: 12,
      types: [
        { type: "Sprinter", count: 8 },
        { type: "Kastenwagen", count: 4 }
      ],
      averageAge: 1.8
    },
    references: [
      { customer: "QuickDelivery", since: "2019", industry: "E-Commerce" },
      { customer: "CityLog", since: "2020", industry: "Stückgut" }
    ],
    prequalifications: {
      eu_license: true,
      adr_certificate: false,
      pq_kep: true,
      iso_9001: false,
      gdp_certified: false
    },
    preferences: {
      regions: ["Nordrhein-Westfalen", "Rheinland-Pfalz"],
      specializations: ["KEP-Dienste", "Letzte-Meile-Lieferung"],
      minContractDuration: "1 Monat"
    }
  },
  5: {
    company: "GreenLogistics Ltd.",
    contactPerson: "Thomas Becker",
    email: "t.becker@greenlogistics.de",
    phone: "+49 69 11223344",
    website: "www.greenlogistics.de",
    address: "Nachhaltigkeitsallee 42, 60329 Frankfurt",
    foundedYear: 2019,
    rating: 4.0,
    summary: "Nachhaltigkeitsorientierter Logistikanbieter mit CO2-neutralem Fuhrpark. Fokus auf umweltfreundliche Logistiklösungen für den Innenstadtbereich mit Elektro- und Hybridfahrzeugen. Idealer Partner für ökologisch ausgerichtete Unternehmen.",
    employees: {
      total: 24,
      drivers: 18,
      office: 4,
      management: 2
    },
    fleet: {
      total: 20,
      types: [
        { type: "E-LKW", count: 12 },
        { type: "Hybrid-LKW", count: 5 },
        { type: "E-Transporter", count: 3 }
      ],
      averageAge: 1.2
    },
    references: [
      { customer: "EcoRetail GmbH", since: "2020", industry: "Einzelhandel" },
      { customer: "Nachhaltig AG", since: "2021", industry: "Konsumgüter" }
    ],
    prequalifications: {
      eu_license: true,
      adr_certificate: false,
      pq_kep: true,
      iso_9001: true,
      gdp_certified: false
    },
    preferences: {
      regions: ["Hessen", "Rhein-Main-Gebiet"],
      specializations: ["CO2-neutrale Logistik", "Innenstadtlogistik"],
      minContractDuration: "12 Monate"
    }
  }
};

// Phase types for UI representation
const phaseTypes = {
  'interessent': { name: 'Interessent', color: 'bg-primary/10 text-primary' },
  'erstgespraech': { name: 'Erstgespräch', color: 'bg-primary/20 text-primary' },
  'bewerbung': { name: 'Bewerbung', color: 'bg-primary/30 text-primary' },
  'ueberpruefung': { name: 'Überprüfung', color: 'bg-primary/40 text-primary' },
  'verhandlung': { name: 'Verhandlung', color: 'bg-primary/50 text-primary' },
  'onhold': { name: 'On Hold', color: 'bg-muted text-muted-foreground' },
  'vertrag': { name: 'Unter Vertrag', color: 'bg-primary/70 text-primary-foreground' },
};

// Render certification badge function  
const renderCertificationBadge = (name: string, isActive: boolean) => {
  if (!isActive) return null;
  
  return (
    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-2 mr-2">
      <ShieldCheck className="mr-1 h-3 w-3" /> {name}
    </Badge>
  );
};

// Render star rating component
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-primary text-primary" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-5 w-5 text-primary/30" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="h-5 w-5 fill-primary text-primary" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-primary/30" />
      ))}
      <span className="ml-2 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

const SubcontractorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<string>('interessent');
  
  // Get subcontractor details from the ID
  const subcontractorId = id ? parseInt(id) : 0;
  const subcontractor = subcontractorDetails[subcontractorId as keyof typeof subcontractorDetails];
  
  if (!subcontractor) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Subunternehmer nicht gefunden</h1>
            <p className="mb-6">Der angeforderte Subunternehmer konnte nicht gefunden werden.</p>
            <Button onClick={() => navigate('/shipper/crm')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur SRM Übersicht
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calculate completeness for progress bar (just a visual representation)
  const getProfileCompleteness = () => {
    let score = 0;
    let total = 0;
    
    // Basic info
    if (subcontractor.company) { score++; total++; }
    if (subcontractor.contactPerson) { score++; total++; }
    if (subcontractor.email) { score++; total++; }
    if (subcontractor.phone) { score++; total++; }
    if (subcontractor.website) { score++; total++; }
    if (subcontractor.address) { score++; total++; }
    
    // Employees
    if (subcontractor.employees.total > 0) { score++; total++; }
    
    // Fleet
    if (subcontractor.fleet.total > 0) { score++; total++; }
    if (subcontractor.fleet.types.length > 0) { score++; total++; }
    
    // References
    if (subcontractor.references.length > 0) { score++; total++; }
    
    // Prequalifications (any active prequalification)
    if (Object.values(subcontractor.prequalifications).some(val => val)) { score++; total++; }
    
    // Preferences
    if (subcontractor.preferences.regions.length > 0) { score++; total++; }
    if (subcontractor.preferences.specializations.length > 0) { score++; total++; }
    
    return Math.round((score / total) * 100);
  };

  const handlePhaseChange = (newPhase: string) => {
    setCurrentPhase(newPhase);
    toast({
      title: "Phase geändert",
      description: `${subcontractor.company} wurde in die Phase "${phaseTypes[newPhase as keyof typeof phaseTypes].name}" verschoben`,
    });
  };

  const handleContact = () => {
    toast({
      title: "Kontakt aufgenommen",
      description: `Eine Nachricht wurde an ${subcontractor.contactPerson} gesendet.`,
    });
  };
  
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header with navigation */}
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/shipper/crm')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{subcontractor.company}</h1>
            <p className="text-muted-foreground">Subunternehmer Detailansicht</p>
          </div>
        </div>
        
        {/* Top section with key info and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="bg-primary h-20"></div>
            <div className="p-6 -mt-8">
              <div className="bg-background dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{subcontractor.company}</h2>
                    <p className="text-muted-foreground">
                      Gegründet {subcontractor.foundedYear} • {subcontractor.address}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(phaseTypes).map(([phase, { name, color }]) => (
                      <Badge 
                        key={phase}
                        className={`${currentPhase === phase ? color : 'bg-muted/50 text-muted-foreground'} cursor-pointer`}
                        onClick={() => handlePhaseChange(phase)}
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Rating & Summary */}
              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-medium text-lg">Bewertung & Zusammenfassung</h3>
                  <StarRating rating={subcontractor.rating} />
                </div>
                <p className="text-muted-foreground">
                  {subcontractor.summary}
                </p>
              </div>
              
              {/* Contact info */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Telefon</div>
                    <div>{subcontractor.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div>{subcontractor.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Website</div>
                    <div>{subcontractor.website}</div>
                  </div>
                </div>
              </div>
              
              {/* Contact person */}
              <div className="bg-muted/10 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Kontaktperson</h3>
                </div>
                <div className="ml-7">
                  <div className="font-medium">{subcontractor.contactPerson}</div>
                  <div className="text-sm text-muted-foreground">{subcontractor.email}</div>
                  <div className="text-sm text-muted-foreground">{subcontractor.phone}</div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Stats Card */}
          <Card className="bg-primary/5 border-0">
            <CardHeader>
              <CardTitle className="text-xl">Profil Übersicht</CardTitle>
              <CardDescription>Vollständigkeit und Kennzahlen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile completeness */}
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Profilkomplettierung</span>
                    <span className="font-medium">{getProfileCompleteness()}%</span>
                  </div>
                  <Progress value={getProfileCompleteness()} className="h-2" />
                </div>
                
                {/* Key stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-3 shadow-sm">
                    <div className="text-sm text-muted-foreground">Fahrzeuge</div>
                    <div className="text-2xl font-bold text-primary">{subcontractor.fleet.total}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 shadow-sm">
                    <div className="text-sm text-muted-foreground">Fahrer</div>
                    <div className="text-2xl font-bold text-primary">{subcontractor.employees.drivers}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 shadow-sm">
                    <div className="text-sm text-muted-foreground">Zertifikate</div>
                    <div className="text-2xl font-bold text-primary">
                      {Object.values(subcontractor.prequalifications).filter(Boolean).length}
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 shadow-sm">
                    <div className="text-sm text-muted-foreground">Referenzen</div>
                    <div className="text-2xl font-bold text-primary">{subcontractor.references.length}</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={handleContact} className="w-full">
                    Kontaktieren
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Employees Section */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-primary py-4 px-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-primary-foreground mr-2" />
                <h2 className="text-xl font-bold text-primary-foreground">Mitarbeiter</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Gesamtanzahl</div>
                  <div className="text-2xl font-bold text-primary">{subcontractor.employees.total}</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Fahrer</div>
                  <div className="text-2xl font-bold text-primary">{subcontractor.employees.drivers}</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Büropersonal</div>
                  <div className="text-2xl font-bold text-primary">{subcontractor.employees.office}</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Management</div>
                  <div className="text-2xl font-bold text-primary">{subcontractor.employees.management}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Fleet Section */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-primary py-4 px-6">
              <div className="flex items-center">
                <Truck className="h-6 w-6 text-primary-foreground mr-2" />
                <h2 className="text-xl font-bold text-primary-foreground">Fuhrpark</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Gesamtanzahl</div>
                  <div className="text-2xl font-bold text-primary">{subcontractor.fleet.total}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Durchschnittsalter</div>
                  <div className="text-2xl font-bold text-primary">{subcontractor.fleet.averageAge} Jahre</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium">Fahrzeugtypen</div>
                {subcontractor.fleet.types.map((vehicle, index) => (
                  <div key={index} className="flex justify-between items-center bg-primary/5 p-3 rounded-lg">
                    <span>{vehicle.type}</span>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      {vehicle.count} Fahrzeuge
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Prequalifications */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-primary py-4 px-6">
              <div className="flex items-center">
                <ShieldCheck className="h-6 w-6 text-primary-foreground mr-2" />
                <h2 className="text-xl font-bold text-primary-foreground">Präqualifikationen</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${subcontractor.prequalifications.eu_license ? 'bg-primary/5' : 'bg-muted/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">EU-Lizenz</span>
                    {subcontractor.prequalifications.eu_license ? (
                      <Badge className="bg-primary/10 text-primary">Vorhanden</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Nicht vorhanden</Badge>
                    )}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${subcontractor.prequalifications.adr_certificate ? 'bg-primary/5' : 'bg-muted/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ADR-Zertifikat</span>
                    {subcontractor.prequalifications.adr_certificate ? (
                      <Badge className="bg-primary/10 text-primary">Vorhanden</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Nicht vorhanden</Badge>
                    )}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${subcontractor.prequalifications.pq_kep ? 'bg-primary/5' : 'bg-muted/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">PQ KEP</span>
                    {subcontractor.prequalifications.pq_kep ? (
                      <Badge className="bg-primary/10 text-primary">Vorhanden</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Nicht vorhanden</Badge>
                    )}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${subcontractor.prequalifications.iso_9001 ? 'bg-primary/5' : 'bg-muted/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">ISO 9001</span>
                    {subcontractor.prequalifications.iso_9001 ? (
                      <Badge className="bg-primary/10 text-primary">Vorhanden</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Nicht vorhanden</Badge>
                    )}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${subcontractor.prequalifications.gdp_certified ? 'bg-primary/5' : 'bg-muted/10'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">GDP-Zertifiziert</span>
                    {subcontractor.prequalifications.gdp_certified ? (
                      <Badge className="bg-primary/10 text-primary">Vorhanden</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Nicht vorhanden</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Preferences */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="bg-primary py-4 px-6">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-primary-foreground mr-2" />
                <h2 className="text-xl font-bold text-primary-foreground">Präferenzen</h2>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Regionen</div>
                <div className="flex flex-wrap gap-2">
                  {subcontractor.preferences.regions.map((region, index) => (
                    <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                      <MapPin className="mr-1 h-3 w-3" /> {region}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Spezialisierungen</div>
                <div className="flex flex-wrap gap-2">
                  {subcontractor.preferences.specializations.map((spec, index) => (
                    <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Star className="mr-1 h-3 w-3" /> {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Min. Vertragsdauer</div>
                <div className="bg-primary/5 p-3 rounded-lg flex items-center">
                  <Calendar className="h-4 w-4 text-primary mr-2" />
                  <span>{subcontractor.preferences.minContractDuration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* References */}
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
          <div className="bg-primary py-4 px-6">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-primary-foreground mr-2" />
              <h2 className="text-xl font-bold text-primary-foreground">Referenzen</h2>
            </div>
          </div>
          <CardContent className="p-6">
            {subcontractor.references.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subcontractor.references.map((reference, index) => (
                  <div key={index} className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Building className="h-4 w-4 text-primary mr-2" />
                      <div className="font-medium">{reference.customer}</div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-primary mr-1" />
                        <span>Seit: {reference.since}</span>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {reference.industry}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Keine Referenzen vorhanden</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer actions */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/shipper/crm')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: "Feature nicht verfügbar", description: "Diese Funktionalität ist noch in Entwicklung." })}>
              Bearbeiten
            </Button>
            <Button onClick={handleContact}>
              Kontaktieren
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SubcontractorDetailPage;
