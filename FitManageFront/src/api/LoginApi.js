import { API_BASE_URL } from '../config/apiConfig.js';

const API_URL = API_BASE_URL;
const API_URL_LOGIN = `${API_URL}/usuarios/auth/login`;

//const API_URL = "https://fitmanageback-production.up.railway.app/auth/login";

console.log("URL del backend:", API_URL);

export const login = async ({ DNI, contraseña }) => {
  try {
    const response = await fetch(API_URL_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ DNI, contraseña }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error en el inicio de sesión");
    }
    return data;
  } catch (error) {
    console.error("Error en login:", error.message);
    throw error;
  }
};

export const cambiarAvatar = async ({ DNI, avatar }) => {
  const API_URL_AVATAR = `${API_URL}/auth/cambiar-avatar/${DNI}`;
  console.log("URL a la que se hace la petición:", API_URL_AVATAR);
  try {
    const response = await fetch(API_URL_AVATAR, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar avatar");
    }

    return data;
  } catch (error) {
    console.error("Error al cambiar avatar:", error.message);
    throw error;
  }
};
