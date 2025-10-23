"use client";

import { useState, useCallback } from "react";
import type { DatabaseProfile, DatabaseProfilesState, DatabaseProfileUpdate } from "./types";

const PROFILES_STORAGE_KEY = "db-console-profiles";

// Default profiles
const defaultProfiles: DatabaseProfile[] = [
  {
    id: "local-turso",
    name: "Local Turso",
    type: "local",
    database: "local.db",
    isActive: true,
    lastConnected: new Date(),
    totalRows: 32258,
  },
];

/**
 * Hook for managing database profiles
 */
export function useDatabaseProfiles() {
  const [state, setState] = useState<DatabaseProfilesState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            profiles: parsed.profiles || defaultProfiles,
            activeProfileId: parsed.activeProfileId || defaultProfiles[0]?.id || null,
          };
        }
      } catch (error) {
        console.error("Error loading database profiles:", error);
      }
    }
    return {
      profiles: defaultProfiles,
      activeProfileId: defaultProfiles[0]?.id || null,
    };
  });

  const saveToStorage = useCallback((newState: DatabaseProfilesState) => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving database profiles:", error);
    }
  }, []);

  const createProfile = useCallback((profile: DatabaseProfileUpdate) => {
    const newProfile: DatabaseProfile = {
      ...profile,
      id: profile.id || `profile-${Date.now()}`,
      isActive: false,
      lastConnected: new Date(),
    };

    setState((prev) => {
      const newState = {
        ...prev,
        profiles: [...prev.profiles, newProfile],
      };
      saveToStorage(newState);
      return newState;
    });

    return newProfile.id;
  }, [saveToStorage]);

  const updateProfile = useCallback((id: string, updates: Partial<DatabaseProfileUpdate>) => {
    setState((prev) => {
      const newState = {
        ...prev,
        profiles: prev.profiles.map((profile) =>
          profile.id === id ? { ...profile, ...updates } : profile
        ),
      };
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  const deleteProfile = useCallback((id: string) => {
    setState((prev) => {
      const newProfiles = prev.profiles.filter((p) => p.id !== id);
      const newActiveId = prev.activeProfileId === id 
        ? (newProfiles[0]?.id || null)
        : prev.activeProfileId;
      
      const newState = {
        profiles: newProfiles,
        activeProfileId: newActiveId,
      };
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  const setActiveProfile = useCallback((id: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        profiles: prev.profiles.map((profile) => ({
          ...profile,
          isActive: profile.id === id,
          lastConnected: profile.id === id ? new Date() : profile.lastConnected,
        })),
        activeProfileId: id,
      };
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  const getActiveProfile = useCallback(() => {
    return state.profiles.find((p) => p.id === state.activeProfileId) || null;
  }, [state.profiles, state.activeProfileId]);

  return {
    profiles: state.profiles,
    activeProfileId: state.activeProfileId,
    activeProfile: getActiveProfile(),
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
  };
}