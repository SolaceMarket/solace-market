"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { QueryResult } from "./database-actions";
import { executeQuery } from "./database-actions";
import { queryHistory } from "./queryHistory";
import { SqlQueryInput, type SqlQueryInputRef } from "./SqlQueryInput";
import { useSettings } from "./settings";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Database" | "Settings" | "Navigation" | "History" | "Smart";
  icon: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tables: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTableSelect?: (table: string) => void;
  onSettingsNavigate?: (section: string) => void;
  onQueryExecute?: (query: string, result: QueryResult) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  tables,
  activeTab,
  onTabChange,
  onTableSelect,
  onSettingsNavigate,
  onQueryExecute,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isQueryMode, setIsQueryMode] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sqlInputRef = useRef<SqlQueryInputRef>(null);
  const { updateSetting } = useSettings();

  // Check if query looks like SQL
  const detectSqlQuery = (text: string) => {
    const trimmed = text.trim().toUpperCase();
    return (
      trimmed.startsWith("SELECT") ||
      trimmed.startsWith("INSERT") ||
      trimmed.startsWith("UPDATE") ||
      trimmed.startsWith("DELETE") ||
      trimmed.startsWith("WITH") ||
      trimmed.startsWith("EXPLAIN")
    );
  };

  // Build command items
  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // Don't show regular commands when in SQL mode
    if (isQueryMode) {
      return items;
    }

    // Smart Suggestions (based on recent actions)
    const smartSuggestions = queryHistory.getSmartSuggestions();
    smartSuggestions.forEach((suggestion, index) => {
      items.push({
        id: `smart-${index}`,
        title: suggestion,
        subtitle: "Smart suggestion based on recent activity",
        category: "Smart",
        icon: "🧠",
        keywords: ["smart", "suggestion", "recent", suggestion.toLowerCase()],
        action: () => {
          setQuery(suggestion);
          setIsQueryMode(true);
          setTimeout(() => {
            if (sqlInputRef.current) {
              sqlInputRef.current.focus();
            }
          }, 50);
        },
      });
    });

    // Recent Query History
    const recentQueries = queryHistory.getRecentQueries(5);
    recentQueries.forEach((entry) => {
      items.push({
        id: `history-${entry.id}`,
        title:
          entry.query.length > 50
            ? entry.query.substring(0, 50) + "..."
            : entry.query,
        subtitle: `Executed ${new Date(entry.timestamp).toLocaleTimeString()} • ${entry.executionTime}ms`,
        category: "History",
        icon: entry.success ? "📋" : "⚠️",
        keywords: ["history", "recent", "query", entry.query.toLowerCase()],
        action: () => {
          setQuery(entry.query);
          setIsQueryMode(true);
          setTimeout(() => {
            if (sqlInputRef.current) {
              sqlInputRef.current.focus();
            }
          }, 50);
        },
      });
    });

    // Favorite Queries
    const favoriteQueries = queryHistory.getFavoriteQueries();
    favoriteQueries.forEach((entry) => {
      items.push({
        id: `favorite-${entry.id}`,
        title:
          entry.query.length > 50
            ? entry.query.substring(0, 50) + "..."
            : entry.query,
        subtitle: "Favorite query ★",
        category: "History",
        icon: "⭐",
        keywords: ["favorite", "starred", "query", entry.query.toLowerCase()],
        action: () => {
          setQuery(entry.query);
          setIsQueryMode(true);
          setTimeout(() => {
            if (sqlInputRef.current) {
              sqlInputRef.current.focus();
            }
          }, 50);
        },
      });
    });

    // Database Operations
    tables.forEach((table) => {
      items.push({
        id: `table-${table}`,
        title: `Open ${table}`,
        subtitle: "View table schema and data",
        category: "Database",
        icon: "📋",
        keywords: ["table", "schema", "data", "open", table],
        action: () => {
          onTableSelect?.(table);
          onClose();
        },
      });
    });

    // Add database operations
    items.push(
      {
        id: "new-query",
        title: "New SQL Query",
        subtitle: "Open query editor",
        category: "Database",
        icon: "💻",
        keywords: ["sql", "query", "editor", "new"],
        action: () => {
          onTabChange("query");
          onClose();
        },
      },
      {
        id: "database-stats",
        title: "Database Statistics",
        subtitle: "View performance metrics",
        category: "Database",
        icon: "📊",
        keywords: ["stats", "metrics", "performance", "statistics"],
        action: () => {
          onTabChange("stats");
          onClose();
        },
      },
      {
        id: "admin-panel",
        title: "Administration",
        subtitle: "Database management tools",
        category: "Database",
        icon: "⚙️",
        keywords: ["admin", "management", "tools", "administration"],
        action: () => {
          onTabChange("admin");
          onClose();
        },
      },
      {
        id: "view-all-tables",
        title: "View All Tables",
        subtitle: "Browse all database tables",
        category: "Database",
        icon: "📋",
        keywords: ["tables", "all", "browse", "list"],
        action: () => {
          onTabChange("tables");
          onClose();
        },
      },
    );

    // Settings Categories
    const settingsCategories = [
      {
        id: "console",
        title: "Console Settings",
        subtitle: "General console preferences",
        icon: "🖥️",
        keywords: ["console", "general", "preferences"],
      },
      {
        id: "tables",
        title: "Table Settings",
        subtitle: "Table display and navigation",
        icon: "📋",
        keywords: ["tables", "display", "navigation"],
      },
      {
        id: "query",
        title: "Query Settings",
        subtitle: "SQL editor and execution",
        icon: "💻",
        keywords: ["query", "sql", "editor"],
      },
      {
        id: "stats",
        title: "Statistics Settings",
        subtitle: "Performance metrics display",
        icon: "📊",
        keywords: ["stats", "performance", "metrics"],
      },
      {
        id: "admin",
        title: "Admin Settings",
        subtitle: "Database management preferences",
        icon: "⚙️",
        keywords: ["admin", "management"],
      },
    ];

    settingsCategories.forEach((setting) => {
      items.push({
        id: `settings-${setting.id}`,
        title: setting.title,
        subtitle: setting.subtitle,
        category: "Settings",
        icon: setting.icon,
        keywords: ["settings", ...setting.keywords],
        action: () => {
          onTabChange("settings");
          onSettingsNavigate?.(setting.id);
          onClose();
        },
      });
    });

    // Navigation Commands
    items.push(
      {
        id: "toggle-sidebar",
        title: "Toggle Sidebar Collapse",
        subtitle: "Expand or collapse navigation sidebar",
        category: "Navigation",
        icon: "↔️",
        keywords: ["sidebar", "collapse", "expand", "navigation"],
        action: () => {
          // This would need to be passed down from parent
          onClose();
        },
      },
      {
        id: "switch-quick-navigation",
        title: "Switch to Quick Navigation",
        subtitle: "Use horizontal table buttons",
        category: "Navigation",
        icon: "🔄",
        keywords: ["quick", "navigation", "horizontal", "buttons"],
        action: () => {
          updateSetting({
            path: "tables.navigation.mode",
            value: "quickSwitch",
          });
          onClose();
        },
      },
      {
        id: "switch-vertical-sidebar",
        title: "Switch to Vertical Sidebar",
        subtitle: "Use vertical table navigation",
        category: "Navigation",
        icon: "📑",
        keywords: ["vertical", "sidebar", "navigation"],
        action: () => {
          updateSetting({
            path: "tables.navigation.mode",
            value: "verticalSidebar",
          });
          onClose();
        },
      },
    );

    return items;
  }, [tables, onTabChange, onTableSelect, onClose, updateSetting, isQueryMode]);

  // Handle SQL query execution
  const handleQueryExecute = async (sqlQuery: string) => {
    if (!sqlQuery.trim()) return;

    setIsExecuting(true);
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);

      // Add to query history
      queryHistory.addQuery(sqlQuery, result);

      // Don't pass to parent or close palette - keep results in command palette
      // User can manually choose to "Open in Query Tab" if desired
    } catch (error) {
      console.error("Error executing query:", error);
      setQueryResult({
        rows: [],
        columns: [],
        rowsAffected: 0,
        executionTime: 0,
        error: (error as Error).message,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (value: string) => {
    setQuery(value);

    // Switch to SQL mode if query looks like SQL
    const shouldBeQueryMode = detectSqlQuery(value);
    if (shouldBeQueryMode !== isQueryMode) {
      setIsQueryMode(shouldBeQueryMode);
      setQueryResult(null); // Clear previous results

      // Focus the new input after mode switch
      if (shouldBeQueryMode) {
        // Small delay to let the SQL input render and focus it
        setTimeout(() => {
          if (sqlInputRef.current) {
            sqlInputRef.current.focus();
          }
        }, 50);
      } else {
        // Focus regular input when switching back to command mode
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(value.length, value.length);
          }
        }, 50);
      }
    }
  };

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    const searchTerm = query.toLowerCase();
    return commands.filter((command) => {
      const searchText = [
        command.title,
        command.subtitle || "",
        command.category,
        ...(command.keywords || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchText.includes(searchTerm);
    });
  }, [commands, query]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((command) => {
      if (!groups[command.category]) {
        groups[command.category] = [];
      }
      groups[command.category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with SQL input keyboard handling
      if (isQueryMode) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          if (isQueryMode) {
            setIsQueryMode(false);
            setQuery("");
            setQueryResult(null);
          } else {
            onClose();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose, isQueryMode]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setSelectedIndex(0);
      setIsQueryMode(false);
      setQueryResult(null);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[10vh]">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          {isQueryMode ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">🔍</span>
                <span className="text-sm font-medium text-green-400">
                  SQL Query Mode
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsQueryMode(false);
                    setQuery("");
                    setQueryResult(null);
                    // Focus the regular input after switching back
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 50);
                  }}
                  className="ml-auto text-xs text-gray-400 hover:text-white"
                >
                  Switch to Commands
                </button>
              </div>
              <SqlQueryInput
                ref={sqlInputRef}
                value={query}
                onChange={handleInputChange}
                onExecute={handleQueryExecute}
                placeholder="Enter SQL query (SELECT, INSERT, UPDATE, DELETE)..."
                className="w-full"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search commands... (or type SQL: SELECT, INSERT, UPDATE, DELETE)"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isQueryMode ? (
            /* SQL Query Results */
            <div className="p-4">
              {isExecuting && (
                <div className="text-center py-8 text-gray-400">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mb-2"></div>
                  <div>Executing query...</div>
                </div>
              )}

              {queryResult && !isExecuting && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">Query Results</h3>
                    <div className="text-xs text-gray-400">
                      {queryResult.error
                        ? "Error"
                        : `${queryResult.rows.length} rows`}{" "}
                      • {queryResult.executionTime}ms
                    </div>
                  </div>

                  {queryResult.error ? (
                    <div className="bg-red-900/30 border border-red-600 p-3 rounded text-red-300 text-sm">
                      <strong>Error:</strong> {queryResult.error}
                    </div>
                  ) : (
                    <div className="bg-gray-800 rounded overflow-auto max-h-64">
                      {queryResult.rows.length > 0 ? (
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-600">
                              {queryResult.columns.map((col) => (
                                <th
                                  key={col}
                                  className="p-2 text-left text-gray-300 font-medium"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResult.rows.slice(0, 10).map((row, idx) => {
                              const rowKey = `${idx}-${Object.values(row).slice(0, 2).join("-").slice(0, 15)}`;
                              return (
                                <tr
                                  key={rowKey}
                                  className="border-b border-gray-700 hover:bg-gray-700/30"
                                >
                                  {queryResult.columns.map((col) => (
                                    <td
                                      key={`${rowKey}-${col}`}
                                      className="p-2 text-gray-300"
                                    >
                                      {String(row[col] ?? "").length > 50
                                        ? String(row[col]).substring(0, 50) +
                                          "..."
                                        : String(row[col] ?? "")}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-gray-400 text-center">
                          Query executed successfully - no results returned
                        </div>
                      )}
                    </div>
                  )}

                  {queryResult.rows.length > 10 && (
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      Showing first 10 rows of {queryResult.rows.length}
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Transfer query and results to Query Tab
                        if (onQueryExecute) {
                          onQueryExecute(query, queryResult);
                        }
                        onClose();
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Open in Query Tab
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQueryResult(null);
                        setQuery("");
                      }}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Clear Results
                    </button>
                  </div>
                </div>
              )}

              {!queryResult && !isExecuting && query.trim() && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">💻</div>
                  <div className="text-lg font-medium mb-1">
                    Ready to execute
                  </div>
                  <div className="text-sm">
                    Press Ctrl+Enter to run your SQL query
                  </div>
                </div>
              )}
            </div>
          ) : /* Command Search Results */
          Object.keys(groupedCommands).length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-lg font-medium mb-1">No results found</div>
              <div className="text-sm">
                Try a different search term or start typing SQL (SELECT, INSERT,
                UPDATE, DELETE)
              </div>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 bg-gray-900/50 border-b border-gray-700">
                  {category}
                </div>
                {commands.map((command, commandIndex) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  return (
                    <button
                      key={command.id}
                      type="button"
                      onClick={command.action}
                      className={`w-full text-left px-4 py-3 border-b border-gray-700/50 transition-colors ${
                        globalIndex === selectedIndex
                          ? "bg-green-600/20 text-green-300"
                          : "hover:bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg flex-shrink-0">
                          {command.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {command.title}
                          </div>
                          {command.subtitle && (
                            <div className="text-xs opacity-75 mt-0.5">
                              {command.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            {isQueryMode ? (
              <div className="flex items-center gap-4">
                <span>Ctrl+Enter: Execute Query</span>
                <span>Enter: Format & New Line</span>
                <span>⎋: Back to Commands</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>⎋ Close</span>
              </div>
            )}
            <div>
              {isQueryMode
                ? queryResult
                  ? `${queryResult.rows.length} rows • ${queryResult.executionTime}ms`
                  : "SQL Mode"
                : `${filteredCommands.length} results`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
