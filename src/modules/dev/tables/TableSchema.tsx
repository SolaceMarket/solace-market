interface TableSchemaProps {
  sql: string;
}

export function TableSchema({ sql }: TableSchemaProps) {
  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">Schema</h4>
      <div className="bg-gray-800 p-3 rounded overflow-x-auto">
        <pre className="text-xs">{sql}</pre>
      </div>
    </div>
  );
}
