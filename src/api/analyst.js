const apiUrl = "https://analyst-server-develop.alquist.ai";

export async function getAllTables() {
  // Get all analytical tables (.csv, .xlsx)
  try {
    const response = await fetch(`${apiUrl}/agent/list_all_tables`);

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }

    const allTables = await response.json();
    return allTables;
  } catch (error) {
    console.error("Failed to fetch all tables:", error);
    return null;
  }
}
