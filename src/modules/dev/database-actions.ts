"use server";

import { client } from "@/turso/database";
import { createDatabaseTables } from "@/turso/database";

export interface QueryResult {
  rows: Record<string, unknown>[];
  columns: string[];
  rowsAffected: number;
  executionTime: number;
  error?: string;
}

export interface TableInfo {
  name: string;
  sql: string;
  columns: ColumnInfo[];
  rowCount: number;
}

export interface ColumnInfo {
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: unknown;
  pk: boolean;
}

export interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  tables: Array<{
    name: string;
    rowCount: number;
    columnCount: number;
  }>;
}

// Utility function to serialize database values for client components
function serializeValue(value: unknown): unknown {
  if (typeof value === "bigint") {
    return Number(value);
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (value === null || value === undefined) {
    return value;
  } else if (typeof value === "object") {
    // Convert any remaining objects to plain objects
    return JSON.parse(JSON.stringify(value));
  } else {
    return value;
  }
}

// Utility function to serialize a database row
function serializeRow(row: Record<string, unknown>): Record<string, unknown> {
  const serializedRow: Record<string, unknown> = {};
  Object.entries(row).forEach(([key, value]) => {
    serializedRow[key] = serializeValue(value);
  });
  return serializedRow;
}

// Execute a raw SQL query
export async function executeQuery(sql: string): Promise<QueryResult> {
  const startTime = Date.now();

  try {
    const result = await client.execute(sql);
    const executionTime = Date.now() - startTime;

    // Extract column names if available
    const columns = result.columns || [];

    // Serialize rows to ensure compatibility with client components
    const serializedRows = result.rows.map(serializeRow);

    return {
      rows: serializedRows,
      columns,
      rowsAffected: result.rowsAffected,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    return {
      rows: [],
      columns: [],
      rowsAffected: 0,
      executionTime,
      error: (error as Error).message,
    };
  }
}

// Get all table names
export async function getAllTables(): Promise<string[]> {
  try {
    const result = await client.execute(`
      SELECT name 
      FROM sqlite_schema 
      WHERE type = 'table' 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    return result.rows.map((row) => row.name as string);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return [];
  }
}

// Get detailed table information
export async function getTableInfo(
  tableName: string,
): Promise<TableInfo | null> {
  try {
    // Get table schema
    const schemaResult = await client.execute(
      `
      SELECT sql 
      FROM sqlite_schema 
      WHERE type = 'table' AND name = ?
    `,
      [tableName],
    );

    if (schemaResult.rows.length === 0) {
      return null;
    }

    // Get column information
    const columnsResult = await client.execute(
      `PRAGMA table_info(${tableName})`,
    );

    // Get row count
    const countResult = await client.execute(
      `SELECT COUNT(*) as count FROM ${tableName}`,
    );
    const rowCount = Number(countResult.rows[0].count);

    const columns: ColumnInfo[] = columnsResult.rows.map(
      (row: Record<string, unknown>) => ({
        name: row.name as string,
        type: row.type as string,
        notnull: Boolean(row.notnull),
        dflt_value: serializeValue(row.dflt_value),
        pk: Boolean(row.pk),
      }),
    );

    return {
      name: tableName,
      sql: schemaResult.rows[0].sql as string,
      columns,
      rowCount,
    };
  } catch (error) {
    console.error(`Error fetching info for table ${tableName}:`, error);
    return null;
  }
}

// Get sample data from a table
export async function getTableSample(
  tableName: string,
  limit = 10,
): Promise<Record<string, unknown>[]> {
  try {
    const result = await client.execute(`SELECT * FROM ${tableName} LIMIT ?`, [
      limit,
    ]);

    // Serialize the sample data to ensure compatibility
    return result.rows.map(serializeRow);
  } catch (error) {
    console.error(`Error fetching sample data for ${tableName}:`, error);
    return [];
  }
}

// Get database statistics
export async function getDatabaseStats(): Promise<DatabaseStats | null> {
  try {
    const tables = await getAllTables();
    const stats = await Promise.all(
      tables.map(async (tableName) => {
        const info = await getTableInfo(tableName);
        return {
          name: tableName,
          rowCount: info?.rowCount || 0,
          columnCount: info?.columns.length || 0,
        };
      }),
    );

    const totalRows = stats.reduce((sum, table) => sum + table.rowCount, 0);
    const totalTables = tables.length;

    return {
      totalTables,
      totalRows,
      tables: stats,
    };
  } catch (error) {
    console.error("Error fetching database stats:", error);
    return null;
  }
}

// Initialize/recreate all tables
export async function initializeTables(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await createDatabaseTables();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
