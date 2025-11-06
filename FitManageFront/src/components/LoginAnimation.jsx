import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Login.css";
const LoginAnimation = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role.toLowerCase() === "administrador") {
        navigate("/admin");
      } else {
        navigate("/cliente");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [role, navigate]);

  return (
    <div className="login-animation-container">
      <motion.div
        className="gif-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1 }}
      >
        <img src="/Animacion.gif" alt="Cargando..." className="animacion-gif" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="login-welcome-text"
      >
        ¡Bienvenido al Gym Klinsmann!
      </motion.h2>
    </div>
  );
};

export default LoginAnimation;
