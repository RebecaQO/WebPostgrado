import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Award, 
  Upload, 
  Download, 
  CheckCircle2, 
  Clock, 
  User, 
  QrCode, 
  Send,
  Sparkles
} from 'lucide-react';

export const StudentPortal = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('calificaciones');
  const [thesisDraftUploaded, setThesisDraftUploaded] = useState(false);
  const [generatedCpt, setGeneratedCpt] = useState(null);

  const student = currentUser || {
    name: 'Ing. Alejandro Choque Mamani',
    program: 'Maestría en Estadística Aplicada y Ciencia de Datos',
    studentCode: 'MAT-2025-0481',
    ci: '6834921 LP',
    currentSemester: 'Semestre II',
    grades: [
      { code: 'EST-801', name: 'Fundamentos Matemáticos para Estadística', grade: 92, status: 'Aprobado', semester: 'I-2025' },
      { code: 'EST-802', name: 'Inferencia Estadística Avanzada', grade: 88, status: 'Aprobado', semester: 'I-2025' },
      { code: 'EST-803', name: 'Programación Estadística con R y Python', grade: 95, status: 'Aprobado', semester: 'I-2025' },
      { code: 'EST-811', name: 'Modelos Lineales Generalizados (GLM)', grade: 85, status: 'En Curso', semester: 'II-2025' },
      { code: 'EST-812', name: 'Aprendizaje Estadístico y Machine Learning', grade: 90, status: 'En Curso', semester: 'II-2025' }
    ],
    payments: [
      { concept: 'Matrícula Anual Gestión 2025', amountBob: 1200, status: 'Cancelado', date: '10/02/2025', receipt: 'REC-UMSA-0912' },
      { concept: 'Cuota 1 - Colegiatura Semestre I', amountBob: 1500, status: 'Cancelado', date: '15/03/2025', receipt: 'REC-UMSA-1420' },
      { concept: 'Cuota 2 - Colegiatura Semestre I', amountBob: 1500, status: 'Cancelado', date: '15/05/2025', receipt: 'REC-UMSA-1983' },
      { concept: 'Cuota 3 - Colegiatura Semestre II', amountBob: 1500, status: 'Cancelado', date: '10/09/2025', receipt: 'REC-UMSA-2341' },
      { concept: 'Cuota 4 - Colegiatura Semestre II', amountBob: 1500, status: 'Pendiente', dueDate: '30/03/2026', cpt: 'CPT-2026-88492' }
    ],
    thesis: {
      title: "Modelación de Series de Tiempo con Componente Espacial en la Predicción de Rendimientos Agrícolas en el Altiplano",
      tutor: "Dr. Marcelo Ramos Quispe (Ph.D.)",
      progressPercent: 65,
      stage: "Capítulo 3: Metodología y Estimación Bayesiana",
      lastFeedback: "Revisar la convergencia de las cadenas de Markov en el paquete R-INLA."
    }
  };

  const handleGenerateCpt = () => {
    setGeneratedCpt(`CPT-UMSA-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div className="section-spacing animate-fade-in">
      <div className="container">
        {/* Student Profile Top Banner */}
        <div className="glass-card" style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(13, 27, 48, 0.95) 0%, rgba(10, 20, 36, 0.9) 100%)',
          borderLeft: '4px solid var(--color-accent-orange)',
          padding: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.5rem',
                boxShadow: '0 0 20px rgba(242, 104, 28, 0.4)'
              }}>
                AC
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-orange">PORTAL DEL POSGRADUANTE</span>
                  <span className="badge badge-green">Estudiante Regular</span>
                </div>
                <h2 style={{ color: '#ffffff', fontSize: '1.5rem', margin: '0.25rem 0' }}>
                  {student.name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Matrícula: <strong style={{ color: '#ffffff' }}>{student.studentCode}</strong> • C.I.: {student.ci} • {student.program}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(10, 20, 36, 0.8)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-glass-border)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Semestre Activo:</div>
              <strong style={{ color: 'var(--color-accent-orange)', fontSize: '1.1rem' }}>{student.currentSemester} (I-2026)</strong>
            </div>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="tabs-header" style={{ marginBottom: '2rem' }}>
          <button
            className={`tab-btn ${activeTab === 'calificaciones' ? 'active' : ''}`}
            onClick={() => setActiveTab('calificaciones')}
          >
            <BookOpen size={16} />
            <span>Asignaturas y Calificaciones</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'pagos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pagos')}
          >
            <CreditCard size={16} />
            <span>Estado de Cuenta y Códigos CPT</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'tesis' ? 'active' : ''}`}
            onClick={() => setActiveTab('tesis')}
          >
            <Award size={16} />
            <span>Seguimiento de Tesis & Tutor</span>
          </button>
        </div>

        {/* TAB 1: Asignaturas y Calificaciones */}
        {activeTab === 'calificaciones' && (
          <div className="animate-fade-in">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Asignatura / Módulo</th>
                    <th>Periodo</th>
                    <th>Calificación (/100)</th>
                    <th>Estado Académico</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {student.grades.map((g, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-family-mono)', color: '#38bdf8', fontWeight: 600 }}>
                        {g.code}
                      </td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>
                        {g.name}
                      </td>
                      <td style={{ color: 'var(--color-text-muted)' }}>
                        {g.semester}
                      </td>
                      <td>
                        <strong style={{
                          fontSize: '1.1rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: g.grade >= 80 ? 'var(--color-status-success)' : 'var(--color-accent-orange)'
                        }}>
                          {g.grade}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${g.status === 'Aprobado' ? 'badge-green' : 'badge-blue'}`}>
                          {g.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => alert(`Descargando certificado de notas para ${g.name}...`)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          Certificado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Promedio Ponderado Acumulado: <strong style={{ color: 'var(--color-status-success)', fontSize: '1.1rem', fontFamily: 'var(--font-family-mono)' }}>90.0 / 100</strong> (Excelencia)
              </div>

              <button
                onClick={() => alert("Generando Historial Académico Oficial Completo...")}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={14} />
                <span>Descargar Historial Académico Completo (PDF)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Pagos y CPT */}
        {activeTab === 'pagos' && (
          <div className="animate-fade-in">
            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              <div className="glass-card">
                <h4 style={{ color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="var(--color-accent-orange)" />
                  Generación de Código CPT de Pago
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Genere su código CPT para cancelar su cuota mensual en cualquier sucursal del Banco Unión, Uninet o QR Simple.
                </p>

                <div style={{ background: 'rgba(10, 20, 36, 0.8)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span>Concepto a Cancelar:</span>
                    <strong style={{ color: '#ffffff' }}>Cuota 4 - Colegiatura Semestre II</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Monto Programado:</span>
                    <strong style={{ color: 'var(--color-accent-orange)', fontFamily: 'var(--font-family-mono)' }}>1,500 BOB</strong>
                  </div>
                </div>

                {generatedCpt ? (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-status-success)', fontWeight: 700 }}>
                      CÓDIGO CPT VIGENTE:
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-family-mono)' }}>
                      {generatedCpt}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Válido hasta el 30 de Marzo, 2026</div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateCpt}
                    className="btn btn-primary btn-block"
                  >
                    Generar Nuevo Código CPT / QR de Pago
                  </button>
                )}
              </div>

              {/* Summary Stats */}
              <div className="glass-card">
                <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Resumen Financiero</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Total Pagado a la Fecha:</span>
                    <strong style={{ color: 'var(--color-status-success)', fontFamily: 'var(--font-family-mono)' }}>5,700 BOB</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Saldo Pendiente del Programa:</span>
                    <strong style={{ color: 'var(--color-accent-orange)', fontFamily: 'var(--font-family-mono)' }}>13,500 BOB</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Cuotas Canceladas:</span>
                    <strong style={{ color: '#ffffff' }}>4 de 18 Cuotas</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments Ledger Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Monto (BOB)</th>
                    <th>Fecha / Vencimiento</th>
                    <th>Estado</th>
                    <th>Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  {student.payments.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{p.concept}</td>
                      <td style={{ fontFamily: 'var(--font-family-mono)' }}>{p.amountBob} BOB</td>
                      <td>{p.date || `Vence: ${p.dueDate}`}</td>
                      <td>
                        <span className={`badge ${p.status === 'Cancelado' ? 'badge-green' : 'badge-yellow'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        {p.receipt ? (
                          <button
                            onClick={() => alert(`Descargando recibo oficial ${p.receipt}...`)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          >
                            <Download size={12} /> {p.receipt}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.8rem' }}>Pendiente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Tesis y Tutor */}
        {activeTab === 'tesis' && (
          <div className="animate-fade-in">
            <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--color-accent-orange)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>PROYECTO DE TESIS DE MAESTRÍA</span>
                  <h3 style={{ color: '#ffffff', fontSize: '1.25rem', margin: 0 }}>
                    {student.thesis.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    Tutor Oficial Asignado: <strong style={{ color: '#38bdf8' }}>{student.thesis.tutor}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Avance Global:</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-status-success)', fontFamily: 'var(--font-family-mono)' }}>
                    {student.thesis.progressPercent}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ width: `${student.thesis.progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-accent-orange), #10b981)', borderRadius: 'var(--radius-full)' }} />
              </div>

              {/* Feedback box */}
              <div style={{
                background: 'rgba(10, 20, 36, 0.8)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--color-glass-border)',
                marginBottom: '1.5rem'
              }}>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                  Última Observación y Retroalimentación del Tutor:
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  "{student.thesis.lastFeedback}"
                </p>
              </div>

              {/* Upload Draft Box */}
              <div style={{
                border: '2px dashed var(--color-glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <Upload size={28} color="var(--color-accent-orange)" style={{ marginBottom: '0.5rem' }} />
                <h5 style={{ color: '#ffffff', fontSize: '1rem', margin: '0 0 0.25rem 0' }}>
                  Cargar Nuevo Borrador de Avance de Tesis (PDF / Overleaf ZIP)
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Su tutor recibirá una notificación automática en su bandeja de revisión académica.
                </p>

                {thesisDraftUploaded ? (
                  <div style={{ color: 'var(--color-status-success)', fontWeight: 600, fontSize: '0.875rem' }}>
                    ✓ ¡Borrador "Capitulo3_EstimacionBayesiana_Rev2.pdf" enviado con éxito a revisión!
                  </div>
                ) : (
                  <button
                    onClick={() => setThesisDraftUploaded(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Seleccionar Archivo y Enviar a Tutor
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
