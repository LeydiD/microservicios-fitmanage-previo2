import React from "react";
import "./Header.css";

const Header = ({ toggleMenu }) => {
  return (
    <header className="header">
      <button className="hamburger-btn" onClick={toggleMenu}>
        ☰
      </button>
      <img src="/Logo.png" alt="Logo del Gym" className="header-logo" />
    </header>
  );
};

export default Header;
