// index.js
import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { testConnection, createTables } from "./db/db.js";
import asistenciaRoutes from "./routes/AsistenciaRoutes.js";
import { connect } from "./config/rabbitmq.js";
import { setupPublisher } from "./asistenciaPublisher.js";

dotenv.config();

const app = express();
app.use(express.json());

// Health check para Consul
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "asistencias-service",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rutas del microservicio de asistencias
app.use("/asistencias", asistenciaRoutes);

const PORT = process.env.PORT || 4003;



async function init() {
  try {
    await testConnection();
    await createTables();

    // Levantar el servidor HTTP primero, para que el gateway pueda enrutar de inmediato
    app.listen(PORT, () => {
      console.log(`Microservicio de Asistencias escuchando en el puerto ${PORT}`);
      // Registrar en Consul después de un pequeño delay
      setTimeout(registerInConsul, 5000);
    });

    // Conectar a RabbitMQ de forma no bloqueante
    (async () => {
      try {
        console.log("📡 Conectando a RabbitMQ...");
        await connect();
        console.log("📤 Configurando publisher...");
        await setupPublisher();
        console.log("✅ RabbitMQ listo en asistencias-service");
      } catch (error) {
        console.error("❌ RabbitMQ no disponible por ahora en asistencias-service:", error.message);
      }
    })();
  } catch (error) {
    console.error("Error iniciando el microservicio de Asistencias:", error);
  }
}

async function registerInConsul() {
  const consulUrl = `http://${process.env.CONSUL_HOST || "consul"}:${process.env.CONSUL_PORT || 8500}`;
  try {
    await axios.put(`${consulUrl}/v1/agent/service/register`, {
      ID: "asistencias-service-instance",
      Name: "asistencias-service",
      Address: "asistencias_service",
      Port: parseInt(PORT),
      Check: {
        HTTP: `http://asistencias_service:${PORT}/health`,
        Interval: "10s",
        Timeout: "5s",
      },
    });
    console.log("✅ Asistencias-service registrado en Consul");
  } catch (error) {
    console.error("❌ Error registrando en Consul:", error.message);
  }
}

init();

// Manejo de cierre graceful
process.on("SIGINT", async () => {
  console.log("\n⚠️  Cerrando aplicación...");
  const { closeConnection } = await import("./config/rabbitmq.js");
  await closeConnection();
  process.exit(0);
});
