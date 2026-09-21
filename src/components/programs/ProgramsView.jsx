import React, { useEffect, useState } from 'react';
import { ProgramDetailModal } from './ProgramDetailModal';
import { 
  GraduationCap, 
  Search, 
  Layers, 
  Award, 
  Clock, 
  FileText,
  Filter,
  MessageCircle
} from 'lucide-react';

export const ProgramsView = ({ onNavigateToAdmission, initialFilter = null }) => {
  const [activeCategory, setActiveCategory] = useState(initialFilter?.level || 'todos');
  const [searchTerm, setSearchTerm] = useState(initialFilter?.search || '');
  const [selectedArea, setSelectedArea] = useState(initialFilter?.area || 'todas');
  const [selectedModality, setSelectedModality] = useState(initialFilter?.modality || 'todas');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if initialFilter prop changes (e.g. searching again from banner)
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.level) setActiveCategory(initialFilter.level);
      if (initialFilter.search !== undefined) setSearchTerm(initialFilter.search || '');
      if (initialFilter.area) setSelectedArea(initialFilter.area);
      if (initialFilter.modality) setSelectedModality(initialFilter.modality);
    }
  }, [initialFilter]);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await fetch('/api/programas/activos');
        const data = await response.json();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando programas:', error);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter((prog) => {
    if (activeCategory === 'maestria' && prog.typeFilter !== 'maestria') return false;
    if (activeCategory === 'diplomado' && prog.typeFilter !== 'diplomado') return false;
    if (activeCategory === 'autofinanciada' && prog.typeFilter !== 'autofinanciada') return false;
    if (activeCategory === 'terminal' && prog.typeFilter !== 'terminal') return false;

    if (selectedArea && selectedArea !== 'todas') {
      const qArea = selectedArea.toLowerCase();
      const pArea = (prog.area || '').toLowerCase();
      const pTitle = (prog.title || '').toLowerCase();
      if (!pArea.includes(qArea) && !pTitle.includes(qArea)) return false;
    }

    if (selectedModality && selectedModality !== 'todas') {
      const qMod = selectedModality.toLowerCase();
      const pMod = (prog.modality || '').toLowerCase();
      if (!pMod.includes(qMod)) return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = (prog.title || '').toLowerCase().includes(q);
      const matchArea = (prog.area || '').toLowerCase().includes(q);
      const matchCode = (prog.id || '').toLowerCase().includes(q);
      const matchDesc = (prog.description || '').toLowerCase().includes(q);
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
              <span>TODAS LAS OFERTAS ({programs.length})</span>
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

        {/* Active Filter Chips */}
        {(selectedArea !== 'todas' || selectedModality !== 'todas' || searchTerm || activeCategory !== 'todos') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Filtros aplicados:</span>
            {activeCategory !== 'todos' && (
              <span className="badge badge-green" style={{ borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Nivel: {activeCategory === 'maestria' ? 'Maestrías' : 'Diplomados'}
              </span>
            )}
            {selectedArea !== 'todas' && (
              <span className="badge badge-blue" style={{ borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Especialidad: {selectedArea}
              </span>
            )}
            {selectedModality !== 'todas' && (
              <span className="badge" style={{ borderRadius: '3px', background: '#e0f2fe', color: '#0369a1', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
                Modalidad: {selectedModality}
              </span>
            )}
            {searchTerm && (
              <span className="badge" style={{ borderRadius: '3px', background: '#e2e8f0', color: 'var(--color-text-main)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Búsqueda: "{searchTerm}"
              </span>
            )}
            <button 
              onClick={() => { setActiveCategory('todos'); setSelectedArea('todas'); setSelectedModality('todas'); setSearchTerm(''); }}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '3px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                fontWeight: 700
              }}
            >
              ✕ Restablecer filtros
            </button>
          </div>
        )}

        {/* Programs Grid */}
        {loading ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff' }}>
            <h3 style={{ color: 'var(--color-umsa-blue-dark)' }}>Cargando programas vigentes...</h3>
          </div>
        ) : filteredPrograms.length === 0 ? (
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem'
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
                    borderRadius: '4px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>

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

                  {/* Actions: Solo Más Información y WhatsApp */}
                  <div
                    className="programs-card-actions"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.75rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    <button
                      onClick={() => setSelectedProgram(prog)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderRadius: '4px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', fontWeight: 600 }}
                    >
                      <FileText size={15} color="var(--color-green-inst)" />
                      <span>Más información</span>
                    </button>

                    <a
                      href={`https://wa.me/59176543210?text=${encodeURIComponent(`Hola, deseo más información sobre el programa: ${prog.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm"
                      style={{
                        background: '#25D366',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp</span>
                    </a>
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

      <style>{`
        @media (max-width: 540px) {
          .programs-card-actions {
            grid-template-columns: 1fr !important;
          }
          .programs-card-actions .btn {
            width: 100% !important;
            padding: 0.65rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
