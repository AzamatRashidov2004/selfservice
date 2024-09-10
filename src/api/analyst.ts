import { SettingsType } from "../utility/types.ts";

const environment = import.meta.env.VITE_ENVIRONMENT 
console.log(environment)
const apiUrl: string = `${import.meta.env[`VITE_ANALYTICAL_URL_${environment}`]}`;

export async function getAllAnalyticalIDs(): Promise<string[] | null> {
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
    if (!all_ids) return null
    return all_ids.answer;

  } catch (error) {
    console.error("Failed to fetch all ids:", error);
    return null;
  }
}

export async function getAllAnalyticalConfigs(
  all_ids: string[]
): Promise<SettingsType[] | null> {
  // Get all the configs for the analytical files
  const configs: SettingsType[] = [];
  
  for (const id of all_ids) {
    const projectConfig = await getSingleAnalyticalConfig(id);
    if (projectConfig){
      configs.push(projectConfig);
    }
  }
  if (configs.length === 0) return null;
  return configs;
}

export async function getSingleAnalyticalConfig(
  id: string
): Promise<SettingsType | null> {
  try {
    const response = await fetch(`${apiUrl}/agent/download_config/${id}`);
    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }
    const config = await response.json();
    if (!config.answer || !config.answer.attributes){
      return null
    }
    return config.answer;

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
  settings: SettingsType // Assuming you're sending SettingsType as query params
): Promise<boolean | null> {
  const encodedId = encodeURIComponent(id);

  // Convert settings object to query parameters
  const queryParams = new URLSearchParams({
    config_data: JSON.stringify(settings), // Embed the settings object into a config_data query param
  }).toString();

  try {
    const response = await fetch(
      `${apiUrl}/agent/upload_config/${encodedId}?${queryParams}`, // Append query params to the URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }

    const result = await response.json();
    return !!result; // Return true if there's a result
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
