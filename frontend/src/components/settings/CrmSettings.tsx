'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface CrmConnection {
  provider: string
  connected: boolean
  spreadsheet_url?: string
  base_id?: string
  table_name?: string
}

export function CrmSettings() {
  const [connections, setConnections] = useState<CrmConnection[]>([])
  const [saving, setSaving] = useState(false)

  // Google Sheets fields
  const [gsApiKey, setGsApiKey] = useState('')
  const [gsUrl, setGsUrl] = useState('')

  // HubSpot fields
  const [hsApiKey, setHsApiKey] = useState('')

  // Airtable fields
  const [atApiKey, setAtApiKey] = useState('')
  const [atBaseId, setAtBaseId] = useState('')
  const [atTableName, setAtTableName] = useState('')

  useEffect(() => {
    fetch('http://localhost:5167/api/settings/crm')
      .then(res => res.json())
      .then(data => {
        const conns: CrmConnection[] = data.connections || []
        setConnections(conns)
        const gs = conns.find(c => c.provider === 'google_sheets')
        if (gs) setGsUrl(gs.spreadsheet_url || '')
        const at = conns.find(c => c.provider === 'airtable')
        if (at) {
          setAtBaseId(at.base_id || '')
          setAtTableName(at.table_name || '')
        }
      })
      .catch(() => toast.error('Failed to load CRM settings'))
  }, [])

  const saveProvider = async (provider: string, body: Record<string, string>) => {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:5167/api/settings/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...body }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success(`${provider === 'google_sheets' ? 'Google Sheets' : provider === 'hubspot' ? 'HubSpot' : 'Airtable'} settings saved!`)
      // Refresh connections
      const refresh = await fetch('http://localhost:5167/api/settings/crm')
      const data = await refresh.json()
      setConnections(data.connections || [])
    } catch {
      toast.error('Failed to save CRM settings')
    } finally {
      setSaving(false)
    }
  }

  const isConnected = (provider: string) => connections.some(c => c.provider === provider)

  const inputClass = "w-full px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
  const labelClass = "block text-sm font-medium text-[hsl(var(--text-secondary))] mb-1"
  const sectionClass = "p-4 rounded-lg border border-[hsl(var(--border))] space-y-3"
  const badgeConnected = "ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"
  const badgeNotConnected = "ml-2 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--text-muted))]"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] mb-1">CRM Integrations</h3>
        <p className="text-sm text-[hsl(var(--text-muted))]">
          Connect your CRM to automatically send meeting summaries.
        </p>
      </div>

      {/* Google Sheets */}
      <div className={sectionClass}>
        <div className="flex items-center">
          <h4 className="font-medium text-[hsl(var(--text-primary))]">Google Sheets</h4>
          <span className={isConnected('google_sheets') ? badgeConnected : badgeNotConnected}>
            {isConnected('google_sheets') ? 'Connected' : 'Not connected'}
          </span>
        </div>
        <div>
          <label className={labelClass}>API Key</label>
          <input
            type="password"
            value={gsApiKey}
            onChange={(e) => setGsApiKey(e.target.value)}
            placeholder="Google API key"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Spreadsheet URL</label>
          <input
            type="text"
            value={gsUrl}
            onChange={(e) => setGsUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className={inputClass}
          />
        </div>
        <button
          onClick={() => saveProvider('google_sheets', { api_key: gsApiKey, spreadsheet_url: gsUrl })}
          disabled={saving || !gsApiKey}
          className="px-4 py-2 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-medium hover:bg-[hsl(var(--accent-dark))] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Google Sheets'}
        </button>
      </div>

      {/* HubSpot */}
      <div className={sectionClass}>
        <div className="flex items-center">
          <h4 className="font-medium text-[hsl(var(--text-primary))]">HubSpot</h4>
          <span className={isConnected('hubspot') ? badgeConnected : badgeNotConnected}>
            {isConnected('hubspot') ? 'Connected' : 'Not connected'}
          </span>
        </div>
        <div>
          <label className={labelClass}>Private App Token</label>
          <input
            type="password"
            value={hsApiKey}
            onChange={(e) => setHsApiKey(e.target.value)}
            placeholder="pat-na1-xxxx..."
            className={inputClass}
          />
        </div>
        <button
          onClick={() => saveProvider('hubspot', { api_key: hsApiKey })}
          disabled={saving || !hsApiKey}
          className="px-4 py-2 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-medium hover:bg-[hsl(var(--accent-dark))] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save HubSpot'}
        </button>
      </div>

      {/* Airtable */}
      <div className={sectionClass}>
        <div className="flex items-center">
          <h4 className="font-medium text-[hsl(var(--text-primary))]">Airtable</h4>
          <span className={isConnected('airtable') ? badgeConnected : badgeNotConnected}>
            {isConnected('airtable') ? 'Connected' : 'Not connected'}
          </span>
        </div>
        <div>
          <label className={labelClass}>Personal Access Token</label>
          <input
            type="password"
            value={atApiKey}
            onChange={(e) => setAtApiKey(e.target.value)}
            placeholder="pat.xxxx..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Base ID</label>
          <input
            type="text"
            value={atBaseId}
            onChange={(e) => setAtBaseId(e.target.value)}
            placeholder="appXXXXXXXXXX"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Table Name</label>
          <input
            type="text"
            value={atTableName}
            onChange={(e) => setAtTableName(e.target.value)}
            placeholder="Meetings"
            className={inputClass}
          />
        </div>
        <button
          onClick={() => saveProvider('airtable', { api_key: atApiKey, base_id: atBaseId, table_name: atTableName })}
          disabled={saving || !atApiKey}
          className="px-4 py-2 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-medium hover:bg-[hsl(var(--accent-dark))] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Airtable'}
        </button>
      </div>
    </div>
  )
}
