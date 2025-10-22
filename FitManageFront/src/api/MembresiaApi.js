const API_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL_MEMBRESIAS = `${API_URL}/membresias`;

export async function obtenerMembresias() {
  try {
    const response = await fetch(`${API_URL_MEMBRESIAS}`);
    if (!response.ok) {
      throw new Error("Error al obtener las membresías");
    }
    const data = await response.json();
    console.log(response.json);
    return data;
  } catch (error) {
    console.error("Error en la API de membresías:", error);
    throw error;
  }
}

export async function crearMembresia(membresia) {
  try {
    const response = await fetch(`${API_URL_MEMBRESIAS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(membresia),
    });

    if (!response.ok) {
      throw new Error("Error al crear la membresía");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la membresía:", error);
    throw error;
  }
}

export async function actualizarMembresia(id_membresia, membresia) {
  try {
    const response = await fetch(`${API_URL_MEMBRESIAS}/${id_membresia}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(membresia),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la membresía");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar la membresía:", error);
    throw error;
  }
}


export async function desactivarMembresia(id_membresia) {
  try {
    const response = await fetch(`${API_URL_MEMBRESIAS}/desactivar/${id_membresia}`, {
      method: "PUT"
    });

    if (!response.ok) {
      throw new Error("Error al desactivar la membresía");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al desactivar la membresía:", error);
    throw error;
  }
}