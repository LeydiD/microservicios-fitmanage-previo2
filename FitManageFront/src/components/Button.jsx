import React from "react";
import "../components/administrador/MenuAdmin.css";

const Button = ({ text, isActive, onClick }) => {
  return (
    <button
      className={`menu-button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
