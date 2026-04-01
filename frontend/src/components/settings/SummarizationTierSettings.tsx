'use client'

import React, { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/api'

type Tier = 'free' | 'byo'
type ByoProvider = 'claude' | 'openai'

export function SummarizationTierSettings() {
  const [tier, setTier] = useState<Tier>('free')
  const [byoProvider, setByoProvider] = useState<ByoProvider>('claude')
  const [byoApiKey, setByoApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/summarization-tier`)
      .then(res => res.json())
      .then(data => {
        if (data.tier && data.tier !== 'premium') setTier(data.tier)
        if (data.byo_provider) setByoProvider(data.byo_provider)
        if (data.byo_api_key) setByoApiKey(data.byo_api_key)
      })
      .catch(() => {
        // Backend may not be running - use defaults
        console.warn('[SummarizationTierSettings] Failed to load tier settings');
      })
  }, [])

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings/summarization-tier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, byo_provider: byoProvider, byo_api_key: byoApiKey })
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('[SummarizationTierSettings] Failed to save:', error);
      setSaved(false);
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))]">AI Summarization</h3>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTier('free')}
          className={`p-4 rounded-xl border text-left transition-all ${
            tier === 'free'
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--accent-glow))]'
              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--border-medium))]'
          }`}
        >
          <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Local AI (Free)</div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-1">Runs on your computer. No internet needed. Great for everyday meetings.</div>
        </button>

        <button
          onClick={() => setTier('byo')}
          className={`p-4 rounded-xl border text-left transition-all ${
            tier === 'byo'
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--accent-glow))]'
              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--border-medium))]'
          }`}
        >
          <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Connect ChatGPT or Claude</div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-1">Use your own API key for higher quality summaries.</div>
        </button>
      </div>

      {tier === 'byo' && (
        <div className="space-y-3">
          <p className="text-xs text-[hsl(var(--text-muted))] bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg px-3 py-2">
            You'll need an API key from your chosen provider. Get one from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="font-medium text-[hsl(var(--primary))] hover:underline">platform.openai.com</a> (ChatGPT) or{' '}
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="font-medium text-[hsl(var(--primary))] hover:underline">console.anthropic.com</a> (Claude).
          </p>

          <label className="block text-sm text-[hsl(var(--text-secondary))]">Provider</label>
          <select
            value={byoProvider}
            onChange={(e) => setByoProvider(e.target.value as ByoProvider)}
            className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          >
            <option value="claude">Claude (Anthropic)</option>
            <option value="openai">GPT-4o (OpenAI)</option>
          </select>

          <label className="block text-sm text-[hsl(var(--text-secondary))]">API Key</label>
          <input
            type="password"
            value={byoApiKey}
            onChange={(e) => setByoApiKey(e.target.value)}
            placeholder={byoProvider === 'claude' ? 'sk-ant-...' : 'sk-...'}
            className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
        </div>
      )}

      <button
        onClick={handleSave}
        className="px-6 py-2 rounded-full bg-[hsl(var(--primary))] text-white font-medium hover:bg-[hsl(var(--accent-dark))] transition-colors"
      >
        {saved ? 'Saved!' : 'Save'}
      </button>
    </div>
  )
}
