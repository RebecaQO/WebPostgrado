import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  Send, 
  Shield, 
  FileText,
  Check
} from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailSub) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailSub('');
    }
  };

  return (
    <footer style={{
      background: '#00224d', // Azul UMSA institucional profundo para remate elegante
      color: '#cbd5e1',
      padding: '4.5rem 0 2rem 0',
      position: 'relative',
      borderTop: '3px solid var(--color-accent-orange)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Col 1: Institución */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #003876 0%, #0a1424 100%)',
                border: '1.5px solid var(--color-accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <GraduationCap size={24} color="var(--color-accent-orange)" />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0 }}>UNIVERSIDAD MAYOR DE SAN ANDRÉS</h4>
                <div style={{ fontSize: '0.8rem', color: '#fed7aa', fontWeight: 600 }}>Facultad de Ciencias Puras y Naturales</div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem', color: '#94a3b8' }}>
              Carrera de Estadística — Unidad de Posgrado e Investigación. Formación de cuarto nivel acreditada por el CEUB, orientada al modelamiento probabilístico, inferencia estadística y ciencia de datos.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-orange">Acreditación CEUB</span>
              <span className="badge badge-blue">Gestión 2026</span>
            </div>
          </div>

          {/* Col 2: Enlaces Académicos */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} color="var(--color-accent-orange)" />
              ENLACES ACADÉMICOS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <a href="http://www.ceub.edu.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} />
                  <span>Estatuto y Normativa CEUB</span>
                </a>
              </li>
              <li>
                <a href="https://moodle.fcpn.edu.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} />
                  <span>Campus Virtual Moodle FCPN</span>
                </a>
              </li>
              <li>
                <a href="https://repositorio.umsa.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} />
                  <span>Repositorio Institucional de Tesis UMSA</span>
                </a>
              </li>
              <li>
                <a href="http://biblioteca.umsa.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} />
                  <span>Biblioteca Central y Bases Scopus/IEEE</span>
                </a>
              </li>
              <li>
                <a href="https://fcpn.umsa.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} />
                  <span>Portal Oficial FCPN - UMSA</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacto Directo */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="var(--color-accent-orange)" />
              SEDES Y CONTACTO
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: 'var(--color-accent-orange)', flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>Campus Universitario Cota Cota:</strong>
                  <div style={{ color: '#94a3b8' }}>Calle 27 s/n, Edif. Carrera de Estadística, 2do Piso. La Paz, Bolivia.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>Monoblock Central:</strong>
                  <div style={{ color: '#94a3b8' }}>Av. Villazón Nº 1995, Plaza del Bicentenario.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={15} style={{ color: 'var(--color-accent-orange)', flexShrink: 0 }} />
                <span style={{ color: '#e2e8f0' }}>+591 (2) 279-2999 / +591 (2) 244-1563</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={15} style={{ color: 'var(--color-accent-orange)', flexShrink: 0 }} />
                <span style={{ color: '#e2e8f0' }}>posgrado.estadistica@umsa.bo</span>
              </div>
            </div>
          </div>

          {/* Col 4: Boletín & Redes */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} color="var(--color-accent-orange)" />
              BOLETÍN INFORMATIVO
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#94a3b8' }}>
              Recibe notificaciones de nuevas convocatorias, defensas de tesis y conferencias estadísticas.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <input
                type="email"
                required
                placeholder="tu.correo@ejemplo.com"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.85rem',
                  color: '#ffffff'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ padding: '0.6rem 1rem' }}
              >
                {subscribed ? <Check size={16} /> : <Send size={16} />}
              </button>
            </form>
            {subscribed && (
              <div style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: '1rem' }}>
                ✓ ¡Suscripción confirmada! Te enviaremos novedades.
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
                REDES INSTITUCIONALES
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1877f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ff0000'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#0a66c2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Transparency & Legal notice */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <div>
            © 2026 Unidad de Posgrado e Investigación — Carrera de Estadística, FCPN - UMSA. Todos los derechos reservados.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => onNavigate('normativa')}
              style={{
                background: 'transparent',
                color: '#fed7aa',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Shield size={13} color="var(--color-accent-orange)" />
              <span>Portal de Transparencia y Resoluciones</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
