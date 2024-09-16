const environment = import.meta.env.VITE_ENVIRONMENT 

export const isProduction: boolean = import.meta.env.VITE_ENVIRONMENT === "PRODUCTION";
export const kronosApiUrl: string = `${import.meta.env[`VITE_KRONOS_URL_${environment}`]}`;
export const kronosApiKey: string = `${import.meta.env[`VITE_KRONOS_API_KEY_${environment}`]}`;

export const analystApiUrl: string = `${import.meta.env[`VITE_ANALYTICAL_URL_${environment}`]}`;

export const handleError = (e: unknown): null => {
    if (e instanceof Error) {
        console.error(e)
        console.error(`Error occurred: ${e.message}`);
        console.error(`Stack trace: ${e.stack}`);
      } else {
        console.error('An unknown error occurred:', e);
      }
  
      return null
}
