import React, { useState, useEffect } from 'react';
import { regulationsData } from '../../data/regulationsData';
import { downloadDocument } from '../../utils/downloader';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  FolderArchive,
  ExternalLink,
  History,
  FolderDown,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

export const RegulationsView = () => {
  const [mainTab, setMainTab] = useState('pasadas'); // 'pasadas' | 'normativa'
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGestion, setSelectedGestion] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch past convocatorias from backend
  useEffect(() => {
    const fetchConvocatoriasPasadas = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/convocatorias-pasadas');
        if (res.ok) {
          const data = await res.json();
          setConvocatorias(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error cargando convocatorias pasadas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvocatoriasPasadas();
  }, []);

  const gestiones = ['todos', ...Array.from(new Set(convocatorias.map(c => c.gestion).filter(Boolean))).sort().reverse()];

  const filteredConvocatorias = convocatorias.filter((conv) => {
    if (selectedGestion !== 'todos' && conv.gestion !== selectedGestion) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        conv.titulo.toLowerCase().includes(q) ||
        conv.programa.toLowerCase().includes(q) ||
        conv.resolucion_hcu.toLowerCase().includes(q) ||
        conv.gestion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDownloadNormativa = (doc) => {
    const fileContent = `================================================================================
UNIVERSIDAD MAYOR DE SAN ANDRÉS
FACULTAD DE CIENCIAS PURAS Y NATURALES
CARRERA DE ESTADÍSTICA — UNIDAD DE POSGRADO E INVESTIGACIÓN
================================================================================

DOCUMENTO OFICIAL: ${doc.title}
CÓDIGO INSTITUCIONAL: ${doc.code}
CATEGORÍA: ${doc.category}
RESOLUCIÓN AVAL: CEUB / HCU UMSA

--------------------------------------------------------------------------------
RESUMEN DEL DOCUMENTO:
${doc.description}

ESTRUCTURA NORMATIVA GENERAL:
1. Disposiciones Generales y Ámbito de Aplicación.
2. Admisión, Permanencia y Evaluación Continua de Posgraduantes.
3. Tribunal Examinador, Tutorías y Normativa de Tesis de Grado.
4. Homologación de Créditos y Obtención del Grado de Magíster / Diplomado.

Para consultar el texto íntegro escaneado con sellos de Rectorado, acuda a la Secretaría de Posgrado (Campus Cota Cota Calle 27) o escriba a: evapost@fcpn.edu.bo
================================================================================
`;
    downloadDocument(doc.title, fileContent, `${doc.code}_${doc.title.slice(0, 25).replace(/\s+/g, '_')}.txt`);
  };

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <History size={14} />
            <span>MEMORIA INSTITUCIONAL & NORMATIVA</span>
          </div>
          <h1 className="section-title">
            Convocatorias Anteriores y Resoluciones HCU
          </h1>
          <p className="section-subtitle">
            Repositorio histórico oficial de convocatorias pasadas con enlaces de visualización en Google Drive, descargas en PDF y resoluciones del Honorable Consejo Universitario (HCU).
          </p>
        </div>

        {/* Top Sub-tabs Selector */}
        <div className="tabs-header" style={{ maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <button
            className={`tab-btn ${mainTab === 'pasadas' ? 'active' : ''}`}
            onClick={() => setMainTab('pasadas')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <FolderArchive size={18} />
            <span>1. Convocatorias Pasadas ({convocatorias.length})</span>
          </button>

          <button
            className={`tab-btn ${mainTab === 'normativa' ? 'active' : ''}`}
            onClick={() => setMainTab('normativa')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <ShieldCheck size={18} />
            <span>2. Reglamentos & Normativa CEUB</span>
          </button>
        </div>

        {/* ── TAB 1: CONVOCATORIAS ANTERIORES ── */}
        {mainTab === 'pasadas' && (
          <div className="animate-fade-in">
            {/* Filter and Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {/* Year/Gestión filters */}
              <div className="tabs-header">
                {gestiones.map((ges, idx) => (
                  <button
                    key={idx}
                    className={`tab-btn ${selectedGestion === ges ? 'active' : ''}`}
                    onClick={() => setSelectedGestion(ges)}
                    style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem' }}
                  >
                    {ges === 'todos' ? 'Todas las Gestiones' : ges}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="text"
                  placeholder="Buscar convocatoria anterior..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', background: '#ffffff' }}
                />
              </div>
            </div>

            {/* Convocatorias Grid */}
            {loading ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff' }}>
                <p style={{ color: 'var(--color-green-inst)', fontWeight: 600 }}>Cargando convocatorias anteriores...</p>
              </div>
            ) : filteredConvocatorias.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff' }}>
                <p>No se encontraron convocatorias pasadas para los filtros seleccionados.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredConvocatorias.map((conv) => (
                  <div
                    key={conv.id}
                    className="glass-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1.5px solid var(--color-border)',
                      boxShadow: 'var(--shadow-sm)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="badge badge-green-inst">
                          {conv.gestion}
                        </span>
                        <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.75rem', fontWeight: 700 }}>
                          📜 {conv.resolucion_hcu}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                        {conv.id} • {conv.nivel}
                      </span>

                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.6rem', lineHeight: 1.35, fontWeight: 800 }}>
                        {conv.titulo}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {conv.descripcion}
                      </p>

                      <div style={{
                        background: '#f8fafc',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-subtle)',
                        marginBottom: '1.25rem',
                        border: '1px solid #e2e8f0'
                      }}>
                        <strong>Programa:</strong> {conv.programa}
                      </div>
                    </div>

                    {/* Drive and PDF buttons */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.65rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      <a
                        href={conv.enlace_drive}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem',
                          color: 'var(--color-green-inst)',
                          borderColor: 'var(--color-green-inst)'
                        }}
                      >
                        <FolderDown size={14} />
                        <span>Ver en Drive</span>
                      </a>

                      <a
                        href={conv.enlace_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        <Download size={14} />
                        <span>Descargar PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: REGLAMENTACIÓN & NORMATIVA CEUB ── */}
        {mainTab === 'normativa' && (
          <div className="animate-fade-in">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}>
              {regulationsData.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '1.5rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-orange">
                        {doc.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                        {doc.code}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {doc.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {doc.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                      Tamaño: <strong style={{ color: 'var(--color-text-main)' }}>{doc.fileSize}</strong>
                    </span>

                    <button
                      onClick={() => handleDownloadNormativa(doc)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem' }}
                    >
                      <Download size={14} />
                      <span>Descargar Documento</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
