import axios from "axios";
import Suscripcion from "../models/Suscripcion.js";
import Membresia from "../models/Membresia.js";
import { NotFoundError, BadRequestError } from "../errors/Errores.js";
import { Op } from "sequelize";

const USUARIOS_MS_URL = process.env.USUARIOS_MS_URL;

// utilidad para calcular fecha fin a partir de días
function calcularFechaFin(fechaInicio, duracionDias) {
  const fin = new Date(fechaInicio);
  fin.setDate(fin.getDate() + duracionDias);
  return fin;
}

// utilidad para calcular dias restantes desde ahora hasta fechaFin
function calcularDiasRestantes(fechaFin) {
  if (!fechaFin) return 0;
  const hoy = new Date();
  const fin = new Date(fechaFin);
  const diff = fin - hoy; // ms
  const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return dias > 0 ? dias : 0;
}

// Registrar nueva suscripción
async function registrar(id_cliente, id_membresia) {
  if (!id_cliente || !id_membresia) {
    throw new BadRequestError(
      "Datos incompletos: cliente o membresía faltante"
    );
  }

  // validar cliente en microservicio Usuarios
  try {
    const clienteResp = await axios.get(
      `${USUARIOS_MS_URL}/clientes/${id_cliente}`
    );
    if (!clienteResp.data)
      throw new NotFoundError("Cliente no encontrado en Usuarios MS");
  } catch (err) {
    // si la llamada devolvió 404 o no responde, estandarizamos el error
    if (err.response && err.response.status === 404) {
      throw new NotFoundError("Cliente no encontrado en Usuarios MS");
    }
    throw new Error("Error validando cliente en Usuarios MS");
  }

  // validar membresía localmente
  const membresia = await Membresia.findByPk(id_membresia);
  if (!membresia) throw new NotFoundError("Membresía no encontrada");

  // calcular fecha fin (asumimos que membresia.duracion es número de días o "X meses")
  let dias = parseInt(membresia.duracion, 10);
  if (isNaN(dias)) {
    // si viene como "3 meses", extraemos número y convertimos a días (aprox 30 días/mes)
    const match = String(membresia.duracion).match(/\d+/);
    dias = match ? parseInt(match[0], 10) * 30 : 0;
  }

  const fechaInicio = new Date();
  const fechaFin = calcularFechaFin(fechaInicio, dias);

  const suscripcion = await Suscripcion.create({
    id_cliente,
    id_membresia,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    estado: calcularDiasRestantes(fechaFin) > 0 ? "activo" : "vencido",
  });

  return suscripcion;
}

// Obtener todas las suscripciones de un cliente (ordenadas desc por fecha_fin)
async function suscripcionesDeCliente(id_cliente) {
  if (!id_cliente) throw new BadRequestError("ID de cliente vacío");

  const suscripciones = await Suscripcion.findAll({
    where: { id_cliente },
    include: [Membresia],
    order: [["fecha_fin", "DESC"]],
  });

  return suscripciones.map((s) => ({
    id: s.id_suscripcion,
    id_cliente: s.id_cliente,
    id_membresia: s.id_membresia,
    tipo_membresia: s.membresia?.tipo || "No tiene",
    fecha_inicio: s.fecha_inicio,
    fecha_fin: s.fecha_fin,
    estado: calcularDiasRestantes(s.fecha_fin) > 0 ? "activo" : "vencido",
    dias_restantes: calcularDiasRestantes(s.fecha_fin),
  }));
}

// Última suscripción (la más reciente por fecha_fin)
async function ultimaSuscripcion(id_cliente) {
  const suscripciones = await Suscripcion.findAll({
    where: { id_cliente },
    include: [Membresia],
    order: [["fecha_fin", "DESC"]],
    limit: 1,
  });

  if (!suscripciones || suscripciones.length === 0) return null;

  const s = suscripciones[0];
  return {
    id: s.id_suscripcion,
    id_cliente: s.id_cliente,
    id_membresia: s.id_membresia,
    tipo_membresia: s.membresia?.tipo || "No tiene",
    fecha_inicio: s.fecha_inicio,
    fecha_fin: s.fecha_fin,
    estado: calcularDiasRestantes(s.fecha_fin) > 0 ? "activo" : "vencido",
    dias_restantes: calcularDiasRestantes(s.fecha_fin),
  };
}

// Devuelve solo los días restantes de la última suscripción de un cliente (0 si no tiene o vencida)
async function diasRestantesCliente(id_cliente) {
  if (!id_cliente) throw new BadRequestError("ID de cliente vacío");

  const ultima = await ultimaSuscripcion(id_cliente);
  if (!ultima) return 0;

  return calcularDiasRestantes(ultima.fecha_fin);
}

export default {
  registrar,
  suscripcionesDeCliente,
  ultimaSuscripcion,
  diasRestantesCliente,
  // exportamos util por si lo usas en otro lugar
  calcularDiasRestantes,
};
