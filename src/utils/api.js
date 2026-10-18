/**
 * Configuración centralizada de API para conectar el frontend con Render.
 * 
 * En desarrollo (npm run dev): usa rutas relativas (/api/...) que el proxy
 * de vite.config.js redirige a Render, evitando cold-start timeouts.
 * En producción: usa la URL absoluta configurada en VITE_API_URL.
 */
const RAW_URL = import.meta.env.VITE_API_URL || '';
const IS_DEV = import.meta.env.DEV;

// En dev y sin URL explícita → rutas relativas (pasan por el proxy de Vite)
// En prod → URL absoluta de Render
export const API_BASE_URL = (IS_DEV && !RAW_URL)
  ? ''
  : (RAW_URL || 'https://webpostgrado.onrender.com').replace(/\/$/, '');

/**
 * Resuelve cualquier endpoint relativo al backend.
 * @param {string} endpoint - Ej: '/api/programas/activos'
 * @returns {string} URL (relativa en dev, absoluta en prod)
 */
export const apiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL || '/';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${clean}`;
};

/**
 * Wrapper de fetch configurado con la URL base del backend
 */
export const apiFetch = (endpoint, options = {}) => {
  return fetch(apiUrl(endpoint), options);
};

export default apiUrl;
