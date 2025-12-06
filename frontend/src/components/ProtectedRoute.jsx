import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <div>Access denied</div>;
  }

  return children;
};

export default ProtectedRoute;
