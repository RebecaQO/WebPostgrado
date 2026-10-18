import { apiUrl } from '../utils/api';

/**
 * Cliente HTTP base para realizar peticiones a la API del backend.
 * Soporta JSON automático, headers y manejo unificado de errores.
 */
export async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...customOptions } = options;

  const config = {
    method,
    headers: {
      ...(!body || body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...customOptions,
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else if (typeof body === 'object') {
      config.body = JSON.stringify(body);
    } else {
      config.body = body;
    }
  }

  const response = await fetch(apiUrl(endpoint), config);

  // Manejar respuestas sin contenido (204 No Content)
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Error del servidor (${response.status})`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default apiClient;
