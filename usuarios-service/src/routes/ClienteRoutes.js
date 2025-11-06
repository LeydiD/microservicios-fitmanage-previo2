import { Router } from "express";
import { listar, buscarPorCedula, registrar, actualizarCliente, crearContraseña, registrarClienteReferido, obtenerReferidos } from "../controllers/ClienteController.js";




const router = Router();

router.use((req, res, next) => {
  console.log(`Request method: ${req.method}, Request URL: ${req.originalUrl}`);
  next();
});

router.get("/", listar);

router.get("/:id", buscarPorCedula);

//registrar cliente
router.post("/", registrar);

//actualizar cliente
router.put("/:id", actualizarCliente)

//Registrar contraseña
router.post("/crear-contrasena/:token", crearContraseña);

//Registrar referido
router.post("/referido", registrarClienteReferido );
//obtener referidos
router.get("/usuarios/referidos", obtenerReferidos)


export default router;
