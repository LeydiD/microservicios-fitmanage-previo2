import cliente from "../models/Cliente.js";

export async function buscarPorCedula(dni) {
    return await cliente.findByPk(dni);
}

export async function registrarCliente(datosCliente) {
    return await cliente.create(datosCliente);
};

export async function actualizarCliente(dni, nuevosDatos) {
    const clienteExistente = await cliente.findByPk(dni);

    if (!clienteExistente) {
        throw new Error("Cliente no encontrado");
    }

    await clienteExistente.update(nuevosDatos);

    return clienteExistente;
}


export async function actualizarContraseña(dni, contraseñaHasheada) {
    const clienteExistente = await cliente.findByPk(dni);
    if (!clienteExistente) {
        throw new Error("Cliente no encontrado");
    }

    clienteExistente.contraseña = contraseñaHasheada;
    await clienteExistente.save();
    return clienteExistente;
};



export async function listar() {
  return await cliente.findAll({
    attributes: ["DNI", "nombre", "email", "telefono"], 
  });
}
