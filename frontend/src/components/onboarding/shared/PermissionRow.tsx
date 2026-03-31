import React from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { PermissionRowProps } from '@/types/onboarding';

export function PermissionRow({ icon, title, description, status, isPending = false, onAction }: PermissionRowProps) {
  const isAuthorized = status === 'authorized';
  const isDenied = status === 'denied';
  const isChecking = isPending;

  const getButtonText = () => {
    if (isChecking) return 'Checking...';
    if (isDenied) return 'Open Settings';
    return 'Allow';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl border px-6 py-5',
        'transition-all duration-200',
        isAuthorized
          ? 'border-green-800/40 bg-green-900/10'
          : isDenied
          ? 'border-red-800/40 bg-red-900/10'
          : 'bg-[hsl(var(--card))] border-[hsl(var(--border))]'
      )}
    >
      {/* Left side: Icon + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon */}
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-full flex-shrink-0',
            isAuthorized
              ? 'bg-green-900/20'
              : isDenied
              ? 'bg-red-900/20'
              : 'bg-[hsl(var(--primary)_/_0.15)]'
          )}
        >
          <div className={cn(
            isAuthorized
              ? 'text-green-400'
              : isDenied
              ? 'text-red-400'
              : 'text-[hsl(var(--accent-light))]'
          )}>{icon}</div>
        </div>

        {/* Title + Description */}
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate text-[hsl(var(--text-primary))]">{title}</div>
          <div className="text-sm">
            {isAuthorized ? (
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Access Granted
              </span>
            ) : isDenied ? (
              <span className="text-red-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Access Denied - Please grant in System Settings
              </span>
            ) : (
              <span className="text-[hsl(var(--text-muted))]">{description}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Action button or checkmark */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {!isAuthorized && (
          <Button
            variant={isDenied ? "destructive" : "outline"}
            size="sm"
            onClick={onAction}
            disabled={isChecking}
            className={cn(
              'min-w-[100px]',
              !isDenied && 'border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)_/_0.1)]'
            )}
          >
            {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {getButtonText()}
          </Button>
        )}
        {isAuthorized && (
          <div className="flex size-8 items-center justify-center rounded-full bg-green-900/20">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
        )}
      </div>
    </div>
  );
}
