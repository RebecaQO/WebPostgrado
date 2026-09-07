import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  GraduationCap, 
  Award, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Calculator, 
  ArrowRight,
  ShieldCheck,
  QrCode,
  Landmark,
  Layers,
  Users,
  Check
} from 'lucide-react';

export const ProgramDetailModal = ({ program: initialProgram, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState('malla');
  const [programData, setProgramData] = useState(initialProgram);
  const [loading, setLoading] = useState(!initialProgram?.curriculum);
  const [installmentCount, setInstallmentCount] = useState(12);
  const [paymentType, setPaymentType] = useState('cash');

  useEffect(() => {
    if (!initialProgram?.id) return;

    const fetchMalla = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/programas/${initialProgram.id}/malla`);
        if (res.ok) {
          const data = await res.json();
          setProgramData(data);
          if (data?.investment?.maxInstallments) {
            setInstallmentCount(data.investment.maxInstallments);
          }
        }
      } catch (err) {
        console.error('Error cargando malla:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMalla();
  }, [initialProgram?.id]);

  if (!initialProgram) return null;

  const prog = programData || initialProgram;
  const isMaster = (prog.type || '').includes('Maestría') || prog.typeFilter === 'terminal' || prog.typeFilter === 'autofinanciada';
  
  const investment = prog.investment || {
    tuitionBob: prog.monto_cuota && prog.numero_cuotas ? Number(prog.monto_cuota) * Number(prog.numero_cuotas) : 0,
    matriculaBob: prog.valor_matricula ? Number(prog.valor_matricula) : 0,
    monthlyBob: prog.monto_cuota ? Number(prog.monto_cuota) : 0,
    cashDiscountPercent: prog.descuento_contado_porcentaje ?? 10,
    maxInstallments: prog.numero_cuotas ? Number(prog.numero_cuotas) : 18,
    cuotaInitialBob: prog.valor_matricula ? Number(prog.valor_matricula) : 0,
    cptCode: `CPT-UMSA-${prog.id || '2026'}`
  };

  const totalTuition = investment.tuitionBob || 0;
  const matricula = investment.matriculaBob || 0;
  const discountPercent = investment.cashDiscountPercent ?? 10;
  const cashDiscountAmount = (totalTuition * discountPercent) / 100;
  const cashTotal = totalTuition - cashDiscountAmount + matricula;
  const monthlyFee = investment.monthlyBob || (installmentCount > 0 ? Math.round(totalTuition / installmentCount) : 0);

  const curriculum = prog.curriculum || [];

  const hasPerfilAspirante = Boolean(prog.perfil_aspirante && prog.perfil_aspirante.trim());
  const hasPerfilEgreso = Boolean(prog.perfil_egreso && prog.perfil_egreso.trim());
  const hasRequisitos = Boolean(prog.requisitos_admision && prog.requisitos_admision.trim());
  const hasPerfilOrRequisitos = hasPerfilAspirante || hasPerfilEgreso || hasRequisitos;
  const hasTitulacion = Boolean(prog.modalidad_titulacion && prog.modalidad_titulacion.trim());

  // Si la pestaña actual no tiene datos, redirigir a malla
  useEffect(() => {
    if (activeTab === 'titulacion' && !hasTitulacion) {
      setActiveTab('malla');
    } else if (activeTab === 'perfil' && !hasPerfilOrRequisitos) {
      setActiveTab('malla');
    }
  }, [activeTab, hasTitulacion, hasPerfilOrRequisitos]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '980px', borderRadius: 'var(--radius-xl)' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '2px solid var(--color-border)' }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.35rem'
            }}>
              <span className={`badge ${isMaster ? 'badge-green-inst' : 'badge-blue'}`}>
                {prog.type || 'Programa'}
              </span>
              <span className="badge badge-green">
                ✓ {prog.status || 'Convocatoria Activa'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                {prog.id || prog.code}
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 800 }}>
              {prog.title}
            </h2>

            <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>{prog.resolution}</span>
              <span>•</span>
              <span>Grado Académico: <strong style={{ color: 'var(--color-green-inst)' }}>{prog.degree || 'Posgrado UMSA'}</strong></span>
              {prog.resolucion_hcu && (
                <>
                  <span>•</span>
                  <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.75rem' }}>
                    📜 {prog.resolucion_hcu}
                  </span>
                </>
              )}
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Sub-tabs dinámicas según datos existentes en BD */}
          <div className="tabs-header" style={{ marginBottom: '1.75rem' }}>
            <button
              className={`tab-btn ${activeTab === 'malla' ? 'active' : ''}`}
              onClick={() => setActiveTab('malla')}
            >
              <BookOpen size={16} />
              <span>1. Malla Curricular Modular {curriculum.length > 0 ? `(${curriculum.length})` : ''}</span>
            </button>

            {hasPerfilOrRequisitos && (
              <button
                className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => setActiveTab('perfil')}
              >
                <GraduationCap size={16} />
                <span>2. Perfil {hasRequisitos ? '& Requisitos de Admisión' : 'Académico'}</span>
              </button>
            )}

            {hasTitulacion && (
              <button
                className={`tab-btn ${activeTab === 'titulacion' ? 'active' : ''}`}
                onClick={() => setActiveTab('titulacion')}
              >
                <Award size={16} />
                <span>3. Modalidades de Titulación</span>
              </button>
            )}

            <button
              className={`tab-btn ${activeTab === 'inversion' ? 'active' : ''}`}
              onClick={() => setActiveTab('inversion')}
            >
              <CreditCard size={16} />
              <span>4. Inversión & Pagos</span>
            </button>
          </div>

          {/* TAB 1: Malla Curricular Modular */}
          {activeTab === 'malla' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 800 }}>
                    Estructura Curricular Modular (Base de Datos)
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Total: <strong>{prog.credits} créditos</strong> • Duración: <strong>{prog.duration || '18 meses'}</strong> • Modalidad: <strong>{prog.modality || 'Híbrida – Turno Noche'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {prog.enlace_pdf_programa && (
                    <a
                      href={prog.enlace_pdf_programa}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                    >
                      <FileText size={14} color="var(--color-green-inst)" />
                      <span>Descargar Malla (PDF)</span>
                    </a>
                  )}
                  <div className="badge badge-green-inst">
                    SNC-CEUB Homologado
                  </div>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-green-inst)' }}>
                  Cargando estructura curricular desde la base de datos...
                </div>
              ) : curriculum.length === 0 ? (
                <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No se registran módulos ni asignaturas en la base de datos para este programa.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {curriculum.map((sem, sIdx) => (
                    <div key={sIdx} className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: 'var(--color-green-inst)',
                        borderBottom: '1.5px solid var(--color-border)',
                        paddingBottom: '0.6rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>{sem.semester}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>
                          {sem.modules.length} Asignaturas
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {sem.modules.map((mod, mIdx) => (
                          <div
                            key={mIdx}
                            style={{
                              background: 'var(--color-bg-primary)',
                              padding: '1rem 1.25rem',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-border)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                              <div>
                                <span style={{
                                  fontFamily: 'var(--font-family-mono)',
                                  fontWeight: 800,
                                  fontSize: '0.8rem',
                                  color: 'var(--color-green-inst)',
                                  background: 'var(--color-green-inst-subtle)',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  marginRight: '0.5rem'
                                }}>
                                  {mod.code}
                                </span>
                                <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                                  {mod.name}
                                </strong>
                              </div>

                              <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem' }}>
                                <span className="badge" style={{ background: 'var(--color-blue-steel-subtle)', color: 'var(--color-blue-steel)' }}>
                                  {mod.credits} Créditos ({mod.hours} hrs)
                                </span>
                                <span className="badge" style={{ background: '#f1f5f9', color: 'var(--color-text-main)' }}>
                                  {mod.type}
                                </span>
                              </div>
                            </div>

                            {mod.desc && (
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.35rem 0 0.5rem 0' }}>
                                {mod.desc}
                              </p>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--color-text-subtle)', flexWrap: 'wrap' }}>
                              {mod.software && (
                                <span><strong>Software:</strong> {mod.software}</span>
                              )}
                              {mod.prerequisites && mod.prerequisites !== 'Ninguno' && (
                                <span style={{ color: 'var(--color-status-warning)' }}><strong>Prerrequisito:</strong> {mod.prerequisites}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Perfil & Requisitos de Admisión (Elimina secciones sin datos) */}
          {activeTab === 'perfil' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {hasPerfilAspirante && (
                <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                  <h4 style={{ color: 'var(--color-green-inst)', fontWeight: 800, marginBottom: '0.6rem' }}>
                    Perfil del Postulante / Aspirante
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                    {prog.perfil_aspirante}
                  </p>
                </div>
              )}

              {hasPerfilEgreso && (
                <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                  <h4 style={{ color: 'var(--color-green-inst)', fontWeight: 800, marginBottom: '0.6rem' }}>
                    Perfil de Egreso Profesional
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                    {prog.perfil_egreso}
                  </p>
                </div>
              )}

              {hasRequisitos && (
                <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <h4 style={{ color: 'var(--color-green-inst)', fontWeight: 800, margin: 0 }}>
                      Requisitos de Admisión Documental (CEUB - FCPN UMSA)
                    </h4>
                    {prog.enlace_pdf_programa && (
                      <a
                        href={prog.enlace_pdf_programa}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                      >
                        <FileText size={14} color="var(--color-green-inst)" />
                        <span>Descargar PDF de Requisitos</span>
                      </a>
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                    {prog.requisitos_admision}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Modalidades de Titulación (Solo se renderiza si hay datos en BD) */}
          {activeTab === 'titulacion' && hasTitulacion && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-green-inst)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={20} />
                  <span>Modalidades de Titulación Aprobadas</span>
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', margin: 0, paddingLeft: '1.75rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {prog.modalidad_titulacion}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Inversión & Pagos (Conectado a BD) */}
          {activeTab === 'inversion' && (
            <div className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: 700 }}>VALOR MATRÍCULA DE ADMISIÓN</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-green-inst)', fontFamily: 'var(--font-family-mono)' }}>
                    {matricula > 0 ? `${matricula} BOB` : 'Gratuita (Beca Institucional UMSA)'}
                  </div>
                </div>

                <div className="glass-panel" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: 700 }}>COLEGIATURA TOTAL / MENSUALIDAD</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-blue-steel)', fontFamily: 'var(--font-family-mono)' }}>
                    {totalTuition > 0 ? `${totalTuition.toLocaleString()} BOB` : 'Sin Costo de Colegiatura'}
                  </div>
                  {monthlyFee > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {monthlyFee} BOB / mes ({investment.maxInstallments || 18} cuotas)
                    </div>
                  )}
                </div>
              </div>

              {totalTuition > 0 && (
                <div className="glass-panel" style={{ background: 'var(--color-bg-primary)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ color: 'var(--color-text-main)', fontWeight: 800, marginBottom: '0.75rem' }}>
                    Simulador de Cuotas & Descuento al Contado
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', fontSize: '0.875rem' }}>
                    <div>
                      <strong>Pago al Contado ({discountPercent}% Descuento):</strong>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-green-inst)', marginTop: '0.25rem' }}>
                        {cashTotal.toLocaleString()} BOB
                      </div>
                    </div>
                    <div>
                      <strong>Plan en Cuotas Mensuales:</strong>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-blue-steel)', marginTop: '0.25rem' }}>
                        {monthlyFee} BOB / mes ({investment.maxInstallments || installmentCount} cuotas)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Actions */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1.5px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: 'var(--color-bg-primary)',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
        }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Cerrar
            </button>

            {/* Si la convocatoria ya está cerrada/concluida, se puede consultar el repositorio histórico en Drive */}
            {prog.status !== 'Activo' && prog.enlace_convocatoria_drive && (
              <a
                href={prog.enlace_convocatoria_drive}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--color-green-inst)', borderColor: 'var(--color-green-inst)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Repositorio Drive (Histórico)</span>
              </a>
            )}

            {prog.enlace_pdf_programa && (
              <a
                href={prog.enlace_pdf_programa}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <FileText size={15} color="var(--color-green-inst)" />
                <span>Descargar Detalle (PDF)</span>
              </a>
            )}
          </div>

          <a
            href={prog.enlace_formulario_inscripcion || 'https://docs.google.com/forms'}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', padding: '0.65rem 1.5rem', textDecoration: 'none' }}
          >
            <span>Postular vía Google Forms</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
