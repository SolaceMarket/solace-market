import type { ColumnInfo } from "../database-actions";

interface TableColumnsProps {
  columns: ColumnInfo[];
}

export function TableColumns({ columns }: TableColumnsProps) {
  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Columns ({columns.length})</h4>
      <div className="bg-gray-800 rounded overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Not Null</th>
              <th className="p-2 text-left">Primary Key</th>
              <th className="p-2 text-left">Default</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col) => (
              <tr key={col.name} className="border-b border-gray-700">
                <td className="p-2 font-semibold">{col.name}</td>
                <td className="p-2">{col.type}</td>
                <td className="p-2">{col.notnull ? "YES" : "NO"}</td>
                <td className="p-2">{col.pk ? "YES" : "NO"}</td>
                <td className="p-2">{String(col.dflt_value ?? "") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
