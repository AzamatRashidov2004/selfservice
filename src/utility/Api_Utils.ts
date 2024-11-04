import {
  uploadAnalyticalProject,
  updateAnalyticalProject,
} from "../api/analyst/postAnalyst.ts";
import {
  getAllPdfProjects,
  getAllPdfsFromProject,
} from "../api/kronos/getKronos.ts";
import {
  createKronosProject,
  uploadMultiplePdfs,
  updatePathSingle,
} from "../api/kronos/postKronos.ts";
import {
  fetchProjectsDataReturn,
  kronosKnowledgeBaseType,
  KronosProjectType,
  projectFetchReturn,
  ProjectType,
} from "./types";
import {
  getAllAnalyticalConfigs,
  getAllAnalyticalIDs,
} from "../api/analyst/getAnalyst.ts";
import { SettingsType } from "./types.ts";
import { deletePdfProject } from "../api/kronos/deleteKronos.ts";


// export async function updateBulkPaths()

export async function updateSinglePath(projectId: string, kb_id: string, newPath: string, token: string): Promise<boolean> {
  const result = await updatePathSingle(projectId, kb_id, newPath, token);
  if (!result){
    return false;
  }
  return true;
}

async function getAllProjectsAndProjectData(token: string): Promise<projectFetchReturn[]> {
  let allResults: projectFetchReturn[] = [];
  const allProjects: KronosProjectType[] | null = await getAllPdfProjects(token);

  if (!allProjects) return []; // Return an empty array if allProjects is null

  if (allProjects.length > 0) {
    // Create an array of promises to fetch project data for each project
    const projectDataPromises = allProjects.map(async (project) => {
      const projectData: kronosKnowledgeBaseType[] | null =
        await getAllPdfsFromProject(project._id, token);

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

export async function fetchProjectsData(
  setInitial: (data: fetchProjectsDataReturn) => void,
  token: string | undefined
): Promise<fetchProjectsDataReturn | null> {
  let allProjects: projectFetchReturn[] = [];
  let allAnalytical: ProjectType[] = [];
  let pdfProjects: projectFetchReturn[] = []

  // Fetch all pdfs (Faster api call first)
  if (token){
    pdfProjects = await getAllProjectsAndProjectData(token);
  }
  if (pdfProjects) {
    allProjects = pdfProjects;
    setInitial({ analytical: allAnalytical, project: allProjects });
  }

  // Fetch all analytical files (Slower api call last)
  const analyticalProjects: ProjectType[] | null =
    await fetchAnalyticalConfigs();
  if (analyticalProjects) {
    allAnalytical = analyticalProjects;
    setInitial({ analytical: allAnalytical, project: allProjects });
  }

  if (allProjects.length === 0) {
    console.error("No pdf/analytical documents found!");
    return null;
  }

  return { analytical: allAnalytical, project: allProjects };
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

export async function createInitialAnalyticalProject(
  settings: SettingsType,
  files: FileList,
  notationFile: File,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> {
  // Upload files to create the analytical project
  if (setLoading) setLoading(true);
  const uploadResult = await uploadAnalyticalProject(files[0], notationFile);

  if (!uploadResult) return false;

  const docID = uploadResult.docID;

  const response = await updateAnalyticalProject(docID, settings);
  if (setLoading) setLoading(false);
  if (!response) return false;

  return true;
}

export async function createInitialKronosProject(
  settings: SettingsType,
  projectName: string,
  description: string,
  files: FileList,
  token: string | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> {
  if (!token) return false;
  const kronosProject = await createKronosProject(
    projectName,
    description,
    settings,
    token
  );

  if (!kronosProject) return false;
  if (setLoading) setLoading(true);

  const filesUpload = await uploadMultiplePdfs(files, kronosProject._id, "", token, setLoading);

  if (!filesUpload) {
    // Delete the created project if file upload fails
    await deletePdfProject(kronosProject._id, token);
    if (setLoading) setLoading(false);
    return false;
  }

  if (setLoading) setLoading(false);

  return true;
}
