import React, { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useOnboarding } from '@/contexts/OnboardingContext';

/**
 * Banner shown on the main screen when the transcription model hasn't been downloaded yet.
 * Lets users trigger the download without going back through onboarding.
 */
export function ModelDownloadBanner() {
  const {
    parakeetDownloaded,
    whisperDownloaded,
    selectedLanguage,
    isBackgroundDownloading,
    startBackgroundDownloads,
  } = useOnboarding();

  const [modelReady, setModelReady] = useState<boolean | null>(null);
  const [isStartingDownload, setIsStartingDownload] = useState(false);

  const useWhisper = selectedLanguage === 'multilingual';
  const contextSaysReady = useWhisper ? whisperDownloaded : parakeetDownloaded;

  // Verify actual model availability on disk (don't trust context alone)
  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      try {
        if (useWhisper) {
          await invoke('whisper_init');
          const available = await invoke<boolean>('whisper_has_available_models');
          if (!cancelled) setModelReady(available);
        } else {
          await invoke('parakeet_init');
          const available = await invoke<boolean>('parakeet_has_available_models');
          if (!cancelled) setModelReady(available);
        }
      } catch {
        if (!cancelled) setModelReady(false);
      }
    };

    verify();
    // Re-check periodically while downloading
    const interval = setInterval(verify, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [useWhisper, contextSaysReady]);

  // Don't show if model is confirmed ready
  if (modelReady === true || contextSaysReady) {
    return null;
  }

  // Don't show until we've checked
  if (modelReady === null) {
    return null;
  }

  const handleDownload = async () => {
    setIsStartingDownload(true);
    try {
      await startBackgroundDownloads(false);
    } catch (error) {
      console.error('[ModelDownloadBanner] Failed to start download:', error);
    } finally {
      setIsStartingDownload(false);
    }
  };

  const isDownloading = isBackgroundDownloading || isStartingDownload;

  return (
    <div className="bg-amber-600 text-white text-sm py-2.5 px-4 flex items-center justify-center gap-3 shrink-0">
      <Download className="w-4 h-4 flex-shrink-0" />
      <span>
        {isDownloading
          ? 'Downloading speech recognition model — recording will be available once complete.'
          : 'Speech recognition model needed to record meetings.'}
      </span>
      {!isDownloading && (
        <button
          onClick={handleDownload}
          className="ml-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md font-medium transition-colors"
        >
          Download Now
        </button>
      )}
      {isDownloading && (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      )}
    </div>
  );
}
