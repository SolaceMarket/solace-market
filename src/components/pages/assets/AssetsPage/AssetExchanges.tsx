export interface AssetExchangesProps {
  exchanges: string[];
}

export async function AssetExchanges({ exchanges }: AssetExchangesProps) {
  return (
    <div>
      <h2>Asset Exchanges</h2>
      <table>
        <thead>
          <tr>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          {exchanges.map((exchange) => (
            <tr key={`${exchange}`}>
              <td>{`${exchange}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
