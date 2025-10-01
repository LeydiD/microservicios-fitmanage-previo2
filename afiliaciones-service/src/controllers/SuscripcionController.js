import SuscripcionService from "../services/SuscripcionService.js";

export async function registrar(req, res) {
  try {
    const { id_cliente, id_membresia } = req.body;
    const nueva = await SuscripcionService.registrar(id_cliente, id_membresia);
    res.status(201).json(nueva);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error interno" });
  }
}

export async function obtenerPorCliente(req, res) {
  try {
    const { id } = req.params;
    const suscripciones = await SuscripcionService.suscripcionesDeCliente(id);
    res.status(200).json(suscripciones);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error interno" });
  }
}

export async function ultima(req, res) {
  try {
    const { id } = req.params;
    const ultima = await SuscripcionService.ultimaSuscripcion(id);
    res.status(200).json(ultima);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error interno" });
  }
}

// NUEVO: endpoint que devuelve solo los días restantes (número)
export async function diasRestantes(req, res) {
  try {
    const { id } = req.params;
    const dias = await SuscripcionService.diasRestantesCliente(id);
    res.status(200).json({ id_cliente: id, dias_restantes: dias });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: error.message || "Error interno" });
  }
}

export default {
  registrar,
  obtenerPorCliente,
  ultima,
  diasRestantes,
};
