'use client'

import React, { useState } from 'react'
import { X, Send } from 'lucide-react'
import { toast } from 'sonner'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  subject: string
  body: string
}

export function EmailModal({ isOpen, onClose, subject, body }: EmailModalProps) {
  const [toEmails, setToEmails] = useState('')
  const [emailSubject, setEmailSubject] = useState(subject)
  const [sending, setSending] = useState(false)

  if (!isOpen) return null

  const handleSend = async () => {
    if (!toEmails.trim()) {
      toast.error('Please enter at least one email address')
      return
    }

    setSending(true)
    try {
      const emails = toEmails.split(',').map(e => e.trim()).filter(Boolean)
      const bodyHtml = body.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^- (.+)$/gm, '<li>$1</li>')

      const res = await fetch('http://localhost:5167/api/actions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_emails: emails,
          subject: emailSubject,
          body_html: bodyHtml,
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to send')
      }

      toast.success('Email sent!')
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))]">Email Summary</h3>
          <button onClick={onClose} className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))]">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[hsl(var(--text-secondary))] mb-1">To</label>
            <input
              type="text"
              value={toEmails}
              onChange={(e) => setToEmails(e.target.value)}
              placeholder="email@example.com, another@example.com"
              className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>

          <div>
            <label className="block text-sm text-[hsl(var(--text-secondary))] mb-1">Subject</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
          </div>

          <div>
            <label className="block text-sm text-[hsl(var(--text-secondary))] mb-1">Preview</label>
            <div className="max-h-48 overflow-y-auto px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--text-secondary))] whitespace-pre-wrap">
              {body}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] border border-[hsl(var(--border))] hover:border-[hsl(var(--border-medium))]"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--accent-dark))] transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
