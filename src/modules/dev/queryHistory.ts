import type { QueryResult } from "./database-actions";

export interface QueryHistoryEntry {
  id: string;
  query: string;
  result: QueryResult;
  timestamp: number;
  executionTime: number;
  success: boolean;
  favorite?: boolean;
}

export interface UserAction {
  type: "query_executed" | "table_opened" | "command_used" | "tab_changed";
  timestamp: number;
  data: {
    query?: string;
    table?: string;
    command?: string;
    context?: string;
    tab?: string;
  };
}

const HISTORY_STORAGE_KEY = "db_console_query_history";
const ACTIONS_STORAGE_KEY = "db_console_user_actions";
const MAX_HISTORY_ENTRIES = 100;
const MAX_ACTION_ENTRIES = 50;

export class QueryHistoryManager {
  private static instance: QueryHistoryManager;
  private history: QueryHistoryEntry[] = [];
  private userActions: UserAction[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): QueryHistoryManager {
    if (!QueryHistoryManager.instance) {
      QueryHistoryManager.instance = new QueryHistoryManager();
    }
    return QueryHistoryManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const historyData = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (historyData) {
        this.history = JSON.parse(historyData);
      }

      const actionsData = localStorage.getItem(ACTIONS_STORAGE_KEY);
      if (actionsData) {
        this.userActions = JSON.parse(actionsData);
      }
    } catch (error) {
      console.error("Error loading query history from storage:", error);
      this.history = [];
      this.userActions = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
      localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(this.userActions));
    } catch (error) {
      console.error("Error saving query history to storage:", error);
    }
  }

  addQuery(query: string, result: QueryResult): string {
    const id = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const entry: QueryHistoryEntry = {
      id,
      query: query.trim(),
      result,
      timestamp: Date.now(),
      executionTime: result.executionTime,
      success: !result.error,
    };

    // Remove duplicate queries (same query text)
    this.history = this.history.filter(h => h.query !== entry.query);
    
    // Add to beginning of array
    this.history.unshift(entry);
    
    // Limit history size
    if (this.history.length > MAX_HISTORY_ENTRIES) {
      this.history = this.history.slice(0, MAX_HISTORY_ENTRIES);
    }

    // Track user action
    this.addUserAction({
      type: "query_executed",
      timestamp: Date.now(),
      data: {
        query: query.trim(),
        context: result.error ? "error" : "success"
      }
    });

    this.saveToStorage();
    return id;
  }

  addUserAction(action: UserAction): void {
    this.userActions.unshift(action);
    
    // Limit actions size
    if (this.userActions.length > MAX_ACTION_ENTRIES) {
      this.userActions = this.userActions.slice(0, MAX_ACTION_ENTRIES);
    }
    
    this.saveToStorage();
  }

  getHistory(): QueryHistoryEntry[] {
    return [...this.history];
  }

  getRecentQueries(limit: number = 10): QueryHistoryEntry[] {
    return this.history.slice(0, limit);
  }

  getSuccessfulQueries(limit: number = 10): QueryHistoryEntry[] {
    return this.history.filter(entry => entry.success).slice(0, limit);
  }

  getFavoriteQueries(): QueryHistoryEntry[] {
    return this.history.filter(entry => entry.favorite);
  }

  toggleFavorite(id: string): void {
    const entry = this.history.find(h => h.id === id);
    if (entry) {
      entry.favorite = !entry.favorite;
      this.saveToStorage();
    }
  }

  removeQuery(id: string): void {
    this.history = this.history.filter(h => h.id !== id);
    this.saveToStorage();
  }

  clearHistory(): void {
    this.history = [];
    this.saveToStorage();
  }

  getRecentActions(limit: number = 3): UserAction[] {
    return this.userActions.slice(0, limit);
  }

  // Smart suggestions based on recent actions
  getSmartSuggestions(): string[] {
    const recentActions = this.getRecentActions(3);
    const suggestions: string[] = [];

    recentActions.forEach(action => {
      switch (action.type) {
        case "query_executed":
          if (action.data.query) {
            // Suggest similar or related queries
            const queryType = this.detectQueryType(action.data.query);
            suggestions.push(...this.getSuggestionsForQueryType(queryType));
          }
          break;
        case "table_opened":
          if (action.data.table) {
            suggestions.push(`SELECT * FROM ${action.data.table} LIMIT 10`);
            suggestions.push(`DESCRIBE ${action.data.table}`);
            suggestions.push(`SELECT COUNT(*) FROM ${action.data.table}`);
          }
          break;
        case "command_used":
          // Could suggest related commands
          break;
      }
    });

    // Remove duplicates and return top suggestions
    return [...new Set(suggestions)].slice(0, 5);
  }

  private detectQueryType(query: string): string {
    const upperQuery = query.toUpperCase().trim();
    if (upperQuery.startsWith("SELECT")) return "SELECT";
    if (upperQuery.startsWith("INSERT")) return "INSERT";
    if (upperQuery.startsWith("UPDATE")) return "UPDATE";
    if (upperQuery.startsWith("DELETE")) return "DELETE";
    if (upperQuery.startsWith("CREATE")) return "CREATE";
    if (upperQuery.startsWith("DROP")) return "DROP";
    if (upperQuery.startsWith("ALTER")) return "ALTER";
    return "OTHER";
  }

  private getSuggestionsForQueryType(queryType: string): string[] {
    switch (queryType) {
      case "SELECT":
        return [
          "SELECT COUNT(*) FROM table_name",
          "SELECT DISTINCT column FROM table_name",
          "SELECT * FROM table_name ORDER BY column DESC",
          "SELECT * FROM table_name WHERE condition"
        ];
      case "INSERT":
        return [
          "SELECT * FROM table_name ORDER BY id DESC LIMIT 5",
          "SELECT COUNT(*) FROM table_name"
        ];
      case "UPDATE":
        return [
          "SELECT * FROM table_name WHERE condition",
          "SELECT COUNT(*) FROM table_name WHERE condition"
        ];
      case "DELETE":
        return [
          "SELECT COUNT(*) FROM table_name",
          "SELECT * FROM table_name LIMIT 10"
        ];
      default:
        return [
          "SELECT name FROM sqlite_schema WHERE type='table'",
          "PRAGMA table_info(table_name)"
        ];
    }
  }

  // Search queries in history
  searchHistory(searchTerm: string): QueryHistoryEntry[] {
    const term = searchTerm.toLowerCase();
    return this.history.filter(entry => 
      entry.query.toLowerCase().includes(term)
    );
  }
}

// Export singleton instance
export const queryHistory = QueryHistoryManager.getInstance();