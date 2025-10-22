# Imagen base
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Ejecutar Vite en modo host (importante para acceso desde fuera del contenedor)
CMD ["npm", "run", "dev", "--", "--host"]
