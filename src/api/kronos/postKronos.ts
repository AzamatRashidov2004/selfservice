import { kronosApiUrl as apiUrl, kronosApiKey as apiKey, handleError } from "../apiEnv";
import { SettingsType, KronosProjectType } from "../../utility/types";

export async function createKronosProject(projectName="", description="", chatbot_config: SettingsType): Promise<KronosProjectType | null>{

  try{
    // Create new kronos project
    const projectResponse: Response = await fetch(`${apiUrl}/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({name: projectName, description, chatbot_config})
    });
  
    if (!projectResponse.ok){
      console.error("Failed to create Kronos project " + projectResponse.statusText)
      return null
    }
  
    const project: KronosProjectType = await projectResponse.json();
  
    if (!project){
      console.error("Failed to create Kronos project")
      return null
    }
  
    return project
      
  }catch(e: unknown){
    return handleError({error: e, origin: "createKronosProject"})
  }
}

export async function uploadPdfToKronosProject(projectID: string, file: File): Promise<string | null> {

  try{
    const formData = new FormData();
    
    formData.append('file', file); // Turn the file into binary string
  
    const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/pdf`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey
      },
      body: formData // Add the file
    });
  
    if (!projectResponse.ok) {
      console.error('Error uploading PDF:', projectResponse.statusText);
      return null;
    }
  
    const result = await projectResponse.json();
    
    return result._id;
      
  }catch(e: unknown){
    return handleError({error: e, origin: "uploadPdfToKronosProject"})
  }
}

export async function updatePdfConfig(
    name: string, 
    description: string,
    projectID: string,
    settings: SettingsType,
  ): Promise<boolean | null>{

    try{
      const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify({
          name, 
          description,
          chatbot_config: settings
        })
      });
    
      if (!projectResponse.ok){
        console.error("Error while trying to update knowledge base" + projectResponse.statusText);
        return false;
      }
    
      return true;
      
    }catch(e: unknown){
      return handleError({error: e, origin: "updatePdfConfig"})
    }
  
  }

  export async function uploadMultiplePdfs(files: FileList, projectID: string): Promise<boolean> {
    try {
      const fileArray = Array.from(files);
      const MAX_BATCH_SIZE = 200 * 1024 * 1024; // 200MB in bytes
  
      let currentBatch = [];
      let currentBatchSize = 0;
  
      for (const file of fileArray) {
        // Check if adding the next file exceeds the batch size limit
        if (currentBatchSize + file.size > MAX_BATCH_SIZE) {
          // Upload the current batch
          const success = await uploadBatch(currentBatch, projectID);
          if (!success) return false; // If upload fails, return false
  
          // Reset for the next batch
          currentBatch = [];
          currentBatchSize = 0;
        }
        // Add the file to the current batch
        currentBatch.push(file);
        currentBatchSize += file.size;
      }
  
      // Upload any remaining files in the last batch
      if (currentBatch.length > 0) {
        const success = await uploadBatch(currentBatch, projectID);
        if (!success) return false; // If upload fails, return false
      }
  
      return true; // Return true if all batches uploaded successfully
    } catch (e: unknown) {
      handleError({ error: e, origin: "uploadPdf" });
      return false;
    }
  }
  
  async function uploadBatch(files: File[], projectID: string): Promise<boolean> {
    try {
      // Create a new FormData object for the current batch
      const formData = new FormData();
  
      // Append each file to FormData
      files.forEach(file => {
        formData.append('files', file);
      });
  
      const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/file/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          // Do not set Content-Type; let the browser set it automatically
        },
        body: formData
      });
  
      return projectResponse.ok; // Return true if successful, false otherwise
    } catch (e: unknown) {
      handleError({ error: e, origin: "uploadBatch" });
      return false;
    }
  }