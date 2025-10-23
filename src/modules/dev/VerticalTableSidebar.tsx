"use client";

import { GenericSidebar } from "./GenericSidebar";

interface VerticalTableSidebarProps {
  tables: string[];
  selectedTable: string | null;
  isPending: boolean;
  width: number;
  onTableSelect: (tableName: string) => void;
}

export function VerticalTableSidebar({
  tables,
  selectedTable,
  isPending,
  width,
  onTableSelect,
}: VerticalTableSidebarProps) {
  // Convert tables to sidebar items
  const sidebarItems = tables.map((table) => ({
    id: table,
    label: table,
    icon: "📄",
    description: selectedTable === table ? "Currently viewing" : undefined,
  }));

  const footer = (
    <div className="text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <span>�</span>
        <span>
          {tables.length} {tables.length === 1 ? "table" : "tables"} available
        </span>
      </div>
    </div>
  );

  const emptyState = {
    icon: "📋",
    title: "No tables found",
    description: "No tables available in the database",
  };

  return (
    <GenericSidebar
      title="Tables"
      items={sidebarItems}
      selectedItem={selectedTable}
      onItemSelect={onTableSelect}
      width={width}
      footer={footer}
      isLoading={isPending}
      emptyState={emptyState}
    />
  );
}
