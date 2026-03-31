'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function EmailSettings() {
  const [method, setMethod] = useState('')
  const [smtpHost, setSmtpHost] = useState('')
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUsername, setSmtpUsername] = useState('')
  const [smtpPassword, setSmtpPassword] = useState('')
  const [sendgridApiKey, setSendgridApiKey] = useState('')
  const [fromEmail, setFromEmail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5167/api/settings/email')
      .then(res => res.json())
      .then(data => {
        setMethod(data.method || '')
        setSmtpHost(data.smtp_host || '')
        setSmtpPort(data.smtp_port || 587)
        setSmtpUsername(data.smtp_username || '')
        setSmtpPassword(data.smtp_password || '')
        setSendgridApiKey(data.sendgrid_api_key || '')
        setFromEmail(data.from_email || '')
      })
      .catch(() => toast.error('Failed to load email settings'))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:5167/api/settings/email', {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-1">Email Configuration</h3>
        <p className="text-sm text-[hsl(var(--text-muted))]">
          Configure SMTP or SendGrid to email meeting summaries.
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
          <option value="smtp">SMTP (Gmail, Outlook, etc.)</option>
          <option value="sendgrid">SendGrid API</option>
        </select>
      </div>

      {method === 'smtp' && (
        <div className="space-y-3">
          <div>
            <label className={labelClass}>SMTP Host</label>
            <input
              type="text"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              placeholder="smtp.gmail.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>SMTP Port</label>
            <input
              type="number"
              value={smtpPort}
              onChange={(e) => setSmtpPort(parseInt(e.target.value) || 587)}
              placeholder="587"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              value={smtpUsername}
              onChange={(e) => setSmtpUsername(e.target.value)}
              placeholder="your-email@gmail.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password / App Password</label>
            <input
              type="password"
              value={smtpPassword}
              onChange={(e) => setSmtpPassword(e.target.value)}
              placeholder="App password or SMTP password"
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
          <label className={labelClass}>From Email</label>
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            placeholder="noreply@yourdomain.com"
            className={inputClass}
          />
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
