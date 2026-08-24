import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USERS = {
  estudiante: {
    role: 'estudiante',
    name: 'Ing. Alejandro Choque Mamani',
    email: 'alejandro.choque@posgrado.fcpn.edu.bo',
    ci: '6834921 LP',
    program: 'Maestría en Estadística Aplicada y Ciencia de Datos',
    studentCode: 'MAT-2025-0481',
    currentSemester: 'Semestre II',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    grades: [
      { code: 'EST-801', name: 'Fundamentos Matemáticos para Estadística', grade: 92, status: 'Aprobado', semester: 'I-2025' },
      { code: 'EST-802', name: 'Inferencia Estadística Avanzada', grade: 88, status: 'Aprobado', semester: 'I-2025' },
      { code: 'EST-803', name: 'Programación Estadística con R y Python', grade: 95, status: 'Aprobado', semester: 'I-2025' },
      { code: 'EST-811', name: 'Modelos Lineales Generalizados (GLM)', grade: 85, status: 'En Curso', semester: 'II-2025' },
      { code: 'EST-812', name: 'Aprendizaje Estadístico y Machine Learning', grade: 90, status: 'En Curso', semester: 'II-2025' }
    ],
    payments: [
      { concept: 'Matrícula Anual Gestión 2025', amountBob: 1200, status: 'Cancelado', date: '10/02/2025', receipt: 'REC-UMSA-0912' },
      { concept: 'Cuota 1 - Colegiatura Semestre I', amountBob: 1500, status: 'Cancelado', date: '15/03/2025', receipt: 'REC-UMSA-1420' },
      { concept: 'Cuota 2 - Colegiatura Semestre I', amountBob: 1500, status: 'Cancelado', date: '15/05/2025', receipt: 'REC-UMSA-1983' },
      { concept: 'Cuota 3 - Colegiatura Semestre II', amountBob: 1500, status: 'Cancelado', date: '10/09/2025', receipt: 'REC-UMSA-2341' },
      { concept: 'Cuota 4 - Colegiatura Semestre II', amountBob: 1500, status: 'Pendiente', dueDate: '30/03/2026', cpt: 'CPT-2026-88492' }
    ],
    thesis: {
      title: "Modelación de Series de Tiempo con Componente Espacial en la Predicción de Rendimientos Agrícolas en el Altiplano",
      tutor: "Dr. Marcelo Ramos Quispe (Ph.D.)",
      progressPercent: 65,
      stage: "Capítulo 3: Metodología y Estimación Bayesiana",
      lastFeedback: "Revisar la convergencia de las cadenas de Markov en el paquete R-INLA."
    }
  },
  docente: {
    role: 'docente',
    name: 'Dr. Marcelo Ramos Quispe',
    email: 'mramos@fcpn.edu.bo',
    ci: '3349120 LP',
    department: 'Departamento de Estadística Matemática',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    assignedModules: [
      {
        code: 'EST-802',
        name: 'Inferencia Estadística Avanzada',
        program: 'Maestría en Estadística Aplicada (Semestre I)',
        enrolledCount: 28,
        status: 'Concluido',
        period: 'Gestión I-2025'
      },
      {
        code: 'EST-832',
        name: 'Estadística Bayesiana Computacional (MCMC)',
        program: 'Maestría en Ciencia de Datos (Semestre IV)',
        enrolledCount: 22,
        status: 'En Curso',
        period: 'Gestión I-2026'
      }
    ],
    supervisedStudents: [
      { name: 'Lic. Rodrigo Paredes', thesis: 'Modelos de Espacio de Estados para Inflación', status: 'Defensa Programada (28/03/2026)' },
      { name: 'Ing. Alejandro Choque', thesis: 'Modelación Espacio-Temporal en Altiplano', status: 'Avance 65%' },
      { name: 'Lic. Mariana Siles', thesis: 'Estimación en Áreas Pequeñas (SAE)', status: 'Avance 40%' }
    ]
  },
  admin: {
    role: 'admin',
    name: 'M.Sc. Roxana Quisbert Valle',
    email: 'admin.posgrado@fcpn.edu.bo',
    position: 'Directora de la Unidad de Posgrado e Investigación',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('posgrado_umsa_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState('estudiante');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('posgrado_umsa_auth', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('posgrado_umsa_auth');
    }
  }, [currentUser]);

  const loginAs = (role) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
      setLoginModalOpen(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
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
        setSelectedRoleTab
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
