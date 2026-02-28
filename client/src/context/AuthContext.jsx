import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        console.log(
          "Initializing auth - token:",
          !!storedToken,
          "user:",
          !!savedUser,
        );

        if (storedToken && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log("Setting user from localStorage:", parsedUser);
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("🔐 Starting login...");
      const response = await authService.login(email, password);
      console.log("📦 Raw response from API:", response);
      console.log("📦 Response structure:", JSON.stringify(response, null, 2));

      // Response is already unwrapped by interceptor
      // response = { data: { user, token }, success, message }
      const authToken = response.data?.token || response.token;
      const userData = response.data?.user || response.user;

      console.log("🔑 Token:", authToken ? "Found" : "Missing");
      console.log("👤 User data:", userData);

      if (!authToken || !userData) {
        console.error("❌ Missing token or user data");
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);

      console.log("✅ Login successful, user set:", userData);
      console.log(
        "✅ Token stored:",
        localStorage.getItem("token") ? "Yes" : "No",
      );
      console.log(
        "✅ User stored:",
        localStorage.getItem("user") ? "Yes" : "No",
      );

      return response;
    } catch (error) {
      console.error("❌ Login error in AuthContext:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Response is already unwrapped by interceptor
    const authToken = response.data?.token || response.token;
    const user = response.data?.user || response.user;

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(authToken);
    setUser(user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
