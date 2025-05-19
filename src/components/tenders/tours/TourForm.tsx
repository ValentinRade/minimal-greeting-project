
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import TenderFormNavigation from '../TenderFormNavigation';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TourFormData } from '@/types/tour';

// Individual step schemas will be defined later
const tourFormSchema = z.object({
  // This is just a placeholder and will be expanded later
  title: z.string().min(3, { message: 'Titel muss mindestens 3 Zeichen lang sein' }),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  tenderId: string;
  onTourCreated?: () => void;
  onCancel?: () => void;
}

const steps = [
  { id: 1, label: 'Fahrzeuganforderungen & Zertifikate' },
  { id: 2, label: 'Routen- und Ladungsdetails' },
  { id: 3, label: 'Transportfrequenz' },
  { id: 4, label: 'Vergütung' },
  { id: 5, label: 'Zahlungsmodalitäten' },
  { id: 6, label: 'Zusammenfassung & Status' },
];

const TourForm: React.FC<TourFormProps> = ({ tenderId, onTourCreated, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: '',
    }
  });
  
  const onSubmit = (data: TourFormValues) => {
    // This will be expanded to handle multi-step form submission
    console.log('Form submitted:', data);
    
    if (onTourCreated) {
      onTourCreated();
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TenderFormNavigation 
        currentStep={currentStep} 
        steps={steps} 
        setCurrentStep={setCurrentStep} 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Fahrzeuganforderungen & Zertifikate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die Implementierung der Tour-Formularschritte erfolgt in einer zukünftigen Aktualisierung.
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Routen- und Ladungsdetails</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die Implementierung der Tour-Formularschritte erfolgt in einer zukünftigen Aktualisierung.
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Transportfrequenz</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die Implementierung der Tour-Formularschritte erfolgt in einer zukünftigen Aktualisierung.
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Vergütung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die Implementierung der Tour-Formularschritte erfolgt in einer zukünftigen Aktualisierung.
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Zahlungsmodalitäten</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die Implementierung der Tour-Formularschritte erfolgt in einer zukünftigen Aktualisierung.
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle>Zusammenfassung & Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Die Implementierung der Tour-Formularschritte erfolgt in einer zukünftigen Aktualisierung.
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel && onCancel()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {currentStep > 1 ? 'Zurück' : 'Abbrechen'}
            </Button>
            
            <Button 
              type={currentStep === 6 ? "submit" : "button"}
              onClick={() => currentStep < 6 && setCurrentStep(currentStep + 1)}
              className="gap-2"
            >
              {currentStep === 6 ? 'Tour speichern' : 'Weiter'}
              {currentStep < 6 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TourForm;
