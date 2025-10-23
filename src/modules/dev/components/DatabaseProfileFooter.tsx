"use client";

import { useState, useEffect, useRef } from "react";
import { useDatabaseProfiles } from "../database-profiles";
import type { DatabaseStats } from "../database-actions";

interface DatabaseProfileFooterProps {
  isCollapsed: boolean;
  stats: DatabaseStats | null;
}

interface ProfileSelectorProps {
  onClose: () => void;
}

function ProfileSelector({ onClose }: ProfileSelectorProps) {
  const { activeProfile, profiles, setActiveProfile } = useDatabaseProfiles();

  const handleProfileSelect = (profileId: string) => {
    setActiveProfile(profileId);
    onClose();
  };

  const handleNewProfile = () => {
    // TODO: Open profile creation modal
    onClose();
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
      <div className="p-2">
        <div className="text-xs font-semibold text-gray-300 mb-2">Database Profiles</div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleProfileSelect(profile.id)}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                profile.id === activeProfile?.id
                  ? "bg-green-600/20 text-green-300"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-gray-500">
                    {profile.type === "local" ? "Local" : `${profile.host}:${profile.port}`}
                  </div>
                </div>
                {profile.id === activeProfile?.id && (
                  <span className="text-green-400 text-xs">●</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-gray-600 mt-2 pt-2">
          <button
            type="button"
            onClick={handleNewProfile}
            className="w-full text-left p-2 rounded text-xs hover:bg-gray-700 text-gray-300"
          >
            <span className="text-green-400">+</span> New Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function CollapsedProfileView({ onClick }: { onClick: () => void }) {
  const { activeProfile } = useDatabaseProfiles();

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        className="text-lg hover:bg-gray-700 p-1 rounded transition-colors"
        title={activeProfile ? `${activeProfile.name} - Connected` : "No database selected"}
      >
        💾
      </button>
      <div className="text-xs text-green-400">●</div>
    </div>
  );
}

function ExpandedProfileView({ 
  onClick, 
  showSelector, 
  stats 
}: { 
  onClick: () => void; 
  showSelector: boolean;
  stats: DatabaseStats | null;
}) {
  const { activeProfile } = useDatabaseProfiles();

  const getTotalRows = () => {
    return (activeProfile?.totalRows || stats?.totalRows || 0).toLocaleString();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left hover:bg-gray-700/50 p-2 rounded transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>💾</span>
            <span>Database: {activeProfile ? "Connected" : "Not connected"}</span>
          </div>
          {activeProfile && (
            <>
              <div className="text-sm font-medium text-green-300 mb-1">
                {activeProfile.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>📈</span>
                <span>{getTotalRows()} total rows</span>
              </div>
            </>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {showSelector ? "▲" : "▼"}
        </span>
      </div>
    </button>
  );
}

export function DatabaseProfileFooter({ isCollapsed, stats }: DatabaseProfileFooterProps) {
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const profileSelectorRef = useRef<HTMLDivElement>(null);

  // Close profile selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileSelectorRef.current && !profileSelectorRef.current.contains(event.target as Node)) {
        setShowProfileSelector(false);
      }
    }

    if (showProfileSelector) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileSelector]);

  const toggleProfileSelector = () => {
    setShowProfileSelector(!showProfileSelector);
  };

  const closeProfileSelector = () => {
    setShowProfileSelector(false);
  };

  return (
    <div className={`border-t border-gray-700 bg-gray-900/50 ${isCollapsed ? 'p-2' : 'p-4'}`}>
      {isCollapsed ? (
        <CollapsedProfileView onClick={toggleProfileSelector} />
      ) : (
        <div className="relative" ref={profileSelectorRef}>
          <ExpandedProfileView 
            onClick={toggleProfileSelector}
            showSelector={showProfileSelector}
            stats={stats}
          />
          {showProfileSelector && (
            <ProfileSelector onClose={closeProfileSelector} />
          )}
        </div>
      )}
    </div>
  );
}