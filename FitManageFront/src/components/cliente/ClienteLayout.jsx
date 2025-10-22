import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header.jsx";
import MenuCliente from "./MenuCliente.jsx";
import "./ClienteLayout.css";

const ClienteLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="cliente-layout">
      <Header toggleMenu={toggleMenu} />
      <div className={`cliente-container ${menuOpen ? "menu-open" : ""}`}>
        <MenuCliente isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <div
          className="cliente-content"
          onClick={() => menuOpen && setMenuOpen(false)}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default ClienteLayout;
