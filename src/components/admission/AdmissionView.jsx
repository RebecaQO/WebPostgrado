import React, { useState } from 'react';
import { AdmissionWizard } from './AdmissionWizard';
import { AdmissionCheck } from './AdmissionCheck';
import { 
  GraduationCap, 
  FileCheck2, 
  Search, 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const AdmissionView = ({ targetProgramId = null }) => {
  const [activeSubTab, setActiveSubTab] = useState('wizard'); // 'wizard' | 'check'
  const [searchCI, setSearchCI] = useState('');

  const handlePostulationFinished = (ci) => {
    setSearchCI(ci);
    setActiveSubTab('check');
  };

  const requirementsList = [
    { name: "Fotocopia legalizada del Título en Provisión Nacional", desc: "Nivel Licenciatura universitaria" },
    { name: "Diploma Académico Universitario", desc: "Legalizado o copia digital de alta resolución" },
    { name: "Cédula de Identidad vigente o Pasaporte", desc: "Indicando expedición en Bolivia o extranjería" },
    { name: "Certificado de Nacimiento Computarizado", desc: "Emitido por SERECÍ" },
    { name: "Hoja de Vida Documentada", desc: "Formato estándar con certificaciones relevantes" },
    { name: "Carta de Solicitud de Admisión & Compromiso", desc: "Dirigida a la Dirección de Posgrado FCPN" },
    { name: "Comprobante de Pago por Derecho de Postulación", desc: "Depósito Banco Unión o Recaudaciones UMSA" }
  ];

  return (
    <div className="section-spacing animate-fade-in">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <GraduationCap size={14} />
            <span>PROCESO DE ADMISIÓN 2026</span>
          </div>
          <h1 className="section-title">
            Convocatoria e Inscripción de Posgrado
          </h1>
          <p className="section-subtitle">
            Complete el formulario digital de 5 pasos o consulte el estado de admisión de su expediente académico en tiempo real.
          </p>
        </div>

        {/* Requirements Summary Banner */}
        <div className="glass-card" style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(13, 27, 48, 0.9) 0%, rgba(10, 20, 36, 0.95) 100%)',
          borderLeft: '4px solid var(--color-accent-orange)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={18} color="var(--color-accent-orange)" />
              Requisitos Formales Obligatorios de Postulación (CEUB / FCPN)
            </h3>
            <span className="badge badge-orange">Reglamento CEUB Art. 45</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.85rem'
          }}>
            {requirementsList.map((req, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={16} color="var(--color-status-success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '0.85rem', display: 'block' }}>{req.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{req.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-tabs Selector */}
        <div className="tabs-header" style={{ maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
          <button
            className={`tab-btn ${activeSubTab === 'wizard' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('wizard')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <FileCheck2 size={18} />
            <span>1. Formulario Digital de Postulación (Wizard 5 Pasos)</span>
          </button>

          <button
            className={`tab-btn ${activeSubTab === 'check' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('check')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Search size={18} />
            <span>2. Consulta de Resultados de Admisión</span>
          </button>
        </div>

        {/* Tab content view */}
        {activeSubTab === 'wizard' ? (
          <AdmissionWizard
            preselectedProgramId={targetProgramId}
            onFinished={handlePostulationFinished}
          />
        ) : (
          <AdmissionCheck initialSearchQuery={searchCI} />
        )}
      </div>
    </div>
  );
};
