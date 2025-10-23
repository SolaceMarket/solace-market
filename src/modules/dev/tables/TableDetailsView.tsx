import type { TableInfo } from "../database-actions";
import { TableSchema } from "./TableSchema";
import { TableColumns } from "./TableColumns";
import { TableSampleData } from "./TableSampleData";

interface TableDetailsViewProps {
  selectedTable: string | null;
  tableInfo: TableInfo | null;
  sampleData: Record<string, unknown>[];
}

export function TableDetailsView({
  selectedTable,
  tableInfo,
  sampleData,
}: TableDetailsViewProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {selectedTable && tableInfo ? (
        <div>
          <h3 className="font-bold text-lg mb-4">{selectedTable}</h3>

          <TableSchema sql={tableInfo.sql} />
          <TableColumns columns={tableInfo.columns} />
          <TableSampleData
            sampleData={sampleData}
            rowCount={tableInfo.rowCount}
            tableName={selectedTable}
          />
        </div>
      ) : (
        <div className="text-gray-400">Select a table to view details</div>
      )}
    </div>
  );
}
