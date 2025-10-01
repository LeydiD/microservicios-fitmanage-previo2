# Imagen base
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --only=production

# Copiar el resto del código
COPY . .

# Exponer puerto del gateway
EXPOSE 4000

# Comando de inicio
CMD ["node", "src/index.js"]
