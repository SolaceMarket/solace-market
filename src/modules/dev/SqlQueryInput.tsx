"use client";

import { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { format } from "sql-formatter";
import { getAllTables, getTableInfo } from "./database-actions";
import type { ColumnInfo } from "./database-actions";

interface SqlQueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface SqlQueryInputRef {
  focus: () => void;
}

interface SqlSuggestion {
  text: string;
  type: "keyword" | "table" | "column" | "function";
  description?: string;
  insertText?: string;
}

// SQL Keywords
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "ORDER", "BY", "GROUP", "HAVING", "INSERT", 
  "INTO", "VALUES", "UPDATE", "SET", "DELETE", "JOIN", "INNER", "LEFT", 
  "RIGHT", "FULL", "OUTER", "ON", "AS", "AND", "OR", "NOT", "NULL", 
  "IS", "IN", "BETWEEN", "LIKE", "LIMIT", "OFFSET", "DISTINCT", "COUNT",
  "SUM", "AVG", "MAX", "MIN", "ASC", "DESC", "CASE", "WHEN", "THEN", "ELSE", "END"
];

// SQL Functions
const SQL_FUNCTIONS = [
  "COUNT(*)", "COUNT(DISTINCT ", "SUM(", "AVG(", "MAX(", "MIN(",
  "LENGTH(", "UPPER(", "LOWER(", "SUBSTR(", "REPLACE(", "TRIM(",
  "DATE(", "DATETIME(", "STRFTIME(", "CAST(", "COALESCE("
];

export const SqlQueryInput = forwardRef<SqlQueryInputRef, SqlQueryInputProps>(({ 
  value, 
  onChange, 
  onExecute, 
  placeholder = "Enter SQL query...",
  className = ""
}, ref) => {
  const [tables, setTables] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<Record<string, ColumnInfo[]>>({});
  const [suggestions, setSuggestions] = useState<SqlSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Set cursor to end of text
        inputRef.current.setSelectionRange(value.length, value.length);
      }
    }
  }));

  // Load tables and their columns on mount
  useEffect(() => {
    const loadDatabaseSchema = async () => {
      try {
        const tableNames = await getAllTables();
        setTables(tableNames);
        
        // Load column information for each table
        const columnsData: Record<string, ColumnInfo[]> = {};
        for (const tableName of tableNames) {
          const tableInfo = await getTableInfo(tableName);
          if (tableInfo) {
            columnsData[tableName] = tableInfo.columns;
          }
        }
        setTableColumns(columnsData);
      } catch (error) {
        console.error("Error loading database schema:", error);
      }
    };

    loadDatabaseSchema();
  }, []);

  // Check SQL syntax and provide suggestions
  const analyzeQuery = useMemo(() => {
    const query = value.toUpperCase();
    const currentWord = getCurrentWord(value, cursorPosition);
    const context = getQueryContext(value, cursorPosition);
    
    // Basic syntax validation
    const errors: string[] = [];
    
    // Check for basic SQL structure
    if (query.startsWith("SELECT") && !query.includes("FROM") && query.length > 10) {
      errors.push("SELECT statement missing FROM clause");
    }
    
    if (query.includes("INSERT INTO") && !query.includes("VALUES") && !query.includes("SELECT")) {
      errors.push("INSERT statement missing VALUES or SELECT clause");
    }

    // Check for unmatched parentheses
    const openParens = (query.match(/\(/g) || []).length;
    const closeParens = (query.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push("Unmatched parentheses");
    }

    setSyntaxErrors(errors);

    // Generate suggestions based on context
    const newSuggestions: SqlSuggestion[] = [];

    if (currentWord.length >= 3) {
      // Keyword suggestions (require at least 3 characters to be less aggressive)
      SQL_KEYWORDS.forEach(keyword => {
        const currentLower = currentWord.toLowerCase();
        const keywordLower = keyword.toLowerCase();
        
        // Only suggest if it's a partial match, not an exact match
        if (keywordLower.startsWith(currentLower) && keywordLower !== currentLower) {
          newSuggestions.push({
            text: keyword,
            type: "keyword",
            insertText: keyword
          });
        }
      });

      // Function suggestions (require at least 3 characters)
      SQL_FUNCTIONS.forEach(func => {
        const currentLower = currentWord.toLowerCase();
        const funcLower = func.toLowerCase();
        
        // Only suggest if it's a partial match, not an exact match
        if (funcLower.startsWith(currentLower) && funcLower !== currentLower) {
          newSuggestions.push({
            text: func,
            type: "function",
            insertText: func
          });
        }
      });

      // Table suggestions (only in clear table context OR with 3+ characters)
      if (context.expectingTable || currentWord.length >= 3) {
        tables.forEach(table => {
          if (table.toLowerCase().includes(currentWord.toLowerCase())) {
            newSuggestions.push({
              text: table,
              type: "table",
              description: `Table with ${tableColumns[table]?.length || 0} columns`,
              insertText: table
            });
          }
        });
      }

      // Column suggestions (only in clear column context OR with 3+ characters)
      if ((context.expectingColumn && currentWord.length >= 2) || currentWord.length >= 3) {
        const relevantTables = context.currentTable ? [context.currentTable] : tables;
        
        relevantTables.forEach(table => {
          const columns = tableColumns[table] || [];
          columns.forEach(column => {
            if (column.name.toLowerCase().includes(currentWord.toLowerCase())) {
              newSuggestions.push({
                text: column.name,
                type: "column",
                description: `${column.type}${column.pk ? " (PRIMARY KEY)" : ""}${column.notnull ? " NOT NULL" : ""}`,
                insertText: column.name
              });
            }
          });
        });
      }
    }

    return { suggestions: newSuggestions, errors };
  }, [value, cursorPosition, tables, tableColumns]);

  useEffect(() => {
    setSuggestions(analyzeQuery.suggestions);
    setSelectedSuggestion(0);
    
    // Only show suggestions if current word is at least 3 characters long and cursor is at end of word
    const currentWord = getCurrentWord(value, cursorPosition);
    const isAtEndOfWord = cursorPosition === value.length || !/[a-zA-Z_0-9]/.test(value[cursorPosition]);
    const isCompleteKeyword = SQL_KEYWORDS.includes(currentWord.toUpperCase());
    
    const shouldShow = analyzeQuery.suggestions.length > 0 && 
                      currentWord.length >= 3 && 
                      isAtEndOfWord &&
                      !isCompleteKeyword; // Don't show suggestions for complete keywords
    
    setShowSuggestions(shouldShow);
  }, [analyzeQuery.suggestions, value, cursorPosition]);

  // Get the current word at cursor position
  function getCurrentWord(text: string, position: number): string {
    // Find start of current word
    let start = position;
    while (start > 0 && /[a-zA-Z_0-9]/.test(text[start - 1])) {
      start--;
    }
    
    // Find end of current word
    let end = position;
    while (end < text.length && /[a-zA-Z_0-9]/.test(text[end])) {
      end++;
    }
    
    return text.slice(start, end);
  }

  // Analyze query context to provide better suggestions
  function getQueryContext(text: string, position: number) {
    const beforeCursor = text.slice(0, position).toUpperCase();
    const words = beforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    // Check if we're expecting a table name
    const expectingTable = /\b(FROM|JOIN|UPDATE|INSERT\s+INTO)\s*$/i.test(beforeCursor);
    
    // Check if we're expecting a column name
    const expectingColumn = /\b(SELECT|WHERE|ORDER\s+BY|GROUP\s+BY)\s*$/i.test(beforeCursor) ||
                           /\b(SELECT\s+.+,)\s*$/i.test(beforeCursor);
    
    // Try to determine current table context
    let currentTable: string | null = null;
    const fromMatch = beforeCursor.match(/\bFROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
    if (fromMatch) {
      currentTable = fromMatch[1].toLowerCase();
    }

    return {
      expectingTable,
      expectingColumn,
      currentTable,
      lastWord
    };
  }

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(cursorPos);

    // Auto-formatting is now handled only on Enter key press
    // No automatic formatting on whitespace or semicolon
  };

  // Handle cursor position changes
  const handleCursorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.target.selectionStart);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Tab":
        case "Enter":
          if (e.key === "Enter" && e.shiftKey) {
            // Shift+Enter for newline
            break;
          }
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            // Ctrl+Enter to execute
            e.preventDefault();
            onExecute(value);
            return;
          }
          if (suggestions[selectedSuggestion]) {
            e.preventDefault();
            insertSuggestion(suggestions[selectedSuggestion]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          break;
      }
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      // Ctrl+Enter to execute
      e.preventDefault();
      onExecute(value);
    } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // Regular Enter - format the SQL before adding newline
      e.preventDefault();
      
      // Format the current query
      try {
        const formatted = format(value, {
          language: "sqlite",
          tabWidth: 2,
          keywordCase: "upper"
        });
        
        // Add newline to the formatted SQL
        const newValue = formatted + '\n';
        onChange(newValue);
        
        // Set cursor to end after formatting
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newValue.length, newValue.length);
          }
        }, 0);
      } catch (error) {
        // If formatting fails, just add the newline
        const newValue = value + '\n';
        onChange(newValue);
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newValue.length, newValue.length);
          }
        }, 0);
      }
    } else if (e.key === "Tab" && e.ctrlKey) {
      // Ctrl+Tab to format SQL without adding newline
      e.preventDefault();
      try {
        const formatted = format(value, {
          language: "sqlite",
          tabWidth: 2,
          keywordCase: "upper"
        });
        onChange(formatted);
      } catch (error) {
        console.error("Error formatting SQL:", error);
      }
    }
  };

  // Insert selected suggestion
  const insertSuggestion = (suggestion: SqlSuggestion) => {
    if (!inputRef.current) return;

    // Find the current word boundaries more reliably
    const text = value;
    const cursor = cursorPosition;
    
    // Find start of current word (go backwards until we hit non-word character)
    let wordStart = cursor;
    while (wordStart > 0 && /[a-zA-Z_0-9]/.test(text[wordStart - 1])) {
      wordStart--;
    }
    
    // Find end of current word (go forwards until we hit non-word character)
    let wordEnd = cursor;
    while (wordEnd < text.length && /[a-zA-Z_0-9]/.test(text[wordEnd])) {
      wordEnd++;
    }
    
    // Replace the current word with the suggestion
    const before = text.slice(0, wordStart);
    const after = text.slice(wordEnd);
    const newValue = before + suggestion.insertText + after;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      if (inputRef.current) {
        const newPosition = wordStart + suggestion.insertText!.length;
        inputRef.current.setSelectionRange(newPosition, newPosition);
        inputRef.current.focus();
      }
    }, 0);
  };

  // Note: Removed problematic syntax highlighting overlay to prevent focus issues
  // and mysterious number displays. Future enhancement could use a proper code editor.

  return (
    <div className={`relative sql-query-input ${className}`}>
      {/* Main input area */}
      <div className="relative">
        {/* SQL input - clean and simple */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onSelect={handleCursorChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            // Don't automatically show suggestions on focus
            // Let user type to trigger them
          }}
          onBlur={(e) => {
            // Don't hide suggestions if user is interacting with them
            const relatedTarget = e.relatedTarget as Node;
            if (!suggestionsRef.current?.contains(relatedTarget)) {
              setTimeout(() => setShowSuggestions(false), 200);
            }
          }}
          placeholder={placeholder}
          className="bg-gray-700 border border-gray-600 rounded p-3 font-mono text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 w-full transition-colors"
          style={{
            minHeight: "80px",
            lineHeight: "1.5"
          }}
        />
      </div>

      {/* Syntax errors */}
      {syntaxErrors.length > 0 && (
        <div className="mt-2 p-2 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">
          {syntaxErrors.map((error, index) => (
            <div key={index}>⚠️ {error}</div>
          ))}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto w-full"
        >
          {suggestions.slice(0, 10).map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}`}
              type="button"
              onMouseDown={(e) => {
                // Prevent stealing focus from input
                e.preventDefault();
                insertSuggestion(suggestion);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                index === selectedSuggestion 
                  ? "bg-green-600/30 text-green-300" 
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  suggestion.type === "keyword" ? "bg-blue-600" :
                  suggestion.type === "table" ? "bg-purple-600" :
                  suggestion.type === "column" ? "bg-orange-600" :
                  "bg-gray-600"
                }`}>
                  {suggestion.type.toUpperCase()}
                </span>
                <span className="font-mono">{suggestion.text}</span>
                {suggestion.description && (
                  <span className="text-xs text-gray-400 ml-auto">
                    {suggestion.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Help text */}
      <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
        <div>
          <span>Ctrl+Enter: Execute</span>
          <span className="mx-2">•</span>
          <span>Enter: Format & New Line</span>
          <span className="mx-2">•</span>
          <span>Ctrl+Tab: Format Only</span>
          <span className="mx-2">•</span>
          <span>Tab/Enter: Accept suggestion</span>
        </div>
        {showSuggestions && (
          <div>
            {suggestions.length} suggestions
          </div>
        )}
      </div>
    </div>
  );
});

SqlQueryInput.displayName = "SqlQueryInput";