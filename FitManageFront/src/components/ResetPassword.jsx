import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validaciones = {
    longitud: nuevaContrasena.length >= 8,
    mayuscula: /[A-Z]/.test(nuevaContrasena),
    minuscula: /[a-z]/.test(nuevaContrasena),
    numero: /[0-9]/.test(nuevaContrasena),
    simbolo: /[\W_]/.test(nuevaContrasena),
  };

  const validarContrasena = () => {
    return Object.values(validaciones).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!validarContrasena()) {
      setError("La contraseña no cumple con los requisitos.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/auth/reset-password/${token}`,
        { nuevaContrasena }
      );
      setMensaje(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
          />

          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />

          <button type="submit">Guardar contraseña</button>

          {/* Checklist abajo del botón */}
          <div className="checklist">
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              La contraseña debe contener:
            </p>
            <ul>
              <li className={validaciones.longitud ? "valid" : ""}>
                Al menos 8 caracteres
              </li>
              <li className={validaciones.mayuscula ? "valid" : ""}>
                Una letra mayúscula
              </li>
              <li className={validaciones.minuscula ? "valid" : ""}>
                Una letra minúscula
              </li>
              <li className={validaciones.numero ? "valid" : ""}>Un número</li>
              <li className={validaciones.simbolo ? "valid" : ""}>
                Un símbolo o carácter especial
              </li>
            </ul>
          </div>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
