const apiUrl = "https://universal-cqa-develop.alquist.ai";

export async function showAllManuals() {
  // Get all available pdf manuals
  try {
    const response = await fetch(`${apiUrl}/show_available_manuals`);

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const manuals = await response.json();
    return manuals;
  } catch (error) {
    console.error("Failed to fetch manuals:", error);
    return null;
  }
}
