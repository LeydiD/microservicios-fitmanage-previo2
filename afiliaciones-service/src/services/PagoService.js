import Membresia from "../models/Membresia.js";
import Suscripcion from "../models/Suscripcion.js";
import Pago from "../models/Pago.js";
import apiClient from "../utils/ApiClient.js";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  Conflict,
} from "../errors/Errores.js";
import SuscripcionService from "./SuscripcionService.js";

//Registrar un nuevo pago, al hacerlo debo también registrar que el cliente adquirió una nuva suscripción
async function registrar(cliente_id, membresia_id) {
  //valido los datos
  if (!cliente_id) {
    throw new BadRequestError("Cliente inválido");
  }
  if (!membresia_id) {
    throw new BadRequestError("Membresia inválida");
  }
  try {
    // Verificar cliente via API Gateway
    const cliente = await apiClient.verificarClienteExiste(cliente_id);
    
    // Verificar si el cliente ya tiene una membresía activa
    const tieneMembresiaActiva = await apiClient.verificarMembresiaActiva(cliente_id);
    if (tieneMembresiaActiva) {
      throw new Conflict("El cliente ya cuenta con una membresia activa");
    }

    const membresia = await Membresia.findByPk(membresia_id);
    if (!membresia) {
      throw new NotFoundError("Membresia no encontrada");
    }
    const pago = await Pago.create({
      fecha_pago: new Date(),
      id_cliente: cliente_id,
      id_membresia: membresia_id,
    });
    SuscripcionService.registrar(cliente_id, membresia_id);
    return pago;
  } catch (error) {
    throw error;
  }
}

export default {
  registrar,
};
