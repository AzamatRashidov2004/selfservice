import { kronosApiUrl as apiUrl, kronosApiKey as apiKey, handleError } from "../apiEnv";

export async function deletePdfProject(projectID: string, token: string): Promise<boolean | null>{
  try{
    const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer + ${token}`,
        'x-api-key': apiKey
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

export async function deletePdf(projectID: string, docID: string, token: string): Promise<boolean>{
  try{
    const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/${docID}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer + ${token}`,
        'x-api-key': apiKey
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


export async function deleteBulkPdf(projectID: string, docIds: string[], token:string): Promise<boolean> {
  try{
    const projectResponse: Response = await fetch(`${apiUrl}/projects/${projectID}/knowledge_base/bulk`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer + ${token}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(docIds)
    });
  
    if (!projectResponse.ok){
      console.error("Error while trying to delete files " + projectResponse.statusText);
      return false
    }
  
    return true

  }catch (e: unknown) {
    handleError({error: e, origin: "deleteBulkPdf"})
    return false 
  }
}