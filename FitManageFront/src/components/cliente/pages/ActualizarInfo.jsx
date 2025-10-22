import React, { useContext, useEffect, useState } from "react";
import "./ActualizarInfo.css";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { actualizarCliente } from "../../../api/ClienteApi.js";
import { useModal } from "../../../context/ModalContext.jsx";
const ActualizarInfo = () => {
  const { user, setUser } = useContext(AuthContext);
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    email: "",
    altura: "",
    telefono: "",
    objetivo: "",
    peso: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        altura: user.altura || "",
        telefono: user.telefono || "",
        objetivo: user.objetivo || "",
        peso: user.peso || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isUnchanged =
      formData.email === user.email &&
      formData.altura === user.altura &&
      formData.telefono === user.telefono &&
      formData.objetivo === user.objetivo &&
      formData.peso === user.peso;

    if (isUnchanged) {
      showModal(
        "Error",
        "No se ha realizado ningún cambio. No se puede actualizar.",
        "error"
      );
      return;
    }

    try {
      const datosActualizados = {
        ...user,
        email: formData.email,
        altura: formData.altura,
        telefono: formData.telefono,
        objetivo: formData.objetivo,
        peso: formData.peso,
      };

      await actualizarCliente(user.DNI, datosActualizados);

      setUser(datosActualizados);
      showModal("Éxito", "Información actualizada correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      showModal("Error", error.message, "error");
    }
  };

  return (
    <div className="actualizar-info-container">
      <h2 className="titulo">Actualizar Información</h2>
      <form className="info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Altura</label>
          <input
            type="text"
            name="altura"
            value={formData.altura}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Número de contacto</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Objetivo</label>
          <select
            name="objetivo"
            value={formData.objetivo}
            onChange={handleChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="Perder peso">Perder peso</option>
            <option value="Mantenrse">Mantenerse</option>
            <option value="Ganar masa muscular">Ganar masa muscular</option>
          </select>
        </div>
        <div className="form-group">
          <label>Peso</label>
          <input
            type="text"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default ActualizarInfo;
