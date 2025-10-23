"use client";

import { useState, useEffect } from "react";
import { useSettings } from "./settings";
import { GenericSidebar } from "./GenericSidebar";
import { SettingsContent } from "./settings/SettingsContent";
import { SETTINGS_CATEGORIES, type SettingSectionType } from "./settings/constants";

interface SettingsTabProps {
  onTabChange: (tab: string) => void;
  initialSection?: string | null;
  onSectionChange?: () => void;
}

export function SettingsTab({ onTabChange: _, initialSection, onSectionChange }: SettingsTabProps) {
  const { resetToDefaults, isLoading, error } = useSettings();
  
  const [activeSection, setActiveSection] = useState<SettingSectionType>(
    (initialSection as SettingSectionType) || "console"
  );

  // Handle initial section navigation from command palette
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection as SettingSectionType);
      onSectionChange?.();
    }
  }, [initialSection, onSectionChange]);

  const handleReset = async () => {
    if (confirm("Reset all settings to defaults? This cannot be undone.")) {
      await resetToDefaults();
    }
  };

  // Footer with reset button
  const sidebarFooter = (
    <button
      type="button"
      onClick={handleReset}
      className="w-full bg-red-600 hover:bg-red-700 p-2 rounded text-sm transition-colors"
    >
      Reset to Defaults
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div>Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4">
        <div className="bg-red-900 border border-red-600 p-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* Settings Navigation using GenericSidebar */}
      <GenericSidebar
        title="Settings Categories"
        items={SETTINGS_CATEGORIES}
        selectedItem={activeSection}
        onItemSelect={(sectionId) => setActiveSection(sectionId as SettingSectionType)}
        width={280}
        footer={sidebarFooter}
        isLoading={isLoading}
      />

      {/* Settings Content */}
      <SettingsContent activeSection={activeSection} />
    </div>
  );
}
