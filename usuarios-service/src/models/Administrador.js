import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Administrador = db.define(
  "administrador",
  {
    DNI: { type: DataTypes.STRING(20), primaryKey: true, unique: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    contraseña: { type: DataTypes.STRING(255), allowNull: false },
    avatar: { type: DataTypes.STRING(400), allowNull: true },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

export default Administrador;
