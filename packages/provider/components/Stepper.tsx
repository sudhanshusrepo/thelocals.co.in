import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full flex items-center justify-between mb-8 px-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 
                  ${isActive ? 'bg-brand-600 text-white ring-4 ring-brand-100 scale-110' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : stepNum}
              </div>
            </div>
            {stepNum !== totalSteps && (
              <div className="flex-1 h-1 mx-2 rounded bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full bg-green-500 transition-all duration-500 ease-out`}
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};