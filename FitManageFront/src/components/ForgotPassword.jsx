import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import { solicitarRecuperacion } from "../api/ForgotPasswordApi.js";

const ForgotPassword = () => {
  const [dni, setDNI] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      const res = await solicitarRecuperacion(dni, email);
      setMensaje(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("Error al enviar el correo");
      }
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ingresa tu número de documento"
            value={dni}
            onChange={(e) => setDNI(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
