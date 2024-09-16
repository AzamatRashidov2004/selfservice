const environment = import.meta.env.VITE_ENVIRONMENT 

export const isProduction: boolean = import.meta.env.VITE_ENVIRONMENT === "PRODUCTION";
export const kronosApiUrl: string = `${import.meta.env[`VITE_KRONOS_URL_${environment}`]}`;
export const kronosApiKey: string = `${import.meta.env[`VITE_KRONOS_API_KEY_${environment}`]}`;

export const analystApiUrl: string = `${import.meta.env[`VITE_ANALYTICAL_URL_${environment}`]}`;

console.log("Is Production", isProduction);
console.log("Kronos API Key", kronosApiKey);
console.log("Kronos Url", kronosApiUrl);

export const handleError = (vars: {error: unknown, origin: string}): null => {
  const error = vars.error
  if (error instanceof Error) {
      console.error('An error occurred:');
      console.error(`Context: ${vars.origin}`);
      console.error(`Type: ${error.name}`);
      console.error(`Message: ${error.message}`);
      
      if (error.stack) {
          console.error('Stack trace:');
          console.error(error.stack);
      } else {
          console.error('No stack trace available.');
      }
  } else {
      console.error('An unknown error occurred with the following details:');
      console.error('Context:', vars.origin);
      console.error(error);
  }

  return null;
}

