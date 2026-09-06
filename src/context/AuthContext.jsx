
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Permissions are returned from backend as an object
  const [permissions, setPermissions] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken && !refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me/");

        console.log("AUTH USER:", response.data.user);
        console.log("AUTH PERMISSIONS:", response.data.permissions);

        setUser(response.data.user || null);
        setPermissions(response.data.permissions || {});
      } catch (error) {
        console.error("Auth initialization failed:", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
        setPermissions({});
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/auth/login/", {
      username,
      password,
    });

    const data = response.data;

    const accessToken = data.tokens?.access;
    const refreshToken = data.tokens?.refresh;

    if (!accessToken || !refreshToken) {
      throw new Error(
        "Login successful, but authentication tokens were not received."
      );
    }

    // Save JWT tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(data.user || null);

    // Load complete user information + permissions
    try {
      const meResponse = await api.get("/auth/me/");

      console.log("LOGIN USER:", meResponse.data.user);
      console.log("LOGIN PERMISSIONS:", meResponse.data.permissions);

      setUser(meResponse.data.user || data.user || null);
      setPermissions(meResponse.data.permissions || {});
    } catch (error) {
      console.error("Permission loading failed:", error);
      setPermissions({});
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);
    setPermissions({});

    window.location.href = "/login";
  };

  const contextValue = {
    user,
    permissions,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;

