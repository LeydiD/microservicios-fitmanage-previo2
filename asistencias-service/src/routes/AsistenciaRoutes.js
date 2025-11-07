import { Router } from "express";
import AsistenciaController from "../controllers/AsistenciaController.js";

const router = Router();

router.post("/", AsistenciaController.registrarAsistencia);
router.get("/semanal/:dni", AsistenciaController.obtenerAsistenciaSemanal);
router.get("/:dni", AsistenciaController.listarAsistenciasPorCliente);

export default router;
