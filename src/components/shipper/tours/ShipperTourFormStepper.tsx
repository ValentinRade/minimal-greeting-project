
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ShipperTourFormStepperProps {
  currentStep: number;
  totalSteps: number;
}

const ShipperTourFormStepper: React.FC<ShipperTourFormStepperProps> = ({ currentStep, totalSteps }) => {
  const { t } = useTranslation();
  
  const steps = [
    { title: t('tours.steps.vehicleRequirements'), description: t('tours.steps.vehicleRequirementsDesc') },
    { title: t('tours.steps.routeDetails'), description: t('tours.steps.routeDetailsDesc') },
    { title: t('tours.steps.transportFrequency'), description: t('tours.steps.transportFrequencyDesc') },
    { title: t('tours.steps.compensation'), description: t('tours.steps.compensationDesc') },
    { title: t('tours.steps.paymentTerms'), description: t('tours.steps.paymentTermsDesc') },
    { title: t('tours.steps.summary'), description: t('tours.steps.summaryDesc') },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-sm font-medium",
                  index + 1 < currentStep && "bg-primary border-primary text-primary-foreground",
                  index + 1 === currentStep && "border-primary text-primary",
                  index + 1 > currentStep && "border-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-center hidden md:block">
                <p className={cn(
                  "text-xs font-medium",
                  index + 1 === currentStep ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
              </div>
            </div>
            
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  index + 1 < currentStep ? "bg-primary" : "bg-muted"
                )}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="text-center mb-6 md:hidden">
        <h3 className="text-base font-medium">{steps[currentStep - 1].title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{steps[currentStep - 1].description}</p>
      </div>
    </div>
  );
};

export default ShipperTourFormStepper;
