
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface NavigationStep {
  id: number;
  label: string;
}

interface TenderFormNavigationProps {
  currentStep: number;
  steps: NavigationStep[];
  setCurrentStep: (step: number) => void;
}

const TenderFormNavigation: React.FC<TenderFormNavigationProps> = ({
  currentStep,
  steps,
  setCurrentStep,
}) => {
  return (
    <div className="px-6 pt-6 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="hidden md:flex w-full">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex-1 flex items-center",
                index !== 0 && "ml-2"
              )}
            >
              {index > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )}
                ></div>
              )}
              
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : step.id < currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.id < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    index < currentStep - 1 ? "bg-primary" : "bg-muted"
                  )}
                ></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile view */}
        <div className="flex md:hidden justify-between w-full">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors",
                currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : step.id < currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.id < currentStep ? (
                <Check className="h-3 w-3" />
              ) : (
                step.id
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold">
          {steps.find((step) => step.id === currentStep)?.label}
        </h2>
      </div>
    </div>
  );
};

export default TenderFormNavigation;
