import React, { useEffect, useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Mic, Sparkles, Check, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingContainer } from '../OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const PARAKEET_MODEL = 'parakeet-tdt-0.6b-v3-int8';

type DownloadStatus = 'waiting' | 'downloading' | 'completed' | 'error';

interface DownloadState {
  status: DownloadStatus;
  progress: number;
  downloadedMb: number;
  totalMb: number;
  speedMbps: number;
  error?: string;
}

export function DownloadProgressStep() {
  const {
    goNext,
    selectedSummaryModel,
    setSelectedSummaryModel,
    selectedTier,
    selectedLanguage,
    parakeetDownloaded,
    setParakeetDownloaded,
    summaryModelDownloaded,
    setSummaryModelDownloaded,
    startBackgroundDownloads,
  } = useOnboarding();

  // Only download gemma if user chose "free" tier (local summarization)
  const needsGemmaDownload = selectedTier === 'free';
  // Download Whisper instead of Parakeet if user chose multilingual
  const useWhisper = selectedLanguage === 'multilingual';

  const [recommendedModel, setRecommendedModel] = useState<string>('gemma3:1b');
  const [isMac, setIsMac] = useState(false);

  const [parakeetState, setParakeetState] = useState<DownloadState>({
    status: parakeetDownloaded ? 'completed' : 'waiting',
    progress: parakeetDownloaded ? 100 : 0,
    downloadedMb: 0,
    totalMb: 670,
    speedMbps: 0,
  });

  const [whisperState, setWhisperState] = useState<DownloadState>({
    status: 'waiting',
    progress: 0,
    downloadedMb: 0,
    totalMb: 466, // small model size
    speedMbps: 0,
  });

  const [whisperDownloaded, setWhisperDownloaded] = useState(false);

  const [gemmaState, setGemmaState] = useState<DownloadState>({
    status: summaryModelDownloaded ? 'completed' : 'waiting',
    progress: summaryModelDownloaded ? 100 : 0,
    downloadedMb: 0,
    totalMb: 806, // 1b model size
    speedMbps: 0,
  });

  const downloadStartedRef = useRef(false);
  const retryingRef = useRef(false);
  const retryingSummaryRef = useRef(false);

  // Retry download handler
  const handleRetryDownload = async () => {
    // Prevent multiple simultaneous retries
    if (retryingRef.current) {
      console.log('[DownloadProgressStep] Retry already in progress, ignoring');
      return;
    }

    console.log('[DownloadProgressStep] Retrying Parakeet download');
    retryingRef.current = true;

    // Reset error state
    setParakeetState((prev) => ({
      ...prev,
      status: 'waiting',
      error: undefined,
      progress: 0,
      downloadedMb: 0,
      speedMbps: 0,
    }));

    try {
      await invoke('parakeet_retry_download', { modelName: PARAKEET_MODEL });
      // Progress events will update state
    } catch (error) {
      console.error('[DownloadProgressStep] Retry failed:', error);
      setParakeetState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Retry failed',
      }));

      toast.error('Download retry failed', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      // Allow retry again after 2 seconds
      setTimeout(() => {
        retryingRef.current = false;
      }, 2000);
    }
  };

  // Retry summary download handler
  const handleRetrySummaryDownload = async () => {
    // Prevent multiple simultaneous retries
    if (retryingSummaryRef.current) {
      console.log('[DownloadProgressStep] Summary retry already in progress, ignoring');
      return;
    }

    console.log('[DownloadProgressStep] Retrying summary model download');
    retryingSummaryRef.current = true;

    // Reset error state
    setGemmaState((prev) => ({
      ...prev,
      status: 'downloading',
      error: undefined,
      progress: 0,
      downloadedMb: 0,
      speedMbps: 0,
    }));

    try {
      // Call download command directly (no retry command exists for built-in AI)
      await invoke('builtin_ai_download_model', { modelName: selectedSummaryModel || recommendedModel });
    } catch (error) {
      console.error('[DownloadProgressStep] Summary retry failed:', error);
      setGemmaState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Retry failed',
      }));

      toast.error('Summary model download retry failed', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      // Allow retry again after 2 seconds
      setTimeout(() => {
        retryingSummaryRef.current = false;
      }, 2000);
    }
  };

  const retryingWhisperRef = useRef(false);

  // Retry Whisper download handler
  const handleRetryWhisperDownload = async () => {
    if (retryingWhisperRef.current) return;
    retryingWhisperRef.current = true;

    setWhisperState((prev) => ({
      ...prev,
      status: 'downloading',
      error: undefined,
      progress: 0,
      downloadedMb: 0,
      speedMbps: 0,
    }));

    try {
      await invoke('whisper_download_model', { modelName: 'small' });
    } catch (error) {
      setWhisperState((prev) => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Retry failed',
      }));
      toast.error('Whisper download retry failed', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setTimeout(() => { retryingWhisperRef.current = false; }, 2000);
    }
  };

  // Fetch recommended model and detect platform on mount
  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const model = await invoke<string>('builtin_ai_get_recommended_model');
        setRecommendedModel(model);
        setSelectedSummaryModel(model);  // Update context
      } catch (error) {
        console.error('Failed to get recommended model:', error);
        // Keep default gemma3:1b
      }
    };

    const checkPlatform = async () => {
      try {
        const { platform } = await import('@tauri-apps/plugin-os');
        setIsMac(platform() === 'macos');
      } catch (e) {
        setIsMac(navigator.userAgent.includes('Mac'));
      }
    };

    fetchRecommendation();
    checkPlatform();
  }, []);

  // Start downloads on mount
  useEffect(() => {
    if (downloadStartedRef.current) return;
    downloadStartedRef.current = true;

    startDownloads();
  }, []);

  // Listen to Parakeet download progress
  useEffect(() => {
    const unlistenProgress = listen<{
      modelName: string;
      progress: number;
      downloaded_mb?: number;
      total_mb?: number;
      speed_mbps?: number;
      status?: string;
    }>('parakeet-model-download-progress', (event) => {
      const { modelName, progress, downloaded_mb, total_mb, speed_mbps, status } = event.payload;
      if (modelName === PARAKEET_MODEL) {
        setParakeetState((prev) => ({
          ...prev,
          status: status === 'completed' ? 'completed' : 'downloading',
          progress,
          downloadedMb: downloaded_mb ?? prev.downloadedMb,
          totalMb: total_mb ?? prev.totalMb,
          speedMbps: speed_mbps ?? prev.speedMbps,
        }));

        if (status === 'completed' || progress >= 100) {
          setParakeetDownloaded(true);
        }
      }
    });

    const unlistenComplete = listen<{ modelName: string }>(
      'parakeet-model-download-complete',
      (event) => {
        if (event.payload.modelName === PARAKEET_MODEL) {
          setParakeetState((prev) => ({ ...prev, status: 'completed', progress: 100 }));
          setParakeetDownloaded(true);
        }
      }
    );

    const unlistenError = listen<{ modelName: string; error: string }>(
      'parakeet-model-download-error',
      (event) => {
        if (event.payload.modelName === PARAKEET_MODEL) {
          setParakeetState((prev) => ({
            ...prev,
            status: 'error',
            error: event.payload.error,
          }));
        }
      }
    );

    return () => {
      unlistenProgress.then((fn) => fn());
      unlistenComplete.then((fn) => fn());
      unlistenError.then((fn) => fn());
    };
  }, []);

  // Listen to Gemma download progress (always downloading for builtin-ai)
  useEffect(() => {
    const unlisten = listen<{
      model: string;
      progress: number;
      downloaded_mb?: number;
      total_mb?: number;
      speed_mbps?: number;
      status: string;
      error?: string;
    }>('builtin-ai-download-progress', (event) => {
      const { model, progress, downloaded_mb, total_mb, speed_mbps, status, error } = event.payload;
      if (model === selectedSummaryModel || model === 'gemma3:1b' || model === 'gemma3:4b') {
        setGemmaState((prev) => ({
          ...prev,
          status: status === 'completed'
            ? 'completed'
            : status === 'error'
            ? 'error'
            : 'downloading',
          progress,
          downloadedMb: downloaded_mb ?? prev.downloadedMb,
          totalMb: total_mb ?? prev.totalMb,
          speedMbps: speed_mbps ?? prev.speedMbps,
          error: status === 'error' ? error : undefined,
        }));

        if (status === 'completed' || progress >= 100) {
          setSummaryModelDownloaded(true);
        }
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [selectedSummaryModel]);

  // Listen to Whisper download progress
  useEffect(() => {
    if (!useWhisper) return;

    const unlistenProgress = listen<{
      model_name: string;
      progress: number;
      downloaded_mb?: number;
      total_mb?: number;
      speed_mbps?: number;
      status?: string;
    }>('model-download-progress', (event) => {
      const { progress, downloaded_mb, total_mb, speed_mbps, status } = event.payload;
      setWhisperState((prev) => ({
        ...prev,
        status: status === 'completed' ? 'completed' : 'downloading',
        progress,
        downloadedMb: downloaded_mb ?? prev.downloadedMb,
        totalMb: total_mb ?? prev.totalMb,
        speedMbps: speed_mbps ?? prev.speedMbps,
      }));
      if (status === 'completed' || progress >= 100) {
        setWhisperDownloaded(true);
      }
    });

    const unlistenComplete = listen<{ model_name: string }>(
      'model-download-complete',
      () => {
        setWhisperState((prev) => ({ ...prev, status: 'completed', progress: 100 }));
        setWhisperDownloaded(true);
      }
    );

    const unlistenError = listen<{ model_name: string; error: string }>(
      'model-download-error',
      (event) => {
        setWhisperState((prev) => ({
          ...prev,
          status: 'error',
          error: event.payload.error,
        }));
      }
    );

    return () => {
      unlistenProgress.then((fn) => fn());
      unlistenComplete.then((fn) => fn());
      unlistenError.then((fn) => fn());
    };
  }, [useWhisper]);

  const startDownloads = async () => {
    const transcriptionNeeded = useWhisper ? !whisperDownloaded : !parakeetDownloaded;
    if (transcriptionNeeded || (needsGemmaDownload && !summaryModelDownloaded)) {
      try {
        if (useWhisper && !whisperDownloaded) {
          setWhisperState((prev) => ({ ...prev, status: 'downloading' }));
        } else if (!useWhisper && !parakeetDownloaded) {
          setParakeetState((prev) => ({ ...prev, status: 'downloading' }));
        }
        if (needsGemmaDownload && !summaryModelDownloaded) {
          setGemmaState((prev) => ({ ...prev, status: 'downloading' }));
        }
        await startBackgroundDownloads(needsGemmaDownload);
      } catch (error) {
        console.error('Failed to start downloads:', error);
        if (useWhisper) {
          setWhisperState((prev) => ({ ...prev, status: 'error', error: String(error) }));
        } else {
          setParakeetState((prev) => ({ ...prev, status: 'error', error: String(error) }));
        }
      }
    }
  };

  const handleContinue = async () => {
    if (useWhisper) {
      // For Whisper, check if download completed or errored
      if (whisperState.status === 'error') {
        toast.error('Transcription engine required', {
          description: 'Please retry the download before continuing.',
        });
        return;
      }
    } else {
      // For Parakeet, verify actual model availability (catches state drift)
      try {
        await invoke('parakeet_init');
        const actuallyAvailable = await invoke<boolean>('parakeet_has_available_models');

        if (actuallyAvailable && !parakeetDownloaded) {
          console.log('[DownloadProgressStep] Model available but state not updated');
          setParakeetDownloaded(true);
          setParakeetState((prev) => ({
            ...prev,
            status: 'completed',
            progress: 100,
          }));
        } else if (!actuallyAvailable && parakeetState.status === 'error') {
          toast.error('Transcription engine required', {
            description: 'Please retry the download before continuing.',
          });
          return;
        }
      } catch (error) {
        console.warn('[DownloadProgressStep] Failed to verify model:', error);
      }
    }

    // Check if downloads are complete for toast notification
    const transcriptionDone = useWhisper ? whisperState.status === 'completed' : parakeetState.status === 'completed';
    const downloadsComplete = transcriptionDone &&
      (!needsGemmaDownload || gemmaState.status === 'completed');

    // Show toast if downloads still in progress
    if (!downloadsComplete) {
      toast.info('Downloads will continue in the background', {
        description: 'You can start using the app. Recording will be available once speech recognition is ready.',
        duration: 5000,
      });
    }

    // Go to Permissions (macOS) or Complete step
    goNext();
  };

  const renderDownloadCard = (
    title: string,
    icon: React.ReactNode,
    state: DownloadState,
    modelSize: string
  ) => (
    <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary)_/_0.15)] flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-[hsl(var(--text-primary))]">{title}</h3>
            <p className="text-sm text-[hsl(var(--text-muted))]">{modelSize}</p>
          </div>
        </div>
        <div>
          {state.status === 'waiting' && (
            <span className="text-sm text-[hsl(var(--text-muted))]">Waiting...</span>
          )}
          {state.status === 'downloading' && (
            <Loader2 className="w-5 h-5 text-[hsl(var(--accent-light))] animate-spin" />
          )}
          {state.status === 'completed' && (
            <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-400" />
            </div>
          )}
          {state.status === 'error' && (
            <span className="text-sm text-red-400">Failed</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(state.status === 'downloading' || state.status === 'completed') && (
        <div className="space-y-2">
          <div className="w-full h-2 bg-[hsl(var(--border-medium))] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-light))] rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[hsl(var(--text-muted))]">
              {state.downloadedMb.toFixed(1)} MB / {state.totalMb.toFixed(1)} MB
            </span>
            <div className="flex items-center gap-2">
              {state.speedMbps > 0 && (
                <span className="text-[hsl(var(--text-muted))]">
                  {state.speedMbps.toFixed(1)} MB/s
                </span>
              )}
              <span className="font-semibold text-[hsl(var(--text-primary))]">
                {Math.round(state.progress)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {state.status === 'error' && state.error && (
        <div className="mt-2 p-3 bg-red-900/20 border border-red-800/30 rounded-md">
          <p className="text-sm text-red-400 font-medium">Download Error</p>
          <p className="text-xs text-red-500 mt-1">{state.error}</p>
          {(title.startsWith('Transcription Engine') || title === 'Summary Engine') && (
            <button
              onClick={title.startsWith('Transcription Engine') ? (useWhisper ? handleRetryWhisperDownload : handleRetryDownload) : handleRetrySummaryDownload}
              className="mt-3 w-full h-9 px-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent-dark))] text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <OnboardingContainer
      title="Getting things ready"
      description="This runs on your computer — your audio never leaves your machine."
      step={5}
      totalSteps={isMac ? 7 : 6}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Download Cards */}
        <div className="w-full max-w-lg space-y-4">
          {useWhisper ? renderDownloadCard(
            'Transcription Engine (Multilingual)',
            <Mic className="w-5 h-5 text-[hsl(var(--accent-light))]" />,
            whisperState,
            '~466 MB'
          ) : renderDownloadCard(
            'Transcription Engine',
            <Mic className="w-5 h-5 text-[hsl(var(--accent-light))]" />,
            parakeetState,
            '~670 MB'
          )}

          {needsGemmaDownload && renderDownloadCard(
            'Summary Engine',
            <Sparkles className="w-5 h-5 text-[hsl(var(--accent-light))]" />,
            gemmaState,
            recommendedModel === 'gemma3:4b' ? '~2.5 GB' : '~806 MB'
          )}
        </div>

        {/* Info Message - Only show when Parakeet is downloaded */}
        <AnimatePresence>
          {(useWhisper ? whisperDownloaded : parakeetDownloaded) && needsGemmaDownload && !summaryModelDownloaded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4 text-sm text-[hsl(var(--text-secondary))]"
            >
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-[hsl(var(--accent-light))] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[hsl(var(--text-primary))]">You can continue while this finishes</p>
                  <p className="text-[hsl(var(--text-muted))] mt-1">
                    Download will continue in the background.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <div className="w-full max-w-xs">
          <Button
            onClick={handleContinue}
            disabled={useWhisper ? !whisperDownloaded : !parakeetDownloaded}
            className="w-full h-11 rounded-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent-dark))] text-white shadow-[0_0_20px_hsl(var(--accent-glow))] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {(useWhisper ? !whisperDownloaded : !parakeetDownloaded) ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </OnboardingContainer>
  );
}
