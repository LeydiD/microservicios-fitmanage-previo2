const API_URL =   `${import.meta.env.VITE_BACKEND_URL}/pagos`;

export const registrarPago = async ({ id_cliente, id_membresia}) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_cliente: id_cliente,         
          id_membresia: id_membresia
        }),
      });
  
      const data = await response.json();

      if (!response.ok) {
        console.log("Response status:", response.status);
         console.log("Raw response:", data);
        throw new Error(data.message || "Error en la solicitud al registrar el pago.");
      }
      return data;
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      throw error;
    }
  };
  