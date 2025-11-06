import Suscripcion from "../models/Suscripcion.js";
import { calcularEstado } from "../models/Suscripcion.js";
import Membresia from "../models/Membresia.js";
import { Op } from "sequelize";
import apiClient from "../utils/ApiClient.js";

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../errors/Errores.js";

//Registrar nueva suscripcion
async function registrar(id_cliente, id_membresia) {
  
  if (!id_cliente || !id_membresia || isNaN(id_membresia)) {
    throw new BadRequestError("DNI o membresia no valida.");
  }
  try {

    // Verificar cliente via API Gateway
    //await apiClient.verificarClienteExiste(id_cliente);
    
    const membresia = await Membresia.findByPk(id_membresia);
    if (!membresia) {
      throw new NotFoundError("Membresia no encontrada");
    }
    const fechaInicio = new Date();
    const fechaFin = new Date(
      calcularFechafin(fechaInicio, parseInt(membresia.duracion))
    );
    //const estado = calcularEstado(fechaInicio, fechaFin);

    const suscripcion = await Suscripcion.create({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      id_cliente: id_cliente,
      id_membresia: id_membresia,
    });
    return suscripcion;
  } catch (error) {
    throw error;
  }
}

function calcularFechafin(fechaInicio, dias) {
  const nuevaFecha = new Date(fechaInicio);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
}

async function obtenerUltimaSuscripcion(id_cliente) {
  try {
    const ultimaSuscripcion = await Suscripcion.findOne({
      where: { id_cliente },
      order: [["fecha_fin", "DESC"]],
    });

    if (!ultimaSuscripcion) {
      throw new NotFoundError("No se encontró ninguna membresía activa.");
    }

    return ultimaSuscripcion;
  } catch (error) {
    throw error;
  }
}

async function verificarMembresiaExpirada(id_cliente) {
  try {
    const ultimaSuscripcion = await obtenerUltimaSuscripcion(id_cliente);

    const hoy = new Date();
    const fechaFin = new Date(ultimaSuscripcion.fecha_fin);

    return fechaFin < hoy;
  } catch (error) {
    throw error;
  }
}

async function obtenerClientesActivos() {
  const hoy = new Date();

  try {
    // Obtener suscripciones activas
    const suscripcionesActivas = await Suscripcion.findAll({
      where: {
        fecha_fin: { [Op.gte]: hoy }, // suscripción vigente
      },
      include: [{ model: Membresia }]
    });

    // Obtener información de clientes via API
    const clientesConInfo = [];
    for (const suscripcion of suscripcionesActivas) {
      try {
        const clienteInfo = await apiClient.obtenerInfoCliente(suscripcion.id_cliente);
        clientesConInfo.push({
          ...clienteInfo,
          suscripcion: {
            id_suscripcion: suscripcion.id_suscripcion,
            fecha_inicio: suscripcion.fecha_inicio,
            fecha_fin: suscripcion.fecha_fin,
            estado: suscripcion.estado,
            membresia: suscripcion.membresia
          }
        });
      } catch (error) {
        console.warn(`No se pudo obtener info del cliente ${suscripcion.id_cliente}:`, error.message);
      }
    }

    return clientesConInfo;
  } catch (error) {
    throw error;
  }
}

async function calcularDiasRestantes(id_cliente) {
  try {
    const ultimaSuscripcion = await obtenerUltimaSuscripcion(id_cliente);
    
    const hoy = new Date();
    const fechaFin = new Date(ultimaSuscripcion.fecha_fin);
    
    // Calcular diferencia en milisegundos
    const diferenciaTiempo = fechaFin.getTime() - hoy.getTime();
    
    // Convertir a días
    const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    
    // Si es negativo, la membresía ha expirado
    return Math.max(0, diasRestantes);
  } catch (error) {
    throw error;
  }
}

export default {
  registrar,
  obtenerUltimaSuscripcion,
  verificarMembresiaExpirada,
  obtenerClientesActivos,
  calcularDiasRestantes,
};
