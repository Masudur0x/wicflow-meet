'use client'

import React, { useState } from 'react'
import { ClipboardCopy, FileDown, Mail, Database } from 'lucide-react'
import { toast } from 'sonner'
import { EmailModal } from './EmailModal'

interface SummaryActionsBarProps {
  summaryText: string
  meetingName: string
  meetingDate?: string
}

export function SummaryActionsBar({ summaryText, meetingName, meetingDate }: SummaryActionsBarProps) {
  const [emailOpen, setEmailOpen] = useState(false)
  const [crmOpen, setCrmOpen] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText)
    toast.success('Summary copied to clipboard!')
  }

  const handleSaveMd = async () => {
    const date = meetingDate || new Date().toISOString().slice(0, 10)
    const safeName = meetingName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')
    const filename = `${date}-${safeName}.md`

    try {
      const res = await fetch('http://localhost:5167/api/actions/save-md', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: summaryText, filename })
      })
      const data = await res.json()
      toast.success(`Saved to ${data.path}`)
    } catch {
      toast.error('Failed to save file')
    }
  }

  const buttonClass = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-[hsl(var(--border))] hover:border-[hsl(var(--border-medium))] hover:bg-[hsl(var(--secondary))] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"

  return (
    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[hsl(var(--border))]">
      <button onClick={handleCopy} className={buttonClass}>
        <ClipboardCopy size={16} />
        Copy
      </button>
      <button onClick={handleSaveMd} className={buttonClass}>
        <FileDown size={16} />
        Save .md
      </button>
      <button onClick={() => setEmailOpen(true)} className={buttonClass}>
        <Mail size={16} />
        Email
      </button>
      <EmailModal
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
        subject={`Meeting Summary: ${meetingName}`}
        body={summaryText}
      />
      <button onClick={() => toast.info('CRM feature coming soon — configure in Settings')} className={buttonClass}>
        <Database size={16} />
        CRM
      </button>
    </div>
  )
}
