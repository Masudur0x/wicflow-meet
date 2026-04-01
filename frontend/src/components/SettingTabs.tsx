import { useState } from "react"
import { ChevronDown, ChevronRight, Mail, Database, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelConfig, ModelSettingsModal } from "./ModelSettingsModal"
import { TranscriptModelProps, TranscriptSettings } from "./TranscriptSettings"
import { RecordingSettings, RecordingPreferences } from "./RecordingSettings"
import { About } from "./About";
import { SummarizationTierSettings } from "@/components/settings/SummarizationTierSettings"
import { EmailSettings } from "@/components/settings/EmailSettings"
import { CrmSettings } from "@/components/settings/CrmSettings"
import { AutoActionsSettings } from "@/components/settings/AutoActionsSettings"

interface SettingTabsProps {
    modelConfig: ModelConfig;
    setModelConfig: (config: ModelConfig | ((prev: ModelConfig) => ModelConfig)) => void;
    onSave: (config: ModelConfig) => void;
    transcriptModelConfig: TranscriptModelProps;
    setTranscriptModelConfig: (config: TranscriptModelProps) => void;
    onSaveTranscript: (config: TranscriptModelProps) => void;
    setSaveSuccess: (success: boolean | null) => void;
    defaultTab?: string;
}

export function SettingTabs({
    modelConfig,
    setModelConfig,
    onSave,
    setSaveSuccess,
    defaultTab = "transcriptSettings",
    transcriptModelConfig,
    setTranscriptModelConfig,
    onSaveTranscript,
}: SettingTabsProps) {

    const [showAdvancedSummary, setShowAdvancedSummary] = useState(false);
    const [showEmailSetup, setShowEmailSetup] = useState(false);
    const [showCrmSetup, setShowCrmSetup] = useState(false);
    const [showAutoActionsSetup, setShowAutoActionsSetup] = useState(false);

    const handleTabChange = () => {
        setSaveSuccess(null); // Reset save success when tab changes
    };

    return (
        <Tabs defaultValue={defaultTab} className="w-full max-h-[calc(100vh-10rem)] overflow-y-auto" onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger value="transcriptSettings">Transcript</TabsTrigger>
    <TabsTrigger value="modelSettings">AI Summary</TabsTrigger>
    <TabsTrigger value="recordingSettings">Preferences</TabsTrigger>
    <TabsTrigger value="integrations">Integrations</TabsTrigger>
    <TabsTrigger value="about">About</TabsTrigger>
  </TabsList>
  <TabsContent value="modelSettings">
    <SummarizationTierSettings />
    {/* Advanced Model Configuration — collapsed by default */}
    <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
      <button
        onClick={() => setShowAdvancedSummary(!showAdvancedSummary)}
        className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors w-full"
      >
        {showAdvancedSummary ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        Advanced Settings
      </button>
      <p className="text-xs text-[hsl(var(--text-secondary))] mt-1 ml-6">
        For developers or power users who want to connect their own AI models.
      </p>
      {showAdvancedSummary && (
        <div className="mt-4">
          <ModelSettingsModal
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            onSave={onSave}
          />
        </div>
      )}
    </div>
  </TabsContent>
<TabsContent value="transcriptSettings">
    <TranscriptSettings
    transcriptModelConfig={transcriptModelConfig}
    setTranscriptModelConfig={setTranscriptModelConfig}
    // onSave={onSaveTranscript}
  />
  </TabsContent>
  <TabsContent value="recordingSettings">
    <RecordingSettings />
  </TabsContent>
  <TabsContent value="integrations">
    <div className="space-y-4">
      {/* Email Summaries Card */}
      <div className="rounded-lg border border-[hsl(var(--border))] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[hsl(var(--text-secondary))]" />
            <div>
              <h4 className="text-sm font-medium">Email Summaries</h4>
              <p className="text-xs text-[hsl(var(--text-secondary))]">
                Automatically email meeting notes to your team after each meeting
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEmailSetup(!showEmailSetup)}
            className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
          >
            Set Up
            {showEmailSetup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {showEmailSetup && (
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
            <EmailSettings />
          </div>
        )}
      </div>

      {/* CRM Card */}
      <div className="rounded-lg border border-[hsl(var(--border))] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[hsl(var(--text-secondary))]" />
            <div>
              <h4 className="text-sm font-medium">CRM</h4>
              <p className="text-xs text-[hsl(var(--text-secondary))]">
                Send meeting summaries directly to Google Sheets, HubSpot, or Airtable
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCrmSetup(!showCrmSetup)}
            className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
          >
            Set Up
            {showCrmSetup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {showCrmSetup && (
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
            <CrmSettings />
          </div>
        )}
      </div>

      {/* Auto-Actions Card */}
      <div className="rounded-lg border border-[hsl(var(--border))] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[hsl(var(--text-secondary))]" />
            <div>
              <h4 className="text-sm font-medium">Auto-Actions</h4>
              <p className="text-xs text-[hsl(var(--text-secondary))]">
                Auto-copy, auto-save, or auto-send after every meeting summary
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoActionsSetup(!showAutoActionsSetup)}
            className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
          >
            Set Up
            {showAutoActionsSetup ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        {showAutoActionsSetup && (
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
            <AutoActionsSettings />
          </div>
        )}
      </div>
    </div>
  </TabsContent>
  <TabsContent value="about">
    <About />
  </TabsContent>
</Tabs>
    )
}
