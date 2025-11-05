import express from "express";
import dotenv from "dotenv";
import os from "os";
import cors from "cors";
import axios from "axios";
import db from "./db/db.js";
import clienteRoutes from "./routes/ClienteRoutes.js";
import Administrador from "./models/Administrador.js";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config({
    path: "./.env",
});

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));


db.authenticate()
    .then(() => console.log("Databse connection successful"))
    .catch((error) => console.log("Connection error: ", error));

// para la creacion de la bd 
db.sync()
    .then(() => console.log("Database synchronized"))
    .catch((error) => console.log("Error synchronizing database: ", error));

async function main() {
    try {
        await db.sync({ force: false });
        console.log("Tablas creadas exitosamente B)")
    } catch (error) {
        console.log(error.message);
    }
}

main();


const interfaces = os.networkInterfaces();
let localIP = "localhost"; // fallback

for (let name in interfaces) {
    for (let iface of interfaces[name]) {
        if (
            iface.family === "IPv4" &&
            !iface.internal &&
            iface.address.startsWith("192.168")
        ) {
            localIP = iface.address;
        }
    }
}

app.listen(process.env.PORT, () => {
    console.log(`API escuchando en http://localhost:${process.env.PORT}`);
});


// Health check endpoint para Consul
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'usuarios-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/clientes", clienteRoutes);
app.use("/auth", authRoutes);

// Registrar servicio en Consul
async function registerInConsul() {
  const consulUrl = `http://${process.env.CONSUL_HOST || 'consul'}:${process.env.CONSUL_PORT || 8500}`;
  
  try {
    await axios.put(`${consulUrl}/v1/agent/service/register`, {
      ID: 'usuarios-service-instance',
      Name: 'usuarios-service',
      Address: 'usuarios_service',
      Port: parseInt(process.env.PORT || 4001),
      Check: {
        HTTP: `http://usuarios_service:${process.env.PORT || 4001}/health`,
        Interval: '10s',
        Timeout: '5s'
      }
    });
    console.log('✅ Usuarios-service registrado en Consul');
  } catch (error) {
    console.error('❌ Error registrando en Consul:', error.message);
  }
}

// Registrar en Consul después de 5 segundos
setTimeout(registerInConsul, 5000);
