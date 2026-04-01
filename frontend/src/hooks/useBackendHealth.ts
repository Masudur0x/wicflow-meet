import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/lib/api';

/**
 * Hook that checks backend health at an interval and reports connection status.
 * Returns { isConnected, isChecking } so components can show a banner when backend is down.
 */
export function useBackendHealth(intervalMs = 15000) {
  const [isConnected, setIsConnected] = useState(true); // optimistic
  const [isChecking, setIsChecking] = useState(true);
  const failCountRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`, {
          signal: AbortSignal.timeout(5000),
        });
        if (mounted) {
          setIsConnected(res.ok);
          failCountRef.current = res.ok ? 0 : failCountRef.current + 1;
        }
      } catch {
        if (mounted) {
          failCountRef.current += 1;
          // Only mark disconnected after 2 consecutive failures to avoid flicker
          if (failCountRef.current >= 2) {
            setIsConnected(false);
          }
        }
      } finally {
        if (mounted) setIsChecking(false);
      }
    };

    check();
    const id = setInterval(check, intervalMs);
    return () => { mounted = false; clearInterval(id); };
  }, [intervalMs]);

  return { isConnected, isChecking };
}
