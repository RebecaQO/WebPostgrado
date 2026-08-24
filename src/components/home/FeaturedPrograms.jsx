import React from 'react';
import { programsData } from '../../data/programsData';
import { 
  GraduationCap, 
  Award, 
  Layers, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CheckCircle 
} from 'lucide-react';

export const FeaturedPrograms = ({ onSelectProgram, onNavigateToAdmission }) => {
  return (
    <section className="section-spacing" style={{ position: 'relative', background: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <GraduationCap size={14} />
            <span>OFERTA ACADÉMICA VIGENTE</span>
          </div>
          <h2 className="section-title">
            Programas con Convocatoria Abierta (Gestión 2026)
          </h2>
          <p className="section-subtitle">
            Planes de estudio de cuarto nivel estructurados bajo el Sistema Nacional de Acreditación del CEUB, orientados a la práctica computacional intensiva y el rigor metodológico.
          </p>
        </div>

        {/* Programs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem'
        }}>
          {programsData.map((prog) => {
            const isMaster = prog.type === 'Maestría';

            return (
              <div
                key={prog.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: prog.featured ? '2px solid rgba(242, 104, 28, 0.4)' : '1px solid #e2e8f0',
                  boxShadow: prog.featured ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                {/* Card Top Badges */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '1.25rem'
                  }}>
                    <span className={`badge ${isMaster ? 'badge-orange' : 'badge-blue'}`}>
                      {prog.type}
                    </span>

                    <span className="badge badge-green">
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                      {prog.status}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-subtle)',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                    fontFamily: 'var(--font-family-mono)'
                  }}>
                    {prog.code} • {prog.resolution}
                  </div>

                  <h3 style={{
                    fontSize: '1.35rem',
                    color: 'var(--color-umsa-blue-dark)',
                    marginBottom: '0.85rem',
                    lineHeight: 1.3
                  }}>
                    {prog.title}
                  </h3>

                  <p style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                    color: 'var(--color-text-muted)'
                  }}>
                    {prog.description}
                  </p>

                  {/* Highlights Pill Info */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.95rem 1.1rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                      <Clock size={15} color="var(--color-accent-orange)" />
                      <span><strong>Duración:</strong> {prog.duration}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                      <Award size={15} color="#0284c7" />
                      <span><strong>Grado:</strong> {prog.degree}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                      <Layers size={15} color="#d97706" />
                      <span><strong>Modalidad:</strong> {prog.modality}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <button
                    onClick={() => onSelectProgram(prog)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Ver Malla & Requisitos
                  </button>

                  <button
                    onClick={() => onNavigateToAdmission(prog.id)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <span>Postular</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
