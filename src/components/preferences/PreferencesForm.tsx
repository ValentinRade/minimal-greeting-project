import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

// Generate year options from 2000 to 2025
const yearOptions = Array.from({ length: 26 }, (_, i) => (2000 + i).toString());

// Generate month options from 01 to 12
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return month < 10 ? `0${month}` : `${month}`;
});

// Tour types options
const tourTypesOptions = [
  { id: 'parcel', label: 'Stückgut' },
  { id: 'partial', label: 'Teil-/Komplettladung' },
  { id: 'express', label: 'Expressfahrten' },
  { id: 'dangerous', label: 'Gefahrgut (ADR)' },
  { id: 'refrigerated', label: 'Kühltransporte' },
  { id: 'night', label: 'Nachtfahrten' },
  { id: 'bulk', label: 'Sammelgut' },
  { id: 'just_in_time', label: 'Just-in-Time-Lieferungen' },
  { id: 'charter', label: 'Charterfahrten' },
  { id: 'intermodal', label: 'Intermodale Transporte' },
  { id: 'oversize', label: 'Oversize/Schwertransporte' },
];

// Client types options
const clientTypesOptions = [
  { id: 'industry', label: 'Industrie' },
  { id: 'wholesale', label: 'Großhandel' },
  { id: 'retail', label: 'Einzelhandel' },
  { id: 'courier', label: 'Kurierdienste' },
  { id: 'automotive', label: 'Automobilwirtschaft' },
  { id: 'pharma', label: 'Pharmalogistik' },
  { id: 'agriculture', label: 'Landwirtschaft' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'building_materials', label: 'Baustoffhandel' },
];

// Languages options
const languagesOptions = [
  { id: 'german', label: 'Deutsch' },
  { id: 'english', label: 'Englisch' },
  { id: 'french', label: 'Französisch' },
  { id: 'spanish', label: 'Spanisch' },
  { id: 'polish', label: 'Polisch' },
];

// Form schema with validation
const formSchema = z.object({
  start_date_transport: z.object({
    month: z.string(),
    year: z.string(),
  }),
  team_size: z.object({
    drivers: z.coerce.number().min(0, 'Wert muss größer oder gleich 0 sein'),
    dispatchers: z.coerce.number().min(0, 'Wert muss größer oder gleich 0 sein'),
    others: z.coerce.number().min(0, 'Wert muss größer oder gleich 0 sein'),
  }),
  preferred_tour_types: z.array(z.string()).min(1, 'Wählen Sie mindestens eine Option aus'),
  flexibility: z.enum(['spot', 'fixed', 'both', '24_7']),
  specialization: z.string().max(500, 'Maximal 500 Zeichen erlaubt'),
  frequent_routes: z.array(z.string().max(50, 'Maximal 50 Zeichen pro Eintrag')).max(5, 'Maximal 5 Einträge erlaubt'),
  client_types: z.array(z.string()).min(1, 'Wählen Sie mindestens eine Option aus'),
  communication: z.object({
    response_time: z.enum(['less_1h', '1_4h', '4_24h', 'more_24h']),
    languages: z.array(z.string()).min(1, 'Wählen Sie mindestens eine Sprache aus'),
  }),
  problem_handling: z.string().max(500, 'Maximal 500 Zeichen erlaubt'),
  expectations_from_shipper: z.string().max(500, 'Maximal 500 Zeichen erlaubt'),
  order_preference: z.enum(['regular', 'spontaneous']),
});

type PreferencesFormValues = z.infer<typeof formSchema>;

// Helper type for Supabase JSON format
// Updated to account for the Json type from Supabase
type JsonFormData = {
  start_date_transport: Json; 
  team_size: Json; 
  communication: Json; 
  preferred_tour_types: string[];
  flexibility: string;
  specialization: string | null;
  frequent_routes: string[];
  client_types: string[];
  problem_handling: string | null;
  expectations_from_shipper: string | null;
  order_preference: string;
  [key: string]: any;
}

const PreferencesForm: React.FC = () => {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date_transport: {
        month: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
        year: new Date().getFullYear().toString(),
      },
      team_size: {
        drivers: 0,
        dispatchers: 0,
        others: 0,
      },
      preferred_tour_types: [],
      flexibility: 'both',
      specialization: '',
      frequent_routes: [],
      client_types: [],
      communication: {
        response_time: '1_4h',
        languages: ['german'],
      },
      problem_handling: '',
      expectations_from_shipper: '',
      order_preference: 'regular',
    },
  });

  // Get current session and user information
  const getUserAndCompany = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Get user's company
    const { data: companyUsers, error: companyError } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', session.user.id)
      .single();

    if (companyError || !companyUsers) {
      throw new Error('Company not found');
    }

    return { userId: session.user.id, companyId: companyUsers.company_id };
  };

  // Query to fetch existing preferences
  const { data: userPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['subcontractorPreferences'],
    queryFn: async () => {
      try {
        const { userId, companyId } = await getUserAndCompany();
        
        const { data, error } = await supabase
          .from('subcontractor_preferences')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId)
          .single();
          
        if (error) {
          // If no data is found, this isn't an error - the user just hasn't set preferences yet
          if (error.code === 'PGRST116') {
            return null;
          }
          console.error('Error fetching preferences:', error);
          throw error;
        }
        
        return data as unknown as JsonFormData; // Properly cast through unknown
      } catch (error) {
        console.error('Error in preferences query:', error);
        return null;
      }
    },
  });
  
  // Mutation to save preferences
  const saveMutation = useMutation({
    mutationFn: async (data: PreferencesFormValues) => {
      const { userId, companyId } = await getUserAndCompany();
      
      const preferenceData = {
        user_id: userId,
        company_id: companyId,
        ...data
      };
      
      // Check if preferences already exist
      const { data: existingData } = await supabase
        .from('subcontractor_preferences')
        .select('id')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .single();
      
      if (existingData) {
        // Update existing preferences
        const { error } = await supabase
          .from('subcontractor_preferences')
          .update(preferenceData)
          .eq('id', existingData.id);
          
        if (error) throw error;
        return 'updated';
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('subcontractor_preferences')
          .insert(preferenceData);
          
        if (error) throw error;
        return 'created';
      }
    },
    onSuccess: (result) => {
      if (result === 'updated') {
        toast.success('Präferenzen erfolgreich aktualisiert');
      } else {
        toast.success('Präferenzen erfolgreich gespeichert');
      }
    },
    onError: (error) => {
      console.error('Error saving preferences:', error);
      toast.error('Fehler beim Speichern der Präferenzen');
    },
  });

  // Load existing preferences into form when data is fetched
  useEffect(() => {
    if (userPreferences) {
      try {
        // Parse JSON data safely from Supabase
        // Handle start_date_transport
        let startDateTransport = { month: monthOptions[0], year: yearOptions[0] };
        if (userPreferences.start_date_transport) {
          const startTransport = userPreferences.start_date_transport as any;
          if (typeof startTransport === 'object' && startTransport !== null) {
            startDateTransport = {
              month: typeof startTransport.month === 'string' ? startTransport.month : monthOptions[0],
              year: typeof startTransport.year === 'string' ? startTransport.year : yearOptions[0]
            };
          }
        }
        
        // Handle team_size
        let teamSize = { drivers: 0, dispatchers: 0, others: 0 };
        if (userPreferences.team_size) {
          const team = userPreferences.team_size as any;
          if (typeof team === 'object' && team !== null) {
            teamSize = {
              drivers: typeof team.drivers === 'number' ? team.drivers : 0,
              dispatchers: typeof team.dispatchers === 'number' ? team.dispatchers : 0,
              others: typeof team.others === 'number' ? team.others : 0
            };
          }
        }
        
        // Handle communication with proper type handling
        let communication = { 
          response_time: '1_4h' as 'less_1h' | '1_4h' | '4_24h' | 'more_24h', 
          languages: ['german'] 
        };
        
        if (userPreferences.communication) {
          const comm = userPreferences.communication as any;
          if (typeof comm === 'object' && comm !== null) {
            // Make sure the response_time is one of the valid enum values
            const validResponseTimes = ['less_1h', '1_4h', '4_24h', 'more_24h'];
            const responseTime = typeof comm.response_time === 'string' && 
              validResponseTimes.includes(comm.response_time) ? 
              comm.response_time as 'less_1h' | '1_4h' | '4_24h' | 'more_24h' : 
              '1_4h';
              
            communication = {
              response_time: responseTime,
              languages: Array.isArray(comm.languages) ? comm.languages : ['german']
            };
          }
        }
        
        // Reset the form with the parsed values
        form.reset({
          start_date_transport: startDateTransport,
          team_size: teamSize,
          preferred_tour_types: Array.isArray(userPreferences.preferred_tour_types) ? 
            userPreferences.preferred_tour_types : [],
          flexibility: (userPreferences.flexibility || 'both') as 'spot' | 'fixed' | 'both' | '24_7',
          specialization: userPreferences.specialization || '',
          frequent_routes: Array.isArray(userPreferences.frequent_routes) ? 
            userPreferences.frequent_routes : [],
          client_types: Array.isArray(userPreferences.client_types) ? 
            userPreferences.client_types : [],
          communication: communication,
          problem_handling: userPreferences.problem_handling || '',
          expectations_from_shipper: userPreferences.expectations_from_shipper || '',
          order_preference: (userPreferences.order_preference || 'regular') as 'regular' | 'spontaneous',
        });
        
        // Update routes state to match the loaded preferences
        setRoutes(Array.isArray(userPreferences.frequent_routes) ? 
          userPreferences.frequent_routes : []);
      } catch (error) {
        console.error('Error parsing preference data:', error);
        toast.error('Fehler beim Laden der Präferenzen');
      }
    }
  }, [userPreferences, form]);

  const onSubmit = async (data: PreferencesFormValues) => {
    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRoute = () => {
    if (!currentRoute) return;
    if (routes.length >= 5) {
      toast.error('Maximal 5 Strecken erlaubt');
      return;
    }
    if (currentRoute.length > 50) {
      toast.error('Maximal 50 Zeichen pro Strecke erlaubt');
      return;
    }

    const newRoutes = [...routes, currentRoute];
    setRoutes(newRoutes);
    form.setValue('frequent_routes', newRoutes);
    setCurrentRoute('');
  };

  const removeRoute = (index: number) => {
    const newRoutes = routes.filter((_, i) => i !== index);
    setRoutes(newRoutes);
    form.setValue('frequent_routes', newRoutes);
  };

  if (isLoadingPreferences) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2">Daten werden geladen...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Start Date Transport */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Seit wann ist Ihr Unternehmen im Transportbereich aktiv?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date_transport.month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Monat auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date_transport.year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jahr</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Jahr auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Team Size */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Wie groß ist Ihr Team aktuell?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="team_size.drivers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fahrer</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_size.dispatchers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponenten</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_size.others"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weitere</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Preferred Tour Types */}
        <FormField
          control={form.control}
          name="preferred_tour_types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg font-medium">Welche Art von Touren übernehmen Sie bevorzugt?</FormLabel>
                <FormDescription>Wählen Sie alle zutreffenden Optionen aus.</FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tourTypesOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="preferred_tour_types"
                    render={({ field }) => {
                      return (
                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(field.value?.filter((value) => value !== option.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Flexibility */}
        <FormField
          control={form.control}
          name="flexibility"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-medium">Wie flexibel ist Ihre Einsatzbereitschaft?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="spot" />
                    </FormControl>
                    <FormLabel className="font-normal">Nur Spot-Geschäft</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="fixed" />
                    </FormControl>
                    <FormLabel className="font-normal">Nur feste Termin-Touren</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="both" />
                    </FormControl>
                    <FormLabel className="font-normal">Beides (Spot + Termin)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="24_7" />
                    </FormControl>
                    <FormLabel className="font-normal">24/7-Bereitschaft</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specialization */}
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Worin liegt Ihre besondere Stärke oder Spezialisierung?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Beschreiben Sie Ihre Stärken oder Spezialisierungen..." 
                  className="min-h-[100px]" 
                  {...field} 
                  maxLength={500}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/500 Zeichen
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequent Routes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Welche Strecken bedienen Sie am häufigsten?</h3>
          <FormDescription>Geben Sie bis zu 5 häufig bediente Strecken ein.</FormDescription>

          <div className="flex items-center gap-2">
            <Input 
              value={currentRoute}
              onChange={(e) => setCurrentRoute(e.target.value)}
              placeholder="z.B. München → Berlin"
              className="flex-1"
              maxLength={50}
            />
            <Button type="button" onClick={addRoute}>Hinzufügen</Button>
          </div>

          <div className="space-y-2">
            {routes.map((route, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span>{route}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoute(index)}
                >
                  Entfernen
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.frequent_routes && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.frequent_routes.message}</p>
          )}
        </div>

        {/* Client Types */}
        <FormField
          control={form.control}
          name="client_types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg font-medium">Welche Auftraggeber-Typen kennen Sie aus der Praxis?</FormLabel>
                <FormDescription>Wählen Sie alle zutreffenden Optionen aus.</FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clientTypesOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="client_types"
                    render={({ field }) => {
                      return (
                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.id])
                                  : field.onChange(field.value?.filter((value) => value !== option.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Communication */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Wie läuft bei Ihnen typischerweise die Kommunikation ab?</h3>
          
          {/* Communication Response Time */}
          <FormField
            control={form.control}
            name="communication.response_time"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Antwortzeit</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="less_1h" />
                      </FormControl>
                      <FormLabel className="font-normal">&#60; 1 h</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1_4h" />
                      </FormControl>
                      <FormLabel className="font-normal">1–4 h</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="4_24h" />
                      </FormControl>
                      <FormLabel className="font-normal">4–24 h</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="more_24h" />
                      </FormControl>
                      <FormLabel className="font-normal">&#62; 24 h</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Communication Languages */}
          <FormField
            control={form.control}
            name="communication.languages"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Sprachen</FormLabel>
                  <FormDescription>Wählen Sie alle zutreffenden Sprachen aus.</FormDescription>
                </div>
                <div className="flex flex-wrap gap-6">
                  {languagesOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="communication.languages"
                      render={({ field }) => {
                        return (
                          <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(field.value?.filter((value) => value !== option.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Problem Handling */}
        <FormField
          control={form.control}
          name="problem_handling"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Wie gehen Sie mit Problemen während der Transporte um?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Beschreiben Sie Ihren Umgang mit Problemen..." 
                  className="min-h-[100px]" 
                  {...field} 
                  maxLength={500}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/500 Zeichen
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expectations From Shipper */}
        <FormField
          control={form.control}
          name="expectations_from_shipper"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">Was erwarten Sie von einem Versender für eine gute Zusammenarbeit?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Beschreiben Sie Ihre Erwartungen..." 
                  className="min-h-[100px]" 
                  {...field} 
                  maxLength={500}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/500 Zeichen
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Order Preference */}
        <FormField
          control={form.control}
          name="order_preference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-medium">Möchten Sie regelmäßig Aufträge erhalten oder lieber spontane Einzelfahrten?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="regular" />
                    </FormControl>
                    <FormLabel className="font-normal">Regelmäßig (z. B. Wochenlimits vereinbar)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="spontaneous" />
                    </FormControl>
                    <FormLabel className="font-normal">Spontan/Einzelfahrten</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            'Präferenzen speichern'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PreferencesForm;
