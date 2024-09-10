import {
  getSingleAnalyticalConfig,
  uploadAnalyticalProject,
  updateAnalyticalProject
} from "../api/analyst";
import { getSinglPdfConfig, isProduction, uploadPdf, getAllPdfProjects } from "../api/universal";
import { ProjectType } from "./types";
import {
  getAllAnalyticalConfigs,
  getAllAnalyticalIDs,
} from "../api/analyst.ts";
import getFileExstension from "./File_Exstension.ts";
import { SettingsType } from "./types.ts";

async function handleUploadAnalytical(file: File, notationFile: File){
  const formData = new FormData();
  formData.append("table_file", file);
  formData.append("annotations_file", notationFile);
  const response = await uploadAnalyticalProject(formData);

  if (!response) {
    console.error("Error while uploading file");
    return null
  }

  return response["id"];
}

async function handleUploadPdf(file: File){
  const formData = new FormData();
    formData.append("file", file);
    const response = await uploadPdf(formData);

    if (!response){
      console.error("Something went wrong while uploading the file");
      return null;
    }

    // TODO Separate this if isProduction logic and put it into uploadPdf.
    if (isProduction) {
      return response["answer"].split(" ")[4];
    } else {
      // not implemented on server
    }
}

export async function uploadProjectFile(file: File, isAnalytical: boolean, notationFile?: File | null){

  if (isAnalytical && notationFile){
    // Analytical file (xlsx or csv)
    return await handleUploadAnalytical(file, notationFile);
  }else{
    // Pdf file
    return await handleUploadPdf(file);
  }
}


export async function handleGetSingleConfig(project: ProjectType): Promise<SettingsType | null> {
  const fileExstension = getFileExstension(project.filename);
  let config: SettingsType | null;

  if (fileExstension === "pdf"){
    config = await getSinglPdfConfig(project.projectId);
  }else{
    config = await getSingleAnalyticalConfig(project.projectId);
  }

  if (!config || !config.attributes){
    console.error("Error config not found");
    return null
  }
  return config;
}

export async function fetchProjectsData(setInitial: React.Dispatch<React.SetStateAction<ProjectType[]>>): Promise<ProjectType[] | null> {
  let allProjects: ProjectType[] = [];

  // Fetch pdf projects
  const pdfProjects = await getAllPdfProjects();
  if (pdfProjects) {
    allProjects = [...pdfProjects];
    setInitial([...allProjects]);  // Update state with the PDF projects first
  }

  // Fetch analytical projects (slower call)
  const analyticalProjects = await fetchAnalyticalConfigs();
  if (analyticalProjects) {
    const newProjects = analyticalProjects.map((projectSetting: SettingsType) => ({
      name: projectSetting.attributes.project_name,
      projectId: projectSetting.attributes.doc_id,
      filename: projectSetting.attributes.doc_name,
      lastUpdate: projectSetting.attributes.last_update,
    }));

    allProjects = [...allProjects, ...newProjects];  // Combine both sets of projects
    setInitial(allProjects);  // Update state with the combined projects
  }

  // Check if any projects exist
  if (allProjects.length === 0) {
    console.error("No projects found");
    return null;
  }

  return allProjects;
}

export async function fetchAnalyticalConfigs(): Promise<SettingsType[] | null> {
  // Get all ids
  const analyst_all_ids = await getAllAnalyticalIDs();
  if (!analyst_all_ids) {
    console.error("Failed to retrieve config ID's");
    return null
  }

  // Get all configs
  const analyst_configs = await getAllAnalyticalConfigs(analyst_all_ids);
  if (!analyst_configs) {
    console.error("Failed to retrieve config data");
    return null;
  }
  
  return analyst_configs;
}


export async function handleUpdateConfig(isAnalytical: boolean, newConfig: SettingsType, projectID: string): Promise<boolean | null>{
  let result: boolean | null = false;
  if (isAnalytical){
    result = await updateAnalyticalProject(projectID, newConfig);
  }else{
    // Implement pdf update
  }

  return result
}

