import { Router } from "express";
import SuscripcionController from "../controllers/SuscripcionController.js";

const router = Router();

router.post("/", SuscripcionController.registrar);
router.get("/cliente/:id", SuscripcionController.obtenerPorCliente);
router.get("/cliente/:id/ultima", SuscripcionController.ultima);
router.get("/cliente/:id/activa", SuscripcionController.verificarActiva);

// NUEVA RUTA
router.get("/cliente/:id/dias", SuscripcionController.diasRestantes);

export default router;
