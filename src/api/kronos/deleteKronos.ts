import { kronosApiUrl as apiUrl, kronosApiKey as apiKey, handleError } from "../apiEnv";

export async function deletePdfProject(projectID: string): Promise<boolean | null>{
  try{
    const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': apiKey
      }
    });
  
    if (!projectResponse.ok){
      console.error("Error while trying to delete project " + projectResponse.statusText);
      return null
    }
  
    return true

  }catch (e: unknown) {
    return handleError({error: e, origin: "deletePdfProject"})
  }
}

export async function deletePdf(projectID: string, docID: string): Promise<boolean>{
  try{
    const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/${docID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': apiKey
      }
    });
  
    if (!projectResponse.ok){
      console.error("Error while trying to delete project " + projectResponse.statusText);
      return false
    }
  
    return true

  }catch (e: unknown) {
    handleError({error: e, origin: "deletePdf"})
    return false 
    
  }
}