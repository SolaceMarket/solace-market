import { getAllTables, getDatabaseStats } from "./database-actions";
import { DatabaseConsoleClient } from "./DatabaseConsoleClient";
import { SettingsProvider } from "./settings";
import { revalidatePath } from "next/cache";

/**
 * Server component that fetches initial database data and provides the console interface
 */
export async function DatabaseConsole() {
  // Fetch initial data on the server
  const [initialTables, initialStats] = await Promise.all([
    getAllTables(),
    getDatabaseStats(),
  ]);

  // Server action to refresh data
  async function refreshData() {
    "use server";

    // Revalidate the current path to refetch data
    revalidatePath("/");
  }

  return (
    <SettingsProvider>
      <DatabaseConsoleClient
        initialTables={initialTables}
        initialStats={initialStats}
        onRefreshData={refreshData}
      />
    </SettingsProvider>
  );
}
