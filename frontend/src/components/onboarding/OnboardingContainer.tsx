import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnboarding } from '@/contexts/OnboardingContext';
import type { OnboardingContainerProps } from '@/types/onboarding';

export function OnboardingContainer({
  title,
  description,
  children,
  step,
  totalSteps = 7,
  stepOffset = 0,
  hideProgress = false,
  className,
  showNavigation = false,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
}: OnboardingContainerProps) {
  const { goToStep, goPrevious, goNext: contextGoNext } = useOnboarding();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      goPrevious();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      contextGoNext();
    }
  };

  const currentStep = step ? step - 1 : 0;

  return (
    <div className="fixed inset-0 bg-[hsl(var(--background))] flex items-center justify-center z-50 overflow-hidden">
      <div className={cn('w-full max-w-2xl h-full max-h-screen flex flex-col px-6 py-6', className)}>
        {/* Navigation Buttons */}
        {step && !hideProgress && showNavigation && (
          <div className="mb-2 relative flex-shrink-0">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious || step === 1}
                className={cn(
                  'pointer-events-auto w-8 h-8 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center transition-all duration-200',
                  canGoPrevious && step !== 1
                    ? 'hover:bg-[hsl(var(--border-medium))] hover:shadow-md hover:scale-110 text-[hsl(var(--text-primary))]'
                    : 'opacity-0 cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext || step === totalSteps}
                className={cn(
                  'pointer-events-auto w-8 h-8 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center transition-all duration-200',
                  canGoNext && step !== totalSteps
                    ? 'hover:bg-[hsl(var(--border-medium))] hover:shadow-md hover:scale-110 text-[hsl(var(--text-primary))]'
                    : 'opacity-0 cursor-not-allowed'
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 text-center space-y-3 flex-shrink-0">
          <h1 className="text-4xl font-semibold text-[hsl(var(--text-primary))] animate-fade-in-up">{title}</h1>
          {description && (
            <p className="text-base text-[hsl(var(--text-secondary))] max-w-md mx-auto animate-fade-in-up delay-75">
              {description}
            </p>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">{children}</div>
        </div>

        {/* Progress Dots */}
        {step && !hideProgress && (
          <div className="flex items-center justify-center gap-2 pb-8 pt-4 flex-shrink-0">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'w-6 bg-[hsl(var(--primary))]'
                    : i < currentStep
                    ? 'w-2 bg-[hsl(var(--accent-light))]'
                    : 'w-2 bg-[hsl(var(--border-medium))]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
