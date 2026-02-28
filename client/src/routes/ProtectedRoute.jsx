import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log("🛡️ ProtectedRoute check:", {
    isAuthenticated,
    loading,
    hasUser: !!user,
    user: user,
  });

  if (loading) {
    console.log("⏳ Still loading...");
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;
