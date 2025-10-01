import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));


db.authenticate()
  .then(() => console.log("Databse connection successful"))
  .catch((error) => console.log("Connection error: ", error));

//para la creacion de la bd 
// db.sync()
//   .then(() => console.log("Database synchronized"))
//   .catch((error) => console.log("Error synchronizing database: ", error));

// async function main() {
//   try {
//     await db.sync({ force: true });
//     console.log("Tablas creadas exitosamente B)")
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// main();


const interfaces = os.networkInterfaces();
let localIP = "localhost"; // fallback

for (let name in interfaces) {
  for (let iface of interfaces[name]) {
    if (
      iface.family === "IPv4" &&
      !iface.internal &&
      iface.address.startsWith("192.168")
    ) {
      localIP = iface.address;
    }
  }
}

app.listen(process.env.PUERTO, () => {
  console.log(`API escuchando en http://localhost:${process.env.PUERTO}`);
});


app.get("/", (req, res) => {
  res.send("Hola Mundo desde mi primera API en Node.js!");
});

app.use("/clientes", clienteRoutes);


// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Microservicio de Usuarios funcionando 🚀");
});

// Aquí luego importas tus rutas reales (login, registro, etc.)
app.listen(process.env.PUERTO || 3001, () => {
  console.log(`Usuarios escuchando en http://localhost:${process.env.PUERTO || 3001}`);
});