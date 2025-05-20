import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, Search, MoreHorizontal, MoveHorizontal, Users, Truck, Star, FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data for detailed subcontractor profiles
const subcontractorDetails = {
  1: {
    company: "Schnell Transport GmbH",
    contactPerson: "Max Müller",
    email: "m.mueller@schnell-transport.de",
    phone: "+49 89 12345678",
    website: "www.schnell-transport.de",
    address: "Industriestr. 45, 80939 München",
    foundedYear: 2008,
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

// Pipelines for the SRM system
const pipelines = [
  { id: 'standard', name: 'Standard Pipeline' },
  { id: 'express', name: 'Express Onboarding' },
  { id: 'international', name: 'Internationale Subunternehmer' },
];

// Dummy-Daten für das Kanban-Board, angepasst an Logistiksubunternehmer
const initialCards = {
  interessent: [
    { id: 1, title: 'Schnell Transport GmbH', description: 'Spezialisiert auf Expresslieferungen in Süddeutschland', priority: 'Hoch', contact: 'M. Müller', date: '2025-05-25' },
    { id: 2, title: 'LogTech AG', description: 'Moderne Flotte mit 15 LKWs, sucht langfristige Zusammenarbeit', priority: 'Mittel', contact: 'S. Schmidt', date: '2025-05-26' },
  ],
  erstgespraech: [
    { id: 3, title: 'Cargo Express', description: 'Spezialisiert auf Möbeltransporte, 8 Jahre Erfahrung', priority: 'Hoch', contact: 'L. Weber', date: '2025-05-23' },
    { id: 4, title: 'SpeedTrans GmbH', description: 'Flotte mit 5 Sprintern, fokussiert auf Stadttransporte', priority: 'Niedrig', contact: 'K. Fischer', date: '2025-05-30' },
  ],
  bewerbung: [
    { id: 5, title: 'GreenLogistics Ltd.', description: 'Umweltfreundliche Elektro-LKWs für Innenstadtlieferungen', priority: 'Mittel', contact: 'T. Becker', date: '2025-05-29' },
    { id: 8, title: 'Blitz Kurier', description: 'KEP-Dienstleister mit 25 Fahrern in Berlin und Umland', priority: 'Hoch', contact: 'A. Schulz', date: '2025-06-03' },
  ],
  ueberpruefung: [
    { id: 9, title: 'TransEuropa GmbH', description: 'Internationale Transporte mit 40 LKWs und allen Zertifizierungen', priority: 'Hoch', contact: 'P. König', date: '2025-06-04' },
  ],
  verhandlung: [
    { id: 6, title: 'MetalTrans Inc.', description: 'Spezialist für Schwerlasttransporte, ISO 9001 zertifiziert', priority: 'Hoch', contact: 'R. Hoffmann', date: '2025-06-01' },
  ],
  onhold: [
    { id: 10, title: 'Schnell & Sicher GmbH', description: 'Wartet auf Erneuerung der Transportlizenz', priority: 'Mittel', contact: 'M. Wagner', date: '2025-06-05' },
  ],
  vertrag: [
    { id: 7, title: 'EcoFreight AG', description: 'Zuverlässiger Partner seit 2024, 20 LKWs verfügbar', priority: 'Mittel', contact: 'C. Meyer', date: '2025-05-28' },
  ],
};

// Pipeline-spezifische Daten
const pipelineData = {
  standard: initialCards,
  express: {
    interessent: [
      { id: 11, title: 'FlashLogistics GmbH', description: 'Express-Lieferdienst mit 30 Sprintern', priority: 'Hoch', contact: 'F. Müller', date: '2025-05-22' },
    ],
    erstgespraech: [
      { id: 12, title: 'RapidTrans AG', description: 'Spezialisiert auf Just-in-Time Lieferungen', priority: 'Mittel', contact: 'R. Schneider', date: '2025-05-24' },
    ],
    bewerbung: [],
    ueberpruefung: [
      { id: 13, title: 'QuickCarrier GmbH', description: 'Flotte von 15 Transportern mit GDP-Zertifizierung', priority: 'Hoch', contact: 'Q. Weber', date: '2025-05-27' },
    ],
    verhandlung: [],
    onhold: [],
    vertrag: [],
  },
  international: {
    interessent: [
      { id: 14, title: 'EuroTrans SpA', description: 'Italienisches Logistikunternehmen, 50 LKWs', priority: 'Mittel', contact: 'E. Rossi', date: '2025-05-21' },
    ],
    erstgespraech: [],
    bewerbung: [
      { id: 15, title: 'Nordic Freight AB', description: 'Skandinavische Transporte mit 35 LKWs', priority: 'Hoch', contact: 'N. Svensson', date: '2025-05-26' },
    ],
    ueberpruefung: [],
    verhandlung: [
      { id: 16, title: 'Trans-Iberia SL', description: 'Spezialist für iberische Halbinsel, 40 Fahrzeuge', priority: 'Mittel', contact: 'T. Garcia', date: '2025-05-29' },
    ],
    onhold: [],
    vertrag: [
      { id: 17, title: 'East Europe Logistics', description: 'Netzwerk in Osteuropa, 80 Fahrzeuge', priority: 'Hoch', contact: 'E. Nowak', date: '2025-05-23' },
    ],
  }
};

// Prioritätsfarben für Badges
const priorityColors = {
  Hoch: "bg-red-100 text-red-800 hover:bg-red-200",
  Mittel: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  Niedrig: "bg-green-100 text-green-800 hover:bg-green-200",
};

const CrmPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cards, setCards] = useState(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('standard');

  // Laden der Pipeline-Daten beim Wechsel
  const handlePipelineChange = (value: string) => {
    setSelectedPipeline(value);
    setCards(pipelineData[value as keyof typeof pipelineData]);
  };

  // Filtern der Karten basierend auf den Filterkriterien
  const getFilteredCards = () => {
    const filtered = {};
    
    Object.keys(cards).forEach(column => {
      filtered[column] = cards[column].filter(card => {
        const matchesSearch = searchQuery === '' || 
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.contact.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPriority = selectedPriority === 'all' || card.priority === selectedPriority;
        
        const matchesDate = selectedDate === '' || card.date === selectedDate;
        
        return matchesSearch && matchesPriority && matchesDate;
      });
    });
    
    return filtered;
  };
  
  const filteredCards = getFilteredCards();
  
  // Kanban Spalten-Konfiguration mit den neuen Pipeline-Phasen und besser angepassten Farben
  const columns = [
    { id: 'interessent', title: 'Interessent', color: 'border-t-4 border-t-primary bg-card' },
    { id: 'erstgespraech', title: 'Erstgespräch', color: 'border-t-4 border-t-primary/80 bg-card' },
    { id: 'bewerbung', title: 'Bewerbung eingereicht', color: 'border-t-4 border-t-primary/70 bg-card' },
    { id: 'ueberpruefung', title: 'Überprüfung', color: 'border-t-4 border-t-primary/60 bg-card' },
    { id: 'verhandlung', title: 'Angebot / Verhandlung', color: 'border-t-4 border-t-primary/50 bg-card' },
    { id: 'onhold', title: 'On Hold', color: 'border-t-4 border-t-muted-foreground bg-card' },
    { id: 'vertrag', title: 'Unter Vertrag', color: 'border-t-4 border-t-green-500 bg-card' },
  ];

  // Get card details from the subcontractorDetails object
  const getSubcontractorDetails = (id: number) => {
    return subcontractorDetails[id] || null;
  };

  // Handler for opening details page
  const handleOpenDetails = (cardId: number) => {
    navigate(`/shipper/crm/details/${cardId}`);
  };

  // Funktion zum Verschieben einer Karte zwischen Phasen
  const handleCardMove = (cardId: number, sourceColumn: string, targetColumn: string) => {
    if (sourceColumn === targetColumn) return;

    setCards(prevCards => {
      const newCards = { ...prevCards };
      
      // Finde die Karte in der Quellspalte
      const cardIndex = newCards[sourceColumn].findIndex(card => card.id === cardId);
      if (cardIndex === -1) return prevCards;
      
      // Entferne die Karte aus der Quellspalte
      const [movedCard] = newCards[sourceColumn].splice(cardIndex, 1);
      
      // Füge die Karte zur Zielspalte hinzu
      newCards[targetColumn] = [...newCards[targetColumn], movedCard];
      
      // Toast-Benachrichtigung
      toast({
        title: "Karte verschoben",
        description: `${movedCard.title} wurde nach ${columns.find(col => col.id === targetColumn)?.title} verschoben`,
      });
      
      return newCards;
    });
  };

  // Drag-and-Drop-Funktionen
  const handleDragStart = (e: React.DragEvent, cardId: number, column: string) => {
    e.dataTransfer.setData('cardId', cardId.toString());
    e.dataTransfer.setData('sourceColumn', column);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('cardId'));
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    handleCardMove(cardId, sourceColumn, targetColumn);
  };

  // Render the badge for certification
  const renderCertificationBadge = (name: string, isActive: boolean) => {
    if (!isActive) return null;
    
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        <ShieldCheck className="mr-1 h-3 w-3" /> {name}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SRM</h1>
          <p className="text-muted-foreground">
            Subcontractor Relationship Management: Verwalten Sie Ihre Subunternehmer-Beziehungen.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer Kontakt
        </Button>
      </div>
      
      {/* Erweiterte Filterleiste mit Pipeline-Auswahl */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Nach Subunternehmern suchen..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {/* Pipeline-Auswahl */}
              <div className="w-48">
                <Select value={selectedPipeline} onValueChange={handlePipelineChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pipeline auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map(pipeline => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>{pipeline.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorität" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Prioritäten</SelectItem>
                    <SelectItem value="Hoch">Hoch</SelectItem>
                    <SelectItem value="Mittel">Mittel</SelectItem>
                    <SelectItem value="Niedrig">Niedrig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedPriority('all');
                setSelectedDate('');
              }}>
                Zurücksetzen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Kanban Board mit horizontaler Scrollbar und Drag-and-Drop-Funktionalität */}
      <div className="overflow-x-auto pb-6">
        <div className="grid grid-cols-7 gap-4" style={{ minWidth: '1400px' }}>
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="flex flex-col h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={`${column.color} px-4 py-2 rounded-t-lg flex items-center justify-between shadow-sm`}>
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="bg-background">
                  {filteredCards[column.id]?.length || 0}
                </Badge>
              </div>
              
              <div className="bg-muted/10 p-2 flex-grow rounded-b-lg min-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  {filteredCards[column.id]?.map((card) => (
                    <div key={card.id}>
                      <Card 
                        className="cursor-move hover:shadow-md transition-shadow card-modern group"
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                        onClick={() => handleOpenDetails(card.id)}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                            <div className="flex items-center gap-2">
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                    <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent align="end" className="w-40 p-2">
                                  <p className="text-xs text-center">Zum Verschieben ziehen oder Aktionsmenü verwenden</p>
                                </HoverCardContent>
                              </HoverCard>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDetails(card.id);
                                  }}>
                                    Detailansicht
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Verschieben nach</DropdownMenuLabel>
                                  {columns.filter(c => c.id !== column.id).map(col => (
                                    <DropdownMenuItem 
                                      key={col.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardMove(card.id, column.id, col.id);
                                      }}
                                    >
                                      {col.title}
                                    </DropdownMenuItem>
                                  ))}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Löschen</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <CardDescription className="mt-1">{card.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-sm">
                            <span className="font-medium">Kontakt:</span> {card.contact}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline" className={priorityColors[card.priority]}>
                            {card.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{card.date}</span>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrmPage;
