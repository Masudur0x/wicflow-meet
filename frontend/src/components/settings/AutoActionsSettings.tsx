'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/api'

export function AutoActionsSettings() {
  const [autoCopy, setAutoCopy] = useState(false)
  const [autoSaveMd, setAutoSaveMd] = useState(false)
  const [autoSendCrm, setAutoSendCrm] = useState(false)
  const [autoSendEmail, setAutoSendEmail] = useState(false)
  const [mdSavePath, setMdSavePath] = useState('~/Documents/Wicflow Meet')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/auto-actions`)
      .then(res => res.json())
      .then(data => {
        setAutoCopy(data.autoCopyClipboard || false)
        setAutoSaveMd(data.autoSaveMd || false)
        setAutoSendCrm(data.autoSendCrm || false)
        setAutoSendEmail(data.autoSendEmail || false)
        if (data.mdSavePath) setMdSavePath(data.mdSavePath)
      })
      .catch(() => {})
  }, [])

  const handleToggle = async (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/auto-actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Setting updated');
    } catch (error) {
      setter(!value); // Revert on failure
      toast.error('Failed to save setting');
    }
  }

  const handlePathSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/auto-actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mdSavePath: mdSavePath })
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Save path updated');
    } catch (error) {
      toast.error('Failed to update save path');
    }
  }

  const toggleClass = (enabled: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--secondary))]'
    }`

  const dotClass = (enabled: boolean) =>
    `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      enabled ? 'translate-x-6' : 'translate-x-1'
    }`

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))]">Auto-Actions</h3>
      <p className="text-sm text-[hsl(var(--text-muted))]">Run these actions automatically after every summary.</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Copy to clipboard</div>
            <div className="text-xs text-[hsl(var(--text-muted))]">Auto-copy summary after generation</div>
          </div>
          <button onClick={() => handleToggle('autoCopyClipboard', !autoCopy, setAutoCopy)} className={toggleClass(autoCopy)}>
            <span className={dotClass(autoCopy)} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Save as .md file</div>
            <div className="text-xs text-[hsl(var(--text-muted))]">Auto-save summary to folder</div>
          </div>
          <button onClick={() => handleToggle('autoSaveMd', !autoSaveMd, setAutoSaveMd)} className={toggleClass(autoSaveMd)}>
            <span className={dotClass(autoSaveMd)} />
          </button>
        </div>

        {autoSaveMd && (
          <div className="flex items-center gap-2 pl-4">
            <input
              type="text"
              value={mdSavePath}
              onChange={e => setMdSavePath(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
            <button onClick={handlePathSave} className="px-3 py-1.5 rounded-lg bg-[hsl(var(--primary))] text-white text-sm">Save</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Send to CRM</div>
            <div className="text-xs text-[hsl(var(--text-muted))]">Auto-send to connected CRMs</div>
          </div>
          <button onClick={() => handleToggle('autoSendCrm', !autoSendCrm, setAutoSendCrm)} className={toggleClass(autoSendCrm)}>
            <span className={dotClass(autoSendCrm)} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Email summary</div>
            <div className="text-xs text-[hsl(var(--text-muted))]">Auto-email after meeting</div>
          </div>
          <button onClick={() => handleToggle('autoSendEmail', !autoSendEmail, setAutoSendEmail)} className={toggleClass(autoSendEmail)}>
            <span className={dotClass(autoSendEmail)} />
          </button>
        </div>
      </div>
    </div>
  )
}
