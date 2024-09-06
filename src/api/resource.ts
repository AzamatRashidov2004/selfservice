const apiUrl: string = import.meta.env.VITE_RESOURCE_URL as string;

export async function getPdfConfig(id: string): Promise<any> {
  // Get the config.json file for the pdf applications of id
  try {
    const response: Response = await fetch(`${apiUrl}/${id}/config.json`);

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const config: any = await response.json();
    return config;
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return null;
  }
}
