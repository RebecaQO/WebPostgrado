import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  FileText,
  MessageCircle,
  Star,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { apiUrl } from '../../utils/api';

export const FeaturedPrograms = ({ onSelectProgram }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl('/api/programas/activos'));
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPrograms(data.slice(0, 3));
            return;
          }
        }
      } catch (err) {
        console.error('Error cargando programas de la BD:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  if (!loading && programs.length === 0) return null;

  const isMaestria = (prog) =>
    (prog.type || '').toLowerCase().includes('maestr') ||
    prog.typeFilter === 'maestria' ||
    prog.typeFilter === 'terminal' ||
    prog.typeFilter === 'autofinanciada';

  /* ── Paleta por tipo ── */
  const palette = {
    maestria: {
      bg: 'linear-gradient(145deg, #1a5c35 0%, #267342 60%, #2d8a52 100%)',
      badgeBg: 'rgba(0,0,0,0.22)',
      badgeText: '#ffffff',
      icon: <GraduationCap size={12} />,
      label: 'MAESTRÍA',
    },
    diplomado: {
      bg: 'linear-gradient(145deg, #1e3a5f 0%, #254d7a 60%, #2d6096 100%)',
      badgeBg: 'rgba(0,0,0,0.22)',
      badgeText: '#ffffff',
      icon: <FileText size={12} />,
      label: 'DIPLOMADO',
    },
  };

  return (
    <section style={{
      position: 'relative',
      padding: '3.5rem 0 4rem',
      background: '#f1f5f9',
    }}>
      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-green-inst)', fontWeight: 600 }}>
            Cargando convocatorias vigentes...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.5rem',
          }}>
            {programs.map((prog) => {
              const master  = isMaestria(prog);
              const p       = master ? palette.maestria : palette.diplomado;
              const mention = prog.area || prog.mencion || prog.modality || '';

              return (
                <div
                  key={prog.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: p.bg,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px -6px rgba(0,0,0,0.28)',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(0,0,0,0.38)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px -6px rgba(0,0,0,0.28)';
                  }}
                >
                  {/* ── Card body ── */}
                  <div style={{ padding: '1.5rem 1.5rem 1.25rem', flex: 1 }}>

                    {/* Top badges row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.1rem' }}>
                      {/* Type badge */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: p.badgeBg,
                        color: p.badgeText,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.07em',
                        padding: '0.28rem 0.65rem',
                        borderRadius: '99px',
                        border: '1px solid rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(4px)',
                        textTransform: 'uppercase',
                      }}>
                        {p.icon}
                        {p.label}
                      </span>

                      {/* Status badge */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'rgba(34, 197, 94, 0.18)',
                        color: '#86efac',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.28rem 0.65rem',
                        borderRadius: '99px',
                        border: '1px solid rgba(134, 239, 172, 0.35)',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                        Convocatoria Abierta
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.3,
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-family-heading)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                    }}>
                      {prog.title}
                    </h3>

                    {/* Mención / área */}
                    {mention && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        marginBottom: '1.1rem',
                      }}>
                        <Star size={13} style={{ flexShrink: 0 }} />
                        <span>Mención: {mention}</span>
                      </div>
                    )}

                    {/* Meta pills */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.45rem',
                      marginBottom: '0.25rem',
                    }}>
                      {prog.duration && (
                        <span style={metaPillStyle}>
                          <Clock size={11} /> {prog.duration}
                        </span>
                      )}
                      {prog.modality && (
                        <span style={metaPillStyle}>
                          <Layers size={11} /> {prog.modality}
                        </span>
                      )}
                      {prog.degree && (
                        <span style={metaPillStyle}>
                          <Award size={11} /> {prog.degree}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Divider ── */}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', margin: '0 1.5rem' }} />

                  {/* ── Actions ── */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem',
                    padding: '1rem 1.5rem 1.4rem',
                  }}>
                    <button
                      onClick={() => onSelectProgram(prog)}
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '6px',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'background 0.18s ease',
                        backdropFilter: 'blur(4px)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    >
                      <FileText size={14} />
                      Más información
                    </button>

                    <a
                      href={`https://wa.me/59176543210?text=${encodeURIComponent(`Hola, deseo más información sobre el programa: ${prog.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        textDecoration: 'none',
                        transition: 'background 0.18s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1da855'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#25D366'}
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const metaPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  background: 'rgba(255,255,255,0.10)',
  color: 'rgba(255,255,255,0.80)',
  fontSize: '0.72rem',
  fontWeight: 600,
  padding: '0.22rem 0.6rem',
  borderRadius: '99px',
  border: '1px solid rgba(255,255,255,0.14)',
};
