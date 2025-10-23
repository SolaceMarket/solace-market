"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSettings as useSettingsHook } from "./useSettings";
import type { SettingsState, SettingsUpdate } from "./types";

interface SettingsContextType extends SettingsState {
  updateSetting: (update: SettingsUpdate) => Promise<void>;
  getSetting: (path: string) => unknown;
  resetToDefaults: () => Promise<void>;
  reload: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const settingsHook = useSettingsHook();

  return (
    <SettingsContext.Provider value={settingsHook}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}