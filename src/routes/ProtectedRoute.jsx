import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Wait until authentication/session check is completed
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2F6FED] border-t-transparent rounded-full animate-spin" />

          <p className="text-sm font-medium text-[#7A7A7A]">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated
  if (isAuthenticated) {
    return <Outlet />;
  }

  // User is not authenticated
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;