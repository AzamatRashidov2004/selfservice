interface ImportMetaEnv {
  VITE_ENVIRONMENT: "DEVELOPMENT" | "PRODUCTION";
  VITE_KEYCLOAK_CLIENT_ID: string;
  VITE_KEYCLOAK_CLIENT_ID_LOCAL: string;
  VITE_KEYCLOAK_REALM: string;
  VITE_KEYCLOAK_URL: string;
  VITE_KRONOS_API_KEY: string;
  VITE_KRONOS_URL: string;
  VITE_MAESTRO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
