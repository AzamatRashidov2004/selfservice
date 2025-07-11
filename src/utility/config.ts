export interface Config {
    ENVIRONMENT: string;
    KEYCLOAK_CLIENT_ID: string;
    KEYCLOAK_CLIENT_ID_LOCAL: string;
    KEYCLOAK_REALM: string;
    KEYCLOAK_URL: string;
    KRONOS_API_KEY: string;
    KRONOS_URL: string;
    MAESTRO_URL: string;
    VERSION: string;
}

export let environment: string;
export let keycloakClientId: string;
export let keycloakClientIdLocal: string;
export let keycloakRealm: string;
export let keycloakUrl: string;
export let kronosApiKey: string;
export let kronosApiUrl: string;
export let maestroApiUrl: string;
export let version: string;

export const loadConfig = async () => {
    const res = await fetch('/config.json', { cache: 'no-store' })
    const data = (await res.json()) as Config;
    environment = data.ENVIRONMENT;
    keycloakClientId = data.KEYCLOAK_CLIENT_ID;
    keycloakClientIdLocal = data.KEYCLOAK_CLIENT_ID_LOCAL;
    keycloakRealm = data.KEYCLOAK_REALM;
    keycloakUrl = data.KEYCLOAK_URL;
    kronosApiKey = data.KRONOS_API_KEY;
    kronosApiUrl = data.KRONOS_URL;
    maestroApiUrl = data.MAESTRO_URL;
    version = data.VERSION || 'dev';
}