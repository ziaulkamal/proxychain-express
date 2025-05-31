# Gunakan image ringan Node.js Alpine
FROM node:18-alpine

# Set direktori kerja
WORKDIR /app

# Salin file package.json & lock dulu untuk install dependensi
COPY package*.json ./

# Install dependensi produksi
RUN npm install

# Salin seluruh source code ke container
COPY . .

# Expose port (default Express)
EXPOSE 3000

# Jalankan server
CMD ["npm", "start"]
