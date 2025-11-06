import { getChannel } from "./config/rabbitmq.js";
import dotenv from "dotenv";
import PagoService from "./services/PagoService.js";

dotenv.config();

const EXCHANGE = process.env.CLIENTES_EXCHANGE || "clientes_exchange";
const CLIENTE_REFERIDO_ROUTING_KEY = process.env.CLIENTE_REFERIDO_ROUTING_KEY || "cliente.referido.creado";

/**
 * Inicia el consumer para escuchar eventos de clientes
 * y crear membresías automáticamente
 */
async function startClienteConsumer() {
  try {
    const channel = await getChannel();
    if (!channel) {
      throw new Error("No se pudo obtener el canal de RabbitMQ");
    }

    // 1. Declarar el exchange
    await channel.assertExchange(EXCHANGE, "topic", { durable: true });

    // 2. Crear cola con nombre específico para afiliaciones
    // Usamos nombre fijo para que persista entre reinicios
    const QUEUE_NAME = "afiliaciones_clientes_queue";
    await channel.assertQueue(QUEUE_NAME, { 
      durable: true  // La cola persiste aunque el servicio se reinicie
    });

    // 3. Bind a las routing keys que nos interesan
    await channel.bindQueue(QUEUE_NAME, EXCHANGE, CLIENTE_REFERIDO_ROUTING_KEY);

    console.log(`📥 [Afiliaciones Consumer] Esperando mensajes en cola: ${QUEUE_NAME}`);
    console.log(`   - Exchange: ${EXCHANGE}`);
    console.log(`   - Escuchando: ${CLIENTE_REFERIDO_ROUTING_KEY}`);

    // 4. Configurar prefetch (procesar un mensaje a la vez)
    channel.prefetch(1);

    // 5. Consumir mensajes
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString());
          console.log(`\n📩 [Afiliaciones] Mensaje recibido: ${payload.evento}`);
          console.log(`   Cliente: ${payload.data.DNI} - ${payload.data.nombre}`);

          //aca debo poner lo de que se le registra una membresia de dos días 
          // Procesar según el tipo de evento
  
           if (payload.evento === "cliente.referido.creado") {
           const pagoRegistrado =  await PagoService.registrar(payload.data.DNI, 5);
           if(!pagoRegistrado){
            throw new Error ("Error al creal el pago");
           }
          }

          // Confirmar mensaje procesado exitosamente
          channel.ack(msg);
          console.log(`✅ [Afiliaciones] Mensaje procesado exitosamente\n`);

        } catch (error) {
          console.error("❌ [Afiliaciones] Error procesando mensaje:", error.message);
          
          // Rechazar mensaje sin reencolar para evitar loops infinitos
          // Si quieres reintentar, usa: channel.nack(msg, false, true);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false } // Confirmación manual
    );

  } catch (error) {
    console.error("❌ [Afiliaciones] Error iniciando consumer:", error);
    console.log("⏳ Reintentando en 5 segundos...");
    setTimeout(startClienteConsumer, 5000);
  }
}

export default startClienteConsumer;