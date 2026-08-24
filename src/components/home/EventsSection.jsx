import React from 'react';
import { newsAndDefensesData } from '../../data/newsData';
import { Calendar, Video, ArrowRight, ExternalLink, GraduationCap, Users } from 'lucide-react';

export const EventsSection = ({ onNavigate }) => {
  const defenses = newsAndDefensesData.filter(d => d.type === 'defense');

  return (
    <section className="section-spacing" style={{ position: 'relative', background: '#f8fafc' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <Calendar size={14} />
            <span>ACTIVIDAD CIENTÍFICA & DEFENSAS PÚBLICAS</span>
          </div>
          <h2 className="section-title">
            Calendario de Admisiones y Defensas de Grado
          </h2>
          <p className="section-subtitle">
            Transmisiones en vivo de defensas de tesis de maestría y fechas clave del cronograma de admisión académica 2026.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {defenses.map((def) => (
            <div
              key={def.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 0,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Event Image */}
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={def.image || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'}
                  alt={def.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className="badge badge-orange">
                    <GraduationCap size={13} /> {def.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-accent-orange)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} /> {def.date}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    {def.title}
                  </h3>

                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    marginBottom: '1.25rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Postulante:</strong> {def.author}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--color-umsa-blue-dark)' }}>Tutor de Tesis:</strong> {def.tutor}
                    </div>
                    <div style={{ color: 'var(--color-text-subtle)', marginTop: '0.2rem' }}>
                      <strong>Modalidad:</strong> {def.modality}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <a
                    href={def.zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Video size={14} />
                    <span>Transmisión Zoom</span>
                  </a>

                  <button
                    onClick={() => onNavigate('noticias')}
                    className="btn btn-secondary btn-sm"
                  >
                    Ver Todas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
