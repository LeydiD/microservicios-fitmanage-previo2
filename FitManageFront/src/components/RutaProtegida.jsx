import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const RutaProtegida = ({ rolRequerido }) => {
  const { role, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="cargando">Cargando...</div>;
  }

  if (!role) {
    // Guarda la ruta actual como `state.from` para redirigir luego del login
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (role !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RutaProtegida;
