import express from "express";
import dotenv from "dotenv";
import notificacionRoutes from "./routes/notificaciones.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/notificaciones", notificacionRoutes);

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => console.log(`Microservicio Notificaciones corriendo en puerto ${PORT}`));
