import { useState, useRef } from "react";
import type { QueryTabRef } from "../QueryTab";
import { queryHistory } from "../queryHistory";

export function useConsoleState(
  autoOpen: boolean,
  defaultTab: "tables" | "query" | "stats" | "admin" | "settings"
) {
  const [isVisible, setIsVisible] = useState(autoOpen);
  const [activeTab, setActiveTab] = useState<
    "tables" | "query" | "stats" | "admin" | "settings"
  >(defaultTab);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedSettingsSection, setSelectedSettingsSection] = useState<string | null>(null);
  const [selectedTableFromCommand, setSelectedTableFromCommand] = useState<string | null>(null);
  const queryTabRef = useRef<QueryTabRef>(null);

  const handleTabChange = (tab: string, updateSetting: (update: any) => void) => {
    setActiveTab(tab as typeof activeTab);
    updateSetting({
      path: "console.defaultTab",
      value: tab,
    });
    
    // Track user action
    queryHistory.addUserAction({
      type: "tab_changed",
      timestamp: Date.now(),
      data: { tab }
    });
  };

  const handleTableSelect = (tableName: string) => {
    // Set the selected table and switch to tables tab
    setSelectedTableFromCommand(tableName);
    setActiveTab("tables");
    
    // Track user action
    queryHistory.addUserAction({
      type: "table_opened",
      timestamp: Date.now(),
      data: { table: tableName }
    });
  };

  const handleSettingsNavigate = (section: string) => {
    setSelectedSettingsSection(section);
  };

  const handleQueryExecute = (query: string, result: any) => {
    console.log("handleQueryExecute called with:", { query, result });
    
    // Switch to query tab first
    setActiveTab("query");
    
    // Set the query and result in the query tab (component is now always mounted)
    if (queryTabRef.current) {
      console.log("Setting query and result via ref");
      queryTabRef.current.setQueryAndResult(query, result);
    } else {
      console.error("QueryTab ref is null");
    }
    
    // Close command palette
    setIsCommandPaletteOpen(false);
  };

  const setSqlQuery = (query: string) => {
    if (queryTabRef.current) {
      queryTabRef.current.setSqlQuery(query);
    }
  };

  return {
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
  };
}