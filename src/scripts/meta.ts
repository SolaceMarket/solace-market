import { returnAllTables } from "@/turso/meta/schema";

export const meta = async () => {
  const tables = await returnAllTables();
  console.log("All tables:", tables);
};

await meta();
