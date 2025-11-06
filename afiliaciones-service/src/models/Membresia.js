import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Membresia = db.define(
  "membresia",
  {
    id_membresia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: { type: DataTypes.STRING(50), allowNull: false },
    duracion: { type: DataTypes.STRING(50), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    activa: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export function calcularDuracionEnDias(duracionT) {
  const match = duracionT.match(/\d+/);
  return duracionT.includes("meses") ? parseInt(match) * 30 : duracionT;
}

export default Membresia;
