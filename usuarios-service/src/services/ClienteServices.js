import Cliente from "../models/Cliente.js";
import cliente from "../models/Cliente.js";

export async function buscarPorCedula(dni) {
    return cliente.findOne({ where: { dni } });
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

async function registrarClienteReferido(DNI, documentoReferido, nombre, correo, telefono, peso, altura) {
   const clienteExistente = await cliente.findByPk(DNI, {
    attributes: ['cantidad_referidos']    
    });

    if (!clienteExistente){
        throw new Error( "No se encontró el cliente.");
    }

    //validacion de cantidad de referidos
    if(clienteExistente.cantidad_referidos == 2){
        throw new Error("El cliente no puede tener más de dos referidos.");
    }

    const clienteReferido = await cliente.create({
        DNI: DNI, 
        id_referido: documentoReferido, 
        nombre: nombre,
        telefono: telefono, 
        email: correo, 
        peso: peso, 
        altura: altura,
        es_referido: true, 
        cantidad_referidos: 0
    }); 
    if(!clienteReferido){
        throw new Error ("Fallo al crear el cliente referido")
    }
    //incrementar referidos al cliente existente.
    await Cliente.increment('cantidad_referidos', {
        by: 1,
        where: { DNI: DNI }
    });
    return clienteReferido;
};

export default {registrarClienteReferido}