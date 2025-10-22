import axios from "axios";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/usuarios`;

//const API_URL = "https://fitmanageback-production.up.railway.app/auth/forgot-password";

export const solicitarRecuperacion = async (dni, email) => {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { dni, email });
  return res.data;
};
