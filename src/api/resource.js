const apiUrl =
  "https://promethistpublic.blob.core.windows.net/data/universal_cqa/model_storage_develop/faiss_dbs/faiss_dbs";

export async function getPdfConfig(id) {
  // Get the config.json file for the pdf applications of id
  try {
    const response = await fetch(`${apiUrl}/${id}/config.json`);

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const config = await response.json();
    return config;
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return null;
  }
}
