import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Not authenticated and not on login/register → send to login
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Not authenticated but on login/register → allow access
  if (
    !isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    return <>{children}</>;
  }

  // Authenticated user checks
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Redirect normal user away from login/register after auth
  if (
    isAuthenticated &&
    user?.role === "user" &&
    (location.pathname === "/auth/login" || location.pathname === "/auth/register")
  ) {
    return <Navigate to="/shop/home" />;
  }

  // Redirect admin away from login/register after auth
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    (location.pathname === "/auth/login" || location.pathname === "/auth/register")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
