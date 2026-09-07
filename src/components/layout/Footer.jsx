import React, { useState, useEffect } from 'react';
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
  const [info, setInfo] = useState({
    direccion: 'Campus Universitario Cota Cota Calle 27, Edif. Estadística (2do Piso)',
    telefono: '+591 (2) 279-2999',
    whatsapp: '+591 76543210',
    email_principal: 'estapost@fcpn.edu.bo',
    campus_virtual_url: 'https://maestria.estadistica.fcpn.edu.bo'
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('/api/institucion/info');
        if (res.ok) {
          const data = await res.json();
          if (data && data.email_principal) {
            setInfo(prev => ({ ...prev, ...data }));
          }
        }
      } catch (err) {
        console.error('Error cargando info institucional en Footer:', err);
      }
    };
    fetchInfo();
  }, []);

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
      background: 'var(--color-footer-bg)',  /* rgb(200,200,200) */
      color: 'var(--color-footer-text)',
      padding: '4.5rem 0 2rem 0',
      position: 'relative',
      borderTop: '3px solid var(--color-green-inst)'
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
                background: 'linear-gradient(135deg, #006400 0%, #004000 100%)',
                border: '1.5px solid var(--color-green-lime)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <GraduationCap size={24} color="#32cd32" />
              </div>
              <div>
                <h4 style={{ color: 'var(--color-text-main)', fontSize: '1.05rem', margin: 0 }}>UNIVERSIDAD MAYOR DE SAN ANDRÉS</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-green-inst)', fontWeight: 600 }}>Facultad de Ciencias Puras y Naturales</div>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem', color: 'var(--color-text-muted)' }}>
              Unidad de Postgrado de Estadística — Carrera de Estadística, FCPN. Formación de cuarto nivel acreditada por el CEUB, orientada al modelamiento probabilístico, inferencia estadística y ciencia de datos.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-orange">Acreditación CEUB</span>
              <span className="badge badge-blue">Gestión 2026</span>
            </div>
          </div>

          {/* Col 2: Enlaces Académicos */}
          <div>
            <h4 style={{ color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} color="var(--color-green-inst)" />
              ENLACES ACADÉMICOS E INSTITUCIONALES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><a href={info.campus_virtual_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                  <ExternalLink size={13} style={{ opacity: 0.9 }} /><span>Campus Virtual: {(info.campus_virtual_url || '').replace('https://', '')}</span></a></li>
              <li><a href="#institucion" onClick={() => onNavigate('institucion')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} /><span>Dirección de la Carrera de Estadística</span></a></li>
              <li><a href="#institucion" onClick={() => onNavigate('institucion')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} /><span>IETA (Instituto de Estadística Teórica y Aplicada)</span></a></li>
              <li><a href="#institucion" onClick={() => onNavigate('institucion')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} /><span>Club Científico de Estadística</span></a></li>
              <li><a href="http://www.ceub.edu.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} /><span>Estatuto y Normativa CEUB</span></a></li>
              <li><a href="https://repositorio.umsa.bo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <ExternalLink size={13} style={{ opacity: 0.7 }} /><span>Repositorio Institucional de Tesis UMSA</span></a></li>
            </ul>
          </div>

          {/* Col 3: Contacto Directo */}
          <div>
            <h4 style={{ color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="var(--color-green-inst)" />
              SEDES Y CONTACTO
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: 'var(--color-accent-orange)', flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Dirección de Carrera / Posgrado:</strong>
                  <div style={{ color: 'var(--color-text-muted)' }}>{info.direccion}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ color: 'var(--color-text-main)' }}>Monoblock Central:</strong>
                  <div style={{ color: 'var(--color-text-muted)' }}>Av. Villazón Nº 1995, Plaza del Bicentenario.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={15} style={{ color: 'var(--color-green-inst)', flexShrink: 0 }} />
                <span style={{ color: 'var(--color-text-muted)' }}>{info.telefono} / {info.whatsapp}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={15} style={{ color: 'var(--color-green-inst)', flexShrink: 0 }} />
                <a href={`mailto:${info.email_principal}`} style={{ color: 'var(--color-green-inst)', fontWeight: 700 }}>
                  {info.email_principal}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Boletín & Redes */}
          <div>
            <h4 style={{ color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={16} color="var(--color-green-inst)" />
              BOLETÍN INFORMATIVO
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
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
                  background: 'rgba(0,0,0,0.06)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)'
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
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.6rem' }}>
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
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
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
                    background: 'rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ff0000'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
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
                    background: 'rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#0a66c2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
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
          borderTop: '1px solid rgba(0,0,0,0.15)',
          paddingTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)'
        }}>
          <div>
            © 2026 Unidad de Postgrado de Estadística — Carrera de Estadística, FCPN · UMSA. Todos los derechos reservados.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => onNavigate('normativa')}
              style={{
                background: 'transparent',
                color: 'var(--color-green-inst)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Shield size={13} color="var(--color-green-inst)" />
              <span>Portal de Transparencia y Resoluciones</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
