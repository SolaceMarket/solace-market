// based on

// CREATE TABLE IF NOT EXISTS assets (
//         id TEXT PRIMARY KEY,
//         class TEXT,
//         exchange TEXT,
//         symbol TEXT,
//         name TEXT,
//         status TEXT,
//         tradable BOOLEAN,
//         marginable BOOLEAN,
//         maintenance_margin_requirement REAL,
//         margin_requirement_long TEXT,
//         margin_requirement_short TEXT,
//         shortable BOOLEAN,
//         easy_to_borrow BOOLEAN,
//         fractionable BOOLEAN,
//         attributes TEXT
//         );

export interface AssetFiltersProps {
  classes: string[];
  exchanges: string[];
}
export function AssetFilters({ exchanges, classes }: AssetFiltersProps) {
  return (
    <div>
      <h2>Asset Filters</h2>

      <AssetFiltersDropdown name="class" items={classes} />
      <AssetFiltersDropdown name="exchange" items={exchanges} />
    </div>
  );
}

export function AssetFiltersDropdown({
  name,
  items,
}: {
  name: string;
  items: string[];
}) {
  return (
    <div>
      <label htmlFor={name}>
        {name.charAt(0).toUpperCase() + name.slice(1)}:
      </label>
      <select id={name} name={name}>
        <option value="">All</option>
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
