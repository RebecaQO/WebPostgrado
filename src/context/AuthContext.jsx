import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';

const AuthContext = createContext();

const DEFAULT_PROFILES = {
  admin: {
    role: 'admin',
    name: 'Administrador UMSA',
    email: 'admin@umsa.bo',
    position: 'Dirección y Administración de Posgrado',
    avatar: ''
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('posgrado_umsa_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState('admin');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('posgrado_umsa_auth', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('posgrado_umsa_auth');
    }
  }, [currentUser]);

  const loginAs = async (credentialsOrRole, passwordValue) => {
    let requestPayload = credentialsOrRole;

    if (typeof credentialsOrRole === 'string') {
      requestPayload = {
        email: credentialsOrRole,
        password: passwordValue || ''
      };
    }

    const email = (requestPayload?.email || '').trim();
    const password = requestPayload?.password || '';

    if (!email || !password) {
      setAuthError('Debe ingresar correo y contraseña');
      return false;
    }

    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || 'Credenciales inválidas');
        return false;
      }

      const normalizedUser = {
        ...DEFAULT_PROFILES.admin,
        ...data.user,
        role: 'admin',
        name: data.user?.name || data.user?.email || DEFAULT_PROFILES.admin.name,
      };

      setCurrentUser(normalizedUser);
      setAuthError('');
      setLoginModalOpen(false);
      return normalizedUser;
    } catch (error) {
      console.error('Error durante autenticación:', error);
      setAuthError('Error de red o servidor no disponible');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('posgrado_umsa_auth');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loginModalOpen,
      setLoginModalOpen,
      selectedRoleTab,
      setSelectedRoleTab,
      loginAs,
      logout,
      authError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
