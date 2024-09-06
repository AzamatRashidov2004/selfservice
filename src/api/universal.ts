export const isProduction: boolean =
  import.meta.env.VITE_ENVIRONMENT === "PRODUCTION";

const apiUrl: string = isProduction
  ? import.meta.env.VITE_UNIVERSAL_URL_DEVELOPMENT
  : import.meta.env.VITE_KRONOS_URL_DEVELOPMENT;

export async function showAllPdfManuals(): Promise<any> {
  // Get all available pdf manuals
  try {
    const response: Response = isProduction
      ? await fetch(`${apiUrl}/show_available_manuals`)
      : await fetch(`${apiUrl}/projects/?page_no=1&per_page=10`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: import.meta.env.VITE_KRONOS_API_KEY_DEVELOPMENT,
          },
        });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const manuals: any = await response.json();
    return manuals;
  } catch (error) {
    console.error("Failed to fetch manuals:", error);
    return null;
  }
}

export async function deletePdfProject(id: string): Promise<boolean> {
  // Delete pdf project
  try {
    const response = await (isProduction
      ? fetch(`${apiUrl}/delete_manual/${id}`)
      : fetch(`${apiUrl}/projects/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: import.meta.env.VITE_KRONOS_API_KEY_DEVELOPMENT,
          },
        }));

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to delete a project:", error);
    return false;
  }
}
export async function updatePdfProject(
  id: string,
  formData: FormData
): Promise<any> {
  // Update pdf project
  try {
    const response = await (isProduction
      ? fetch(`${apiUrl}/upload_config/${id}`, {
          method: "POST",
          body: formData,
        })
      : null); // response might be set to null here

    if (!response) {
      console.error(
        "No response received, possibly due to incorrect environment setup."
      );
      return null;
    }

    if (!response.ok) {
      console.error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`
      );
      return null;
    }

    const data: any = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update a project:", error);
    return null;
  }
}
export async function uploadPdf(formData: FormData): Promise<any | null> {
  try {
    if (isProduction) {
      const response = await fetch(`${apiUrl}/upload_manual`, {
        method: "POST",
        body: formData,
      });
      if (!response) {
        console.error(
          "No response received, possibly due to non-production environment."
        );
        return null;
      }

      if (!response.ok) {
        console.error(
          `HTTP error! Status: ${response.status} - ${response.statusText}`
        );
        return null;
      }
      const result = await response.json();
      return result;
    } else {
      // not implemented in kronos yet, since the server doesn't generate ids
      // need to create a project first get the id, then upload the pdf to the id
    }
  } catch (error) {
    console.error("Failed to upload a project:", error);
    return null;
  }
}

export async function getSinglPdfConfig(id: string): Promise<any | null> {
  try {
    if (isProduction) {
      // implement
    } else {
      const response = await fetch(
        `${apiUrl}/projects/${id}/knowledge_base/?page_no=1&per_page=10`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: import.meta.env.VITE_KRONOS_API_KEY_DEVELOPMENT,
          },
        }
      );
      if (!response) {
        console.error("Error getting a Kronos pdf config");
        return null;
      }

      if (!response.ok) {
        console.error(
          `HTTP error! Status: ${response.status} - ${response.statusText}`
        );
        return null;
      }
      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error("Failed to get a since pdf config", error);
    return null;
  }
}
