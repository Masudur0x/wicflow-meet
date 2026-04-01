'use client'

import React, { useState, useEffect } from 'react'

type Tier = 'free' | 'byo'
type ByoProvider = 'claude' | 'openai'

export function SummarizationTierSettings() {
  const [tier, setTier] = useState<Tier>('free')
  const [byoProvider, setByoProvider] = useState<ByoProvider>('claude')
  const [byoApiKey, setByoApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('http://localhost:5167/api/settings/summarization-tier')
      .then(res => res.json())
      .then(data => {
        if (data.tier && data.tier !== 'premium') setTier(data.tier)
        if (data.byo_provider) setByoProvider(data.byo_provider)
        if (data.byo_api_key) setByoApiKey(data.byo_api_key)
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    await fetch('http://localhost:5167/api/settings/summarization-tier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, byo_provider: byoProvider, byo_api_key: byoApiKey })
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
          <div className="text-xs text-[hsl(var(--text-secondary))] mt-1">Runs entirely on your computer</div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-2">Runs on your computer. No internet needed. Great for everyday meetings.</div>
        </button>

        <button
          onClick={() => setTier('byo')}
          className={`p-4 rounded-xl border text-left transition-all ${
            tier === 'byo'
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--accent-glow))]'
              : 'border-[hsl(var(--border))] hover:border-[hsl(var(--border-medium))]'
          }`}
        >
          <div className="text-sm font-medium text-[hsl(var(--text-primary))]">Use Your Own API Key</div>
          <div className="text-xs text-[hsl(var(--text-secondary))] mt-1">Connect ChatGPT or Claude</div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-2">Connect your ChatGPT or Claude account for higher quality summaries.</div>
        </button>
      </div>

      {tier === 'byo' && (
        <div className="space-y-3">
          <p className="text-xs text-[hsl(var(--text-muted))] bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg px-3 py-2">
            You'll need an API key from your chosen provider. Get one from{' '}
            <span className="font-medium text-[hsl(var(--text-secondary))]">platform.openai.com</span> (ChatGPT) or{' '}
            <span className="font-medium text-[hsl(var(--text-secondary))]">console.anthropic.com</span> (Claude).
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
