"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  DatabaseConsoleSettings,
  SettingsState,
  SettingsUpdate,
} from "./types";
import defaultSettings from "./default-settings.json";

const USER_SETTINGS_KEY = "db-console-user-settings";

/**
 * Deep merge two objects, with source taking precedence
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    if (
      sourceValue !== null &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue)
    ) {
      result[key] = deepMerge(
        (result[key] as Record<string, unknown>) || {},
        sourceValue as Record<string, unknown>,
      ) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/**
 * Set a value in an object using a dot-notation path
 */
function setValueByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const keys = path.split(".");
  const result = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>; // Deep clone

  let current: Record<string, unknown> = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Get a value from an object using a dot-notation path
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((current: unknown, key: string) => {
    return (current as Record<string, unknown>)?.[key];
  }, obj);
}

/**
 * Settings manager hook for database console
 */
export function useSettings() {
  const [state, setState] = useState<SettingsState>({
    isLoaded: false,
    isLoading: true,
    error: null,
    settings: defaultSettings as DatabaseConsoleSettings,
  });

  const loadSettings = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Load user settings from localStorage
      const userSettingsJson = localStorage.getItem(USER_SETTINGS_KEY);
      const userSettings = userSettingsJson ? JSON.parse(userSettingsJson) : {};

      // Merge default settings with user settings
      const mergedSettings = deepMerge(
        defaultSettings as unknown as Record<string, unknown>,
        userSettings,
      ) as unknown as DatabaseConsoleSettings;

      setState({
        isLoaded: true,
        isLoading: false,
        error: null,
        settings: mergedSettings,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to load settings",
      }));
    }
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = useCallback(
    async (update: SettingsUpdate) => {
      try {
        console.log("Updating setting:", update);

        // Update the current settings
        const newSettings = setValueByPath(
          state.settings as unknown as Record<string, unknown>,
          update.path,
          update.value,
        ) as unknown as DatabaseConsoleSettings;

        // Calculate what changed from defaults to save only user modifications
        const userSettings = getUserModifications(newSettings);

        // Save to localStorage
        localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(userSettings));

        // Update state
        setState((prev) => ({
          ...prev,
          settings: newSettings,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error.message : "Failed to update setting",
        }));
      }
    },
    [state.settings],
  );

  const getSetting = useCallback(
    (path: string): unknown => {
      return getValueByPath(
        state.settings as unknown as Record<string, unknown>,
        path,
      );
    },
    [state.settings],
  );

  const resetToDefaults = useCallback(async () => {
    try {
      localStorage.removeItem(USER_SETTINGS_KEY);
      setState({
        isLoaded: true,
        isLoading: false,
        error: null,
        settings: defaultSettings as DatabaseConsoleSettings,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to reset settings",
      }));
    }
  }, []);

  return {
    ...state,
    updateSetting,
    getSetting,
    resetToDefaults,
    reload: loadSettings,
  };
}

/**
 * Calculate user modifications by comparing current settings with defaults
 */
function getUserModifications(
  currentSettings: DatabaseConsoleSettings,
): Record<string, unknown> {
  function getDifferences(
    current: Record<string, unknown>,
    defaults: Record<string, unknown>,
    path = "",
  ): Record<string, unknown> {
    const differences: Record<string, unknown> = {};

    for (const key in current) {
      const currentPath = path ? `${path}.${key}` : key;
      const currentValue = current[key];
      const defaultValue = defaults[key];

      if (
        typeof currentValue === "object" &&
        currentValue !== null &&
        !Array.isArray(currentValue)
      ) {
        const nested = getDifferences(
          currentValue as Record<string, unknown>,
          (defaultValue as Record<string, unknown>) || {},
          currentPath,
        );
        if (Object.keys(nested).length > 0) {
          differences[key] = nested;
        }
      } else if (currentValue !== defaultValue) {
        differences[key] = currentValue;
      }
    }

    return differences;
  }

  return getDifferences(
    currentSettings as unknown as Record<string, unknown>,
    defaultSettings as unknown as Record<string, unknown>,
  );
}
