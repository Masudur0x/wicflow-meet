import React, { useState, useEffect } from 'react';
import { Cpu, Key } from 'lucide-react';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface TierOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

export function AISummarizerStep() {
  const { goNext, setSelectedTier } = useOnboarding();
  const [isMac, setIsMac] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const tiers: TierOption[] = [
    {
      id: 'free',
      title: 'Local AI (Free)',
      description: 'Runs on your computer. No internet needed. Great for everyday meetings.',
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      id: 'byo',
      title: 'Use Your Own API Key',
      description: 'Connect your ChatGPT or Claude account for higher quality summaries.',
      icon: <Key className="w-6 h-6" />,
    },
  ];

  const handleSelectTier = async (tierId: string) => {
    if (saving) return;
    setSaving(true);

    try {
      await fetch('http://localhost:5167/api/settings/summarization-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId }),
      });
    } catch (error) {
      console.error('[AISummarizerStep] Failed to save tier:', error);
      // Continue anyway - user can configure later in settings
    }

    setSaving(false);
    setSelectedTier(tierId);
    goNext();
  };

  const handleSkip = () => {
    setSelectedTier('free');
    goNext();
  };

  return (
    <OnboardingContainer
      title="Choose AI Summarizer"
      description="Select how you'd like your meetings summarized."
      step={4}
      totalSteps={isMac ? 7 : 6}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Tier Cards */}
        <div className="w-full max-w-lg grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleSelectTier(tier.id)}
              disabled={saving}
              className="relative flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all duration-200 hover:border-[hsl(var(--primary))] hover:shadow-[0_0_20px_hsl(var(--accent-glow))] disabled:opacity-50"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary)_/_0.15)] flex items-center justify-center text-[hsl(var(--accent-light))]">
                {tier.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[hsl(var(--text-primary))]">{tier.title}</h3>

              {/* Description */}
              <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">{tier.description}</p>
            </button>
          ))}
        </div>

        {/* Helper text */}
        <p className="text-sm text-[hsl(var(--text-muted))]">
          Not sure? Start with Local AI — you can always switch later in Settings.
        </p>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="text-sm text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-secondary))] transition-colors"
        >
          Skip — I'll configure later
        </button>
      </div>
    </OnboardingContainer>
  );
}
