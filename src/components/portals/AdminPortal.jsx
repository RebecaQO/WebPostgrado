import React, { useState } from 'react';
import { useApplicants } from '../../context/ApplicantsContext';
import { useAuth } from '../../context/AuthContext';
import { programsData } from '../../data/programsData';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Eye, 
  Check, 
  X, 
  Settings, 
  Layers,
  Send,
  Plus
} from 'lucide-react';

export const AdminPortal = () => {
  const { currentUser } = useAuth();
  const { applicants, updateApplicantStatus } = useApplicants();

  const [activeTab, setActiveTab] = useState('postulantes'); // 'postulantes' | 'metricas' | 'convocatorias'
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicantForReview, setSelectedApplicantForReview] = useState(null);
  const [observationNotes, setObservationNotes] = useState('');

  // Metrics calculations
  const totalApplicants = applicants.length;
  const admittedCount = applicants.filter(a => a.status === 'Habilitado / Admitido').length;
  const observedCount = applicants.filter(a => a.status === 'Observado').length;
  const pendingCount = applicants.filter(a => a.status === 'En Revisión Documental').length;
  const admissionRate = totalApplicants > 0 ? Math.round((admittedCount / totalApplicants) * 100) : 0;
  const totalRevenueBob = admittedCount * 18000 + totalApplicants * 350; // Mock calculation

  const filteredApplicants = applicants.filter(app => {
    if (filterStatus !== 'todos' && app.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        app.fullName.toLowerCase().includes(q) ||
        app.ci.toLowerCase().includes(q) ||
        app.ticketCode.toLowerCase().includes(q) ||
        app.programTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (id) => {
    updateApplicantStatus(id, 'Habilitado / Admitido', '', 95);
    setSelectedApplicantForReview(null);
    alert("Postulante APROBADO: Se ha generado la Carta de Aceptación y credenciales del Campus Virtual.");
  };

  const handleObserve = (id) => {
    if (!observationNotes) {
      alert("Por favor ingrese el motivo u observación documental para notificar al postulante.");
      return;
    }
    updateApplicantStatus(id, 'Observado', observationNotes);
    setSelectedApplicantForReview(null);
    setObservationNotes('');
    alert("Postulante marcado como OBSERVADO. El aspirante podrá subsanar el documento en la plataforma.");
  };

  const handleReject = (id) => {
    if (window.confirm("¿Está seguro de rechazar formalmente esta postulación?")) {
      updateApplicantStatus(id, 'Rechazado', 'No cumple con los requisitos mínimos de admisión del CEUB.');
      setSelectedApplicantForReview(null);
    }
  };

  return (
    <div className="section-spacing animate-fade-in">
      <div className="container">
        {/* Admin Header Banner */}
        <div className="glass-card" style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(13, 27, 48, 0.95) 0%, rgba(10, 20, 36, 0.9) 100%)',
          borderLeft: '4px solid #f59e0b',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.5rem',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
              }}>
                ADM
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-yellow">BACKOFFICE & DIRECCIÓN DE POSGRADO</span>
                  <span className="badge badge-green">Sistema Activo 2026</span>
                </div>
                <h2 style={{ color: '#ffffff', fontSize: '1.5rem', margin: '0.25rem 0' }}>
                  Panel Administrativo de Control y Admisiones
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Unidad de Posgrado e Investigación • Carrera de Estadística (FCPN - UMSA)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => alert("Sincronizando expedientes con el sistema central del CEUB y Rectorado...")}
                className="btn btn-secondary btn-sm"
              >
                Sincronizar CEUB
              </button>
            </div>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL POSTULANTES</span>
              <Users size={18} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-family-mono)' }}>
              {totalApplicants}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Expedientes registrados en plataforma</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>HABILITADOS / ADMITIDOS</span>
              <CheckCircle2 size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-status-success)', fontFamily: 'var(--font-family-mono)' }}>
              {admittedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Tasa de Admisión: {admissionRate}%</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>EN REVISIÓN / OBSERVADOS</span>
              <AlertTriangle size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-family-mono)' }}>
              {pendingCount + observedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{observedCount} con observaciones activas</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>RECAUDACIÓN ESTIMADA</span>
              <DollarSign size={18} color="var(--color-accent-orange)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent-orange)', fontFamily: 'var(--font-family-mono)' }}>
              {totalRevenueBob.toLocaleString()} BOB
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Matrículas + Derechos de postulación</div>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="tabs-header" style={{ marginBottom: '2rem' }}>
          <button
            className={`tab-btn ${activeTab === 'postulantes' ? 'active' : ''}`}
            onClick={() => setActiveTab('postulantes')}
          >
            <Users size={16} />
            <span>Gestión de Postulantes & Revisión Documental ({applicants.length})</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'convocatorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('convocatorias')}
          >
            <Layers size={16} />
            <span>Configuración de Programas & Cupos</span>
          </button>
        </div>

        {/* TAB 1: Postulantes Table & Review */}
        {activeTab === 'postulantes' && (
          <div className="animate-fade-in">
            {/* Filter bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['todos', 'En Revisión Documental', 'Observado', 'Habilitado / Admitido', 'Rechazado'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.785rem' }}
                  >
                    {st === 'todos' ? 'Todos los Estados' : st}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="text"
                  placeholder="Filtrar por C.I., nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Applicants Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código / Ticket</th>
                    <th>Postulante</th>
                    <th>C.I.</th>
                    <th>Programa</th>
                    <th>Fecha Registro</th>
                    <th>Estado Actual</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-accent-orange)', fontWeight: 700 }}>
                        {app.ticketCode}
                      </td>
                      <td>
                        <strong style={{ color: '#ffffff', display: 'block' }}>{app.fullName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{app.email}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-family-mono)' }}>{app.ci} {app.ciExp}</td>
                      <td style={{ fontSize: '0.85rem' }}>{app.programTitle}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {new Date(app.applicationDate).toLocaleDateString('es-ES')}
                      </td>
                      <td>
                        <span className={`badge ${
                          app.status === 'Habilitado / Admitido' ? 'badge-green' :
                          app.status === 'Observado' ? 'badge-yellow' :
                          app.status === 'Rechazado' ? 'badge-red' : 'badge-blue'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedApplicantForReview(app);
                            setObservationNotes(app.observations || '');
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Eye size={13} />
                          <span>Revisar Expediente</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Convocatorias Config */}
        {activeTab === 'convocatorias' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {programsData.map((prog) => (
                <div key={prog.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-orange">{prog.type}</span>
                    <span className="badge badge-green">{prog.status}</span>
                  </div>

                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {prog.title}
                  </h4>

                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                    Cupos Totales: <strong style={{ color: '#ffffff' }}>35 Plazas</strong> • Modalidad: {prog.modality}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => alert(`Editando cupos y aranceles para ${prog.title}...`)} className="btn btn-secondary btn-sm">
                      <Settings size={14} /> Configurar Cupos
                    </button>
                    <button onClick={() => alert("Docentes asignados correctamente.")} className="btn btn-primary btn-sm">
                      Asignar Docentes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Applicant Document Review */}
        {selectedApplicantForReview && (
          <div className="modal-overlay" onClick={() => setSelectedApplicantForReview(null)}>
            <div
              className="modal-content modal-content-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem' }}>
                    Expediente del Postulante: {selectedApplicantForReview.fullName}
                  </h3>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                    Código: <strong style={{ color: 'var(--color-accent-orange)' }}>{selectedApplicantForReview.ticketCode}</strong> • C.I.: {selectedApplicantForReview.ci} {selectedApplicantForReview.ciExp}
                  </div>
                </div>

                <button className="modal-close-btn" onClick={() => setSelectedApplicantForReview(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* Academic Background Summary */}
                <div style={{
                  background: 'rgba(10, 20, 36, 0.7)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Universidad de Origen:</span>
                    <strong style={{ color: '#ffffff' }}>{selectedApplicantForReview.university || 'UMSA'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Grado / Carrera Previa:</span>
                    <strong style={{ color: '#ffffff' }}>{selectedApplicantForReview.undergraduateDegree || 'Licenciatura'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Programa Solicitado:</span>
                    <strong style={{ color: 'var(--color-accent-orange)' }}>{selectedApplicantForReview.programTitle}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-subtle)', display: 'block' }}>Forma de Pago:</span>
                    <strong style={{ color: '#38bdf8' }}>{selectedApplicantForReview.paymentOption}</strong>
                  </div>
                </div>

                {/* Submitted Documents Inspection */}
                <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.85rem' }}>
                  Documentos Digitales Presentados (PDF):
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  {selectedApplicantForReview.documents?.map((doc, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid var(--color-glass-border)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={16} color="#38bdf8" />
                        <div>
                          <strong style={{ color: '#ffffff', fontSize: '0.875rem' }}>{doc.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{doc.fileName}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Visualizando documento "${doc.fileName}" en el visor PDF seguro...`)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                      >
                        <Eye size={12} /> Ver Archivo PDF
                      </button>
                    </div>
                  ))}
                </div>

                {/* Observation input box */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">
                    <span>Observaciones del Comité de Admisión (Para subsanar)</span>
                    <span className="form-label-hint">Se mostrará al estudiante en su consulta</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: El archivo del Diploma Académico adjunto se encuentra ilegible..."
                    value={observationNotes}
                    onChange={(e) => setObservationNotes(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                {/* Resolution CTA Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--color-glass-border)'
                }}>
                  <button
                    onClick={() => handleReject(selectedApplicantForReview.id)}
                    className="btn btn-sm"
                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                  >
                    <X size={14} /> Rechazar Postulación
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleObserve(selectedApplicantForReview.id)}
                      className="btn btn-sm"
                      style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                    >
                      <AlertTriangle size={14} /> Emitir Observación
                    </button>

                    <button
                      onClick={() => handleApprove(selectedApplicantForReview.id)}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'var(--color-status-success)' }}
                    >
                      <Check size={14} /> Aprobar & Habilitar Admisión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
