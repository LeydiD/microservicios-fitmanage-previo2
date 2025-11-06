import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    define: { timestamps: false },
  }
);

// Función para probar conexión
export async function testConnection() {
  try {
    await db.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
}

// Función para crear tablas
export async function createTables() {
  try {
    await db.sync({ alter: false }); // alter: true actualiza tablas existentes
    console.log("Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("Error al sincronizar tablas:", error);
    throw error;
  }
}

export default db;
