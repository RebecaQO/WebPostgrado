import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Layers, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

import logoUmsa from '../../assets/images/logo/logo_umsa.png';
import logoFcpn from '../../assets/images/logo/logo_fcpn.png';
import logoEstadistica from '../../assets/images/logo/logo_estadistica.png';
import logoMaestriaDatos from '../../assets/images/logo/logo_maestria_datos.png';

// Carousel slides – content complements each background image
const SLIDES = [
  {
    bg: new URL('../../assets/images/carrusel/slide1.jpg', import.meta.url).href,
    badge: 'UNIDAD DE POSTGRADO DE ESTADÍSTICA · FCPN UMSA',
    title: 'Maestría en Estadística',
    titleAccent: 'Aplicada',
    subtitle: 'Rigor metodológico, aprendizaje computacional avanzado con R & Python. Programa autofinanciado de 18 meses con turno nocturno.',
    accent: '#267342',
    tipo: 'Maestría',
  },
  {
    bg: new URL('../../assets/images/carrusel/slide2.jpg', import.meta.url).href,
    badge: 'UNIDAD DE POSTGRADO DE ESTADÍSTICA · FCPN UMSA',
    title: 'Maestría en Ciencia',
    titleAccent: 'de Datos e IA',
    subtitle: 'Formación de cuarto nivel en machine learning, deep learning y estadística computacional para el ecosistema digital boliviano.',
    accent: '#4f7e9f',
    tipo: 'Maestría',
  },
  {
    bg: new URL('../../assets/images/carrusel/slide3.jpg', import.meta.url).href,
    badge: 'UNIDAD DE POSTGRADO DE ESTADÍSTICA · FCPN UMSA',
    title: 'Diplomado en Análisis',
    titleAccent: 'Estadístico con R',
    subtitle: 'Certificación profesional orientada a la práctica. Modelamiento de datos, visualización y reportes científicos con herramientas modernas.',
    accent: '#267342',
    tipo: 'Diplomado',
  },
  {
    bg: new URL('../../assets/images/carrusel/slide4.jpg', import.meta.url).href,
    badge: 'CONVOCATORIA GESTIÓN ACADÉMICA 2026 · CEUB',
    title: 'Unidad de Postgrado de',
    titleAccent: 'Estadística UMSA',
    subtitle: 'Excelencia académica de cuarto nivel en la Universidad Mayor de San Andrés. Programas acreditados bajo el Sistema Nacional de Acreditación del CEUB.',
    accent: '#267342',
    tipo: null,
  },
];

export const HeroSection = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 350);
  }, [animating]);

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '620px',
      overflow: 'hidden',
      background: '#0d1a0f',
    }}>
      {/* ── Background Image with Ken Burns effect ── */}
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${s.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
            transform: idx === current ? 'scale(1.03)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
            transitionDuration: idx === current ? '6s, 6s' : '0.7s, 0.7s',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Multi-layer Overlay for readability ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, rgba(8,24,12,0.92) 0%, rgba(8,24,12,0.76) 50%, rgba(8,24,12,0.58) 100%)',
        zIndex: 1,
      }} />

      {/* ── Left accent stripe ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '5px',
        height: '100%',
        background: `linear-gradient(180deg, ${slide.accent}, ${slide.accent}aa, transparent)`,
        zIndex: 2,
        transition: 'background 0.5s ease',
      }} />

      {/* ── Bottom progress bar ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(255,255,255,0.15)',
        zIndex: 3,
      }}>
        <div style={{
          height: '100%',
          background: slide.accent,
          width: `${((current + 1) / SLIDES.length) * 100}%`,
          transition: 'width 0.4s ease',
          borderRadius: '0 2px 2px 0',
        }} />
      </div>

      {/* ── Main Content Container ── */}
      <div className="container" style={{
        position: 'relative',
        zIndex: 4,
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
        minHeight: '620px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>

        {/* ── Left Flank Logos (UMSA & FCPN) - Puros logos, sin recuadros ni textos ── */}
        <div className="hero-flank-logos">
          <img
            src={logoUmsa}
            alt="Universidad Mayor de San Andrés"
            title="Universidad Mayor de San Andrés - UMSA"
            className="hero-flank-logo-img"
          />
          <img
            src={logoFcpn}
            alt="Facultad de Ciencias Puras y Naturales"
            title="Facultad de Ciencias Puras y Naturales - FCPN"
            className="hero-flank-logo-img"
          />
        </div>

        {/* ── Center: Slide Text & Content ── */}
        <div style={{
          flex: '1 1 auto',
          maxWidth: '760px',
          padding: '0 1rem',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          {/* Fila móvil para pantallas pequeñas (sin recuadros ni textos) */}
          <div className="hero-logos-mobile-row">
            <img src={logoUmsa} alt="UMSA" className="hero-flank-logo-img" />
            <img src={logoFcpn} alt="FCPN" className="hero-flank-logo-img" />
            <img src={logoEstadistica} alt="Carrera de Estadística" className="hero-flank-logo-img" />
            <img src={logoMaestriaDatos} alt="Posgrado en Estadística" className="hero-flank-logo-img" />
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '99px',
            background: 'rgba(255,255,255,0.12)',
            border: `1.5px solid ${slide.accent}80`,
            color: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginBottom: '1.25rem',
            backdropFilter: 'blur(6px)',
            transition: 'border-color 0.4s ease',
          }}>
            {slide.tipo && (
              <span style={{
                background: slide.accent,
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 900,
                padding: '0.15rem 0.55rem',
                borderRadius: '99px',
                letterSpacing: '0.06em',
                marginRight: '0.2rem',
              }}>
                {slide.tipo.toUpperCase()}
              </span>
            )}
            <span>{slide.badge}</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.8vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.2,
            color: '#ffffff',
            marginBottom: '1.25rem',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 16px rgba(0,0,0,0.55)',
          }}>
            <span style={{ display: 'block' }}>{slide.title}</span>
            <span style={{
              display: 'block',
              color: slide.accent === '#4f7e9f' ? '#9fd4f0' : '#7ee8a2',
              fontWeight: 900,
            }}>
              {slide.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
            maxWidth: '620px',
          }}>
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('admision')}
              className="btn btn-lg"
              style={{
                background: slide.accent,
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: `0 8px 24px -4px ${slide.accent}60`,
                fontWeight: 800,
              }}
            >
              <GraduationCap size={18} />
              <span>Postular a Convocatoria 2026</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('programas')}
              className="btn btn-lg"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1.5px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <Layers size={16} />
              <span>Ver Programas Académicos</span>
            </button>
          </div>
        </div>

        {/* ── Right Flank Logos (Carrera de Estadística & Maestría/Posgrado) - Puros logos, sin recuadros ni textos ── */}
        <div className="hero-flank-logos">
          <img
            src={logoEstadistica}
            alt="Carrera de Estadística UMSA"
            title="Carrera de Estadística - UMSA FCPN"
            className="hero-flank-logo-img"
          />
          <img
            src={logoMaestriaDatos}
            alt="Unidad de Posgrado en Estadística"
            title="Unidad de Posgrado de Estadística - UMSA"
            className="hero-flank-logo-img"
          />
        </div>

      </div>

      {/* ── Arrow Navigation ── */}
      <button
        onClick={prev}
        aria-label="Anterior"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 5,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        aria-label="Siguiente"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 5,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '1.5px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Dot Indicators ── */}
      <div style={{
        position: 'absolute',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
            style={{
              width: idx === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '99px',
              background: idx === current ? slide.accent : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div style={{
        position: 'absolute',
        bottom: '1.25rem',
        right: '1.5rem',
        zIndex: 5,
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.78rem',
        fontWeight: 700,
        fontFamily: 'var(--font-family-mono)',
        letterSpacing: '0.05em',
      }}>
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
};
