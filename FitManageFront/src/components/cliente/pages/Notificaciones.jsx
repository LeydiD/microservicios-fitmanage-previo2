import React, { useContext, useEffect, useState } from "react";
import "./Notificaciones.css";
import { FaCheckCircle, FaRegCircle, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { useModal } from "../../../context/ModalContext.jsx";
import {
  marcarNotificacionLeida,
  obtenerNotificacionesPorDNI,
  eliminarNotificacion,
} from "../../../api/NotificacionApi.js";

const opciones = [
  { value: "todos", label: "Todos" },
  { value: "asistencias", label: "Asistencias" },
  { value: "eventos", label: "Eventos" },
  { value: "vencimiento", label: "Vencim. Membresía" },
];

const filtroMap = {
  asistencias: "asistencia",
  eventos: "evento",
  vencimiento: "vencimiento",
};

const Notificaciones = () => {
  const [filtro, setFiltro] = useState("todos");
  const [notificaciones, setNotificaciones] = useState([]);
  const { user } = useContext(AuthContext);
  const { showModal } = useModal();

  useEffect(() => {
    let interval;
    if (user?.DNI) {
      obtenerNotificacionesPorDNI(user.DNI)
        .then(setNotificaciones)
        .catch(() => setNotificaciones([]));

      // Consulta periódica cada 10 segundos para ver si hay nuevas notificaciones
      interval = setInterval(() => {
        obtenerNotificacionesPorDNI(user.DNI)
          .then(setNotificaciones)
          .catch(() => setNotificaciones([]));
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    console.log("Notificaciones recibidas:", notificaciones); // Verifica que tengan ID
  }, [notificaciones]);

  const notificacionesFiltradas =
    filtro === "todos"
      ? notificaciones
      : notificaciones.filter(
          (n) => (n.etiqueta || "").toLowerCase() === filtroMap[filtro]
        );

  const notificacionesOrdenadas = [...notificacionesFiltradas].sort((a, b) => {
    // Los no leídos (estado === false) primero
    if (a.estado === b.estado) return 0;
    return a.estado ? 1 : -1;
  });

  const handleMarcarLeida = async (id) => {
    try {
      await marcarNotificacionLeida(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, estado: !n.estado } : n))
      );
    } catch (e) {
      showModal("Error", "No se pudo cambiar el estado de la notificación", "error");
    }
  };

  const handleEliminar = async (id) => {
    if (!id) {
      showModal("Error", "No se pudo identificar la notificación", "error");
      return;
    }

    showModal(
      "Confirmar eliminación",
      "¿Seguro que deseas eliminar esta notificación?",
      "info",
      async () => {
        try {
          await eliminarNotificacion(id);
          setNotificaciones((prev) => prev.filter((n) => n.id !== id));
        } catch (e) {
          console.error("Error al eliminar:", e);
          showModal("Error", "No se pudo eliminar la notificación", "error");
        }
      }
    );
  };

  return (
    <div className="notificaciones-bg">
      <div className="notificaciones-container">
        <div className="notificaciones-header">
          <h2>Notificaciones</h2>
          <select
            className="notificaciones-filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            {opciones.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
        <div className="notificaciones-tabla-container">
          <table className="notificaciones-tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Mensaje</th>
                <th>Etiqueta</th>
                <th>Leído</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notificacionesOrdenadas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                    No se encontraron notificaciones.
                  </td>
                </tr>
              ) : (
                notificacionesOrdenadas.map((n) => (
                  <tr
                    key={n.id}
                    className={
                      n.estado ? "notificacion-leida" : "notificacion-no-leida"
                    }
                  >
                    <td>{n.titulo}</td>
                    <td>{n.mensaje}</td>
                    <td>
                      <span
                        className={`etiqueta etiqueta-${(
                          n.etiqueta || ""
                        ).toLowerCase()}`}
                      >
                        {n.etiqueta}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div 
                        onClick={() => handleMarcarLeida(n.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {n.estado ? (
                          <FaCheckCircle 
                            color="#2ecc40" 
                            title="Marcar como no leída"
                          />
                        ) : (
                          <FaRegCircle
                            color="#d60000"
                            className="icono-marcar-leido"
                            title="Marcar como leída"
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <FaTrash
                        color="#d60000"
                        className="icono-eliminar"
                        onClick={() => {
                          console.log("Attempting to delete notification with ID:", n.id);
                          handleEliminar(n.id);
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;
