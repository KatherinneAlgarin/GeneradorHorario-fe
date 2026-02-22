import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { getUserRole } from "../services/authService";

const RoleRoute = ({ allowedRoles, children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const userRole = await getUserRole();
      setRole(userRole?.rol);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!role) {
  return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {

    if (role === "admin_general") {
      return <Navigate to="/admin" />;
    }

    if (role === "decano") {
      return <Navigate to="/decano" />;
    }
  
    if (role === "docente") {
      return <Navigate to="/docente" />;
    }
  
    return <Navigate to="/login" />;
}

  return children;
};

export default RoleRoute;