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

    const handleTabChange = () => {
        setSaveSuccess(null); // Reset save success when tab changes
    };

    return (
        <Tabs defaultValue={defaultTab} className="w-full max-h-[calc(100vh-10rem)] overflow-y-auto" onValueChange={handleTabChange}>
  <TabsList>
    <TabsTrigger value="transcriptSettings">Transcript</TabsTrigger>
    <TabsTrigger value="modelSettings">Ai Summary</TabsTrigger>
    <TabsTrigger value="recordingSettings">Preferences</TabsTrigger>
    <TabsTrigger value="emailSettings">Email</TabsTrigger>
    <TabsTrigger value="crmSettings">CRM</TabsTrigger>
    <TabsTrigger value="autoActions">Auto-Actions</TabsTrigger>
    <TabsTrigger value="about">About</TabsTrigger>
  </TabsList>
  <TabsContent value="modelSettings">
    <SummarizationTierSettings />
    <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
      <ModelSettingsModal
        modelConfig={modelConfig}
        setModelConfig={setModelConfig}
        onSave={onSave}
      />
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
  <TabsContent value="emailSettings">
    <EmailSettings />
  </TabsContent>
  <TabsContent value="crmSettings">
    <CrmSettings />
  </TabsContent>
  <TabsContent value="autoActions">
    <AutoActionsSettings />
  </TabsContent>
  <TabsContent value="about">
    <About />
  </TabsContent>
</Tabs>
    )
}


