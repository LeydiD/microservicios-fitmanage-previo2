import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegistrarReferido.css";
import { registrarClienteReferido } from "../../../api/ClienteApi.js";
import { useModal } from "../../../context/ModalContext.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";

const RegistrarReferido = () => {
  const { showModal } = useModal();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    telefono: "",
    peso: "",
    email: "",
    altura: "",
    DNI: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Se agrega automáticamente el documento del usuario logueado
      const payload = {
        ...formData,
        documento_referido: user?.DNI, // viene del contexto
      };

      const response = await registrarClienteReferido(payload);
      console.log("Cliente referido registrado con éxito:", response);

      showModal("Éxito", "Cliente referido registrado exitosamente", "success");

      setFormData({
        nombre: "",
        edad: "",
        telefono: "",
        peso: "",
        email: "",
        altura: "",
        DNI: "",
      });
    } catch (error) {
      showModal("Error", error.message || "Error al registrar referido", "error");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <div className="logo-container">
          <img src="/LogoGym.jpeg" alt="Logo Gym" className="gym-logo" />
        </div>

        <h2 className="text-center fw-bold">REGISTRO DE REFERIDOS</h2>
        <br />

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label>Edad</label>
              <input
                type="text"
                name="edad"
                className="form-control"
                value={formData.edad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>Número de contacto</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label>Peso (kg)</label>
              <input
                type="text"
                name="peso"
                className="form-control"
                value={formData.peso}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label>Altura (cm)</label>
              <input
                type="text"
                name="altura"
                className="form-control"
                value={formData.altura}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label>Número de identidad</label>
              <input
                type="text"
                name="DNI"
                className="form-control"
                value={formData.DNI}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-danger btn-lg">
              REGISTRAR REFERIDO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarReferido;