import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir acceso desde la IP de red en desarrollo (evita el aviso Cross origin)
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://192.168.0.227:3000",
    "http://192.168.0.227:3001",
  ],
  images: {
    remotePatterns: [],
    unoptimized: true, // Para permitir imágenes de la API
  },
};

export default nextConfig;
