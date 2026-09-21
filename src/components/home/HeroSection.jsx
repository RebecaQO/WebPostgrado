import React, { useState, useEffect, useCallback } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { apiUrl } from '../../utils/api';

const SLIDES = [
  new URL('../../assets/images/carrusel/slide1.jpg', import.meta.url).href,
  new URL('../../assets/images/carrusel/slide2.jpg', import.meta.url).href,
  new URL('../../assets/images/carrusel/slide3.jpg', import.meta.url).href,
  new URL('../../assets/images/carrusel/slide4.jpg', import.meta.url).href,
];

export const HeroSection = ({ onNavigate, onFilterPrograms }) => {
  const [current, setCurrent] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [areas, setAreas] = useState([]);

  // Auto-advance slides every 6 seconds
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Fetch unique areas from the DB via the programas activos endpoint
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(apiUrl('/api/programas/activos'));
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Extract unique non-empty areas from the BD
            const unique = [...new Set(
              data
                .map(p => p.area || '')
                .filter(a => a.trim().length > 0)
            )].sort();
            setAreas(unique);
          }
        }
      } catch (_) {
        // Fallback: keep empty → no options shown besides default
      }
    };
    fetchAreas();
  }, []);

  // Handle program search submission (solo filtros)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterPrograms) {
      onFilterPrograms({
        level: selectedLevel || 'todos',
        area: selectedArea || 'todas',
        modality: 'todas',
        search: ''
      });
    } else if (onNavigate) {
      onNavigate('programas');
    }
  };

  return (
    <section className="hero-banner-section">
      {/* ── Background Slides with Subtle Ken Burns Transition ── */}
      {SLIDES.map((slideImg, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slideImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: idx === current ? 1 : 0,
            transform: idx === current ? 'scale(1.03)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
            transitionDuration: idx === current ? '6s, 6s' : '0.8s, 0.8s',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Overlay equilibrado ── */}
      <div className="hero-image-overlay" />

      {/* ── Central Hero Content ── */}
      <div className="hero-content-wrapper">
        
        {/* ── Texto Institucional ── */}
        <div className="hero-top-badge animate-fade-in">
          <span className="hero-top-institution">
            FACULTAD DE CIENCIAS PURAS Y NATURALES · UNIVERSIDAD MAYOR DE SAN ANDRÉS
          </span>
          <h1 className="hero-top-title">
            UNIDAD DE POSGRADO EN ESTADÍSTICA
          </h1>
        </div>

        {/* ── Buscador por Filtros ── */}
        <div className="emlyon-homepage-filter-banner-block animate-fade-in">
          <div className="emlyon-homepage-filter-banner-block-title">
            Encuentra tu programa
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="emlyon-homepage-filter-banner-form"
            noValidate
          >
            {/* 1. Nivel del Programa */}
            <div className="filter-input-group">
              <GraduationCap size={18} className="filter-input-icon" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="banner-filter-select"
                aria-label="Seleccionar nivel académico"
              >
                <option value="">Nivel académico...</option>
                <option value="maestria">Maestrías (M.Sc.)</option>
                <option value="diplomado">Diplomados</option>
              </select>
            </div>

            {/* 2. Especialidad / Área — conectado a BD */}
            <div className="filter-input-group">
              <BookOpen size={18} className="filter-input-icon" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="banner-filter-select"
                aria-label="Seleccionar especialidad o área"
              >
                <option value="">Especialidad / Área...</option>
                {areas.length > 0 ? (
                  areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))
                ) : (
                  /* Fallback estático si la BD no responde */
                  <>
                    <option value="Ciencia de Datos">Ciencia de Datos &amp; IA</option>
                    <option value="Estadística Aplicada">Estadística Aplicada &amp; Modelos</option>
                    <option value="Bioestadística">Bioestadística &amp; Salud Pública</option>
                    <option value="Finanzas">Finanzas Cuantitativas &amp; Actuaria</option>
                  </>
                )}
              </select>
            </div>

            {/* 3. Botón de Búsqueda */}
            <button
              type="submit"
              className="emlyon-homepage-filter-banner-button"
            >
              <span>Ver programas</span>
              <ArrowRight size={17} />
            </button>
          </form>
        </div>

      </div>

      {/* ── Flechas de Navegación del Carrusel ── */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        style={{
          position: 'absolute',
          left: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          width: '38px',
          height: '38px',
          borderRadius: '4px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)')}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        aria-label="Slide siguiente"
        style={{
          position: 'absolute',
          right: '1.25rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 4,
          width: '38px',
          height: '38px',
          borderRadius: '4px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.75)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)')}
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Indicadores de Slide ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          display: 'flex',
          gap: '0.4rem',
        }}
      >
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            style={{
              width: idx === current ? '22px' : '7px',
              height: '5px',
              borderRadius: '2px',
              background: idx === current ? 'var(--color-green-inst)' : 'rgba(255, 255, 255, 0.45)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
};
