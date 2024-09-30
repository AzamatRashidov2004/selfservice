import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import keycloak from '../keycloak'; // Adjust the path as necessary

// Define the shape of your context data
interface AuthContextType {
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Create the context with the initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Keycloak on mount
    const initKeycloak = async () => {
      try {
        const auth = await keycloak.init({ onLoad: 'login-required' });
        setAuthenticated(auth);
        if (auth) {
          console.log('Authenticated', keycloak.tokenParsed);
        }
      } catch (err) {
        console.error('Failed to initialize Keycloak', err);
      }
    };

    initKeycloak();

    // Set up token refresh
    const refreshToken = setInterval(() => {
      keycloak.updateToken(70).catch(err => {
        console.error('Failed to refresh token', err);
      });
    }, 60000); // Refresh token every minute

    return () => clearInterval(refreshToken);
  }, []);

  // Function to handle login (not necessary to call since we do it on load)
  const login = async () => {
    try {
      await keycloak.login();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await keycloak.logout();
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Function to refresh the token
  const refresh = async () => {
    try {
      await keycloak.updateToken(70);
    } catch (error) {
      console.error('Token refresh failed', error);
    }
  };

  // Context value to provide
  const contextValue: AuthContextType = {
    authenticated,
    login,
    logout,
    refresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};