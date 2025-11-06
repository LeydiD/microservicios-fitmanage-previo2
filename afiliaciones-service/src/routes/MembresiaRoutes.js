import { Router } from "express";
import {
  listar,
  crear,
  buscarPorId,
  actualizar,
  desactivarMembresiaPorId,
} from "../controllers/MembresiaController.js";

const router = Router();

router.get("/", listar);
router.post("/", crear);
router.put("/:id_membresia", actualizar);
router.get("/:id_m", buscarPorId);
router.put("/desactivar/:id", desactivarMembresiaPorId);

export default router;
