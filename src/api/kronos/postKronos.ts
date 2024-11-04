import {
  kronosApiUrl as apiUrl,
  kronosApiKey as apiKey,
  handleError,
} from "../apiEnv";
import {
  SettingsType,
  KronosProjectType,
  kronosKnowledgeBaseType,
} from "../../utility/types";

export async function createKronosProject(
  projectName = "",
  description = "",
  chatbot_config: SettingsType,
  token: string
): Promise<KronosProjectType | null> {
  try {
    // Create new kronos project
    const projectResponse: Response = await fetch(`${apiUrl}/projects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer + ${token}`,
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ name: projectName, description, chatbot_config }),
    });

    if (!projectResponse.ok) {
      console.error(
        "Failed to create Kronos project " + projectResponse.statusText
      );
      return null;
    }

    const project: KronosProjectType = await projectResponse.json();

    if (!project) {
      console.error("Failed to create Kronos project");
      return null;
    }

    return project;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "createKronosProject" });
  }
}

export async function uploadPdfToKronosProject(
  projectID: string,
  file: File,
  token: string
): Promise<string | null> {
  try {
    const formData = new FormData();

    formData.append("file", file); // Turn the file into binary string

    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectID}/knowledge_base/pdf`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
        body: formData, // Add the file
      }
    );

    if (!projectResponse.ok) {
      console.error("Error uploading PDF:", projectResponse.statusText);
      return null;
    }

    const result = await projectResponse.json();

    return result._id;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "uploadPdfToKronosProject" });
  }
}

export async function updatePdfConfig(
  name: string,
  description: string,
  projectID: string,
  settings: SettingsType,
  token: string
): Promise<boolean | null> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectID}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          name,
          description,
          chatbot_config: settings,
        }),
      }
    );

    if (!projectResponse.ok) {
      console.error(
        "Error while trying to update knowledge base" +
          projectResponse.statusText
      );
      return false;
    }

    return true;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "updatePdfConfig" });
  }
}

export async function uploadMultiplePdfs(
  files: FileList,
  projectID: string,
  path: string,
  token: string,
  setFileUploadLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<kronosKnowledgeBaseType[] | null> {
  try {
    setFileUploadLoading(true);
    const fileArray = Array.from(files);
    const MAX_BATCH_SIZE = 200 * 1024 * 1024; // 200MB in bytes

    let currentBatch = [];
    let currentBatchSize = 0;
    let response: kronosKnowledgeBaseType[] = [];
    for (const file of fileArray) {
      // Check if adding the next file exceeds the batch size limit
      if (currentBatchSize + file.size > MAX_BATCH_SIZE) {
        // Upload the current batch
        const result = await uploadBatch(currentBatch, projectID, path, token);
        setFileUploadLoading(false);
        if (!result) return null; // If upload fails, return false
        response = [...response, ...result];
        // Reset for the next batch
        currentBatch = [];
        currentBatchSize = 0;
      }
      // Add the file to the current batch
      currentBatch.push(file);
      currentBatchSize += file.size;
    }

    // Upload any remaining files in the last batch
    if (currentBatch.length > 0) {
      setFileUploadLoading(true);
      const result = await uploadBatch(currentBatch, projectID, path, token);
      setFileUploadLoading(false);
      if (!result) return null; // If upload fails, return false
      response = [...response, ...result];
    }
    return response;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "uploadPdf" });
  }
}

async function uploadBatch(
  files: File[],
  projectID: string,
  sourcePath: string,
  token: string
): Promise<kronosKnowledgeBaseType[] | null> {
  try {
    // Create a new FormData object for the current batch
    const formData = new FormData();

    // Append each file to FormData
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Create a URL object and append query parameters
    const url = new URL(
      `${apiUrl}/projects/${projectID}/knowledge_base/file/bulk`
    );
    url.searchParams.append("source_path", sourcePath);

    const projectResponse: Response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": apiKey,
      },
      body: formData,
    });

    if (!projectResponse.ok) {
      return null; // Return null if the response was not successful
    }
    const responseData: kronosKnowledgeBaseType[] =
      await projectResponse.json();

    return responseData;
  } catch (e: unknown) {
    return handleError({ error: e, origin: "uploadBatch" });
  }
}

export async function updatePathBulk(
  projectID: string,
  knowledge_bases: { _id: string; project_id: string; source_file: string }[],
  token: string
): Promise<boolean> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectID}/knowledge_base/bulk`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
        body: JSON.stringify(knowledge_bases),
      }
    );

    if (!projectResponse.ok) {
      console.error(
        "Error while trying to update knowledge base path" +
          projectResponse.statusText
      );
      return false;
    }

    return true;
  } catch (e: unknown) {
    handleError({ error: e, origin: "updatePdfConfig" });
    return false;
  }
}

export async function updatePathSingle(
  projectID: string,
  kb_id: string,
  newPath: string,
  token: string
): Promise<boolean> {
  try {
    const projectResponse: Response = await fetch(
      `${apiUrl}/projects/${projectID}/knowledge_base/${kb_id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer + ${token}`,
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          _id: kb_id,
          project_id: projectID,
          source_file: newPath,
        }),
      }
    );

    if (!projectResponse.ok) {
      console.error(
        "Error while trying to update knowledge base path" +
          projectResponse.statusText
      );
      return false;
    }

    return true;
  } catch (e: unknown) {
    handleError({ error: e, origin: "updatePdfConfig" });
    return false;
  }
}
