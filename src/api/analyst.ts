const environment = import.meta.env.VITE_ENVIRONMENT;
const apiUrl = import.meta.env[`VITE_ANALYTICAL_URL_${environment}`];

export async function getAllAnalyticalTables(): Promise<any | null> {
  // Get all the Id's for analytical files (.csv, .xlsx)
  try {
    console.log("URL",apiUrl)
    const response = await fetch(`${apiUrl}/agent/list_all_tables`);

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    console.log("HHHH", response)
    const all_ids = await response.json();
    return all_ids;
  } catch (error) {
    console.error("Failed to fetch all tables:", error);
    return null;
  }
}

export async function getAllAnalyticalConfigs(
  all_ids: any
): Promise<any[] | null> {
  // Get all the configs for the analytical files
  let configs: any[] = [];
  for (const id of all_ids.answer) {
    try {
      const response = await fetch(`${apiUrl}/agent/download_config/${id}`);
      if (!response.ok) {
        console.error(
          `HTTP error! Status: ${response.status} - ${response.statusText}`
        );
      }
      const config = await response.json();
      configs.push(config);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  return configs;
}

export async function getSingleAnalyticalConfig(
  id: string
): Promise<any | null> {
  try {
    const response = await fetch(`${apiUrl}/agent/download_config/${id}`);
    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    const config = await response.json();
    return config;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function deleteAnalyticalProject(id: string): Promise<boolean> {
  // Deletes analytical app by id
  try {
    const response = await fetch(`${apiUrl}/agent/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting the analytical app:", error);
    return false;
  }
}

export async function updateAnalyticalProject(
  id: string,
  queryParams: string
): Promise<any | null> {
  // Updates analytical app by uploading new config
  const encodedId = encodeURIComponent(id);
  try {
    const response = await fetch(
      `${apiUrl}/agent/upload_config/${encodedId}?${queryParams}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No need to specify body for query parameters
      }
    );
    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating the analytical config:", error);
    return null;
  }
}

export async function uploadAnalyticalProject(
  formData: FormData
): Promise<any | null> {
  try {
    const response = await fetch(`${apiUrl}/agent/upload_table`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading the analytical app:", error);
    return null;
  }
}
