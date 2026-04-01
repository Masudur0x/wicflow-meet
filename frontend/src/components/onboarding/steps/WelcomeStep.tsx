import React from 'react';
import { Lock, Sparkles, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function WelcomeStep() {
  const { goNext } = useOnboarding();

  const features = [
    {
      icon: Lock,
      title: 'Your data never leaves your device',
    },
    {
      icon: Sparkles,
      title: 'Intelligent summaries & insights',
    },
    {
      icon: Cpu,
      title: 'Works offline, no cloud required',
    },
  ];

  return (
    <OnboardingContainer
      title=""
      step={1}
      hideProgress={true}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Purple "W" logo box */}
        <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--primary))] flex items-center justify-center shadow-[0_0_40px_hsl(var(--accent-glow))]">
          <span className="text-4xl font-bold text-white">W</span>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-[hsl(var(--text-primary))]">Welcome to Wicflow Meet</h1>
          <p className="text-base text-[hsl(var(--text-secondary))] max-w-md mx-auto">
            Record, transcribe, and summarize your meetings — powered by AI.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-[hsl(var(--border-medium))]" />

        {/* Features Card */}
        <div className="w-full max-w-md bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-6 space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-[hsl(var(--primary)_/_0.15)] flex items-center justify-center">
                    <Icon className="w-3 h-3 text-[hsl(var(--accent-light))]" />
                  </div>
                </div>
                <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">{feature.title}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="w-full max-w-xs space-y-3">
          <Button
            onClick={goNext}
            className="w-full h-11 rounded-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent-dark))] text-white shadow-[0_0_20px_hsl(var(--accent-glow))]"
          >
            Get Started
          </Button>
          <p className="text-xs text-center text-[hsl(var(--text-muted))]">Setup takes just a few taps</p>
        </div>
      </div>
    </OnboardingContainer>
  );
}
