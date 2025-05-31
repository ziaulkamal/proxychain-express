# Gunakan base image Node.js 18 Alpine untuk image ringan
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json ke container
COPY package*.json ./

# Install dependencies (termasuk devDependencies)
RUN npm install

# Copy semua source code ke container
COPY . .

# Expose port yang akan digunakan (sesuaikan dengan env PORT)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
