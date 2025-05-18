
import React, { useState } from 'react';
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
  { id: 'polish', label: 'Polnisch' },
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

const PreferencesForm: React.FC = () => {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState<string[]>([]);
  const [currentRoute, setCurrentRoute] = useState('');
  
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

  const onSubmit = (data: PreferencesFormValues) => {
    console.log('Form submitted:', data);
    
    // Here you would typically save the data to your backend
    toast.success('Präferenzen erfolgreich gespeichert');
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

        <Button type="submit" className="w-full md:w-auto">Präferenzen speichern</Button>
      </form>
    </Form>
  );
};

export default PreferencesForm;
