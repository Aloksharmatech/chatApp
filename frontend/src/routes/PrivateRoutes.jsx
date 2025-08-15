import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { isAuthenticated, isBootstrapped } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (!isBootstrapped) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoutes;
