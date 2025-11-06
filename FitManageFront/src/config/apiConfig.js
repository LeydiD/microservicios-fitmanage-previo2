// Configuración inteligente de API que detecta el entorno
const getApiUrl = () => {
  // Si estamos en desarrollo y accediendo desde localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  
  // Si estamos accediendo desde la red Docker
  if (window.location.hostname.includes('172.') || window.location.hostname === 'frontend1') {
    return 'http://gateway:3000/api';
  }
  
  // Fallback a la variable de entorno
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
};

export const API_BASE_URL = getApiUrl();

console.log('🔧 API Configuration:', {
  hostname: window.location.hostname,
  href: window.location.href,
  apiUrl: API_BASE_URL,
  env: import.meta.env.VITE_BACKEND_URL
});
