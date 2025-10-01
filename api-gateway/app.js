require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 3000;

const USERS = process.env.USUARIOS_URL || 'http://localhost:4001';
const AFI   = process.env.AFILIACIONES_URL || 'http://localhost:4002';
const ASIS  = process.env.ASISTENCIAS_URL || 'http://localhost:4003';
const RUT   = process.env.RUTINAS_URL || 'http://localhost:4004';
const NOTI  = process.env.NOTIFICACIONES_URL || 'http://localhost:4005';

app.use('/api/usuarios', createProxyMiddleware({ target: USERS, changeOrigin: true, pathRewrite: {'^/api/usuarios':'/usuarios'} }));
app.use('/api/membresias', createProxyMiddleware({ target: AFI, changeOrigin: true, pathRewrite: {'^/api/membresias':'/membresias'} }));
app.use('/api/asistencias', createProxyMiddleware({ target: ASIS, changeOrigin: true, pathRewrite: {'^/api/asistencias':'/'} }));
app.use('/api/rutinas', createProxyMiddleware({ target: RUT, changeOrigin: true, pathRewrite: {'^/api/rutinas':'/'} }));
app.use('/api/notificaciones', createProxyMiddleware({ target: NOTI, changeOrigin: true, pathRewrite: {'^/api/notificaciones':'/'} }));

app.listen(port, ()=>console.log(`API Gateway listening ${port}`));