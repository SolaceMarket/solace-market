"use client";

import { useState } from "react";
import { SidebarNavigation } from "./SidebarNavigation";
import { CommandPalette } from "./CommandPalette";
import type { DatabaseStats } from "./database-actions";
import { useSettings } from "./settings";
import { useKeyboardShortcuts, useConsoleState } from "./hooks";
import { 
  MainContent, 
  CloseButton, 
  KeyboardShortcutsHint, 
  ConsoleStateDisplay 
} from "./components";
import { getThemeClasses } from "./utils/theme";

interface DatabaseConsoleClientProps {
  initialTables: string[];
  initialStats: DatabaseStats | null;
  onRefreshData: () => void;
}

/**
 * Client component that handles all interactive functionality for the database console
 */
export function DatabaseConsoleClient({
  initialTables,
  initialStats,
  onRefreshData,
}: DatabaseConsoleClientProps) {
  const { settings, updateSetting, isLoaded } = useSettings();
  const [tables] = useState<string[]>(initialTables);
  const [stats] = useState<DatabaseStats | null>(initialStats);

  const {
    isVisible,
    setIsVisible,
    activeTab,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    selectedSettingsSection,
    setSelectedSettingsSection,
    selectedTableFromCommand,
    setSelectedTableFromCommand,
    queryTabRef,
    handleTabChange,
    handleTableSelect,
    handleSettingsNavigate,
    handleQueryExecute,
    setSqlQuery,
  } = useConsoleState(settings.console.autoOpen, settings.console.defaultTab);

  // Keyboard shortcuts handling
  useKeyboardShortcuts({
    isVisible,
    isCommandPaletteOpen,
    directCommandPalette: settings.console.directCommandPalette,
    toggleKey: settings.console.keyboardShortcuts.toggle,
    closeKey: settings.console.keyboardShortcuts.close,
    onToggle: () => setIsVisible((prev) => !prev),
    onClose: () => setIsVisible(false),
    onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
  });

  // Show loading or hidden state
  const stateDisplay = (
    <ConsoleStateDisplay
      isLoaded={isLoaded}
      isVisible={isVisible}
      isCommandPaletteOpen={isCommandPaletteOpen}
      directCommandPalette={settings.console.directCommandPalette}
      toggleKey={settings.console.keyboardShortcuts.toggle}
    />
  );

  if (!isLoaded || !isVisible) {
    return (
      <>
        {stateDisplay}
        {/* Command Palette can still be shown even when console is hidden */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          tables={tables}
          activeTab={activeTab}
          onTabChange={(tab) => handleTabChange(tab, updateSetting)}
          onTableSelect={handleTableSelect}
          onSettingsNavigate={handleSettingsNavigate}
          onQueryExecute={handleQueryExecute}
        />
      </>
    );
  }

  const themeClasses = getThemeClasses(settings.console.theme);

  return (
    <div className={`fixed inset-0 ${themeClasses} overflow-hidden z-50`}>
      {/* Floating Close Button */}
      <CloseButton onClose={() => setIsVisible(false)} />

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <SidebarNavigation
          activeTab={activeTab}
          tables={tables}
          stats={stats}
          onTabChange={(tab) => handleTabChange(tab, updateSetting)}
        />

        {/* Main Content */}
        <MainContent
          activeTab={activeTab}
          tables={tables}
          stats={stats}
          selectedTableFromCommand={selectedTableFromCommand}
          selectedSettingsSection={selectedSettingsSection}
          queryTabRef={queryTabRef}
          onTableCommandHandled={() => setSelectedTableFromCommand(null)}
          onTabChange={(tab) => handleTabChange(tab, updateSetting)}
          onRefreshData={onRefreshData}
          setSqlQuery={setSqlQuery}
          onSectionChange={() => setSelectedSettingsSection(null)}
        />
      </div>

      {/* Keyboard Shortcuts Hint */}
      <KeyboardShortcutsHint
        toggleKey={settings.console.keyboardShortcuts.toggle}
        directCommandPalette={settings.console.directCommandPalette}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tables={tables}
        activeTab={activeTab}
        onTabChange={(tab) => handleTabChange(tab, updateSetting)}
        onTableSelect={handleTableSelect}
        onSettingsNavigate={handleSettingsNavigate}
        onQueryExecute={handleQueryExecute}
      />
    </div>
  );
}
