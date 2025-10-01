import { enviarCorreo } from "../services/EmailService.js";

export async function enviarCorreoController(req, res) {
  try {
    const { destinatario, asunto, mensaje } = req.body;

    const resultado = await enviarCorreo(destinatario, asunto, mensaje);

    res.status(200).json({
      message: "Correo enviado correctamente",
      resultado,
    });
  } catch (error) {
    console.error("Error en enviarCorreoController:", error);
    res.status(500).json({ message: "Error enviando correo", error: error.message });
  }
}
