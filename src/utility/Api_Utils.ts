import {
  getAllPdfProjects,
  getAllPdfsFromProject,
} from "../api/kronos/getKronos.ts";
import {
  createKronosProject,
  uploadMultiplePdfs,
  updatePathSingle,
  initResource,
} from "../api/kronos/postKronos.ts";
import {
  ChatBotSceleton,
  fetchProjectsDataReturn,
  kronosKnowledgeBaseType,
  KronosProjectType,
  projectFetchReturn,
  ProjectType,
} from "./types";
import { SettingsType } from "./types.ts";
import { deletePdfProject } from "../api/kronos/deleteKronos.ts";

// export async function updateBulkPaths()

export async function updateSinglePath(
  projectId: string,
  kb_id: string,
  newPath: string,
  token: string
): Promise<boolean> {
  const result = await updatePathSingle(projectId, kb_id, newPath, token);
  if (!result) {
    return false;
  }
  return true;
}

async function getAllProjectsAndProjectData(
  token: string
): Promise<projectFetchReturn[]> {
  let allResults: projectFetchReturn[] = [];
  const allProjects: KronosProjectType[] | null = await getAllPdfProjects(
    token
  );

  // todo: here i can go thru each project and somehow create dev folders with
  // source files here

  if (!allProjects) return []; // Return an empty array if allProjects is null

  if (allProjects.length > 0) {
    // Create an array of promises to fetch project data for each project
    const projectDataPromises = allProjects.map(async (project) => {
      const projectData: kronosKnowledgeBaseType[] | null =
        await getAllPdfsFromProject(project._id, token);

      // Create dummy fsm and html files
      const newKnowledgeBaseData1: kronosKnowledgeBaseType = {
        _id: "",
        project_id: project._id,
        name: "",
        description: "",
        embedding_model: "", // Example embedding model
        language: "", // Example language
        total_pages: 0, // Example page count
        source_file: `dev/index.html`, // Example source file name
        source_type: "html", // Example source type
        created_at: new Date().toISOString(), // Current timestamp
        model_version: 3, // Example model version
      };

      const newKnowledgeBaseData2: kronosKnowledgeBaseType = {
        _id: "",
        project_id: project._id,
        name: "",
        description: "",
        embedding_model: "", // Example embedding model
        language: "", // Example language
        total_pages: 0, // Example page count
        source_file: `dev/config.fsm`, // Example source file name
        source_type: "fsm", // Example source type
        created_at: new Date().toISOString(), // Current timestamp
        model_version: 3, // Example model version
      };

      projectData?.push(newKnowledgeBaseData1);
      projectData?.push(newKnowledgeBaseData2);

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
  const allAnalytical: ProjectType[] = [];
  let pdfProjects: projectFetchReturn[] = [];

  // Fetch all pdfs (Faster api call first)
  if (token) {
    pdfProjects = await getAllProjectsAndProjectData(token);
    console.log("PROJECTS", pdfProjects)
  }
  if (pdfProjects) {
    allProjects = pdfProjects;
    console.log("allProjects is: ", allProjects);
    setInitial({ analytical: allAnalytical, project: allProjects });
  }

  // Removed analytical projects fetch
  // Fetch all analytical files (Slower api call last)
  // const analyticalProjects: ProjectType[] | null =
  //   await fetchAnalyticalConfigs();
  // if (analyticalProjects) {
  //   allAnalytical = analyticalProjects;
  //   setInitial({ analytical: allAnalytical, project: allProjects });
  // }

  if (allProjects.length === 0) {
    console.error("No pdf/analytical documents found!");
    return null;
  }

  return { analytical: allAnalytical, project: allProjects };
}

export async function createInitialKronosProject(
  settings: SettingsType,
  projectName: string,
  description: string,
  language: "en-US" | "cs-CZ",
  files: FileList,
  token: string | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  introMessage?: string, 
  introImage?: string,
  chatbot?: ChatBotSceleton,
): Promise<boolean> {
  if (!token) return false;
  
  const kronosProject = await createKronosProject(
    projectName,
    description,
    language,
    settings,
    token
  );

  if (!kronosProject) return false;
  if (setLoading) setLoading(true);

  const filesUpload = await uploadMultiplePdfs(
    files,
    kronosProject._id,
    "",
    token,
    setLoading
  );

  try{
    if ((introImage && introImage.trim() !== "") || (introMessage && introMessage.trim() !== "") || chatbot){
      await initResource(kronosProject._id, token, introImage, introMessage, chatbot);
    }
  }catch{
    console.error("Failed while initialising the fsm")
  }

  if (!filesUpload) {
    // Delete the created project if file upload fails
    await deletePdfProject(kronosProject._id, token);
    if (setLoading) setLoading(false);
    return false;
  }

  if (setLoading) setLoading(false);

  return true;
}

export function extractProgramName(sourcePath: string) {
  const folders = sourcePath.replace(/\/$/, "").split("/");
  
  // Check if there are no slashes (i.e., only one part in the path)
  if (folders.length <= 1) {
    return null;
  }
  
  const program_name = folders[0];
  return program_name || null;
}

