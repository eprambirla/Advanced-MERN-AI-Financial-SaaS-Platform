import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./common/routePath";

const AuthRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken && !user) return <Outlet />;

  // Allow access to password reset page if they have a valid token in URL
  if (location.pathname === AUTH_ROUTES.RESET_PASSWORD && location.search.includes("token=")) {
    return <Outlet />;
  }

  return <Navigate to={PROTECTED_ROUTES.OVERVIEW} replace />;
};

export default AuthRoute;