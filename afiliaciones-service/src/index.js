// index.js
import express from "express";
import dotenv from "dotenv";
import db, { testConnection, createTables } from "./db/db.js";
import suscripcionRoutes from "./routes/SuscripcionRoutes.js";
import membresiaRoutes from "./routes/MembresiaRoutes.js";

dotenv.config();

const app = express();

// Middleware para JSON
app.use(express.json());

// Rutas del microservicio de Suscripciones
app.use("/api/suscripciones", suscripcionRoutes);
app.use("/api/membresias", membresiaRoutes);

// Puerto desde .env
const PORT = process.env.PORT || 4002;

// Probar conexión a la BD y levantar servidor
async function init() {
  try {
    await testConnection(); // Verifica conexión
    await createTables(); // Crea tablas si no existen

    app.listen(PORT, () => {
      console.log(
        `Microservicio de Suscripciones escuchando en el puerto ${PORT}`
      );
    });
  } catch (error) {
    console.error("Error iniciando el microservicio de Suscripciones:", error);
  }
}

init();
