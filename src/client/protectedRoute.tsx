import { Navigate, Outlet } from "react-router-dom";
import Header from "./header";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const isAuthenticated = !!Cookies.get("accessToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
