'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { API_BASE_URL } from '@/lib/api'

const SMTP_PRESETS: Record<string, { host: string; port: number; hint: string }> = {
  gmail: { host: 'smtp.gmail.com', port: 587, hint: 'Use your Gmail address and an App Password (not your regular password). Create one at Google Account → Security → App Passwords.' },
  outlook: { host: 'smtp.office365.com', port: 587, hint: 'Use your Outlook/Hotmail email and password. If you have 2FA enabled, create an App Password.' },
  yahoo: { host: 'smtp.mail.yahoo.com', port: 587, hint: 'Use your Yahoo email and an App Password. Generate one at Yahoo Account → Security → App Passwords.' },
  custom: { host: '', port: 587, hint: '' },
}

export function EmailSettings() {
  const [method, setMethod] = useState('')
  const [smtpPreset, setSmtpPreset] = useState('')
  const [smtpHost, setSmtpHost] = useState('')
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUsername, setSmtpUsername] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  const [sendgridApiKey, setSendgridApiKey] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/email`)
      .then(res => res.json())
      .then(data => {
        setMethod(data.method || '')
        setSmtpHost(data.smtp_host || '')
        setSmtpPort(data.smtp_port || 587)
        setSmtpUsername(data.smtp_username || '')
        setSmtpPassword(data.smtp_password || '')
        setSendgridApiKey(data.sendgrid_api_key || '')
        setFromEmail(data.from_email || '')

        // Detect preset from saved host
        if (data.smtp_host) {
          const match = Object.entries(SMTP_PRESETS).find(([, p]) => p.host === data.smtp_host)
          setSmtpPreset(match ? match[0] : 'custom')
        }
      })
      .catch(() => toast.error('Failed to load email settings'))
  }, [])

  const handlePresetChange = (preset: string) => {
    setSmtpPreset(preset)
    const p = SMTP_PRESETS[preset]
    if (p) {
      setSmtpHost(p.host)
      setSmtpPort(p.port)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          smtp_host: smtpHost,
          smtp_port: smtpPort,
          smtp_username: smtpUsername,
          smtp_password: smtpPassword,
          sendgrid_api_key: sendgridApiKey,
          from_email: fromEmail,
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Email settings saved!')
    } catch {
      toast.error('Failed to save email settings')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
  const labelClass = "block text-sm font-medium text-[hsl(var(--text-secondary))] mb-1"

  const activePreset = SMTP_PRESETS[smtpPreset]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-1">Email Configuration</h3>
        <p className="text-sm text-[hsl(var(--text-muted))]">
          Send meeting summaries to your email automatically.
        </p>
      </div>

      <div>
        <label className={labelClass}>Email Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={inputClass}
        >
          <option value="">Select method...</option>
          <option value="smtp">SMTP (Gmail, Outlook, Yahoo, etc.)</option>
          <option value="sendgrid">SendGrid API</option>
        </select>
      </div>

      {method === 'smtp' && (
        <div className="space-y-4">
          {/* Provider preset buttons */}
          <div>
            <label className={labelClass}>Email Provider</label>
            <div className="grid grid-cols-4 gap-2">
              {(['gmail', 'outlook', 'yahoo', 'custom'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    smtpPreset === preset
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--accent-glow))] text-[hsl(var(--text-primary))] border'
                      : 'border border-[hsl(var(--border))] text-[hsl(var(--text-secondary))] hover:border-[hsl(var(--border-medium))]'
                  }`}
                >
                  {preset === 'gmail' ? 'Gmail' : preset === 'outlook' ? 'Outlook' : preset === 'yahoo' ? 'Yahoo' : 'Other'}
                </button>
              ))}
            </div>
          </div>

          {/* Preset hint */}
          {activePreset?.hint && (
            <div className="p-3 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg">
              <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">{activePreset.hint}</p>
            </div>
          )}

          {/* Show host/port only for custom */}
          {smtpPreset === 'custom' && (
            <>
              <div>
                <label className={labelClass}>SMTP Server Address</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="e.g. smtp.yourprovider.com"
                  className={inputClass}
                />
                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Your email provider's SMTP server. Check their help docs if unsure.</p>
              </div>
              <div>
                <label className={labelClass}>Port</label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(parseInt(e.target.value) || 587)}
                  placeholder="587"
                  className={inputClass}
                />
                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Usually 587 (recommended) or 465.</p>
              </div>
            </>
          )}

          {/* Auto-filled host/port display for presets */}
          {smtpPreset && smtpPreset !== 'custom' && (
            <div className="text-xs text-[hsl(var(--text-muted))] px-1">
              Server: {smtpHost} (port {smtpPort}) — auto-configured
            </div>
          )}

          <div>
            <label className={labelClass}>Your Email Address</label>
            <input
              type="text"
              value={smtpUsername}
              onChange={(e) => setSmtpUsername(e.target.value)}
              placeholder={smtpPreset === 'gmail' ? 'you@gmail.com' : smtpPreset === 'outlook' ? 'you@outlook.com' : 'your-email@provider.com'}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              {smtpPreset === 'gmail' || smtpPreset === 'yahoo' ? 'App Password' : 'Password'}
            </label>
            <input
              type="password"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
              placeholder={smtpPreset === 'gmail' || smtpPreset === 'yahoo' ? 'Paste your App Password here' : 'Your email password'}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {method === 'sendgrid' && (
        <div>
          <label className={labelClass}>SendGrid API Key</label>
          <input
            type="password"
            value={sendgridApiKey}
            onChange={(e) => setSendgridApiKey(e.target.value)}
            placeholder="SG.xxxx..."
            className={inputClass}
          />
        </div>
      )}

      {method && (
        <div>
          <label className={labelClass}>Send From Email</label>
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder={smtpUsername || 'noreply@yourdomain.com'}
            className={inputClass}
          />
          <p className="text-xs text-[hsl(var(--text-muted))] mt-1">The email address that appears in the "From" field.</p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !method}
        className="px-5 py-2 rounded-full bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--accent-dark))] transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Email Settings'}
      </button>
    </div>
  )
}
