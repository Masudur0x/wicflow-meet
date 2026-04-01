import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
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
    const [showIntegrations, setShowIntegrations] = useState(false);

    const handleTabChange = () => {
        setSaveSuccess(null); // Reset save success when tab changes
    };

    return (
        <Tabs defaultValue={defaultTab} className="w-full max-h-[calc(100vh-10rem)] overflow-y-auto" onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger value="transcriptSettings">Transcript</TabsTrigger>
    <TabsTrigger value="modelSettings">Ai Summary</TabsTrigger>
    <TabsTrigger value="recordingSettings">Preferences</TabsTrigger>
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
    {/* Integrations — collapsed by default */}
    <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
      <button
        onClick={() => setShowIntegrations(!showIntegrations)}
        className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors w-full"
      >
        {showIntegrations ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        Integrations
      </button>
      {showIntegrations && (
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Email</h4>
            <EmailSettings />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">CRM</h4>
            <CrmSettings />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">Auto-Actions</h4>
            <AutoActionsSettings />
          </div>
        </div>
      )}
    </div>
  </TabsContent>
  <TabsContent value="about">
    <About />
  </TabsContent>
</Tabs>
    )
}
