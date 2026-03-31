'use client'

import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface CrmConnection {
  provider: string
  connected: boolean
  spreadsheet_url?: string
  base_id?: string
  table_name?: string
}

interface CrmDropdownProps {
  isOpen: boolean
  onClose: () => void
  meetingName: string
  meetingDate: string
  attendees: string[]
  summary: string
  actionItems: string[]
}

const PROVIDER_LABELS: Record<string, string> = {
  google_sheets: 'Google Sheets',
  hubspot: 'HubSpot',
  airtable: 'Airtable',
}

export function CrmDropdown({
  isOpen,
  onClose,
  meetingName,
  meetingDate,
  attendees,
  summary,
  actionItems,
}: CrmDropdownProps) {
  const [connections, setConnections] = useState<CrmConnection[]>([])
  const [sending, setSending] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5167/api/settings/crm')
        .then(res => res.json())
        .then(data => setConnections(data.connections || []))
        .catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSend = async (provider: string) => {
    setSending(provider)
    try {
      const res = await fetch('http://localhost:5167/api/actions/send-to-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          meeting_name: meetingName,
          date: meetingDate,
          attendees,
          summary,
          action_items: actionItems,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(err.detail || 'Failed')
      }
      toast.success(`Sent to ${PROVIDER_LABELS[provider] || provider}!`)
      onClose()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to send'
      toast.error(msg)
    } finally {
      setSending(null)
    }
  }

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 w-56 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg z-50"
    >
      <div className="p-2">
        {connections.length === 0 ? (
          <p className="text-sm text-[hsl(var(--text-muted))] px-2 py-3 text-center">
            No CRM connected.<br />
            <span className="text-xs">Go to Settings &rarr; CRM to configure.</span>
          </p>
        ) : (
          connections.map((conn) => (
            <button
              key={conn.provider}
              onClick={() => handleSend(conn.provider)}
              disabled={sending !== null}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--secondary))] transition-colors disabled:opacity-50"
            >
              {sending === conn.provider
                ? 'Sending...'
                : `Send to ${PROVIDER_LABELS[conn.provider] || conn.provider}`}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
