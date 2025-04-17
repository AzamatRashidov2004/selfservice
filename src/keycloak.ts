import Keycloak from 'keycloak-js';

export const kronosApiUrl: string = import.meta.env.VITE_KRONOS_URL;

// Function to determine if the app is running on localhost
const isLocalhost = () => {
  return window.location.hostname === 'localhost';
};

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: isLocalhost() ? import.meta.env.VITE_KEYCLOAK_CLIENT_ID_LOCAL : import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;