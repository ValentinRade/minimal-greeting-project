
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight, X } from 'lucide-react';
import TenderFormNavigation from './TenderFormNavigation';

// Define the form schema for the first step
const generalDetailsSchema = z.object({
  tenderType: z.enum(['transport_route', 'fixed_area']),
  title: z.string().min(3, { message: 'Titel muss mindestens 3 Zeichen lang sein' }),
  description: z.string().min(10, { message: 'Beschreibung muss mindestens 10 Zeichen lang sein' }),
  showContactInfo: z.boolean().default(false),
  prequalifications: z.array(z.string()).optional(),
  duration: z.object({
    value: z.string().min(1, { message: 'Bitte geben Sie einen Wert ein' }),
    unit: z.enum(['days', 'weeks', 'months'])
  }),
  documentsRequired: z.array(z.string()).optional(),
  commercialCalculation: z.enum(['yes', 'no']),
  serviceProviderOption: z.enum(['own_fleet', 'single_provider']),
  inviteServiceProviders: z.object({
    email: z.string().email().optional().or(z.literal('')),
    confirmed: z.boolean().default(false)
  }).optional()
});

// Define the form schema for the second step
const contractorPreferencesSchema = z.object({
  experience: z.enum(['less_than_1_year', 'more_than_1_year', 'more_than_2_years', 'more_than_3_years']),
  fleetSize: z.enum(['less_than_3_vehicles', '3_or_more_vehicles']),
  vehicleAge: z.enum(['less_than_1_year', 'more_than_1_year', 'more_than_2_years']),
  regionality: z.enum(['local', 'international']),
  industryExperience: z.enum(['yes', 'no']),
  flexibility: z.enum(['1_day', '1_week', '1_month', 'more_than_1_month'])
});

// Combined schema types
type GeneralDetailsFormValues = z.infer<typeof generalDetailsSchema>;
type ContractorPreferencesFormValues = z.infer<typeof contractorPreferencesSchema>;

const prequalificationOptions = [
  { id: 'pq_kep', label: 'PQ KEP' },
  { id: 'adr', label: 'ADR' },
  { id: 'eu_license', label: 'EU-Lizenz' },
  { id: 'adr_1000', label: 'ADR bis 1000 Punkte' },
];

const steps = [
  { id: 1, label: 'Ausschreibungsdetails' },
  { id: 2, label: 'Unternehmerpräferenzen' },
  { id: 3, label: 'Touren hinzufügen' },
];

const CreateTenderForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [generalDetails, setGeneralDetails] = useState<GeneralDetailsFormValues>();
  
  // General details form
  const generalDetailsForm = useForm<GeneralDetailsFormValues>({
    resolver: zodResolver(generalDetailsSchema),
    defaultValues: {
      tenderType: 'transport_route',
      showContactInfo: false,
      prequalifications: [],
      duration: { value: '', unit: 'days' },
      documentsRequired: [],
      commercialCalculation: 'no',
      serviceProviderOption: 'own_fleet',
      inviteServiceProviders: { email: '', confirmed: false }
    }
  });
  
  // Contractor preferences form
  const contractorPreferencesForm = useForm<ContractorPreferencesFormValues>({
    resolver: zodResolver(contractorPreferencesSchema),
    defaultValues: {
      experience: 'more_than_1_year',
      fleetSize: 'less_than_3_vehicles',
      vehicleAge: 'less_than_1_year',
      regionality: 'local',
      industryExperience: 'no',
      flexibility: '1_week'
    }
  });
  
  const handleGeneralDetailsSubmit = (data: GeneralDetailsFormValues) => {
    setGeneralDetails(data);
    setCurrentStep(2);
  };
  
  const handleContractorPreferencesSubmit = (data: ContractorPreferencesFormValues) => {
    // We would combine both forms' data and proceed
    setCurrentStep(3);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TenderFormNavigation 
        currentStep={currentStep} 
        steps={steps} 
        setCurrentStep={setCurrentStep} 
      />
      
      {currentStep === 1 && (
        <Form {...generalDetailsForm}>
          <form onSubmit={generalDetailsForm.handleSubmit(handleGeneralDetailsSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Ausschreibungsdetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tender Type */}
                <FormField
                  control={generalDetailsForm.control}
                  name="tenderType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Ausschreibungsart</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="transport_route" id="transport_route" />
                            <Label htmlFor="transport_route">Transportstrecke</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed_area" id="fixed_area" />
                            <Label htmlFor="fixed_area">Festes Einsatzgebiet</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Title */}
                <FormField
                  control={generalDetailsForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titel der Ausschreibung</FormLabel>
                      <FormControl>
                        <Input placeholder="Ausschreibungstitel eingeben" {...field} />
                      </FormControl>
                      <FormDescription>
                        Öffentlicher Titel der Ausschreibung
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Description */}
                <FormField
                  control={generalDetailsForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ausschreibungsbeschreibung</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Beschreiben Sie Ihre Ausschreibung im Detail" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Öffentliche Beschreibung der Ausschreibung
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Show Contact Info */}
                <FormField
                  control={generalDetailsForm.control}
                  name="showContactInfo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Kontaktdaten anzeigen?</FormLabel>
                        <FormDescription>
                          Ihre Kontaktdaten werden öffentlich in der Ausschreibung angezeigt
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Prequalifications */}
                <FormField
                  control={generalDetailsForm.control}
                  name="prequalifications"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Präqualifikationen</FormLabel>
                        <FormDescription>
                          Wählen Sie die erforderlichen Präqualifikationen
                        </FormDescription>
                      </div>
                      {prequalificationOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={generalDetailsForm.control}
                          name="prequalifications"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={generalDetailsForm.control}
                    name="duration.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ausschreibungsdauer</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="Dauer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalDetailsForm.control}
                    name="duration.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zeiteinheit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Zeiteinheit wählen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="days">Tage</SelectItem>
                            <SelectItem value="weeks">Wochen</SelectItem>
                            <SelectItem value="months">Monate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Document Upload - placeholder for now */}
                <FormItem>
                  <FormLabel>Dokumente hochladen (optional)</FormLabel>
                  <FormDescription>
                    Laden Sie relevante Dokumente für die Ausschreibung hoch
                  </FormDescription>
                  <div className="mt-2 flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Klicken zum Hochladen</span> oder Dateien hierher ziehen
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, XLS (max. 10MB pro Datei)</p>
                      </div>
                      <input type="file" className="hidden" multiple />
                    </label>
                  </div>
                </FormItem>
                
                {/* Commercial Calculation */}
                <FormField
                  control={generalDetailsForm.control}
                  name="commercialCalculation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Kaufmännische Kalkulation erforderlich?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="calc_yes" />
                            <Label htmlFor="calc_yes">Ja</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="calc_no" />
                            <Label htmlFor="calc_no">Nein</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Service Provider Options */}
                <FormField
                  control={generalDetailsForm.control}
                  name="serviceProviderOption"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Dienstleister-Optionen</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="own_fleet" id="own_fleet" />
                            <Label htmlFor="own_fleet">Dienstleister im Selbsteintritt mit eigenem Fuhrpark</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single_provider" id="single_provider" />
                            <Label htmlFor="single_provider">Alle Transporte an einen Dienstleister vergeben</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Invite Service Providers */}
                <FormField
                  control={generalDetailsForm.control}
                  name="inviteServiceProviders.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Einladung von Dienstleistern (optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="E-Mail-Adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generalDetailsForm.control}
                  name="inviteServiceProviders.confirmed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Dienstleister per E-Mail einladen</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                Weiter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      {currentStep === 2 && (
        <Form {...contractorPreferencesForm}>
          <form onSubmit={contractorPreferencesForm.handleSubmit(handleContractorPreferencesSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Unternehmerpräferenzen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Experience */}
                <FormField
                  control={contractorPreferencesForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Erfahrung im Transportgeschäft</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Erfahrung wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="less_than_1_year">&lt;1 Jahr</SelectItem>
                          <SelectItem value="more_than_1_year">&gt;1 Jahr</SelectItem>
                          <SelectItem value="more_than_2_years">&gt;2 Jahre</SelectItem>
                          <SelectItem value="more_than_3_years">≥3 Jahre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Fleet Size */}
                <FormField
                  control={contractorPreferencesForm.control}
                  name="fleetSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flottengröße</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Flottengröße wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="less_than_3_vehicles">&lt;3 Fahrzeuge</SelectItem>
                          <SelectItem value="3_or_more_vehicles">≥3 Fahrzeuge</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Vehicle Age */}
                <FormField
                  control={contractorPreferencesForm.control}
                  name="vehicleAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alter der Fahrzeuge</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Fahrzeugalter wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="less_than_1_year">&lt;1 Jahr</SelectItem>
                          <SelectItem value="more_than_1_year">&gt;1 Jahr</SelectItem>
                          <SelectItem value="more_than_2_years">&gt;2 Jahre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Regionality */}
                <FormField
                  control={contractorPreferencesForm.control}
                  name="regionality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regionalität vs. Internationalität</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Regionalität wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="local">Lokal</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Industry Experience */}
                <FormField
                  control={contractorPreferencesForm.control}
                  name="industryExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branchenerfahrung</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Branchenerfahrung wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Ja</SelectItem>
                          <SelectItem value="no">Nein</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Flexibility */}
                <FormField
                  control={contractorPreferencesForm.control}
                  name="flexibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flexibilität / Reaktionszeit</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Flexibilität wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1_day">1 Tag</SelectItem>
                          <SelectItem value="1_week">1 Woche</SelectItem>
                          <SelectItem value="1_month">1 Monat</SelectItem>
                          <SelectItem value="more_than_1_month">&gt;1 Monat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
              >
                Zurück
              </Button>
              <Button type="submit" className="gap-2">
                Touren hinzufügen
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Touren hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Dieser Abschnitt wird später implementiert.
            </p>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(2)}
              >
                Zurück
              </Button>
              <Button type="button">
                Speichern
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateTenderForm;
