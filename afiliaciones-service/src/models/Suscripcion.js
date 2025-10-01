import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Membresia from "./Membresia.js";

const Suscripcion = db.define(
  "suscripcion",
  {
    id_suscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false, // viene del microservicio de Usuarios
    },
    id_membresia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Membresia,
        key: "id_membresia",
      },
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("activo", "inactivo", "vencido"),
      defaultValue: "activo",
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Relación con Membresia
Membresia.hasMany(Suscripcion, { foreignKey: "id_membresia" });
Suscripcion.belongsTo(Membresia, { foreignKey: "id_membresia" });

// Función para calcular estado dinámicamente
export function calcularEstado(fechaInicio, fechaFin) {
  const ahora = new Date();
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (ahora < inicio) return "inactivo";
  if (ahora > fin) return "vencido";
  return "activo";
}

export default Suscripcion;
