import {
  listarMembresias,
  crearMembresia,
  buscarPorId as buscarPId,
  actualizarMembresia,
  desactivarMembresia,
} from "../services/MembresiaService.js";

export async function listar(req, res) {
  try {
    const membresias = await listarMembresias();
    res.json(membresias);
  } catch (error) {
    console.error("Error al obtener membresías:", error);
    res
      .status(500)
      .json({ message: "Error al obtener membresías", error: error.message });
  }
}

export async function crear(req, res) {
  try {
    const { tipo, duracion, precio } = req.body;

    if (!tipo || !duracion || !precio) {
      return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    const nueva = await crearMembresia({ tipo, duracion, precio });
    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear membresía:", error);
    res
      .status(500)
      .json({ message: "Error al crear membresía", error: error.message });
  }
}

export async function buscarPorId(req, res) {
  //obtengo el id del path
  const id = req.params.id_m; //el atributo id debe llamarse igual al que se recibe en routes
  try {
    const membresia = await buscarPId(id);
    res.status(200).json(membresia);
  } catch (error) {
    res.status(error.statusCode).json(error.message);
  }
}

//Editar membresia
export async function actualizar(req, res) {
  try {
    const { id_membresia } = req.params;
    const { tipo, precio } = req.body;

    // Verificar que al menos uno de los campos esté presente
    if (!tipo && !precio) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron datos para actualizar" });
    }

    const membresiaActualizada = await actualizarMembresia(id_membresia, {
      tipo,
      precio,
    });
    res.json({
      message: "Membresía actualizada exitosamente",
      membresia: membresiaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar la membresía:", error);
    res.status(500).json({
      message: "Error al actualizar la membresía",
      error: error.message,
    });
  }
}

// Eliminar una membresía
export async function desactivarMembresiaPorId(req, res) {
  const { id } = req.params;
  try {
    const desactivada = await desactivarMembresia(id);
    res.json({
      mensaje: "Membresía desactivada correctamente",
      membresia: desactivada,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ mensaje: error.message });
  }
}
