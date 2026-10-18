import { apiClient } from './apiClient';

export const authService = {
  /**
   * Inicia sesión con correo y contraseña
   */
  login: async (email, password) => {
    return apiClient('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },
};

export default authService;
