
import React from 'react';
import { Loader2, FileSearch, Brain, Target } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const steps = [
    { icon: FileSearch, text: "Analyzing CV content..." },
    { icon: Brain, text: "Processing job requirements..." },
    { icon: Target, text: "Calculating match score..." },
    { icon: Loader2, text: "Generating suggestions..." }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          {React.createElement(steps[currentStep].icon, {
            className: "h-8 w-8 text-primary"
          })}
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">
          {steps[currentStep].text}
        </p>
        <p className="text-sm text-gray-500">
          This may take a few moments...
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentStep ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
