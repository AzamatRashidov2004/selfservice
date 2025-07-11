import Keycloak from 'keycloak-js';
import {keycloakClientId, keycloakClientIdLocal, keycloakRealm, keycloakUrl} from "./utility/config.ts";

// Function to determine if the app is running on localhost
const isLocalhost = () => {
  return window.location.hostname === 'localhost';
};

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: isLocalhost() ? keycloakClientIdLocal : keycloakClientId,
});

export default keycloak;