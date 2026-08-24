import React, { useState } from 'react';
import { programsData } from '../../data/programsData';
import { ProgramDetailModal } from './ProgramDetailModal';
import { 
  GraduationCap, 
  Search, 
  Layers, 
  Award, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Filter
} from 'lucide-react';

export const ProgramsView = ({ onNavigateToAdmission, initialFilter = null }) => {
  const [activeCategory, setActiveCategory] = useState(initialFilter?.level || 'todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);

  const filteredPrograms = programsData.filter((prog) => {
    if (activeCategory === 'maestria' && prog.typeFilter !== 'maestria') return false;
    if (activeCategory === 'diplomado' && prog.typeFilter !== 'diplomado') return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = prog.title.toLowerCase().includes(q);
      const matchArea = prog.area.toLowerCase().includes(q);
      const matchCode = prog.code.toLowerCase().includes(q);
      const matchDesc = prog.description.toLowerCase().includes(q);
      if (!matchTitle && !matchArea && !matchCode && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <GraduationCap size={14} />
            <span>CATÁLOGO ACADÉMICO OFICIAL</span>
          </div>
          <h1 className="section-title">
            Programas de Posgrado en Estadística y Ciencia de Datos
          </h1>
          <p className="section-subtitle">
            Planes de estudio de cuarto nivel estructurados bajo el Sistema Nacional de Acreditación del CEUB. Convocatoria y postulaciones Gestión 2026.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* Sub-tabs selector */}
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeCategory === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveCategory('todos')}
            >
              <Layers size={16} />
              <span>TODAS LAS OFERTAS ({programsData.length})</span>
            </button>

            <button
              className={`tab-btn ${activeCategory === 'maestria' ? 'active' : ''}`}
              onClick={() => setActiveCategory('maestria')}
            >
              <GraduationCap size={16} />
              <span>MAESTRÍAS (4 Semestres)</span>
            </button>

            <button
              className={`tab-btn ${activeCategory === 'diplomado' ? 'active' : ''}`}
              onClick={() => setActiveCategory('diplomado')}
            >
              <FileText size={16} />
              <span>DIPLOMADOS (6 Meses)</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre, código o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', background: '#ffffff' }}
            />
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff' }}>
            <Filter size={40} color="var(--color-text-subtle)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--color-umsa-blue-dark)' }}>No se encontraron programas con estos filtros</h3>
            <p>Intenta ajustar el término de búsqueda o seleccionar otra categoría.</p>
            <button
              onClick={() => { setActiveCategory('todos'); setSearchTerm(''); }}
              className="btn btn-outline-orange btn-sm"
              style={{ marginTop: '1rem' }}
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem'
          }}>
            {filteredPrograms.map((prog) => {
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
                    border: '1px solid #e2e8f0',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    {/* Top tags */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className={`badge ${isMaster ? 'badge-orange' : 'badge-blue'}`}>
                        {prog.type}
                      </span>

                      <span className="badge badge-green">
                        {prog.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)', fontWeight: 700, marginBottom: '0.35rem' }}>
                      {prog.code} • {prog.resolution}
                    </div>

                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {prog.title}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {prog.description}
                    </p>

                    {/* Metadata pill */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.95rem 1.1rem',
                      border: '1px solid #e2e8f0',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                        <Clock size={14} color="var(--color-accent-orange)" />
                        <span><strong>Duración:</strong> {prog.duration}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                        <Award size={14} color="#0284c7" />
                        <span><strong>Grado Oficial:</strong> {prog.degree}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-main)' }}>
                        <Layers size={14} color="#d97706" />
                        <span><strong>Modalidad:</strong> {prog.modality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '0.75rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <button
                      onClick={() => setSelectedProgram(prog)}
                      className="btn btn-secondary btn-sm"
                    >
                      Ver Malla & Requisitos
                    </button>

                    <button
                      onClick={() => onNavigateToAdmission(prog.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Postular</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal render */}
        {selectedProgram && (
          <ProgramDetailModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onApply={(progId) => {
              setSelectedProgram(null);
              onNavigateToAdmission(progId);
            }}
          />
        )}
      </div>
    </div>
  );
};
