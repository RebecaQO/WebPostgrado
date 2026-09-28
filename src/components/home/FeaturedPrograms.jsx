import React, { useEffect, useState } from 'react';
import {
  FileText,
  MessageCircle,
  Star,
  Clock,
  Layers,
  Award,
  GraduationCap
} from 'lucide-react';
import { apiUrl } from '../../utils/api';

import slide1 from '../../assets/images/carrusel/slide1.jpg';
import slide2 from '../../assets/images/carrusel/slide2.jpg';
import slide3 from '../../assets/images/carrusel/slide3.jpg';
import slide4 from '../../assets/images/carrusel/slide4.jpg';

const CARD_IMAGES = [slide1, slide2, slide3, slide4];

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
    prog.typeFilter === 'autofinanciada' ||
    (prog.title || '').toLowerCase().includes('maestr');

  /* Diferenciación visual: Maestrías = Verde Institucional | Diplomados = Azul Institucional */
  const getCardStyle = (master, idx) => {
    if (master) {
      const greenGradients = [
        'linear-gradient(145deg, #0e2d19 0%, #164828 55%, #1e5f35 100%)',
        'linear-gradient(145deg, #11341d 0%, #1a512d 55%, #226b3c 100%)',
        'linear-gradient(145deg, #0d2816 0%, #144023 55%, #1b5630 100%)'
      ];
      return {
        background: greenGradients[idx % greenGradients.length],
        border: '1px solid rgba(74, 222, 128, 0.3)',
        shadowHover: '0 16px 40px -8px rgba(30, 95, 53, 0.45)',
        badgeBg: '#1e5f35',
        badgeBorder: 'rgba(187, 247, 208, 0.45)',
        badgeText: '#ffffff',
        label: 'MAESTRÍA',
        isMaster: true
      };
    } else {
      const blueGradients = [
        'linear-gradient(145deg, #0e243a 0%, #163a5f 55%, #1e4f80 100%)',
        'linear-gradient(145deg, #102a43 0%, #1a426c 55%, #22568c 100%)',
        'linear-gradient(145deg, #0c2033 0%, #133353 55%, #1b4470 100%)'
      ];
      return {
        background: blueGradients[idx % blueGradients.length],
        border: '1px solid rgba(125, 211, 252, 0.3)',
        shadowHover: '0 16px 40px -8px rgba(30, 58, 95, 0.45)',
        badgeBg: '#1e3a5f',
        badgeBorder: 'rgba(186, 230, 253, 0.45)',
        badgeText: '#ffffff',
        label: 'DIPLOMADO',
        isMaster: false
      };
    }
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
            {programs.map((prog, idx) => {
              const master    = isMaestria(prog);
              const styleInfo = getCardStyle(master, idx);
              const mention   = prog.area || prog.mencion || prog.modality || '';

              return (
                <div
                  key={prog.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: styleInfo.background,
                    border: styleInfo.border,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px -6px rgba(0,0,0,0.28)',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = styleInfo.shadowHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px -6px rgba(0,0,0,0.28)';
                  }}
                >
                  {/* ── Banner con Imagen superior de la tarjeta e insignia de diferenciación ── */}
                  <div style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden' }}>
                    <img
                      src={prog.imagen || CARD_IMAGES[idx % CARD_IMAGES.length]}
                      alt={prog.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    {/* Insignia clara de diferenciación: Maestría Verde / Diplomado Azul */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: styleInfo.badgeBg,
                      color: styleInfo.badgeText,
                      border: `1px solid ${styleInfo.badgeBorder}`,
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {styleInfo.isMaster ? <GraduationCap size={13} /> : <Award size={13} />}
                      <span>{styleInfo.label}</span>
                    </div>
                  </div>

                  {/* ── Card body (sin las insignias superiores eliminadas) ── */}
                  <div style={{ padding: '1.4rem 1.5rem 1.25rem', flex: 1 }}>

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

                  {/* ── Actions: Más info y solamente derivar a WhatsApp (sin botón postular) ── */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.35fr',
                    gap: '0.65rem',
                    padding: '1.1rem 1.5rem 1.35rem',
                  }}>
                    <button
                      onClick={() => onSelectProgram(prog)}
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: '6px',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.84rem',
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
                      <FileText size={15} />
                      <span>Más info</span>
                    </button>

                    {/* Derivar exclusivamente a WhatsApp */}
                    <a
                      href={`https://wa.me/59176543210?text=${encodeURIComponent(`Hola, deseo más información y consultar sobre la postulación al programa: ${prog.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#25D366',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                        transition: 'background 0.18s ease, transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1da855';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#25D366';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>WhatsApp</span>
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
