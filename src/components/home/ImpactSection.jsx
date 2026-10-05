import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import slide4 from '../../assets/images/carrusel/slide4.jpg';

export const ImpactSection = ({ onExplorePrograms, onAboutInstitution }) => {
  return (
    <section className="section-spacing" data-reveal aria-label="Compromiso e impacto institucional"
      style={{ background: 'linear-gradient(180deg, #edf4f9 0%, #e8f0ea 100%)', paddingInline: '1rem' }}
    >
      <div className="container">
        <div className="impact">
          <div className="impact__media">
            <img
              src={slide4}
              alt="Laboratorios de investigación y computación científica de posgrado UMSA"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="impact__body">
            <div className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
              <Sparkles size={13} />
              <span>Descubrimiento &amp; Transformación</span>
            </div>
            <h2 style={{ color: '#ffffff', fontFamily: 'var(--font-family-heading)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '0', lineHeight: 1.2 }}>
              Investigación cuantitativa que <span style={{ color: '#68d391' }}>transforma decisiones</span> en el país
            </h2>
            <p style={{ color: 'rgba(220,235,228,0.88)', lineHeight: 1.65, margin: 0 }}>
              Desde la modelación probabilística hasta la inteligencia artificial y el aprendizaje automático, nuestros programas de posgrado te preparan para liderar soluciones de alto impacto en sectores estratégicos.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: 'var(--space-xs)' }}>
              <button type="button" className="btn btn--primary" onClick={onExplorePrograms}>
                <span>Explorar programas</span>
                <ArrowRight size={16} />
              </button>
              <button type="button" className="btn btn--ghost-white" onClick={onAboutInstitution}>
                <BookOpen size={15} />
                <span>Nuestra historia</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

