
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Truck, 
  Plus, 
  Search, 
  Route, 
  Map, 
  Calendar, 
  Filter, 
  ArrowUpDown 
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Types for our mock data
interface SpotLoad {
  id: string;
  title: string;
  origin: string;
  destination: string;
  date: string;
  price: number;
  weight: string;
  volume: string;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  vehicle_type: string;
  urgency: 'high' | 'medium' | 'low';
  distance: number;
}

// Mock data for spot loads
const mockSpotLoads: SpotLoad[] = [
  {
    id: 'SL-001',
    title: 'Palettenlieferung Frankfurt - Berlin',
    origin: 'Frankfurt am Main',
    destination: 'Berlin',
    date: '2025-05-25',
    price: 450,
    weight: '750 kg',
    volume: '2 Paletten',
    status: 'available',
    vehicle_type: 'Sprinter',
    urgency: 'medium',
    distance: 545
  },
  {
    id: 'SL-002',
    title: 'Gekühlte Lebensmittel Hamburg - München',
    origin: 'Hamburg',
    destination: 'München',
    date: '2025-05-22',
    price: 980,
    weight: '1.2 t',
    volume: '4 Paletten',
    status: 'booked',
    vehicle_type: 'Kühl-LKW',
    urgency: 'high',
    distance: 790
  },
  {
    id: 'SL-003',
    title: 'Bauteile Düsseldorf - Stuttgart',
    origin: 'Düsseldorf',
    destination: 'Stuttgart',
    date: '2025-05-27',
    price: 550,
    weight: '1.5 t',
    volume: '3 Paletten',
    status: 'available',
    vehicle_type: '7.5t LKW',
    urgency: 'low',
    distance: 435
  },
  {
    id: 'SL-004',
    title: 'Elektroniklieferung Köln - Leipzig',
    origin: 'Köln',
    destination: 'Leipzig',
    date: '2025-05-23',
    price: 480,
    weight: '400 kg',
    volume: '1.5 Paletten',
    status: 'available',
    vehicle_type: 'Transporter',
    urgency: 'medium',
    distance: 480
  },
  {
    id: 'SL-005',
    title: 'Express Medikamentenlieferung Hannover - Dresden',
    origin: 'Hannover',
    destination: 'Dresden',
    date: '2025-05-21',
    price: 520,
    weight: '200 kg',
    volume: '1 Palette',
    status: 'completed',
    vehicle_type: 'Sprinter',
    urgency: 'high',
    distance: 395
  },
  {
    id: 'SL-006',
    title: 'Möbeltransport Bremen - Nürnberg',
    origin: 'Bremen',
    destination: 'Nürnberg',
    date: '2025-05-29',
    price: 850,
    weight: '2.5 t',
    volume: '12 m³',
    status: 'available',
    vehicle_type: '7.5t LKW',
    urgency: 'low',
    distance: 595
  },
  {
    id: 'SL-007',
    title: 'Maschinen Aachen - Chemnitz',
    origin: 'Aachen',
    destination: 'Chemnitz',
    date: '2025-05-24',
    price: 720,
    weight: '3 t',
    volume: '8 m³',
    status: 'cancelled',
    vehicle_type: '12t LKW',
    urgency: 'medium',
    distance: 625
  },
  {
    id: 'SL-008',
    title: 'Autoteile Wolfsburg - Regensburg',
    origin: 'Wolfsburg',
    destination: 'Regensburg',
    date: '2025-05-26',
    price: 580,
    weight: '1.8 t',
    volume: '6 m³',
    status: 'booked',
    vehicle_type: '7.5t LKW',
    urgency: 'high',
    distance: 485
  }
];

const SpotLoadsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort the spot loads
  const filteredSpotLoads = mockSpotLoads.filter(load => {
    // Search filter
    const searchLowerCase = searchTerm.toLowerCase();
    const matchesSearch = 
      load.title.toLowerCase().includes(searchLowerCase) ||
      load.origin.toLowerCase().includes(searchLowerCase) ||
      load.destination.toLowerCase().includes(searchLowerCase);
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
    
    // Urgency filter
    const matchesUrgency = urgencyFilter === 'all' || load.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  }).sort((a, b) => {
    // Sort by selected property
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'distance') {
      comparison = a.distance - b.distance;
    }
    
    // Adjust for sort direction
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: de });
    } catch (error) {
      return 'Ungültiges Datum';
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: SpotLoad['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Verfügbar</Badge>;
      case 'booked':
        return <Badge className="bg-blue-500">Gebucht</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Abgeschlossen</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Storniert</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get urgency badge
  const getUrgencyBadge = (urgency: SpotLoad['urgency']) => {
    switch (urgency) {
      case 'high':
        return <Badge className="bg-red-500">Hoch</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Mittel</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Niedrig</Badge>;
      default:
        return <Badge>{urgency}</Badge>;
    }
  };
  
  // Toggle sort direction
  const handleSortToggle = (column: string) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spot-Ladungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie kurzfristige Transporte und Spot-Ladungen.
          </p>
        </div>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Neue Spot-Ladung
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter</CardTitle>
          <CardDescription>Filtern Sie Ihre Spot-Ladungen nach verschiedenen Kriterien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suchen..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="available">Verfügbar</SelectItem>
                <SelectItem value="booked">Gebucht</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Dringlichkeit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Dringlichkeiten</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="low">Niedrig</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Spot Loads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Spot-Ladungen</CardTitle>
          <CardDescription>
            Liste aller verfügbaren und gebuchten Spot-Ladungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transport</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortToggle('date')}>
                      Datum
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Fahrzeugtyp</TableHead>
                  <TableHead>Fracht</TableHead>
                  <TableHead className="text-center">Dringlichkeit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSortToggle('distance')}>
                      Distanz
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSortToggle('price')}>
                      Preis
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpotLoads.map((load) => (
                  <TableRow key={load.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{load.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(load.date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Route className="h-3 w-3 text-muted-foreground" />
                        {load.origin} → {load.destination}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        {load.vehicle_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      {load.weight}, {load.volume}
                    </TableCell>
                    <TableCell className="text-center">{getUrgencyBadge(load.urgency)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(load.status)}</TableCell>
                    <TableCell>{load.distance} km</TableCell>
                    <TableCell className="text-right font-medium">{load.price} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotLoadsPage;
