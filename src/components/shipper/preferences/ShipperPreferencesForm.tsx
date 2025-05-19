
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ShipperPreferencesFormData, ShipperPreferences } from '@/types/shipperPreference';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createShipperPreferences, updateShipperPreferences } from '@/services/shipperPreferencesService';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShipperPreferencesFormProps {
  initialData?: ShipperPreferences;
  onSuccess: (data: ShipperPreferences) => void;
}

const ShipperPreferencesForm: React.FC<ShipperPreferencesFormProps> = ({ initialData, onSuccess }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: ShipperPreferencesFormData = {
    industry: initialData?.industry || '',
    transport_routes: initialData?.transport_routes || [],
    transport_types: initialData?.transport_types || [],
    vehicle_types: initialData?.vehicle_types || [],
    subcontractor_frequency: initialData?.subcontractor_frequency || 'monthly',
    selection_criteria: initialData?.selection_criteria || {
      price: false,
      punctuality: false,
      communication: false,
      vehicle_condition: false,
      experience: false,
      language_skills: false,
      ratings: false,
      flexibility: false,
      regional_availability: false,
      documentation: false,
      weekend_availability: false,
      longterm_cooperation: false,
      sensitive_cargo: false
    },
    required_languages: initialData?.required_languages || [],
    industry_requirements: initialData?.industry_requirements || '',
    partnership_preference: initialData?.partnership_preference || 'both',
    communication_preferences: initialData?.communication_preferences || '',
    additional_requirements: initialData?.additional_requirements || ''
  };

  const form = useForm<ShipperPreferencesFormData>({
    defaultValues,
  });

  const handleSubmit = async (data: ShipperPreferencesFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      let result;
      if (initialData) {
        result = await updateShipperPreferences(initialData.id, data);
        toast({
          title: "Präferenzen aktualisiert",
          description: "Ihre Präferenzen wurden erfolgreich aktualisiert.",
        });
      } else {
        result = await createShipperPreferences(data);
        toast({
          title: "Präferenzen gespeichert",
          description: "Ihre Präferenzen wurden erfolgreich gespeichert.",
        });
      }
      onSuccess(result);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransportRoutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const routes = value.split(',').map(route => route.trim()).filter(route => route !== '');
    form.setValue('transport_routes', routes);
  };

  const handleTransportTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const types = value.split(',').map(type => type.trim()).filter(type => type !== '');
    form.setValue('transport_types', types);
  };

  const handleVehicleTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const types = value.split(',').map(type => type.trim()).filter(type => type !== '');
    form.setValue('vehicle_types', types);
  };

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const languages = value.split(',').map(lang => lang.trim()).filter(lang => lang !== '');
    form.setValue('required_languages', languages);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>In welcher Branche ist Ihr Unternehmen tätig?</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Automobilindustrie, Einzelhandel, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Welche Relationen / Transportrouten sind für Sie regelmäßig relevant?</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="z.B. Hamburg-Berlin, Köln-Frankfurt, etc. (durch Komma getrennt)" 
                    defaultValue={form.getValues('transport_routes').join(', ')}
                    onChange={handleTransportRoutesChange}
                  />
                </FormControl>
                <FormDescription>Geben Sie mehrere Routen durch Kommas getrennt ein</FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Welche Arten von Transporten vergeben Sie am häufigsten?</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="z.B. Stückgut, Expresslieferung, etc. (durch Komma getrennt)" 
                    defaultValue={form.getValues('transport_types').join(', ')}
                    onChange={handleTransportTypesChange}
                  />
                </FormControl>
                <FormDescription>Geben Sie mehrere Transportarten durch Kommas getrennt ein</FormDescription>
              </FormItem>

              <FormItem>
                <FormLabel>Welche Fahrzeugtypen werden typischerweise benötigt?</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="z.B. Sprinter, 7,5t LKW, Kühlfahrzeug, etc. (durch Komma getrennt)" 
                    defaultValue={form.getValues('vehicle_types').join(', ')}
                    onChange={handleVehicleTypesChange}
                  />
                </FormControl>
                <FormDescription>Geben Sie mehrere Fahrzeugtypen durch Kommas getrennt ein</FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="subcontractor_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wie regelmäßig vergeben Sie Aufträge an Subunternehmer?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bitte auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Täglich</SelectItem>
                        <SelectItem value="weekly">Wöchentlich</SelectItem>
                        <SelectItem value="monthly">Monatlich</SelectItem>
                        <SelectItem value="quarterly">Quartalsweise</SelectItem>
                        <SelectItem value="rarely">Selten</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="mb-3 block">Was sind für Sie die wichtigsten Kriterien bei der Auswahl von Subunternehmern?</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="selection_criteria.price"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Preis</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.punctuality"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Pünktlichkeit / Termintreue</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.communication"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Kommunikationsfähigkeit</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.vehicle_condition"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Ausstattung & Zustand der Fahrzeuge</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.experience"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Erfahrung / Referenzen</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.language_skills"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Sprachkenntnisse</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.ratings"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Bewertungen auf carrinex</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.flexibility"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Flexibilität / Reaktionszeit</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.regional_availability"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Verfügbarkeit in Ihrer Region</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.documentation"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Zuverlässige Dokumentenübergabe</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.weekend_availability"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Verfügbarkeit an Wochenenden oder nachts</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.longterm_cooperation"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Bereitschaft zur langfristigen Zusammenarbeit</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="selection_criteria.sensitive_cargo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">Umgang mit sensibler oder besonders wertvoller Ware</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormItem>
                <FormLabel>Welche Sprachen sollten die Fahrer und Ansprechpartner der Subunternehmer idealerweise sprechen?</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="z.B. Deutsch, Englisch, etc. (durch Komma getrennt)" 
                    defaultValue={form.getValues('required_languages').join(', ')}
                    onChange={handleLanguagesChange}
                  />
                </FormControl>
                <FormDescription>Geben Sie mehrere Sprachen durch Kommas getrennt ein</FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="industry_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gibt es branchenspezifische Anforderungen?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Beschreiben Sie spezielle Anforderungen Ihrer Branche..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partnership_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sind Langzeitpartnerschaften oder kurzfristige Buchungen für Sie wichtiger?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bitte auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="longterm">Langzeitpartnerschaften</SelectItem>
                        <SelectItem value="shortterm">Kurzfristige Buchungen</SelectItem>
                        <SelectItem value="both">Beides gleich wichtig</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communication_preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Was ist Ihnen in der Kommunikation mit Subunternehmern besonders wichtig?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="z.B. regelmäßige Updates, schnelle Antworten, etc." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additional_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gibt es sonstige Hinweise oder Anforderungen an Subunternehmer?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Weitere Anforderungen oder Hinweise..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wird gespeichert...' : initialData ? 'Aktualisieren' : 'Speichern'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShipperPreferencesForm;
