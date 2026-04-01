'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Mail, Database, Zap } from 'lucide-react'
import { EmailSettings } from './EmailSettings'
import { CrmSettings } from './CrmSettings'
import { AutoActionsSettings } from './AutoActionsSettings'

export function IntegrationsTab() {
  const [showEmailSetup, setShowEmailSetup] = useState(false)
  const [showCrmSetup, setShowCrmSetup] = useState(false)
  const [showAutoActionsSetup, setShowAutoActionsSetup] = useState(false)

  return (
    <div className="space-y-4 py-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
        <p className="text-sm text-gray-500 mt-1">
          Connect external services to automatically share meeting summaries.
        </p>
      </div>

      {/* Email Summaries Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Summaries</h4>
              <p className="text-xs text-gray-500">
                Automatically email meeting notes after each meeting
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEmailSetup(!showEmailSetup)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showEmailSetup ? 'Collapse' : 'Set Up'}
            {showEmailSetup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {showEmailSetup && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <EmailSettings />
          </div>
        )}
      </div>

      {/* CRM Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">CRM</h4>
              <p className="text-xs text-gray-500">
                Send meeting summaries to Google Sheets, HubSpot, or Airtable
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCrmSetup(!showCrmSetup)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showCrmSetup ? 'Collapse' : 'Set Up'}
            {showCrmSetup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {showCrmSetup && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CrmSettings />
          </div>
        )}
      </div>

      {/* Auto-Actions Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Auto-Actions</h4>
              <p className="text-xs text-gray-500">
                Auto-copy, auto-save, or auto-send after every meeting summary
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoActionsSetup(!showAutoActionsSetup)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showAutoActionsSetup ? 'Collapse' : 'Set Up'}
            {showAutoActionsSetup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {showAutoActionsSetup && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <AutoActionsSettings />
          </div>
        )}
      </div>
    </div>
  )
}
