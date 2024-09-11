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
      return handleError(e)
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
      return handleError(e)
    }
  }

export async function getAllAnalyticalConfigs(
    all_ids: string[]
  ): Promise<SettingsType[] | null> {

    try{
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
      
    }catch(e: unknown){
      return handleError(e);
    }
  }