import React, { useState } from 'react';
import { regulationsData } from '../../data/regulationsData';
import { downloadDocument } from '../../utils/downloader';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  FolderArchive,
  ExternalLink
} from 'lucide-react';

export const RegulationsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const filteredDocs = regulationsData.filter(doc => {
    if (selectedCategory !== 'todos' && doc.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q) || doc.code.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = ['todos', 'Reglamentación General', 'Reglamentación Facultativa', 'Plantillas de Tesis', 'Trámites de Titulación', 'Estudiantes Extranjeros'];

  const handleDownload = (doc) => {
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

Para consultar el texto íntegro escaneado con sellos de Rectorado, acuda a la Secretaría de Posgrado (Campus Cota Cota Calle 27) o ingrese con sus credenciales al Repositorio Institucional UMSA.
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
            <ShieldCheck size={14} />
            <span>NORMATIVA & PROCESOS ACADÉMICOS</span>
          </div>
          <h1 className="section-title">
            Procesos, Documentación y Reglamentos
          </h1>
          <p className="section-subtitle">
            Repositorio oficial de reglamentos del CEUB, normativas de la FCPN, plantillas en LaTeX/Word para tesis y manuales de tramitación de grados.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {/* Category tabs */}
          <div className="tabs-header">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem' }}
              >
                {cat === 'todos' ? 'Todos los Documentos' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              type="text"
              placeholder="Buscar reglamento o plantilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', background: '#ffffff' }}
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
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
                  onClick={() => handleDownload(doc)}
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
    </div>
  );
};
