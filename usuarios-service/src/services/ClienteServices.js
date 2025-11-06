import cliente from "../models/Cliente.js";
// import { publicarClienteReferidoCreado } from "../clientePublisher.js";
import axios from "axios";

const GATEWAY = process.env.API_GATEWAY_URL;
const http = axios.create({ baseURL: GATEWAY, timeout: 5000 });

async function getAsistenciasCliente(dni) {
    const { data } = await http.get(`/api/asistencias/asistencias/${dni}`);
    return data;
}

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

// async function registrarClienteReferido(DNIclienteNuevo, documentoReferido, nombre, correo, telefono, peso, altura, edad) {
//     try {
//         console.log("1. Buscando cliente existente (quien refiere):", documentoReferido);
//         const clienteExistente = await cliente.findByPk(documentoReferido);
//         console.log("2. Cliente encontrado:", clienteExistente);

//         if (!clienteExistente) {
//             throw new Error("No se encontró el cliente que está refiriendo.");
//         }

//         console.log("3. Cantidad de referidos actual:", clienteExistente.cantidad_referidos);

//         if (clienteExistente.cantidad_referidos >= 2) {
//             throw new Error("El cliente no puede tener más de dos referidos.");
//         }

//         console.log("4. Creando nuevo cliente referido con DNI:", DNIclienteNuevo);
//         const clienteReferido = await cliente.create({
//             DNI: DNIclienteNuevo,
//             id_referido: documentoReferido,
//             nombre: nombre,
//             telefono: telefono,
//             email: correo,
//             peso: peso,
//             altura: altura,
//             es_referido: true,
//             cantidad_referidos: 0,
//             edad: edad
//         });

//         if (!clienteReferido) {
//             throw new Error("Fallo al crear el cliente referido");
//         }

//         console.log("5. Cliente referido creado:", clienteReferido);


//         await cliente.increment('cantidad_referidos', {
//             by: 1,
//             where: { DNI: documentoReferido }
//         });

//         console.log("6. Contador incrementado para el cliente:", documentoReferido);
//         await publicarClienteCreado(clienteReferido);
//         return clienteReferido;

//     } catch (error) {
//         console.error("Error completo en service:", error);
//         throw new Error("Error al crear el cliente referido: " + error.message);
//     }
// }

export async function obtenerReferidos() {
    try {
        const referidos = await cliente.findAll({
            where: { es_referido: true },
            attributes: ["DNI", "nombre", "telefono", "email", "fecha_referido"]
        });

        const resultado = await Promise.all(
            referidos.map(async (ref) => {
                try {
                    const asistencias = await getAsistenciasCliente(ref.DNI);
                    return {
                        ...ref.dataValues,
                        ha_ingresado: Array.isArray(asistencias) ? asistencias.length > 0 : false
                    };
                } catch (error) {
                    // Si falla la consulta a asistencias, asumimos que no ingresó
                    if (error.response && error.response.status === 404) {
                        return { ...ref.dataValues, ha_ingresado: false };
                    } else {
                        console.error(`Error consultando asistencias de ${ref.DNI}:`, error.message);
                        return { ...ref.dataValues, ha_ingresado: false };
                    }
                }
            })
        );

        return resultado;
    } catch (error) {
        console.error("Error en obtenerReferidos service:", error);
        throw new Error("Error al obtener los referidos");
    }
};
export default {
    // registrarClienteReferido,
    obtenerReferidos
}