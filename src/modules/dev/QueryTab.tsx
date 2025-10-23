"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useQueryExecutor } from "./hooks/useQueryExecutor";
import {
  CommonQueries,
  QueryHistory,
  QueryInput,
  QueryResults,
} from "./components";
import type { QueryResult } from "./database-actions";

interface QueryTabProps {
  onTabChange: (tab: string) => void;
}

export interface QueryTabRef {
  setSqlQuery: (query: string) => void;
  setQueryResult: (result: QueryResult) => void;
  setQueryAndResult: (query: string, result: QueryResult) => void;
}

export const QueryTab = forwardRef<QueryTabRef, QueryTabProps>(
  ({ onTabChange: _ }, ref) => {
    const {
      sqlQuery,
      queryResult,
      isPending,
      history,
      setSqlQuery,
      setQueryResult,
      setQueryAndResult,
      executeSQL,
      loadCommonQuery,
      updateHistory,
    } = useQueryExecutor();

    useImperativeHandle(ref, () => ({
      setSqlQuery,
      setQueryResult,
      setQueryAndResult,
    }));

    return (
      <div className="h-full overflow-auto">
        <div className="flex flex-col">
          {/* Common Queries */}
          <div className="p-4 pb-2">
            <CommonQueries onQuerySelect={loadCommonQuery} />
          </div>

          {/* Query History */}
          <div className="px-4 pb-2">
            <QueryHistory
              history={history}
              onQuerySelect={setSqlQuery}
              onHistoryUpdate={updateHistory}
            />
          </div>

          {/* Query Input */}
          <div className="px-4 pb-2">
            <QueryInput
              sqlQuery={sqlQuery}
              isPending={isPending}
              onQueryChange={setSqlQuery}
              onExecute={executeSQL}
            />
          </div>

          {/* Query Results */}
          <div className="px-4 pb-4">
            {queryResult && <QueryResults queryResult={queryResult} />}
          </div>
        </div>
      </div>
    );
  },
);

QueryTab.displayName = "QueryTab";
