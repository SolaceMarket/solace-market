import { createDatabaseTables } from "@/turso/database";

export async function GET(request: Request) {
  const result = await createDatabaseTables();

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
