import { kronosApiUrl as apiUrl, kronosApiKey as apiKey } from "../../utility/config.ts";
import { handleError } from "../handleError.ts";
import {
  KronosProjectType,
  kronosKnowledgeBaseType,
} from "../../utility/types";

export async function getHTMLFromProject(
  projectId: string,
  token: string
): Promise<string> {
  try {
    const _url = `${apiUrl}/resources/chatbot_html?project_id=${projectId}`;
    const response: Response = await fetch(_url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer + ${token}`,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch html resource files");
      return "";
    }

    const blob = await response.blob();
    return await blob.text();
  } catch (e: unknown) {
    return "handleError({ error: e, origin: getHTMLFromProject })";
  }
}

export async function getFSMFromProject(
  projectId: string,
  token: string
): Promise<string> {
  try {
    const _url = `${apiUrl}/resources/dialogue_fsm?project_id=${projectId}`;
    const response: Response = await fetch(_url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer + ${token}`,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch fsm resource files");
      return "";
    }

    const blob = await response.blob();
    return await blob.text();
  } catch (e: unknown) {
    return "handleError({ error: e, origin: getFSMFromProject })";
  }
}

export async function getAllPdfsFromProject(
  projectId: string,
  token: string
): Promise<kronosKnowledgeBaseType[] | null> {
  try {
    const _url = `${apiUrl}/projects/${projectId}/knowledge_base/?per_page=0`;
    const response: Response = await fetch(_url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer + ${token}`,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch all knowledge base");
      return null;
    }

    const result: { data: kronosKnowledgeBaseType[] } = await response.json();

    if (result.data.length === 0) {
      console.error("No pdf found inside the knowledge base");
      return null;
    }

    return result.data;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "getAllPdfsFromProject" });
  }
}

export async function getAllPdfProjects(
  token: string
): Promise<KronosProjectType[] | null> {
  const _url = `${apiUrl}/projects/?page_no=1&per_page=100000`; // Big number per page to get all the projects
  try {
    const response: Response = await fetch(_url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer + ${token}`,
        "x-api-key": apiKey,
      },
    });
    const projects: { data: KronosProjectType[] } = await response.json();

    return projects.data;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "getAllPdfProjects" });
  }
}

export async function getKronosProject(
  projectId: string,
  token: string
): Promise<KronosProjectType | null> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
      }
    );

    if (!projectResponse.ok) {
      console.error("Failed to get project");
      return null;
    }

    const project: KronosProjectType = await projectResponse.json();

    if (!project) {
      console.error("Failed to get project");
      return null;
    }

    return project;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "getKronosProject" });
  }
}

export async function getKronosConfig(
  projectId: string,
  docId: string,
  token: string
): Promise<kronosKnowledgeBaseType | null> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectId}/knowledge_base/${docId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
      }
    );

    if (!projectResponse.ok) {
      console.error("Failed to get config");
      return null;
    }

    const project: kronosKnowledgeBaseType = await projectResponse.json();

    if (!project) {
      console.error("Failed to get project");
      return null;
    }

    return project;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "getKronosConfig" });
  }
}

export async function getPdfFile(
  projectID: string,
  docID: string,
  docName: string,
  token: string
): Promise<boolean> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectID}/knowledge_base/${docID}/source`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
      }
    );

    if (!projectResponse.ok) {
      console.error("Failed to get PDF file");
      return false;
    }

    // Convert response to Blob
    const blob = await projectResponse.blob();

    // Create a downloadable link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Set the file name for download (you can modify it as per your needs)
    link.download = `${docName}`;

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the object URL
    window.URL.revokeObjectURL(url);

    return true;
  } catch (e: unknown) {
    handleError({ error: e, origin: "getPdfFile" });
    return false;
  }
}

export async function getPdfFileUrl(
  projectID: string,
  docID: string,
  docName: string,
  token: string
): Promise<string> {
  console.log(docName);
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectID}/knowledge_base/${docID}/source`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
      }
    );

    if (!projectResponse.ok) {
      console.error("Failed to get PDF file");
      return "";
    }

    // Convert response to Blob
    const blob = await projectResponse.blob();

    // Create a downloadable link
    const url = window.URL.createObjectURL(blob);
    //const link = document.createElement("a");
    //link.href = url;
    return url;
  } catch (e: unknown) {
    handleError({ error: e, origin: "getPdfFile" });
    return "";
  }
}

export async function getKbId(
  projectId: string,
  token: string
): Promise<string | null> {
  try {
    const _url = `${apiUrl}/projects/${projectId}/knowledge_base/?page_no=1&per_page=10`;
    const response: Response = await fetch(_url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer + ${token}`,
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch all knowledge base");
      return null;
    }

    const result: { data: kronosKnowledgeBaseType[] } = await response.json();

    if (result.data.length === 0) {
      console.error("No pdf found inside the knowledge base");
      return null;
    }

    return result.data[0]._id;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "getAllPdfsFromProject" });
  }
}

export async function getHtmlFile(
  projectID: string,
  docID: string,
  token: string
): Promise<string> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/resources/chatbot_html?project_id=${projectID}&kb_id=${docID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
      }
    );

    if (!projectResponse.ok) {
      console.error("Failed to get PDF file");
      return "";
    }

    // Convert response to Blob
    const blob = await projectResponse.blob();
    return await blob.text();
  } catch (e: unknown) {
    handleError({ error: e, origin: "getHTMLFile" });
    return "";
  }
}
