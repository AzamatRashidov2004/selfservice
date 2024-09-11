import { analystApiUrl as apiUrl, handleError } from "../apiEnv";
import { SettingsType } from "../../utility/types";

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
    } catch (e:unknown) {
      return handleError(e);
    }
  }
  
  export async function uploadAnalyticalProject(
    file: File,
    notationFile: File
  ): Promise<{projectID: null, docID: string} | null> {
    try {
  
      const formData = new FormData();
      formData.append("table_file", file);
      formData.append("annotations_file", notationFile);
  
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
      const result: {id: string} = await response.json();
      return {docID: result.id, projectID: null};
    } catch (e:unknown) {
      return handleError(e);
    }
  }