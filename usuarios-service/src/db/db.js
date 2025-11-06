import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({
    path: "../.env"
});


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

// (async () => {
//   try {
//     await db.authenticate();
//     console.log("Conexión a la base de datos exitosa.");
//   } catch (error) {
//     console.error("Error al conectar a la base de datos:", error);
//   }
// })();
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error(" Error al conectar a la base de datos:", error);
  }
}

export default db;