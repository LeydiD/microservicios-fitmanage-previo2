require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


const USERS = process.env.USUARIOS_URL || 'http://usuarios_service:4001';
const AFI = process.env.AFILIACIONES_URL || 'http://afiliaciones_service:4002';
const ASIS = process.env.ASISTENCIAS_URL || 'http://asistencias_service:4003';
const RUT = process.env.RUTINAS_URL || 'http://rutinas_service:4004';
const NOTI = process.env.NOTIFICACIONES_URL || 'http://notificaciones_service:4005';

app.use('/api/usuarios', createProxyMiddleware({ target: USERS, changeOrigin: true, pathRewrite: { '^/api/usuarios': '' } }));
app.use('/api/afiliaciones', createProxyMiddleware({ target: AFI, changeOrigin: true, pathRewrite: { '^/api/afiliaciones': '' } }));
app.use('/api/asistencias', createProxyMiddleware({ target: ASIS, changeOrigin: true, pathRewrite: { '^/api/asistencias': '' } }));
app.use('/api/rutinas', createProxyMiddleware({ target: RUT, changeOrigin: true, pathRewrite: { '^/api/rutinas': '' } }));
app.use('/api/notificaciones', createProxyMiddleware({ target: NOTI, changeOrigin: true, pathRewrite: { '^/api/notificaciones': '' } }));

app.listen(port, () => console.log(`API Gateway listening ${port}`));