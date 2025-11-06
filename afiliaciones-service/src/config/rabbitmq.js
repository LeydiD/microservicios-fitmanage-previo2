import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

let connection = null;
let channel = null;

// Construye la URL desde las variables de entorno
const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "rabbitmq";
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || "5672";
const RABBITMQ_USER = process.env.RABBITMQ_USER || "admin";
const RABBITMQ_PASS = process.env.RABBITMQ_PASS || "admin123";

const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

async function connect() {
  try {
    console.log(`🔌 Conectando a RabbitMQ en ${RABBITMQ_HOST}:${RABBITMQ_PORT}...`);
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("✅ Conectado a RabbitMQ exitosamente");

    // Manejo de errores de conexión
    connection.on("error", (err) => {
      console.error("❌ Error en conexión RabbitMQ:", err);
    });

    connection.on("close", () => {
      console.log("⚠️  Conexión a RabbitMQ cerrada. Reconectando en 5s...");
      channel = null;
      connection = null;
      setTimeout(connect, 5000);
    });

    return channel;
  } catch (error) {
    console.error("❌ Error conectando a RabbitMQ:", error.message);
    console.error("Verifica que RabbitMQ esté corriendo y las credenciales sean correctas");
    console.log("⏳ Reintentando conexión en 5 segundos...");
    setTimeout(connect, 5000);
    return null;
  }
}

async function getChannel() {
  if (!channel) {
    await connect();
  }
  return channel;
}

async function closeConnection() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("🔌 Conexión a RabbitMQ cerrada");
  } catch (error) {
    console.error("Error cerrando conexión:", error);
  }
}

export { connect, getChannel, closeConnection };