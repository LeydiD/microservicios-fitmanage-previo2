import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Clientes.css";
import { obtenerReferidos, obtenerClientePorDNI } from "../../../api/ClienteApi.js";
import { useModal } from "../../../context/ModalContext.jsx";

const Referidos = () => {
  const { showModal } = useModal();
  const [referidos, setReferidos] = useState([]);
  const [allReferidos, setAllReferidos] = useState([]);
  const [search, setSearch] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [sinResultados, setSinResultados] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerReferidos();
        setReferidos(data || []);
        setAllReferidos(data || []);
      } catch (e) {
        setReferidos([]);
        setAllReferidos([]);
      }
    };
    fetchData();
  }, []);

  const handleBuscar = () => {
    const q = search.trim().toLowerCase();
    const filtrados = allReferidos.filter((r) => {
      const nombre = (r?.nombre || "").toLowerCase();
      const documento = String(r?.DNI ?? r?.documento ?? "").toLowerCase();
      return nombre.includes(q) || documento.includes(q);
    });
    setSinResultados(filtrados.length === 0);
    setReferidos(filtrados);
  };

  const ordenarPorNombre = () => {
    const ordenados = [...referidos].sort((a, b) => {
      const na = (a?.nombre || "").toLowerCase();
      const nb = (b?.nombre || "").toLowerCase();
      if (na < nb) return ordenAsc ? -1 : 1;
      if (na > nb) return ordenAsc ? 1 : -1;
      return 0;
    });
    setReferidos(ordenados);
    setOrdenAsc(!ordenAsc);
  };

  const fechaFormateada = (value) => {
    if (!value) return "-";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString();
    } catch {
      return String(value);
    }
  };

  const handleVer = async (dni) => {
    try {
      if (!dni) {
        showModal("Información", "No hay DNI disponible para este referido");
        return;
      }
      const data = await obtenerClientePorDNI(dni);
      console.log(data);
      showModal(
        "Información del Referido",
        <div>
          <p><strong>Nombre:</strong> {data?.nombre ?? "-"}</p>
          <p><strong>DNI:</strong> {data?.DNI ?? "-"}</p>
          <p><strong>Teléfono:</strong> {data?.telefono ?? "-"}</p>
          <p><strong>Email:</strong> {data?.email ?? "-"}</p>
          {data?.edad !== undefined && (
            <p><strong>Edad:</strong> {data.edad}</p>
          )}
          {data?.peso !== undefined && (
            <p><strong>Peso:</strong> {data.peso} kg</p>
          )}
          {data?.altura !== undefined && (
            <p><strong>Altura:</strong> {data.altura} m</p>
          )}
        </div>
      );
    } catch (error) {
      showModal("Error", "No se pudo obtener la información del referido.", "error");
    }
  };

  const columnas = useMemo(
    () => [
      { key: "nombre", label: "Nombre" },
      { key: "documento", label: "Documento" },
      { key: "email", label: "correo" },
      { key: "fechaReferencia", label: "Fecha de referencia" },
    ],
    []
  );

  return (
    <div className="clientes-container">
      <div className="clientes-content">
        <div className="search-bar d-flex align-items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o documento"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-danger" onClick={handleBuscar}>
            <i className="bi bi-search me-1"></i> Buscar
          </button>
        </div>

        <div className="clientes-list">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th style={{ cursor: "pointer" }} onClick={ordenarPorNombre}>
                    Nombre {ordenAsc ? "▲" : "▼"}
                  </th>
                  <th>Documento</th>
                  <th>correo</th>
                  <th>Fecha de referencia</th>
                  <th>Información</th>
                </tr>
              </thead>
              <tbody>
                {referidos.map((ref, i) => (
                  <tr key={i}>
                    <td>{ref?.nombre ?? "-"}</td>
                    <td>{ref?.documento ?? ref?.DNI ?? "-"}</td>
                    <td>{ref?.email ?? ref?.correo ?? "-"}</td>
                    <td>{fechaFormateada(ref?.fecha_referido ?? ref?.fecha_referencia)}</td>
                    <td>
                      <button
                        className="ver-btn"
                        onClick={() => handleVer(ref?.DNI ?? ref?.documento)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sinResultados && (
            <div className="alert alert-warning mt-3" role="alert">
              No se encontraron referidos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referidos;


