import {
  uploadAnalyticalProject,
  updateAnalyticalProject,
} from "../api/analyst/postAnalyst.ts";
import { getSinglPdfConfig, getAllPdfProjects, getAllPdfsFromProject } from "../api/kronos/getKronos.ts";
import { updatePdfConfig, createKronosProject, uploadMultiplePdfs  } from "../api/kronos/postKronos.ts";
import { fetchProjectsDataReturn, kronosKnowledgeBaseType, KronosProjectType, projectFetchReturn, ProjectType } from "./types";
import {
  getAllAnalyticalConfigs,
  getAllAnalyticalIDs,
  getSingleAnalyticalConfig,
} from "../api/analyst/getAnalyst.ts";
import { SettingsType } from "./types.ts";
import getFileExstension from "../utility/File_Exstension.ts";
import { deletePdfProject } from "../api/kronos/deleteKronos.ts";

export async function handleGetSingleConfig(
  project: ProjectType,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<SettingsType | null> {
  if (setLoading) setLoading(true);
  const fileExstension = getFileExstension(project.filename);
  let config: SettingsType | null;

  if (fileExstension === "pdf" && project.projectId) {
    config = await getSinglPdfConfig(project.projectId, project.docId);
  } else {
    config = await getSingleAnalyticalConfig(project.docId);
  }

  if (setLoading) setLoading(false);
  if (!config || !config.attributes) {
    console.error("Error config not found");
    return null;
  }

  return config;
}



async function getAllProjectsAndProjectData(): Promise<projectFetchReturn[]> {
  let allResults: projectFetchReturn[] = [];
  const allProjects: KronosProjectType[] | null = await getAllPdfProjects();

  if (!allProjects) return []; // Return an empty array if allProjects is null

  if (allProjects.length > 0) {
    // Create an array of promises to fetch project data for each project
    const projectDataPromises = allProjects.map(async (project) => {
      const projectData: kronosKnowledgeBaseType[] | null = await getAllPdfsFromProject(project._id);
      
      // If projectData is null, return an empty array for projectData
      return {
        project,
        projectData: projectData || [],
      };
    });

    // Wait for all the promises to resolve
    allResults = await Promise.all(projectDataPromises);
  }

  return allResults; // Return the collected results
}



export async function fetchProjectsData(setInitial: (data: fetchProjectsDataReturn) => void): Promise<fetchProjectsDataReturn | null> {
  let allProjects: projectFetchReturn[] = [];
  let allAnalytical: ProjectType[] = [];

  // Fetch all pdfs (Faster api call first)
  const pdfProjects: projectFetchReturn[] = await getAllProjectsAndProjectData();
  if (pdfProjects){
    allProjects = pdfProjects;
    setInitial({analytical: allAnalytical, project: allProjects});
  }

  // Fetch all analytical files (Slower api call last)
  const analyticalProjects: ProjectType[] | null = await fetchAnalyticalConfigs();
  if (analyticalProjects){
    allAnalytical = analyticalProjects;
    setInitial({analytical: allAnalytical, project: allProjects});
  }

  if (allProjects.length === 0) {
    console.error("No pdf/analytical documents found!");
    return null;
  }

  return {analytical: allAnalytical, project: allProjects};
}

export async function fetchAnalyticalConfigs(
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<ProjectType[] | null> {
  // Get all ids
  if (setLoading) setLoading(true);
  const analyst_all_ids = await getAllAnalyticalIDs();
  if (!analyst_all_ids) {
    console.error("Failed to retrieve config ID's");
    if (setLoading) setLoading(false);
    return null;
  }

  // Get all configs
  const analyst_configs: SettingsType[] | null = await getAllAnalyticalConfigs(
    analyst_all_ids
  );
  if (!analyst_configs) {
    console.error("Failed to retrieve config data");
    if (setLoading) setLoading(false);
    return null;
  }

  const result: ProjectType[] = analyst_configs.map((config: SettingsType) => ({
    name: config.attributes?.project_name || "Unknown Project",
    lastUpdate: config.attributes?.last_update || "Unknown Date",
    filename: config.attributes?.doc_name || "Unknown File",
    docId: config.attributes?.doc_id || "Unknown ID",
  }));
  if (setLoading) setLoading(true);
  return result;
}

export async function createInitialAnalyticalProject(settings: SettingsType, files: FileList, notationFile: File): Promise<boolean>{
  // Upload files to create the analytical project
  const uploadResult = await uploadAnalyticalProject(files[0], notationFile);

  if (!uploadResult) return false;

  const docID = uploadResult.docID;

  const response = await updateAnalyticalProject(docID, settings);

  if (!response) return false;

  return true;
}

export async function createInitialKronosProject(settings: SettingsType, projectName: string, description: string, files: FileList): Promise<boolean>{
  const kronosProject = await createKronosProject(projectName, description, settings);

  if (!kronosProject) return false;

  const filesUpload = await uploadMultiplePdfs(files, kronosProject._id);


  if (!filesUpload) {
    // Delete the created project if file upload fails
    await deletePdfProject(kronosProject._id);
    return false
  };

  return true
}


export async function handleUpdateConfig(isAnalytical: boolean, newConfig: SettingsType, docID: string, projectID: string | null): Promise<boolean | null>{
  let result: boolean | null = false;
  const attributes = newConfig.attributes;
  console.log("id", projectID);
  if (isAnalytical) {
    // Analytical documents update
    result = await updateAnalyticalProject(docID, newConfig);
  } else if (projectID) {
    // PDF documents update
    result = await updatePdfConfig(
      attributes.project_name, 
      attributes.description, 
      getLocale(attributes.language),
      newConfig
    );
  }
  if (setLoading) setLoading(false);
  return result;
}

function getLocale(language?: string): string {
  switch (language?.toLowerCase()) {
    case "deutsch":
    case "german":
      return "de-DE";
    case "czech":
    case "čeština":
    case "česky":
      return "cs-CZ";
    case "english":
    case "angličtina":
      return "en-US";
    default:
      return "en-US"; // Default to 'en-US' if undefined or unknown
  }
}
