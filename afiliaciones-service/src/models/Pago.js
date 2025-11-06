import { DataTypes } from "sequelize";
import db from "../db/db.js";
import Membresia from "./Membresia.js";

const Pago = db.define("pago", {
    id_pago: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, 
    id_cliente: {
        type: DataTypes.INTEGER, 
        allowNull: false // Referencia al microservicio de usuarios (solo ID)
    },
    id_membresia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Membresia,
            key: "id_membresia"
        }
    },
    fecha_pago: {type: DataTypes.DATEONLY, allowNull: false}
}, {
    timestamps: false, 
    freezeTableName: true
});

// Relación solo con Membresia (propio del microservicio)
Membresia.hasMany(Pago, {
    foreignKey: "id_membresia"
});
Pago.belongsTo(Membresia, {
    foreignKey: "id_membresia"
});

// NOTA: id_cliente es solo una referencia al microservicio de usuarios
// No creamos relación Sequelize porque Cliente no existe en este microservicio

export default Pago;