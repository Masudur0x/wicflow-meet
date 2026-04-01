import React from 'react';
import { Languages, Mic, Info } from 'lucide-react';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useIsMac } from '@/hooks/usePlatform';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LanguageStep() {
  const { goNext, setSelectedLanguage } = useOnboarding();
  const isMac = useIsMac();

  const handleSelect = (language: 'english' | 'multilingual') => {
    setSelectedLanguage(language);
    goNext();
  };

  return (
    <OnboardingContainer
      title="What language are your meetings in?"
      description="This helps us download the right transcription engine for you."
      step={3}
      totalSteps={isMac ? 7 : 6}
      showNavigation={true}
      canGoPrevious={true}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Language Cards */}
        <div className="w-full max-w-lg grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* English Card */}
          <button
            onClick={() => handleSelect('english')}
            className="relative flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all duration-200 hover:border-[hsl(var(--primary))] hover:shadow-[0_0_20px_hsl(var(--accent-glow))]"
          >
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary)_/_0.15)] flex items-center justify-center text-[hsl(var(--accent-light))]">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[hsl(var(--text-primary))]">English</h3>
            <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">
              Fastest and most accurate. Smaller download (~670 MB).
            </p>

            {/* Tooltip for switching later */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--text-muted))] mt-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>What if I need other languages later?</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  You can switch to the multilingual engine anytime in Settings → Transcript. It will download automatically when you switch.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>

          {/* Multilingual Card */}
          <button
            onClick={() => handleSelect('multilingual')}
            className="relative flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center transition-all duration-200 hover:border-[hsl(var(--primary))] hover:shadow-[0_0_20px_hsl(var(--accent-glow))]"
          >
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary)_/_0.15)] flex items-center justify-center text-[hsl(var(--accent-light))]">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-[hsl(var(--text-primary))]">Other Languages</h3>
            <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">
              Supports 99 languages including Bangla, Hindi, Spanish, Arabic, and more. Larger download (~466 MB).
            </p>
          </button>
        </div>
      </div>
    </OnboardingContainer>
  );
}
