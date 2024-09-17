import { analystApiUrl as apiUrl, handleError } from "../apiEnv";
import { SettingsType } from "../../utility/types";

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
  
    } catch (e: unknown) {
      return handleError({error: e, origin: "getSingleAnalyticalConfig"})
    }
  }

export async function getAllAnalyticalIDs(): Promise<string[] | null> {
    // Get all the Id's for analytical files (.csv, .xlsx)
    try {
      const response = await fetch(`${apiUrl}/agent/list_all_tables`);
  
      if (!response.ok) {
        console.error(
          `HTTP error! Status: ${response.status} - ${response.statusText}`
        );
        return null;
      }
      const all_ids = await response.json();
      if (!all_ids) return null
      return all_ids.answer;
  
    } catch (e: unknown) {
      return handleError({error: e, origin: "getAllAnalyticalIDs"})
    }
  }

  export async function getAllAnalyticalConfigs(
    all_ids: string[]
  ): Promise<SettingsType[] | null> {
    try {
      // Create an array of promises for each analytical config request
      const requests = all_ids.map(id => getSingleAnalyticalConfig(id));
  
      // Wait for all promises to resolve. Batch request for overall faster response times
      const results = await Promise.all(requests);
  
      // Filter out null or undefined results and return them
      const configs = results.filter(config => config !== null && config !== undefined);
  
      return configs.length > 0 ? configs : null;
  
    } catch (e: unknown) {
      return handleError({ error: e, origin: "getAllAnalyticalConfigs" });
    }
  }