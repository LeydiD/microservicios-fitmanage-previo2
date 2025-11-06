import { getChannel } from "./config/rabbitmq.js";
import dotenv from "dotenv";

dotenv.config();

// Configuración del Exchange y Routing Keys
const EXCHANGE = process.env.CLIENTES_EXCHANGE || "clientes_exchange";
const CLIENTE_REFERIDO_ROUTING_KEY = process.env.CLIENTE_REFERIDO_ROUTING_KEY || "cliente.referido.creado";

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

async function publicarClienteReferidoCreado(clienteReferidoData) {
  try {
    const channel = await getChannel();
    if (!channel) {
      console.error("❌ Canal no disponible, no se pudo publicar mensaje");
      return false;
    }
    
    const mensaje = {
      evento: "cliente.referido.creado",
      timestamp: new Date().toISOString(),
      data: {
        DNI: clienteReferidoData.DNI,
        nombre: clienteReferidoData.nombre,
        email: clienteReferidoData.email,
        telefono: clienteReferidoData.telefono,
        edad: clienteReferidoData.edad,
        peso: clienteReferidoData.peso,
        altura: clienteReferidoData.altura,
        id_referido: clienteReferidoData.id_referido, // DNI de quien lo refirió
        es_referido: true
      }
    };

    const mensajeBuffer = Buffer.from(JSON.stringify(mensaje));
    
    channel.publish(
      EXCHANGE,
      CLIENTE_REFERIDO_ROUTING_KEY,
      mensajeBuffer,
      { persistent: true }
    );

    console.log(`📨 Mensaje publicado: Cliente referido ${clienteReferidoData.DNI} creado (referido por ${clienteReferidoData.id_referido})`);
    return true;
  } catch (error) {
    console.error("❌ Error publicando mensaje cliente referido:", error);
    return false;
  }
}

export { 
  setupPublisher,  
  publicarClienteReferidoCreado 
};