import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  // if no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // otherwise → render the requested page
  return children;
};

export default ProtectedRoute;
