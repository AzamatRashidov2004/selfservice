import {
  uploadAnalyticalProject,
  updateAnalyticalProject
} from "../api/analyst/postAnalyst.ts";
import { getSinglPdfConfig, getAllPdfs } from "../api/kronos/getKronos.ts";
import { uploadPdf, updatePdfConfig,  } from "../api/kronos/postKronos.ts";
import { ProjectType } from "./types";
import {
  getAllAnalyticalConfigs,
  getAllAnalyticalIDs,
  getSingleAnalyticalConfig,
} from "../api/analyst/getAnalyst.ts";
import { SettingsType } from "./types.ts";
import getFileExstension from "../utility/File_Exstension.ts";


export async function uploadProjectFile(file: File, isAnalytical: boolean, notationFile?: File | null){

  if (isAnalytical && notationFile){
    // Analytical file (xlsx or csv)
    return await uploadAnalyticalProject(file, notationFile);
  }else{
    // Pdf file
    return await uploadPdf(file)
  }
}


export async function handleGetSingleConfig(project: ProjectType): Promise<SettingsType | null> {
  const fileExstension = getFileExstension(project.filename);
  let config: SettingsType | null;

  if (fileExstension === "pdf" && project.projectId){
    config = await getSinglPdfConfig(project.projectId, project.docId);
  }else{
    config = await getSingleAnalyticalConfig(project.docId);
  }

  if (!config || !config.attributes){
    console.error("Error config not found");
    return null
  }
  return config;
}

export async function fetchProjectsData(setInitial: React.Dispatch<React.SetStateAction<ProjectType[]>>): Promise<ProjectType[] | null> {
  let allProjects: ProjectType[] = [];

  // Fetch all pdfs (Faster api call first)
  const pdfProjects: ProjectType[] | null = await getAllPdfs();
  if (pdfProjects){
    allProjects = [...allProjects, ...pdfProjects];
    setInitial(allProjects);
  }

  // Fetch all analytical files (Slower api call last)
  const analyticalProjects: ProjectType[] | null = await fetchAnalyticalConfigs();
  if (analyticalProjects){
    allProjects = [...allProjects, ...analyticalProjects];
    setInitial(allProjects);
  }

  if (allProjects.length === 0){
    console.error("No pdf/analytical documents found!");
    return null;
  }

  return allProjects;
}

export async function fetchAnalyticalConfigs(): Promise<ProjectType[] | null> {
  // Get all ids
  const analyst_all_ids = await getAllAnalyticalIDs();
  if (!analyst_all_ids) {
    console.error("Failed to retrieve config ID's");
    return null
  }

  // Get all configs
  const analyst_configs: SettingsType[] | null = await getAllAnalyticalConfigs(analyst_all_ids);
  if (!analyst_configs) {
    console.error("Failed to retrieve config data");
    return null;
  }
  
  const result: ProjectType[] = analyst_configs.map((config: SettingsType) => ({
    name: config.attributes?.project_name || "Unknown Project",
    lastUpdate: config.attributes?.last_update || "Unknown Date",
    filename: config.attributes?.doc_name || "Unknown File",
    docId: config.attributes?.doc_id || "Unknown ID"
  }));

  return result;
}


export async function handleUpdateConfig(isAnalytical: boolean, newConfig: SettingsType, docID: string, projectID: string | null): Promise<boolean | null>{
  let result: boolean | null = false;
  const attributes = newConfig.attributes;
  console.log("id", projectID)
  if (isAnalytical){
    // Analytical documents update
    result = await updateAnalyticalProject(docID, newConfig);
    
  }else if (projectID){
    // PDF documents update
    result = await updatePdfConfig(
      attributes.project_name, 
      attributes.description, 
      getLocale(attributes.language), 
      projectID, 
      docID, 
      newConfig, 
      attributes.doc_name
    );

  }
  
  return result
}

function getLocale(language?: string): string {
  switch (language?.toLowerCase()) {
    case 'deutsch':
    case 'german':
      return 'de-DE';
    case 'czech':
    case 'čeština':
    case 'česky':
      return 'cs-CZ';
    case 'english':
    case 'angličtina':
      return 'en-US';
    default:
      return 'en-US';  // Default to 'en-US' if undefined or unknown
  }
}

