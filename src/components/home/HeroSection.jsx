import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Database, 
  GraduationCap, 
  Layers
} from 'lucide-react';

export const HeroSection = ({ onNavigate, onFilterPrograms }) => {
  const [levelFilter, setLevelFilter] = useState('todos');
  const [areaFilter, setAreaFilter] = useState('todas');
  const [modalityFilter, setModalityFilter] = useState('todas');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onFilterPrograms) {
      onFilterPrograms({ level: levelFilter, area: areaFilter, modality: modalityFilter });
    }
    onNavigate('programas');
  };

  return (
    <section style={{
      position: 'relative',
      padding: '5.5rem 0 4.5rem 0',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Glows */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '950px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(242, 104, 28, 0.08) 0%, rgba(0, 56, 118, 0.06) 50%, transparent 80%)',
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          {/* Top Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-accent-orange-subtle)',
            border: '1.5px solid var(--color-accent-orange-border)',
            color: 'var(--color-accent-orange)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} />
            <span>ADMISIÓN GESTIÓN ACADÉMICA 2026 • CUARTO NIVEL UNIVERSITARIO</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.85rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            letterSpacing: '-0.025em',
            color: 'var(--color-umsa-blue-dark)'
          }}>
            Maestrías y Posgrados en{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--color-umsa-blue) 20%, var(--color-accent-orange) 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Estadística y Ciencia de Datos
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: '840px',
            marginBottom: '2.5rem',
            fontWeight: 400
          }}>
            Investigación rigurosa, modelamiento estocástico avanzado y toma de decisiones basada en evidencia empírica. Formamos investigadores y profesionales de alto impacto bajo el estándar de la Universidad Mayor de San Andrés (FCPN).
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button
              onClick={() => onNavigate('admision')}
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
            >
              <span>Postular a Convocatoria 2026</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigate('programas')}
              className="btn btn-secondary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
            >
              <Layers size={18} color="var(--color-accent-orange)" />
              <span>Explorar Oferta Académica</span>
            </button>
          </div>

          {/* Quick Program Search & Filter Bar */}
          <div className="glass-card" style={{
            width: '100%',
            padding: '1.75rem 2rem',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-umsa-blue-dark)',
              fontWeight: 800,
              fontSize: '1rem',
              marginBottom: '1.25rem',
              textAlign: 'left'
            }}>
              <Search size={18} color="var(--color-accent-orange)" />
              <span>Buscador y Filtro Rápido de Programas de Posgrado</span>
            </div>

            <form onSubmit={handleSearch} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
              gap: '0.85rem',
              alignItems: 'center'
            }}>
              {/* Level Filter */}
              <div>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="form-select"
                  style={{ background: '#f8fafc', fontSize: '0.875rem' }}
                >
                  <option value="todos">Nivel: Todas las Ofertas</option>
                  <option value="maestria">Maestrías (2 Años - M.Sc.)</option>
                  <option value="diplomado">Diplomados (6 Meses)</option>
                </select>
              </div>

              {/* Area Filter */}
              <div>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="form-select"
                  style={{ background: '#f8fafc', fontSize: '0.875rem' }}
                >
                  <option value="todas">Área: Todas las Especialidades</option>
                  <option value="data-science">Ciencia de Datos & ML</option>
                  <option value="bioestadistica">Bioestadística & Salud</option>
                  <option value="actuarial">Actuaria & Finanzas</option>
                </select>
              </div>

              {/* Modality Filter */}
              <div>
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className="form-select"
                  style={{ background: '#f8fafc', fontSize: '0.875rem' }}
                >
                  <option value="todas">Modalidad: Virtual & Híbrida</option>
                  <option value="virtual">100% Virtual Síncrona</option>
                  <option value="hibrida">Híbrida con Labs FCPN</option>
                </select>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.8rem 1.75rem', whiteSpace: 'nowrap' }}
              >
                <Search size={16} />
                <span>Buscar Ofertas</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
