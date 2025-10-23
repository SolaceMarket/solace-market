import type { Asset } from "@/alpaca/assets/Asset";

export interface AssetsTableProps {
  assets: Asset[];
}

export function AssetsTable({ assets }: AssetsTableProps) {
  return (
    <div>
      <h2>Assets Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Class</th>
            <th>Exchange</th>
            <th>Symbol</th>
            <th>Name</th>
            <th>Status</th>
            <th>Tradable</th>
            <th>Marginable</th>
            <th>Maintenance Margin Requirement</th>
            <th>Margin Requirement Long</th>
            <th>Margin Requirement Short</th>
            <th>Shortable</th>
            <th>Easy to Borrow</th>
            <th>Fractionable</th>
            <th>Attributes</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.class}</td>
              <td>{asset.exchange}</td>
              <td>{asset.symbol}</td>
              <td>{asset.name}</td>
              <td>{asset.status}</td>
              <td>{asset.tradable}</td>
              <td>{asset.marginable}</td>
              <td>{asset.maintenance_margin_requirement}</td>
              <td>{asset.margin_requirement_long}</td>
              <td>{asset.margin_requirement_short}</td>
              <td>{asset.shortable}</td>
              <td>{asset.easy_to_borrow}</td>
              <td>{asset.fractionable}</td>
              <td>{JSON.stringify(asset.attributes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
