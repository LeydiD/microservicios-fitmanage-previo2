import { DataTypes } from "sequelize";
import db from "../db/db.js";

const Cliente = db.define(
  "cliente",
  {
    DNI: { type: DataTypes.STRING(20), primaryKey: true, unique: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    telefono: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(100) },
    edad: { type: DataTypes.INTEGER },
    peso: { type: DataTypes.DECIMAL(5, 2) },
    altura: { type: DataTypes.DECIMAL(5, 2) },
    contraseña: { type: DataTypes.STRING(255) },
    objetivo: { type: DataTypes.STRING(100) },
    es_referido: {type: DataTypes.BOOLEAN, defaultValue: false },
    cantidad_referidos: { type: DataTypes.INTEGER(2), defaultValue: 0}
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

Cliente.hasMany(Cliente, {
  foreignKey: 'id_referido' 
});

Cliente.belongsTo(Cliente, {
  foreignKey: 'id_referido'
});

export default Cliente;
