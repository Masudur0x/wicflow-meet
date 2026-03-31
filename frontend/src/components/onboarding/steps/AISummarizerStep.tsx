import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Key } from 'lucide-react';
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
  const { goNext } = useOnboarding();
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
      title: 'Free',
      description: 'Use Ollama for local AI summarization. No data leaves your device.',
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      id: 'premium',
      title: 'Wicflow AI',
      description: 'Cloud-powered summaries with higher quality and speed.',
      icon: <Sparkles className="w-6 h-6" />,
      badge: 'Recommended',
    },
    {
      id: 'byo',
      title: 'BYO Key',
      description: 'Bring your own API key from OpenAI, Claude, or other providers.',
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
    goNext();
  };

  const handleSkip = () => {
    goNext();
  };

  return (
    <OnboardingContainer
      title="Choose AI Summarizer"
      description="Select how you'd like your meetings summarized."
      step={4}
      totalSteps={isMac ? 6 : 5}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Tier Cards */}
        <div className="w-full max-w-lg grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => handleSelectTier(tier.id)}
              disabled={saving}
              className="relative flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all duration-200 hover:border-[hsl(var(--primary))] hover:shadow-[0_0_20px_hsl(var(--accent-glow))] disabled:opacity-50"
            >
              {/* Recommended badge */}
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--primary))] px-3 py-0.5 text-xs font-medium text-white">
                  {tier.badge}
                </span>
              )}

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
