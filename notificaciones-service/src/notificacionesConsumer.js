import { getChannel } from "./config/rabbitmq.js";
import dotenv from "dotenv";
import { enviarCorreo } from "./services/EmailService.js";

dotenv.config();

const EXCHANGE = "asistencias_exchange";
const ASISTENCIA_ROUTING_KEY = "asistencia.creada";

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
    const QUEUE_NAME = "asistencia_clientes_queue";
    await channel.assertQueue(QUEUE_NAME, { 
      durable: true  // La cola persiste aunque el servicio se reinicie
    });

    // 3. Bind a las routing keys que nos interesan
    await channel.bindQueue(QUEUE_NAME, EXCHANGE, ASISTENCIA_ROUTING_KEY);

    console.log(`📥 [Afiliaciones Consumer] Esperando mensajes en cola: ${QUEUE_NAME}`);
    console.log(`   - Exchange: ${EXCHANGE}`);
    console.log(`   - Escuchando: ${ASISTENCIA_ROUTING_KEY}`);

    // 4. Configurar prefetch (procesar un mensaje a la vez)
    channel.prefetch(1);

    // 5. Consumir mensajes
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString());

          //aca debo poner lo de que se le registra una membresia de dos días
          if (payload.evento === "asistencia.creada") {
            const nofiticacion = await enviarCorreo('lizethdanielavb@gmail.com', "Entrenenar a un nuevo referido", `Debes entrenar al nuevo cliente referido con el DNI: ${payload.data.dni_cliente}`)
            if(!nofiticacion){
              throw new Error ("Error al crear la notifi");
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