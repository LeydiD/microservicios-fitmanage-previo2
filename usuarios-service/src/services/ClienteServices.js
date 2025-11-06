import Cliente from "../models/Cliente.js";
import cliente from "../models/Cliente.js";
import { publicarClienteReferidoCreado } from "../clientePublisher.js";

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

async function registrarClienteReferido(DNIclienteNuevo, documentoReferido, nombre, correo, telefono, peso, altura, edad) {
    try {
        console.log("1. Buscando cliente existente (quien refiere):", documentoReferido); 
        const clienteExistente = await cliente.findByPk(documentoReferido); 
        console.log("2. Cliente encontrado:", clienteExistente);

        if (!clienteExistente){
            throw new Error("No se encontró el cliente que está refiriendo.");
        }

        console.log("3. Cantidad de referidos actual:", clienteExistente.cantidad_referidos);
        
        if(clienteExistente.cantidad_referidos >= 2){
            throw new Error("El cliente no puede tener más de dos referidos.");
        }

        console.log("4. Creando nuevo cliente referido con DNI:", DNIclienteNuevo); 
        const clienteReferido = await cliente.create({
            DNI: DNIclienteNuevo, 
            id_referido: documentoReferido, 
            nombre: nombre,
            telefono: telefono, 
            email: correo, 
            peso: peso, 
            altura: altura,
            es_referido: true, 
            cantidad_referidos: 0, 
            edad: edad
        }); 

        if(!clienteReferido){
            throw new Error("Fallo al crear el cliente referido");
        }

        console.log("5. Cliente referido creado:", clienteReferido);
        

        await cliente.increment('cantidad_referidos', {
            by: 1,
            where: { DNI: documentoReferido } 
        });

        console.log("6. Contador incrementado para el cliente:", documentoReferido);
         await publicarClienteReferidoCreado(clienteReferido);
        return clienteReferido;

    } catch (error) {
        console.error("Error completo en service:", error); 
        throw new Error("Error al crear el cliente referido: " + error.message);
    }
}

export default {registrarClienteReferido}