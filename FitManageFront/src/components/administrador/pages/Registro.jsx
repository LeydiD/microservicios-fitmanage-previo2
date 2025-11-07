import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registro.css";
import { registrarCliente } from "../../../api/ClienteApi.js";
import { useModal } from "../../../context/ModalContext.jsx";
const Registro = () => {
  const { showModal } = useModal();

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
      const response = await registrarCliente(formData);
      console.log("Cliente registrado con éxito:", response);
      showModal("Éxito", "Registro exitoso", "success");
      setFormData({
        DNI: "",
        nombre: "",
        telefono: "",
        email: "",
        edad: "",
        peso: "",
        altura: "",
      });
    } catch (error) {
      showModal("Error", error.message, "error");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form">
        <div className="logo-container">
          <img src="/LogoGym.jpeg" alt="Logo Gym" className="gym-logo" />
        </div>
        <br />
        <h2 className="text-center fw-bold">FORMULARIO DE REGISTRO</h2>
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
              />
            </div>
            <div className="col-md-6">
              <label>Peso</label>
              <input
                type="text"
                name="peso"
                className="form-control"
                placeholder="En kilogramos"
                value={formData.peso}
                onChange={handleChange}
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
              />
            </div>
            <div className="col-md-6">
              <label>Altura</label>
              <input
                type="text"
                name="altura"
                className="form-control"
                placeholder="En centimetros"
                value={formData.altura}
                onChange={handleChange}
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
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-danger btn-lg">
              REGISTRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
