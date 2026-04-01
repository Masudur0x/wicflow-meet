import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { toast } from 'sonner';

export function CompleteStep() {
  const { completeOnboarding } = useOnboarding();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const handleFinish = async () => {
    if (isCompleting) return;
    setIsCompleting(true);

    try {
      await completeOnboarding();

      // Mark completion time so main screen can suppress permission warnings briefly
      sessionStorage.setItem('onboarding_completed_at', Date.now().toString());

      // Fade out before reload
      setIsFadingOut(true);

      // Wait for fade animation + ensure state is saved
      await new Promise(resolve => setTimeout(resolve, 500));

      window.location.reload();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('Failed to complete setup', {
        description: 'Something went wrong saving your preferences. Please try again, or restart the app if this keeps happening.',
      });
      setIsCompleting(false);
      setIsFadingOut(false);
    }
  };

  return (
    <OnboardingContainer
      title=""
      hideProgress={true}
    >
      <div
        className={`flex flex-col items-center space-y-8 pt-12 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Green checkmark circle */}
        <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-[hsl(var(--text-primary))]">You're All Set!</h1>
          <p className="text-base text-[hsl(var(--text-secondary))] max-w-md mx-auto">
            Wicflow Meet is ready to record, transcribe, and summarize your meetings.
          </p>
        </div>

        {/* CTA */}
        <div className="w-full max-w-xs pt-4">
          <Button
            onClick={handleFinish}
            disabled={isCompleting}
            className="w-full h-11 rounded-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent-dark))] text-white shadow-[0_0_20px_hsl(var(--accent-glow))] disabled:opacity-50"
          >
            {isCompleting ? 'Finishing...' : 'Start Your First Recording'}
          </Button>
        </div>
      </div>
    </OnboardingContainer>
  );
}
