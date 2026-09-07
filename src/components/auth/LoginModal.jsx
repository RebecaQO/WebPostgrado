import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  ArrowRight, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const LoginModal = ({ onLoginSuccess }) => {
  const { loginModalOpen, setLoginModalOpen, selectedRoleTab, setSelectedRoleTab, loginAs, authError } = useAuth();

  const [emailInput, setEmailInput] = useState('admin@umsa.bo');
  const [passwordInput, setPasswordInput] = useState('Admin123!');
  const [rememberMe, setRememberMe] = useState(true);

  if (!loginModalOpen) return null;

  const handleRoleSelect = (role) => {
    setSelectedRoleTab(role);
    if (role === 'estudiante') {
      setEmailInput('mtorres@email.com');
      setPasswordInput('Estudiante123!');
    } else if (role === 'docente') {
      setEmailInput('cmamani@umsa.bo');
      setPasswordInput('Docente123!');
    } else if (role === 'admin') {
      setEmailInput('admin@umsa.bo');
      setPasswordInput('Admin123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await loginAs({ email: emailInput, password: passwordInput });
    if (user) {
      if (onLoginSuccess) {
        onLoginSuccess(user.role || selectedRoleTab);
      }
    }
  };

  const roleConfigs = {
    estudiante: {
      title: 'Portal del Posgraduante',
      subtitle: 'Acceso a calificaciones, estado de pagos CPT y avance de tesis.',
      icon: GraduationCap,
      color: 'var(--color-accent-orange)',
      bg: 'var(--color-accent-orange-subtle)',
      demoEmail: 'alejandro.choque@posgrado.fcpn.edu.bo',
      features: ['Visualización de Módulos & Notas', 'Generación de Códigos CPT de Pago', 'Subida de Avance de Tesis y Contacto con Tutor']
    },
    docente: {
      title: 'Portal Docente e Investigador',
      subtitle: 'Registro de calificaciones modulares, asistencia y material didáctico.',
      icon: BookOpen,
      color: '#0284c7',
      bg: '#f0f9ff',
      demoEmail: 'mramos@fcpn.edu.bo',
      features: ['Carga de Notas y Emisión de Actas', 'Gestión de Asistencia en Sesiones Síncronas', 'Revisión de Avances de Tesis Asignadas']
    },
    admin: {
      title: 'Backoffice de Posgrado (Administración)',
      subtitle: 'Gestión de postulaciones, revisión de PDFs y control de convocatorias.',
      icon: ShieldCheck,
      color: '#d97706',
      bg: '#fffbeb',
      demoEmail: 'admin.posgrado@fcpn.edu.bo',
      features: ['Revisión y Aprobación de Documentos de Aspirantes', 'Dashboard de Admisiones y Recaudación', 'Gestión de Cupos y Asignación Docente']
    }
  };

  const currentConfig = roleConfigs[selectedRoleTab];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="modal-overlay" onClick={() => setLoginModalOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-xl)' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--color-accent-orange-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <KeyRound size={22} color="var(--color-accent-orange)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-umsa-blue-dark)' }}>Portal de Autenticación Unificado</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Posgrado e Investigación • Carrera de Estadística UMSA
              </div>
            </div>
          </div>

          <button 
            className="modal-close-btn"
            onClick={() => setLoginModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* 3 Role Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            background: '#f1f5f9',
            padding: '0.4rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0',
            marginBottom: '1.75rem'
          }}>
            <button
              type="button"
              onClick={() => handleRoleSelect('estudiante')}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                background: selectedRoleTab === 'estudiante' ? 'var(--color-accent-orange)' : 'transparent',
                color: selectedRoleTab === 'estudiante' ? '#ffffff' : 'var(--color-text-main)',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)',
                boxShadow: selectedRoleTab === 'estudiante' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <GraduationCap size={18} />
              <span>ESTUDIANTE</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('docente')}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                background: selectedRoleTab === 'docente' ? '#0284c7' : 'transparent',
                color: selectedRoleTab === 'docente' ? '#ffffff' : 'var(--color-text-main)',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)',
                boxShadow: selectedRoleTab === 'docente' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <BookOpen size={18} />
              <span>DOCENTE</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              style={{
                padding: '0.75rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                background: selectedRoleTab === 'admin' ? '#d97706' : 'transparent',
                color: selectedRoleTab === 'admin' ? '#ffffff' : 'var(--color-text-main)',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all var(--transition-fast)',
                boxShadow: selectedRoleTab === 'admin' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <ShieldCheck size={18} />
              <span>ADMIN</span>
            </button>
          </div>

          {/* Active Role Feature Summary */}
          <div style={{
            background: currentConfig.bg,
            border: `1px solid ${currentConfig.color}40`,
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}>
            <CurrentIcon size={24} style={{ color: currentConfig.color, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--color-umsa-blue-dark)', fontSize: '1rem' }}>
                {currentConfig.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                {currentConfig.subtitle}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {currentConfig.features.map((feat, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.75rem',
                    background: '#ffffff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                    border: '1px solid #cbd5e1',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <CheckCircle2 size={12} color={currentConfig.color} />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <span>Correo Institucional</span>
                <span className="form-label-hint">Ej: admin@umsa.bo</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="text"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
                  placeholder="admin@umsa.bo"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Contraseña</span>
                <span className="form-label-hint">Credencial real del sistema</span>
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              fontSize: '0.85rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-accent-orange)' }}
                />
                <span>Recordar sesión</span>
              </label>

              <a 
                href="#recuperar" 
                onClick={(e) => { e.preventDefault(); alert("Instrucciones de restablecimiento enviadas al correo institucional de la FCPN."); }}
                style={{ color: 'var(--color-accent-orange)', fontWeight: 700 }}
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
            >
              <span>Ingresar al Portal {selectedRoleTab.toUpperCase()}</span>
              <ArrowRight size={18} />
            </button>

            {authError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 0.9rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: '#b91c1c',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {authError}
              </div>
            )}

            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Info size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>Acceso real:</strong> usa un usuario activo de la base de datos y la contraseña del sistema para ingresar al portal correspondiente.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
