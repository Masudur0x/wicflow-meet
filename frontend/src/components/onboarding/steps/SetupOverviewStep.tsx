import React, { useEffect, useState } from 'react';
import { Download, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function SetupOverviewStep() {
  const { goNext } = useOnboarding();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const checkPlatform = async () => {
      try {
        const { platform } = await import('@tauri-apps/plugin-os');
        setIsMac(platform() === 'macos');
      } catch (e) {
        setIsMac(navigator.userAgent.includes('Mac'));
      }
    };
    checkPlatform();
  }, []);

  const handleContinue = () => {
    goNext();
  };

  return (
    <OnboardingContainer
      title="Setup Overview"
      description="We'll download the AI models needed to transcribe and summarize your meetings — everything runs on your computer."
      step={2}
      totalSteps={isMac ? 7 : 6}
    >
      <div className="flex flex-col items-center space-y-10">
        {/* What we'll set up */}
        <div className="w-full max-w-md bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[hsl(var(--primary))] shrink-0" />
              <div>
                <h3 className="font-medium text-[hsl(var(--text-primary))]">Choose your AI summarizer</h3>
                <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">Free local AI or your own API key</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[hsl(var(--primary))] shrink-0" />
              <div>
                <h3 className="font-medium text-[hsl(var(--text-primary))]">Download AI models</h3>
                <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">We'll only download what you need</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-xs space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full h-11 rounded-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent-dark))] text-white shadow-[0_0_20px_hsl(var(--accent-glow))]"
          >
            Let's Go
          </Button>
          <div className="text-center">
            <a
              href="https://github.com/Zackriya-Solutions/meeting-minutes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[hsl(var(--text-muted))] hover:underline"
            >
              Report issues on GitHub
            </a>
          </div>
        </div>
      </div>
    </OnboardingContainer>
  );
}
