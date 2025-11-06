const API_URL = `${import.meta.env.VITE_BACKEND_URL}/rutina/chatbot`;
import axios from 'axios';

export const generarRutina = async ({ message, altura, peso, objetivo, nombre }) => {
    try {
        const response = await axios.post(API_URL, {
            message,
            altura,
            peso,
            objetivo,
            nombre
        });
        return response.data;
    } catch (error) {
        console.error('Error al generar la rutina:', error);
        throw new Error(error.message);
    }

};