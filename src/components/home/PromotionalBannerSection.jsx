import React from 'react';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import cienciaBanner from '../../assets/images/banner/cienciabanner.jpeg';

export const PromotionalBannerSection = ({ onSelectProgram }) => {
  const handleRedirect = () => {
    if (onSelectProgram) {
      onSelectProgram('PG-EST-002');
    } else {
      window.location.hash = 'programa/PG-EST-002';
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Hola, deseo consultar sobre la Maestría en Ciencia y Análisis de Datos (II Versión).'
  );

  return (
    <section style={{
      background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
      padding: 'clamp(2rem, 3.5vw, 3.5rem) 0',
      position: 'relative',
    }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.15fr)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 45px -12px rgba(11, 25, 44, 0.25)',
            border: '1px solid rgba(30, 62, 98, 0.15)',
            background: '#0B192C',
            minHeight: '400px',
          }}
          className="promo-banner-grid"
        >
          {/* ── Imagen grande a un lado ── */}
          <div
            onClick={handleRedirect}
            title="Haz clic para ver más información de la maestría"
            style={{
              position: 'relative',
              background: '#07111e',
              cursor: 'pointer',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="promo-image-box"
          >
            <img
              src={cienciaBanner}
              alt="Maestría en Ciencia y Análisis de Datos"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          </div>

          {/* ── Panel en tono azul elegante ── */}
          <div
            style={{
              background: 'linear-gradient(145deg, #0B192C 0%, #1E3E62 100%)',
              padding: 'clamp(2rem, 3.5vw, 3rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.25rem',
              color: '#ffffff',
            }}
          >
            {/* Encabezado sin etiquetas rígidas */}
            <div>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#93c5fd',
                  margin: '0 0 0.4rem 0',
                }}
              >
                UMSA · Facultad de Ciencias Puras y Naturales
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Maestría en Ciencia y Análisis de Datos
              </h2>
              <p
                style={{
                  fontSize: '0.95rem',
                  color: '#cbd5e1',
                  margin: '0.35rem 0 0 0',
                  fontWeight: 500,
                }}
              >
                II Versión — Gestión Académica 2026
              </p>
            </div>

            {/* Puntos destacados limpios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'Modalidad semipresencial con sesiones virtuales síncronas',
                'Herramientas avanzadas: R, Python, Machine Learning, Big Data',
                'Campus Universitario Cota Cota · Edificio FCPN',
              ].map((text, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.9rem',
                    color: '#e2e8f0',
                  }}
                >
                  <CheckCircle2 size={16} color="#60a5fa" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Acciones principales */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                marginTop: '0.5rem',
              }}
            >
              <button
                onClick={handleRedirect}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1d4ed8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Ver Maestría en Más Información</span>
                <ArrowRight size={17} />
              </button>

              <a
                href={`https://wa.me/59176543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '0.75rem 1.2rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  backdropFilter: 'blur(6px)',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .promo-banner-grid {
            grid-template-columns: 1fr !important;
          }
          .promo-image-box {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};
