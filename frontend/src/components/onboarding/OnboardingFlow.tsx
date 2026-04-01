import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useIsMac } from '@/hooks/usePlatform';
import {
  WelcomeStep,
  SetupOverviewStep,
  LanguageStep,
  AISummarizerStep,
  DownloadProgressStep,
  PermissionsStep,
  CompleteStep,
} from './steps';

export function OnboardingFlow() {
  const { currentStep } = useOnboarding();
  const isMac = useIsMac();

  // macOS flow (7 steps):
  //   1: Welcome, 2: SetupOverview, 3: Language, 4: AI Summarizer, 5: Download, 6: Permissions, 7: Complete
  // Non-macOS flow (6 steps):
  //   1: Welcome, 2: SetupOverview, 3: Language, 4: AI Summarizer, 5: Download, 6: Complete

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <SetupOverviewStep />;
      case 3:
        return <LanguageStep />;
      case 4:
        return <AISummarizerStep />;
      case 5:
        return <DownloadProgressStep />;
      case 6:
        return isMac ? <PermissionsStep /> : <CompleteStep />;
      case 7:
        return <CompleteStep />;
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-flow">
      {renderStep()}
    </div>
  );
}
