import { client } from "@/turso//database";

export const returnAllTables = async () => {
  try {
    // Create table if not exists
    const result = await client.execute(`
    SELECT
        name
    FROM
        sqlite_schema
    WHERE
        type ='table' AND 
        name NOT LIKE 'sqlite_%';
    `);
    console.log("Returned all tables", result);
    return result.rows.map((row) => row.name);
  } catch (error) {
    console.error("Error returning all tables", error);
    return { error: (error as Error).message };
  }
};
