
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Plus, Search, MoreHorizontal } from 'lucide-react';
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

// Dummy-Daten für das Kanban-Board
const initialCards = {
  lead: [
    { id: 1, title: 'Media GmbH', description: 'Interessiert an Logistikdienstleistungen', priority: 'Hoch', contact: 'M. Müller', date: '2025-05-25' },
    { id: 2, title: 'TechCorp AG', description: 'Anfrage für regelmäßige Transporte', priority: 'Mittel', contact: 'S. Schmidt', date: '2025-05-26' },
  ],
  contact: [
    { id: 3, title: 'Furniture World', description: 'Preisanfrage für Möbeltransporte', priority: 'Hoch', contact: 'L. Weber', date: '2025-05-23' },
    { id: 4, title: 'SoftDev GmbH', description: 'Meeting vereinbart für nächste Woche', priority: 'Niedrig', contact: 'K. Fischer', date: '2025-05-30' },
  ],
  proposal: [
    { id: 5, title: 'GreenTech Ltd.', description: 'Angebot für umweltfreundliche Logistik', priority: 'Mittel', contact: 'T. Becker', date: '2025-05-29' },
  ],
  customer: [
    { id: 6, title: 'MetalWorks Inc.', description: 'Bestehender Kunde seit 2024', priority: 'Hoch', contact: 'R. Hoffmann', date: '2025-06-01' },
    { id: 7, title: 'EcoShipping AG', description: 'Vertrag bis Ende 2025', priority: 'Mittel', contact: 'C. Meyer', date: '2025-05-28' },
  ],
};

// Prioritätsfarben für Badges
const priorityColors = {
  Hoch: "bg-red-100 text-red-800 hover:bg-red-200",
  Mittel: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  Niedrig: "bg-green-100 text-green-800 hover:bg-green-200",
};

const CrmPage: React.FC = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Filtern der Karten basierend auf den Filterkriterien
  const getFilteredCards = () => {
    const filtered = {};
    
    Object.keys(cards).forEach(column => {
      filtered[column] = cards[column].filter(card => {
        const matchesSearch = searchQuery === '' || 
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.contact.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPriority = selectedPriority === '' || card.priority === selectedPriority;
        
        const matchesDate = selectedDate === '' || card.date === selectedDate;
        
        return matchesSearch && matchesPriority && matchesDate;
      });
    });
    
    return filtered;
  };
  
  const filteredCards = getFilteredCards();
  
  // Kanban Spalten-Konfiguration
  const columns = [
    { id: 'lead', title: 'Leads', color: 'bg-blue-500' },
    { id: 'contact', title: 'Kontaktiert', color: 'bg-purple-500' },
    { id: 'proposal', title: 'Angebot', color: 'bg-amber-500' },
    { id: 'customer', title: 'Kunde', color: 'bg-green-500' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Kunden- und Geschäftsbeziehungen.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neuer Kontakt
        </Button>
      </div>
      
      {/* Filterleiste */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Nach Kontakten suchen..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
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
      
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col h-full">
            <div className={`${column.color} px-4 py-2 rounded-t-lg flex items-center justify-between`}>
              <h3 className="font-semibold text-white">{column.title}</h3>
              <Badge variant="secondary" className="bg-white bg-opacity-20">
                {filteredCards[column.id].length}
              </Badge>
            </div>
            
            <div className="bg-slate-100 p-2 flex-grow rounded-b-lg min-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {filteredCards[column.id].map((card) => (
                  <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
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
                            <DropdownMenuItem>Verschieben</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Löschen</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
  );
};

export default CrmPage;
