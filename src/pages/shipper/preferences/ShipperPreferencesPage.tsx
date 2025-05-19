
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getShipperPreferences } from '@/services/shipperPreferencesService';
import ShipperPreferencesForm from '@/components/shipper/preferences/ShipperPreferencesForm';
import { ShipperPreferences } from '@/types/shipperPreference';
import { useToast } from '@/hooks/use-toast';
import { Edit, AlertCircle, Loader2, LogIn, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const ShipperPreferencesPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, company, hasCompany } = useAuth();
  const [preferences, setPreferences] = useState<ShipperPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    // Only run this effect once during component mount
    if (!isInitialLoad) return;
    
    setIsInitialLoad(false);
    
    // If we're on this page but not logged in, redirect to auth
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    
    // If logged in but no company, show error (don't try to load preferences)
    if (user && !hasCompany) {
      setIsLoading(false);
      setError("Sie müssen ein Unternehmen erstellen, bevor Sie Präferenzen festlegen können.");
      return;
    }
    
    // Only load preferences if both user and company are available
    if (user && hasCompany) {
      loadPreferences();
    }
  }, [user, hasCompany, navigate, isInitialLoad]);

  const loadPreferences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getShipperPreferences();
      setPreferences(data);
      setIsEditMode(!data); // Enter edit mode if no preferences exist
    } catch (error: any) {
      console.error('Error loading shipper preferences:', error);
      setError(error.message || "Fehler beim Laden der Präferenzen");
      toast({
        title: "Fehler",
        description: error.message || "Präferenzen konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (data: ShipperPreferences) => {
    setPreferences(data);
    setIsEditMode(false);
  };

  const redirectToAuth = () => {
    navigate('/auth');
  };

  const redirectToCreateCompany = () => {
    navigate('/create-company');
  };

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Anmeldung erforderlich</CardTitle>
            <CardDescription>Bitte melden Sie sich an, um Ihre Präferenzen zu verwalten.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Sie müssen angemeldet sein, um Präferenzen festlegen zu können.</AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button onClick={redirectToAuth}>
                <LogIn className="mr-2 h-4 w-4" />
                Anmelden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-6 w-6 mr-2 animate-spin" />
              <p>Präferenzen werden geladen...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center">
              {user && !hasCompany ? (
                <Button onClick={redirectToCreateCompany}>
                  <Building className="mr-2 h-4 w-4" />
                  Unternehmen erstellen
                </Button>
              ) : (
                <Button onClick={loadPreferences}>Erneut versuchen</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Versender-Präferenzen</CardTitle>
            <CardDescription>
              Bitte teilen Sie uns Ihre Präferenzen mit, damit wir Ihnen passende Subunternehmer vorschlagen können.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShipperPreferencesForm initialData={preferences || undefined} onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ihre Präferenzen</CardTitle>
            <CardDescription>
              Diese Informationen helfen uns, Ihnen passende Subunternehmer vorzuschlagen.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditMode(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        </CardHeader>
        <CardContent>
          {preferences && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-1">Branche</h3>
                  <p>{preferences.industry || 'Keine Angabe'}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Auftragsfrequenz</h3>
                  <p>
                    {preferences.subcontractor_frequency === 'daily' && 'Täglich'}
                    {preferences.subcontractor_frequency === 'weekly' && 'Wöchentlich'}
                    {preferences.subcontractor_frequency === 'monthly' && 'Monatlich'}
                    {preferences.subcontractor_frequency === 'quarterly' && 'Quartalsweise'}
                    {preferences.subcontractor_frequency === 'rarely' && 'Selten'}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Transportrouten</h3>
                  <p>{preferences.transport_routes?.join(', ') || 'Keine Angabe'}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Transportarten</h3>
                  <p>{preferences.transport_types?.join(', ') || 'Keine Angabe'}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Benötigte Fahrzeugtypen</h3>
                  <p>{preferences.vehicle_types?.join(', ') || 'Keine Angabe'}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Benötigte Sprachen</h3>
                  <p>{preferences.required_languages?.join(', ') || 'Keine Angabe'}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Partnerschaftspräferenz</h3>
                  <p>
                    {preferences.partnership_preference === 'longterm' && 'Langzeitpartnerschaften'}
                    {preferences.partnership_preference === 'shortterm' && 'Kurzfristige Buchungen'}
                    {preferences.partnership_preference === 'both' && 'Beides gleich wichtig'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-1">Auswahlkriterien für Subunternehmer</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {preferences.selection_criteria.price && <div className="bg-muted px-3 py-1 rounded-md text-sm">Preis</div>}
                  {preferences.selection_criteria.punctuality && <div className="bg-muted px-3 py-1 rounded-md text-sm">Pünktlichkeit / Termintreue</div>}
                  {preferences.selection_criteria.communication && <div className="bg-muted px-3 py-1 rounded-md text-sm">Kommunikationsfähigkeit</div>}
                  {preferences.selection_criteria.vehicle_condition && <div className="bg-muted px-3 py-1 rounded-md text-sm">Ausstattung & Zustand der Fahrzeuge</div>}
                  {preferences.selection_criteria.experience && <div className="bg-muted px-3 py-1 rounded-md text-sm">Erfahrung / Referenzen</div>}
                  {preferences.selection_criteria.language_skills && <div className="bg-muted px-3 py-1 rounded-md text-sm">Sprachkenntnisse</div>}
                  {preferences.selection_criteria.ratings && <div className="bg-muted px-3 py-1 rounded-md text-sm">Bewertungen auf carrinex</div>}
                  {preferences.selection_criteria.flexibility && <div className="bg-muted px-3 py-1 rounded-md text-sm">Flexibilität / Reaktionszeit</div>}
                  {preferences.selection_criteria.regional_availability && <div className="bg-muted px-3 py-1 rounded-md text-sm">Verfügbarkeit in der Region</div>}
                  {preferences.selection_criteria.documentation && <div className="bg-muted px-3 py-1 rounded-md text-sm">Zuverlässige Dokumentenübergabe</div>}
                  {preferences.selection_criteria.weekend_availability && <div className="bg-muted px-3 py-1 rounded-md text-sm">Verfügbarkeit an Wochenenden oder nachts</div>}
                  {preferences.selection_criteria.longterm_cooperation && <div className="bg-muted px-3 py-1 rounded-md text-sm">Bereitschaft zur langfristigen Zusammenarbeit</div>}
                  {preferences.selection_criteria.sensitive_cargo && <div className="bg-muted px-3 py-1 rounded-md text-sm">Umgang mit sensibler oder wertvoller Ware</div>}
                </div>
              </div>

              {preferences.industry_requirements && (
                <div>
                  <h3 className="font-medium mb-1">Branchenspezifische Anforderungen</h3>
                  <p className="whitespace-pre-line">{preferences.industry_requirements}</p>
                </div>
              )}

              {preferences.communication_preferences && (
                <div>
                  <h3 className="font-medium mb-1">Kommunikationspräferenzen</h3>
                  <p className="whitespace-pre-line">{preferences.communication_preferences}</p>
                </div>
              )}

              {preferences.additional_requirements && (
                <div>
                  <h3 className="font-medium mb-1">Weitere Anforderungen</h3>
                  <p className="whitespace-pre-line">{preferences.additional_requirements}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipperPreferencesPage;
