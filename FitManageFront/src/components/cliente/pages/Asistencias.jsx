import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerAsistenciasPorCliente } from "../../../api/AsistenciasApi.js";
import { AuthContext } from "../../../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Asistencias.css";
import chuloImg from "/chulo.png";
import equisImg from "/equis.png";

const Asistencias = () => {
  const { user, loading } = useContext(AuthContext);
  const dni = user?.DNI;
  const [fechas, setFechas] = useState([]);
  const [error, setError] = useState(null);
  const [today] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!dni) return;

    setError(null);
    obtenerAsistenciasPorCliente(dni)
      .then((data) => {
        const fechasComoDate = data.map((fechaStr) => {
          const [year, month, day] = fechaStr.split("-");
          return new Date(year, month - 1, day);
        });
        setFechas(fechasComoDate);
      })
      .catch(() => {
        setError("No se pudieron cargar las asistencias.");
      });
  }, [dni]);

  const formatWeekday = (locale, date) => {
    const weekdays = isMobile
      ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
      : [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];

    return weekdays[date.getDay()];
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      if (date > today) return null;

      const hayAsistencia = fechas.some(
        (fechaAsistencia) =>
          fechaAsistencia.getFullYear() === date.getFullYear() &&
          fechaAsistencia.getMonth() === date.getMonth() &&
          fechaAsistencia.getDate() === date.getDate()
      );

      return (
        <div className="day-content">
          {hayAsistencia ? (
            <img src={chuloImg} alt="Asistió" className="attendance-icon" />
          ) : (
            <img src={equisImg} alt="No asistió" className="attendance-icon" />
          )}
        </div>
      );
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (!user) return <p>Por favor, inicia sesión para ver tus asistencias.</p>;
  if (!dni) return <p>No se encontró el DNI del usuario autenticado.</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="calendar-container">
      <h3 className="calendar-title">Tu progreso</h3>
      <Calendar
        tileContent={tileContent}
        calendarType="gregory"
        formatShortWeekday={formatWeekday}
        navigationLabel={({ date, view }) =>
          view === "month"
            ? `${date.toLocaleString("es-ES", {
                month: "long",
              })} ${date.getFullYear()}`
            : ""
        }
        tileClassName={({ date, view }) => {
          if (view === "month") {
            if (
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            ) {
              return "current-day";
            }
          }
          return null;
        }}
      />
    </div>
  );
};

export default Asistencias;
