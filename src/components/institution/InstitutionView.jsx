import React, { useState } from 'react';
import { facultyData, institutionTimeline } from '../../data/facultyData';
import { 
  Building2, 
  ShieldCheck, 
  Target, 
  Eye, 
  BookOpen, 
  Award, 
  History, 
  Users, 
  GraduationCap, 
  ExternalLink,
  BookMarked
} from 'lucide-react';

export const InstitutionView = () => {
  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Building2 size={14} />
            <span>NUESTRA INSTITUCIÓN</span>
          </div>
          <h1 className="section-title">
            Excelencia Académica, Investigación & Rigor Estadístico
          </h1>
          <p className="section-subtitle">
            Unidad de Posgrado e Investigación — Carrera de Estadística, Facultad de Ciencias Puras y Naturales, Universidad Mayor de San Andrés.
          </p>
        </div>

        {/* Misión y Visión Cards */}
        <div className="grid-2" style={{ marginBottom: '4.5rem' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--color-accent-orange)', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-orange-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={22} color="var(--color-accent-orange)" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-umsa-blue-dark)' }}>Misión Académica</h3>
            </div>
            <p style={{ lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Formar investigadores y profesionales de cuarto nivel con sólida fundamentación matemática y estocástica, capaces de formular modelos probabilísticos, diseñar experimentos complejos y liderar la toma de decisiones basada en datos para resolver problemáticas prioritarias del desarrollo científico, social, ambiental y productivo del Estado Plurinacional de Bolivia.
            </p>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #0284c7', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Eye size={22} color="#0284c7" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-umsa-blue-dark)' }}>Visión Estratégica 2030</h3>
            </div>
            <p style={{ lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Consolidarse como el centro de posgrado e investigación de referencia internacional en Estadística y Ciencia de Datos en la región andina, acreditado con los más altos estándares del Sistema de la Universidad Boliviana (CEUB), impulsando la innovación analítica y la generación de conocimiento transferible.
            </p>
          </div>
        </div>

        {/* Reseña Histórica & Timeline */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag">
              <History size={14} />
              <span>TRAYECTORIA HISTÓRICA</span>
            </div>
            <h2>Más de Cinco Décadas al Servicio de la Ciencia</h2>
          </div>

          <div style={{
            position: 'relative',
            maxWidth: '850px',
            margin: '0 auto',
            paddingLeft: '2rem',
            borderLeft: '3px solid var(--color-accent-orange)'
          }}>
            {institutionTimeline.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                {/* Node point */}
                <div style={{
                  position: 'absolute',
                  left: '-2.72rem',
                  top: '0.2rem',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '3px solid var(--color-accent-orange)',
                  boxShadow: '0 0 10px rgba(242, 104, 28, 0.5)'
                }} />

                <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: 'var(--color-accent-orange)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-family-mono)'
                  }}>
                    {item.year}
                  </div>
                  <h4 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claustro Docente e Investigadores */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag">
              <Users size={14} />
              <span>CLAUSTRO DOCENTE & INVESTIGADORES</span>
            </div>
            <h2>Comité Académico y Docentes Titulares</h2>
            <p className="section-subtitle">
              Profesores con grado doctoral (Ph.D.) y maestría (M.Sc.) de universidades de renombre mundial, dedicados a la docencia e investigación aplicada.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {facultyData.map((doc) => (
              <div
                key={doc.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: '#ffffff'
                }}
              >
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  style={{
                    width: '104px',
                    height: '104px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--color-accent-orange)',
                    boxShadow: '0 4px 14px rgba(242, 104, 28, 0.25)',
                    marginBottom: '1.25rem'
                  }}
                />

                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.25rem' }}>
                  {doc.name}
                </h3>

                <div style={{
                  fontSize: '0.825rem',
                  color: 'var(--color-accent-orange)',
                  fontWeight: 800,
                  marginBottom: '0.35rem'
                }}>
                  {doc.degree}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '1rem' }}>
                  {doc.university}
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  width: '100%',
                  fontSize: '0.825rem',
                  textAlign: 'left',
                  marginBottom: '1.25rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: 'var(--color-umsa-blue-dark)', display: 'block', marginBottom: '0.25rem' }}>
                    Áreas de Especialidad:
                  </strong>
                  <div style={{ color: 'var(--color-text-muted)' }}>{doc.specialty}</div>
                </div>

                {/* Academic Profile Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: 'auto' }}>
                  <a
                    href={doc.links.scholar}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    title="Google Scholar"
                  >
                    Google Scholar
                  </a>
                  <a
                    href={doc.links.orcid}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                    title="ORCID"
                  >
                    ORCID
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
