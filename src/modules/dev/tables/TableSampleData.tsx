interface TableSampleDataProps {
  sampleData: Record<string, unknown>[];
  rowCount: number;
  tableName: string;
}

export function TableSampleData({
  sampleData,
  rowCount,
  tableName,
}: TableSampleDataProps) {
  return (
    <div>
      <h4 className="font-semibold mb-2">
        Sample Data ({rowCount} total rows)
      </h4>
      {sampleData.length > 0 ? (
        <div className="bg-gray-800 rounded overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-600">
                {Object.keys(sampleData[0]).map((key) => (
                  <th key={key} className="p-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => {
                // Create a more unique key using table name, index, and first column value
                const firstValue = Object.values(row)[0];
                const uniqueKey = `${tableName}-${idx}-${String(firstValue).slice(0, 20)}`;

                return (
                  <tr key={uniqueKey} className="border-b border-gray-700">
                    {Object.values(row).map((value, colIdx) => (
                      <td
                        key={`col-${colIdx}-${String(value).slice(0, 10)}`}
                        className="p-2"
                      >
                        {String(value).length > 50
                          ? String(value).substring(0, 50) + "..."
                          : String(value)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded">No data</div>
      )}
    </div>
  );
}
