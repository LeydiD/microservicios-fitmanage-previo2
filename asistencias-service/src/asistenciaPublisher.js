import { getChannel } from "./config/rabbitmq.js";
import dotenv from "dotenv";

dotenv.config();

// Configuración del Exchange y Routing Keys
const EXCHANGE =  "asistencias_exchange";
const ASISTENCIA_ROUTING_KEY =  "asistencia.creada";

/**
 * Configura el publisher declarando el exchange
 */
async function setupPublisher() {
  try {
    const channel = await getChannel();
    if (!channel) {
      throw new Error("No se pudo obtener el canal de RabbitMQ");
    }
    
    // Declarar exchange tipo topic
    await channel.assertExchange(EXCHANGE, "topic", { durable: true });
    
    console.log(`📤 Publisher configurado en exchange: ${EXCHANGE}`);
    return true;
  } catch (error) {
    console.error("❌ Error configurando publisher:", error);
    throw error;
  }
}

async function publicarAsistenciaCreada(asistenciaData) {
  try {
    const channel = await getChannel();
    if (!channel) {
      console.error("❌ Canal no disponible, no se pudo publicar mensaje");
      return false;
    }
    
    const mensaje = {
      evento: "asistencia.creada",
      timestamp: new Date().toISOString(),
      data: {
        id_asistencia: asistenciaData.id_asistencia, 
        fecha: asistenciaData.fecha, 
        dni_cliente: asistenciaData.dni_cliente
      }
    };

    const mensajeBuffer = Buffer.from(JSON.stringify(mensaje));
    
    channel.publish(
      EXCHANGE,
      ASISTENCIA_ROUTING_KEY,
      mensajeBuffer,
      { persistent: true }
    );

    console.log(`📨 Mensaje publicado: ${JSON.stringify(mensaje)}`); 
    return true;
  } catch (error) {
    console.error("❌ Error publicando mensaje cliente referido:", error);
    return false;
  }
}

export { 
  setupPublisher,  
  publicarAsistenciaCreada  
};