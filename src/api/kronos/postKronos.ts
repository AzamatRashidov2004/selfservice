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
      const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}`, {
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
    
      const result = await projectResponse.json();
    
      console.log("RESULT", result);
    
      return true;
      
    }catch(e: unknown){
      return handleError({error: e, origin: "updatePdfConfig"})
    }
  
  }

  export async function uploadMultiplePdfs(files: FileList, projectID: string): Promise<boolean> {
    try {
      
      // Create a new FormData object
      const formData = new FormData();
  
      // Loop through each file in the FileList and append it to FormData
      Array.from(files).forEach(file => {
        formData.append('files', file); // Use the same key 'files' for each file
      });
  
      const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/file/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          // Do not set Content-Type; let the browser set it automatically
        },
        body: formData // Use formData directly here
      });
  
      if (!projectResponse.ok) return false; // Check for response status
  
      return true; // Return true if successful
    } catch (e: unknown) {
      handleError({ error: e, origin: "uploadPdf" });
      return false;
    }
  }