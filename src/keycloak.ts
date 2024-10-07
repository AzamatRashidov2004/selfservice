import Keycloak from 'keycloak-js';

// Function to determine if the app is running on localhost
const isLocalhost = () => {
  return window.location.hostname === 'localhost';
};

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOACK_URL,
  realm: import.meta.env.VITE_KEYCLOACK_REALM,
  clientId: isLocalhost() ? import.meta.env.VITE_KEYCLOACK_CLIENT_ID : import.meta.env.VITE_KEYCLOACK_PRODUCTION_CLIENT_ID,
});

export default keycloak;