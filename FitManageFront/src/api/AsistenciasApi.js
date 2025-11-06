import { API_BASE_URL } from '../config/apiConfig.js';

const API_URL = `${API_BASE_URL}/asistencias/asistencias`;

export const registrarAsistencia = async () => {
  try {
    const dni = localStorage.getItem("DNI");
    if (!dni) {
      throw new Error("No se encontró el DNI en el almacenamiento local");
    }
    
    console.log('🎯 Registrando asistencia:', {
      dni,
      apiUrl: API_URL,
      fullUrl: `${API_URL}`
    });
    
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_cliente: dni,
      }),
    });

    if (!response.ok) {
      let message = "Error al registrar asistencia";
      try {
        const errorData = await response.json();
        message = errorData?.message || message;
      } catch (_) {
        try {
          const text = await response.text();
          if (text) message = text;
        } catch (_) {}
      }
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en registrarAsistencia:", error);
    throw error;
  }
};

export async function obtenerAsistenciasPorCliente(dni) {
  try {
    const response = await fetch(`${API_URL}/${dni}`);
    if (!response.ok) throw new Error("Error al obtener asistencias");
    const fechas = await response.json();
    return fechas;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function obtenerAsistenciasSemanal(dni) {
  try {
    const response = await fetch(`${API_URL}/semanal/${dni}`);
    if (!response.ok) throw new Error("Error al obtener asistencias");
    const fechas = await response.json();
    return fechas;
  } catch (error) {
    throw new Error("Error al obtener asistencias semanales: " + error.message);
  }
}

