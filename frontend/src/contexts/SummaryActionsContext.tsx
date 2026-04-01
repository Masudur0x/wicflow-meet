'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/api'

interface AutoActions {
  autoCopyClipboard: boolean
  autoSaveMd: boolean
  autoSendCrm: boolean
  autoSendEmail: boolean
  mdSavePath: string
}

interface SummaryActionsContextType {
  autoActions: AutoActions
  setAutoActions: (actions: AutoActions) => void
}

const defaultAutoActions: AutoActions = {
  autoCopyClipboard: false,
  autoSaveMd: false,
  autoSendCrm: false,
  autoSendEmail: false,
  mdSavePath: '~/Documents/Wicflow Meet',
}

const SummaryActionsContext = createContext<SummaryActionsContextType>({
  autoActions: defaultAutoActions,
  setAutoActions: () => {},
})

export function SummaryActionsProvider({ children }: { children: React.ReactNode }) {
  const [autoActions, setAutoActions] = useState<AutoActions>(defaultAutoActions)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings/auto-actions`)
      .then(res => res.json())
      .then(data => setAutoActions({ ...defaultAutoActions, ...data }))
      .catch(() => {})
  }, [])

  return (
    <SummaryActionsContext.Provider value={{ autoActions, setAutoActions }}>
      {children}
    </SummaryActionsContext.Provider>
  )
}

export const useSummaryActions = () => useContext(SummaryActionsContext)
