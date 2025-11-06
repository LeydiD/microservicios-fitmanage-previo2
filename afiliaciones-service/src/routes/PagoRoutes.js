import { Router } from "express";
import PagoController from "../controllers/PagoController.js";

const router = Router();

router.post("/", PagoController.registrar);

export default router;