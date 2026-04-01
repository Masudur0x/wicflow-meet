import React, { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  WelcomeStep,
  SetupOverviewStep,
  LanguageStep,
  AISummarizerStep,
  DownloadProgressStep,
  PermissionsStep,
  CompleteStep,
} from './steps';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { currentStep } = useOnboarding();
  const [isMac, setIsMac] = React.useState(false);

  useEffect(() => {
    // Check if running on macOS
    const checkPlatform = async () => {
      try {
        const { platform } = await import('@tauri-apps/plugin-os');
        setIsMac(platform() === 'macos');
      } catch (e) {
        console.error('Failed to detect platform:', e);
        setIsMac(navigator.userAgent.includes('Mac'));
      }
    };
    checkPlatform();
  }, []);

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
        return isMac ? <CompleteStep /> : null;
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
