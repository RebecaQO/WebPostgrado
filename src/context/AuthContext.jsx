import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';

const AuthContext = createContext();

const DEFAULT_PROFILES = {
  estudiante: {
    role: 'estudiante',
    name: 'Estudiante UMSA',
    email: 'estudiante@umsa.bo',
    ci: '0000000 LP',
    program: 'Programa de Posgrado',
    studentCode: 'MAT-2026-0000',
    currentSemester: 'Semestre I',
    grades: [],
    payments: [],
    thesis: { title: 'Sin proyecto registrado', tutor: 'Sin tutor asignado', progressPercent: 0, stage: 'Pendiente', lastFeedback: 'Sin observaciones' }
  },
  docente: {
    role: 'docente',
    name: 'Docente UMSA',
    email: 'docente@umsa.bo',
    ci: '0000000 LP',
    department: 'Departamento de Estadística Matemática',
    avatar: '',
    assignedModules: [],
    supervisedStudents: []
  },
  admin: {
    role: 'admin',
    name: 'Administrador UMSA',
    email: 'admin@umsa.bo',
    position: 'Administración de Posgrado',
    avatar: ''
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('posgrado_umsa_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState('estudiante');
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
        ...DEFAULT_PROFILES[data.user?.role || selectedRoleTab],
        ...data.user,
        role: data.user?.role || selectedRoleTab,
        name: data.user?.name || data.user?.email || DEFAULT_PROFILES[data.user?.role || selectedRoleTab].name,
      };

      setCurrentUser(normalizedUser);
      setLoginModalOpen(false);
      setAuthError('');
      return normalizedUser;
    } catch (error) {
      setAuthError('No se pudo conectar con el servidor de autenticación');
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError('');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginAs,
        logout,
        loginModalOpen,
        setLoginModalOpen,
        selectedRoleTab,
        setSelectedRoleTab,
        authError,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
