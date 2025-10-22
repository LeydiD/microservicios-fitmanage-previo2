import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header.jsx";
import MenuAdmin from "./MenuAdmin.jsx";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="admin-layout">
      <Header toggleMenu={toggleMenu} />
      <div className={`admin-container ${menuOpen ? "menu-open" : ""}`}>
        <MenuAdmin isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <div
          className="admin-content"
          onClick={() => menuOpen && setMenuOpen(false)}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
