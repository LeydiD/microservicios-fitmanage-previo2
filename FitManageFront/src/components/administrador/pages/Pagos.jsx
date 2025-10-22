import React, { useState, useEffect } from "react";
import "./Pagos.css";
import { obtenerMembresias } from "../../../api/MembresiaApi.js";
import { registrarPago } from "../../../api/PagosApi.js";
import { obtenerClientePorDNI } from "../../../api/ClienteApi.js";
import Modal from "../../Modal.jsx";

const Pagos = () => {
  const [formData, setFormData] = useState({
    DNI: "",
    nombre: "",
    membresia: "",
    precio: "",
  });

  const [membresias, setMembresias] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: "",
    body: "",
    type: "info",
  });

  // Estado para el usuario encontrado
  const [usuario, setUsuario] = useState(null);

  const mostrarModal = (titulo, cuerpo, tipo = "info") => {
    setModalInfo({
      show: true,
      title: titulo,
      body: cuerpo,
      type: tipo,
    });
  };

  const cerrarModal = () => {
    setModalInfo((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    const cargarMembresias = async () => {
      try {
        const data = await obtenerMembresias();
        setMembresias(data);
      } catch (error) {
        console.error("Error al cargar membresías:", error);
        mostrarModal("Error", "No se pudieron cargar las membresías", "error");
      }
    };

    cargarMembresias();
  }, []);

  // Buscar usuario automáticamente al escribir el DNI
  useEffect(() => {
    const buscar = async () => {
      if (formData.DNI.length < 6) {
        setUsuario(null);
        setFormData((prev) => ({ ...prev, nombre: "" }));
        return;
      }
      try {
        const cliente = await obtenerClientePorDNI(formData.DNI);
        setUsuario(cliente || null);
        setFormData((prev) => ({
          ...prev,
          nombre: cliente
            ? [cliente.nombre, cliente.apellido].filter(Boolean).join(" ")
            : "",
        }));
      } catch {
        setUsuario(null);
        setFormData((prev) => ({ ...prev, nombre: "" }));
      }
    };
    buscar();
    // eslint-disable-next-line
  }, [formData.DNI]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "membresia") {
      const seleccionada = membresias.find(
        (m) => m.id_membresia.toString() === value
      );
      setFormData({
        ...formData,
        membresia: value,
        precio: seleccionada ? seleccionada.precio : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.DNI || !formData.membresia) {
      mostrarModal(
        "Érror",
        "Debe ingresar la cédula y seleccionar una membresía.",
        "error"
      );
      return;
    }

    try {
      const cliente = await obtenerClientePorDNI(formData.DNI);
      if (!cliente) {
        mostrarModal("Error", "Cliente no encontrado.", "error");
        return;
      }

      const id_cliente = cliente.DNI;
      const id_membresia = formData.membresia;

      const resultado = await registrarPago({ id_cliente, id_membresia });
      console.log("Pago registrado exitosamente:", resultado);
      mostrarModal("Éxito", "Pago registrado exitosamente", "success");

      // Limpiar todos los campos
      setFormData({ DNI: "", nombre: "", membresia: "", precio: "" });
      setUsuario(null);
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      mostrarModal(
        "Error",
        error.message || "Error al registrar el pago",
        "error"
      );
    }
  };

  return (
    <div className="pago-container">
      <div className={`pago-form${formData.nombre ? " nombre-activo" : ""}`}>
        {/* Imagen circular arriba del formulario */}
        <div className="logo-container">
          <img src="/LogoGym.jpeg" alt="Logo Gym" className="gym-logo" />
        </div>
        <h2 className="titulo-pago">REGISTRAR PAGO</h2>
        <form onSubmit={handleSubmit}>
          <label>Número de identidad</label>
          <input
            type="text"
            name="DNI"
            value={formData.DNI}
            onChange={handleChange}
            className="input-field"
          />

          {formData.nombre && (
            <>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                className="input-field"
                disabled
              />
            </>
          )}

          <label>Tipo de membresía</label>
          <select
            name="membresia"
            value={formData.membresia}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Seleccione una opción</option>
            {membresias.map((m) => (
              <option key={m.id_membresia} value={m.id_membresia}>
                {m.tipo}
              </option>
            ))}
          </select>

          <label>Precio de la membresía</label>
          <input
            type="text"
            name="precio"
            value={
              formData.precio
                ? `\$ ${Number(formData.precio).toLocaleString()}`
                : ""
            }
            className="input-field"
            disabled
          />

          <button type="submit" className="btn-registrar">
            REGISTRAR
          </button>
        </form>
      </div>
      <Modal
        show={modalInfo.show}
        title={modalInfo.title}
        body={modalInfo.body}
        type={modalInfo.type}
        onClose={cerrarModal}
      />
    </div>
  );
};

export default Pagos;
