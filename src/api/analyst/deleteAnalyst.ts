import { analystApiUrl as apiUrl, handleError } from "../apiEnv";

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
    } catch (e:unknown) {
      handleError({error: e, origin: "deleteAnalyticalProject"})
      return false
    }
  }