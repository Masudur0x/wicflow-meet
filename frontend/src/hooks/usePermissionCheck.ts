import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface PermissionStatus {
  hasMicrophone: boolean;
  hasSystemAudio: boolean;
  isChecking: boolean;
  error: string | null;
}

// Grace period after onboarding completes — suppress warnings while OS catches up
const POST_ONBOARDING_GRACE_MS = 5000;

export function usePermissionCheck() {
  const [status, setStatus] = useState<PermissionStatus>({
    hasMicrophone: false,
    hasSystemAudio: false,
    isChecking: true,
    error: null,
  });
  const [inGracePeriod, setInGracePeriod] = useState(false);

  const checkPermissions = async () => {
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      // Get audio devices to check for microphone and system audio availability
      const devices = await invoke<Array<{ name: string; device_type: 'Input' | 'Output' }>>('get_audio_devices');

      // Check for microphone devices (Input)
      const inputDevices = devices.filter(d => d.device_type === 'Input');
      const hasMicrophone = inputDevices.length > 0;

      // Check for system audio devices (Output)
      // On macOS, we need ScreenCaptureKit devices for system audio
      const outputDevices = devices.filter(d => d.device_type === 'Output');
      const hasSystemAudio = outputDevices.length > 0;

      console.log('Permission check:', {
        hasMicrophone,
        hasSystemAudio,
        inputDevices: inputDevices.length,
        outputDevices: outputDevices.length
      });

      setStatus({
        hasMicrophone,
        hasSystemAudio,
        isChecking: false,
        error: null,
      });

      return { hasMicrophone, hasSystemAudio };
    } catch (error) {
      console.error('Failed to check audio permissions:', error);
      setStatus({
        hasMicrophone: false,
        hasSystemAudio: false,
        isChecking: false,
        error: error instanceof Error ? error.message : 'Failed to check permissions',
      });
      return { hasMicrophone: false, hasSystemAudio: false };
    }
  };

  const requestPermissions = async () => {
    try {
      // Trigger audio permission by trying to access devices
      await invoke('get_audio_devices');

      // Recheck after triggering
      setTimeout(() => {
        checkPermissions();
      }, 1000);
    } catch (error) {
      console.error('Failed to request permissions:', error);
    }
  };

  // Check permissions on mount, with grace period after onboarding
  useEffect(() => {
    // Check if onboarding just completed (timestamp set in CompleteStep before reload)
    const onboardingCompletedAt = sessionStorage.getItem('onboarding_completed_at');
    if (onboardingCompletedAt) {
      const elapsed = Date.now() - parseInt(onboardingCompletedAt, 10);
      if (elapsed < POST_ONBOARDING_GRACE_MS) {
        // Within grace period — suppress warnings while OS permission state catches up
        setInGracePeriod(true);
        const remaining = POST_ONBOARDING_GRACE_MS - elapsed;
        const timer = setTimeout(() => {
          setInGracePeriod(false);
          checkPermissions();
        }, remaining);
        // Still run an initial check (results won't show until grace period ends)
        checkPermissions();
        sessionStorage.removeItem('onboarding_completed_at');
        return () => clearTimeout(timer);
      }
      // Grace period already expired — clean up and check normally
      sessionStorage.removeItem('onboarding_completed_at');
    }

    checkPermissions();
  }, []);

  return {
    ...status,
    inGracePeriod,
    checkPermissions,
    requestPermissions,
  };
}
