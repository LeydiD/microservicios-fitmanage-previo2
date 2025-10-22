import { createContext, useEffect, useState } from "react";
import { obtenerClientePorDNI } from "../api/ClienteApi.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullUserData = async () => {
      if (role === "Cliente" && user && user.DNI && !user.altura) {
        try {
          const datosCompletos = await obtenerClientePorDNI(user.DNI);
          setUser(datosCompletos);
        } catch (error) {
          console.error(
            "Error al obtener los datos completos del usuario:",
            error
          );
          setUser(null);
          setRole(null);
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("DNI");
        }
      }
      setLoading(false);
    };

    fetchFullUserData();
  }, [user, role]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("DNI");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, role, setRole, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
