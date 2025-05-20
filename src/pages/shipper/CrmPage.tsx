
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Plus, Search, MoreHorizontal, MoveHorizontal } from 'lucide-react';
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
                    <Card 
                      key={card.id} 
                      className="cursor-move hover:shadow-md transition-shadow card-modern"
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Verschieben nach</DropdownMenuLabel>
                                {columns.filter(c => c.id !== column.id).map(col => (
                                  <DropdownMenuItem 
                                    key={col.id}
                                    onClick={() => handleCardMove(card.id, column.id, col.id)}
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
