/**
 * Configuración centralizada de API para conectar el frontend con Render
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://webpostgrado.onrender.com').replace(/\/$/, '');

/**
 * Resuelve cualquier endpoint relativo al backend de Render
 * @param {string} endpoint - Ej: '/api/programas/activos'
 * @returns {string} URL absoluta a Render
 */
export const apiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL;
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
