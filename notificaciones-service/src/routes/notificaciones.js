import { Router } from "express";
import { enviarCorreoController } from "../controllers/NotificacionController.js";

const router = Router();

router.post("/email", enviarCorreoController);

export default router;
