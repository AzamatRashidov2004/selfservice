import { kronosApiUrl as apiUrl, kronosApiKey as apiKey, handleError } from "../apiEnv";
import { SettingsType, KronosProjectType } from "../../utility/types";

async function createKronosProject(name="", description=""): Promise<KronosProjectType | null>{

  try{
    // Create new kronos project
    const projectResponse: Response = await fetch(`${apiUrl}/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({name, description})
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

async function uploadPdfToKronosProject(projectID: string, file: File): Promise<string | null> {

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
    language: string, 
    projectID: string,
    docId: string,
    settings: SettingsType, 
    filename: string
  ): Promise<boolean | null>{

    try{
      const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/${docId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify({
          _id: docId, 
          project_id: projectID,
          name, 
          description,
          language,
          source_file: filename,
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

  export async function uploadPdf(file: File): Promise<{projectID: string, docID: string} | null> {
    
    try{
      //  Create new Kronos project  
      const project = await createKronosProject();
      if (!project ){
        return null;
      }
    
      const projectID = project._id;
    
      // Upload the pdf to the project
      const docID = await uploadPdfToKronosProject(projectID, file);
    
      if (!docID){
        return null;
      }
    
      console.log(projectID, docID)
      return {projectID, docID}
      
    }catch(e: unknown){
      return handleError({error: e, origin: "uploadPdf"})
    }
  }