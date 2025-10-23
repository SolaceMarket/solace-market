"use client";

import { 
  ConsoleSettings, 
  TablesSettings, 
  QuerySettings, 
  StatsSettings, 
  AdminSettings 
} from './sections';
import type { SettingSectionType } from './constants';

interface SettingsContentProps {
  activeSection: SettingSectionType;
}

export function SettingsContent({ activeSection }: SettingsContentProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-900">
      <div className="max-w-4xl">
        <h3 className="font-bold text-xl mb-6 capitalize text-green-300">
          {activeSection} Settings
        </h3>

        {activeSection === "console" && <ConsoleSettings />}
        {activeSection === "tables" && <TablesSettings />}
        {activeSection === "query" && <QuerySettings />}
        {activeSection === "stats" && <StatsSettings />}
        {activeSection === "admin" && <AdminSettings />}
      </div>
    </div>
  );
}