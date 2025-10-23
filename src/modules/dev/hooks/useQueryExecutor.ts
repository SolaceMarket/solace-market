"use client";

import { useState, useTransition, useCallback } from "react";
import { executeQuery } from "../database-actions";
import { queryHistory, type QueryHistoryEntry } from "../queryHistory";
import { COMMON_QUERIES, type CommonQueryKey } from "../common-queries";
import type { QueryResult } from "../database-actions";

export interface UseQueryExecutorReturn {
  sqlQuery: string;
  queryResult: QueryResult | null;
  isPending: boolean;
  history: QueryHistoryEntry[];
  setSqlQuery: (query: string) => void;
  setQueryResult: (result: QueryResult) => void;
  setQueryAndResult: (query: string, result: QueryResult) => void;
  executeSQL: () => void;
  loadCommonQuery: (queryName: string) => void;
  updateHistory: (newHistory: QueryHistoryEntry[]) => void;
}

export function useQueryExecutor(): UseQueryExecutorReturn {
  const [history, setHistory] = useState<QueryHistoryEntry[]>(() =>
    queryHistory.getHistory(),
  );

  // Initialize with the most recent successful query and its results, or session data
  const [sqlQuery, setSqlQuery] = useState(() => {
    // First try to get from sessionStorage (for unsaved queries)
    const sessionQuery = sessionStorage.getItem("db_console_current_query");
    if (sessionQuery) {
      return sessionQuery;
    }
    // Otherwise get the most recent successful query
    const recentSuccessful = queryHistory.getSuccessfulQueries(1)[0];
    return recentSuccessful?.query || "";
  });

  const [queryResult, setQueryResult] = useState<QueryResult | null>(() => {
    // Try to get from sessionStorage first
    const sessionResult = sessionStorage.getItem("db_console_current_result");
    if (sessionResult) {
      try {
        return JSON.parse(sessionResult);
      } catch {
        // If parsing fails, fall back to history
      }
    }
    // Otherwise get the most recent successful result
    const recentSuccessful = queryHistory.getSuccessfulQueries(1)[0];
    return recentSuccessful?.result || null;
  });

  const [isPending, startTransition] = useTransition();

  const executeSQL = useCallback(() => {
    if (!sqlQuery.trim()) return;

    startTransition(async () => {
      try {
        const result = await executeQuery(sqlQuery);
        setQueryResult(result);
        sessionStorage.setItem(
          "db_console_current_result",
          JSON.stringify(result),
        );

        // Add to query history
        queryHistory.addQuery(sqlQuery, result);
        setHistory(queryHistory.getHistory());
      } catch (error) {
        console.error("Error executing query:", error);
      }
    });
  }, [sqlQuery]);

  const loadCommonQuery = useCallback((queryName: string) => {
    setSqlQuery(COMMON_QUERIES[queryName as CommonQueryKey]);
  }, []);

  const setQueryAndResult = useCallback(
    (query: string, result: QueryResult) => {
      console.log("useQueryExecutor: setQueryAndResult called with:", {
        query,
        result,
      });
      setSqlQuery(query);
      setQueryResult(result);
      // Save both to sessionStorage
      sessionStorage.setItem("db_console_current_query", query);
      sessionStorage.setItem(
        "db_console_current_result",
        JSON.stringify(result),
      );
    },
    [],
  );

  const updateHistory = useCallback((newHistory: QueryHistoryEntry[]) => {
    setHistory(newHistory);
  }, []);

  // Enhanced setSqlQuery to also save to sessionStorage
  const setSqlQueryWithPersistence = useCallback((query: string) => {
    setSqlQuery(query);
    sessionStorage.setItem("db_console_current_query", query);
  }, []);

  // Enhanced setQueryResult to also save to sessionStorage
  const setQueryResultWithPersistence = useCallback((result: QueryResult) => {
    setQueryResult(result);
    sessionStorage.setItem("db_console_current_result", JSON.stringify(result));
  }, []);

  return {
    sqlQuery,
    queryResult,
    isPending,
    history,
    setSqlQuery: setSqlQueryWithPersistence,
    setQueryResult: setQueryResultWithPersistence,
    setQueryAndResult,
    executeSQL,
    loadCommonQuery,
    updateHistory,
  };
}
