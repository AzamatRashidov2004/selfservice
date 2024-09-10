export const isProduction: boolean =
  import.meta.env.VITE_ENVIRONMENT === "PRODUCTION";

const apiUrl: string = isProduction
  ? import.meta.env.VITE_UNIVERSAL_URL_DEVELOPMENT
  : import.meta.env.VITE_KRONOS_URL_PRODUCTION;

import { formatKronosDate } from "../utility/Date_Util";
// Import statements if needed
// import { apiUrl, isProduction } from './config';
import { ProjectType } from "../utility/types";
import { getPdfConfig } from "./resource";

async function getProductionPdfNamesAndIds(): Promise<{name: string, id: string}[] | null>{
  const _url = `${apiUrl}/show_available_manuals`;

  // Get all pdf ids and names
  const response: Response = await fetch(_url);

  if (!response.ok){
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return null;
  }

  const data: {answer: [string[]]} | undefined = await response.json();
  if (!data || !data.answer) return null

  return data.answer.map(idList => {return {id: idList[0], name: idList[1]}})

}

async function getAllProductionPdf(): Promise<ProjectType[] | null>{
  const allConfigs: ProjectType[] = [];

  // Get all names and ids of pdfs
  const allFiles = await getProductionPdfNamesAndIds();
  if (!allFiles || allFiles.length === 0) {
    console.error("No pdf documents found");
    return null;
  }

  // Get all pdf configs
  for (const pdf of allFiles) {
    const config = await getPdfConfig(pdf.id);

    if (config && config.attributes){
      allConfigs.push({
        name: config.attributes.project_name,
        lastUpdate: config.attributes.last_update,
        filename: pdf.name + ".pdf",
        projectId: pdf.id
      })
    }
  }

  if (allConfigs.length === 0 ){
    console.error("No pdf documents found");
    return null;
  }
  return allConfigs;
}

async function getAllDevelopmentPdfProjects(): Promise<ProjectType[] | null>{
  interface kronosResponse {
    _id: string,
    name: string,
    description: string,
    created_at: string
  }

  const _url = `${apiUrl}/projects/?page_no=1&per_page=10`;
  try{
      const response: Response = await fetch(_url,
        {
          method: "GET",
          headers: 
          {
            accept: "application/json",
            Authorization: import.meta.env.VITE_KRONOS_API_KEY_DEVELOPMENT,
          },
        }
      );
      const projects: {data: kronosResponse[]} = await response.json();
       // Map data to the Project interface
      return projects.data.map((item: kronosResponse) => ({
        name: item.name,
        projectId: item._id,
        lastUpdate: formatKronosDate(new Date(item.created_at)),
        filename: item.name + ".pdf",
      }));
  }catch(error){
    console.error("Failed to fetch manuals:", error);
    return null
  }
}

export async function getAllPdfProjects(): Promise<ProjectType[] | null> {
  let allPdfProjects: ProjectType[] | null;
  if (isProduction){
    allPdfProjects = await getAllProductionPdf();
  }else{
    allPdfProjects = await getAllDevelopmentPdfProjects();
  }

  if (!allPdfProjects) return null;
  return allPdfProjects
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

async function uploadProductionPdf(formData: FormData): Promise<any | null>{
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
}

async function uploadDevelopmentPdf(formData: FormData): Promise<any | null>{
  console.log(formData);
  return null
}

export async function uploadPdf(formData: FormData): Promise<any | null> {
  try {
    if (isProduction) {
      return await uploadProductionPdf(formData);
    } else {
      return await uploadDevelopmentPdf(formData);
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
