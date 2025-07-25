import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  SetStateAction,
} from "react";
import keycloak from "../keycloak"; // Adjust the path as necessary
import Keycloak from "keycloak-js";

// Define the shape of your context data
interface AuthContextType {
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  checkAuthenticated: () => boolean;
  keycloak: Keycloak;
  isFirstLogin: boolean;
  setIsFirst: React.Dispatch<SetStateAction<boolean>>;
}

// Create the context with the initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isFirstLogin, setIsFirst] = useState<boolean>(true);

  const checkAuthenticated = (): boolean => {
    return keycloak.authenticated || false;
  };

  useEffect(() => {
    // Initialize Keycloak on mount
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso", // Optional: Adjust this value based on your use case
        });
        console.log("Initialization Result:", authenticated); // Check what this returns
        console.log("Keycloak Authenticated:", keycloak.authenticated); // Check the status after init

        setAuthenticated(authenticated); // Update state based on the result
      } catch (err) {
        console.error("Failed to initialize Keycloak", err);
      }
    };

    initKeycloak();

    // Set up token refresh
    const refreshToken = setInterval(() => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            setAuthenticated(checkAuthenticated()); // Update state on token refresh
          }
        })
        .catch((err) => {
          console.error("Failed to refresh token", err);
          setAuthenticated(false); // If token refresh fails, set authenticated to false
        });
    }, 60000); // Refresh token every minute

    return () => clearInterval(refreshToken);
  }, []);

  const login = async () => {
    try {
      await keycloak.login({
        redirectUri: window.location.origin + "/dashboard",
      });
      console.log("token", keycloak.token);
      setAuthenticated(checkAuthenticated()); // Update state after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      console.log("wlo: ", window.location.origin.toString());
      await keycloak.logout({
        redirectUri: window.location.origin + "/",
      });
      setAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const refresh = async () => {
    try {
      await keycloak.updateToken(70);
      setAuthenticated(checkAuthenticated()); // Update authenticated state after refreshing token
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };

  const contextValue: AuthContextType = {
    authenticated,
    login,
    logout,
    refresh,
    checkAuthenticated,
    keycloak,
    isFirstLogin,
    setIsFirst,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
