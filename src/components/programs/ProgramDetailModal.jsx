import React, { useState } from 'react';
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
  Landmark
} from 'lucide-react';

export const ProgramDetailModal = ({ program, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState('malla');
  const [installmentCount, setInstallmentCount] = useState(program.investment.maxInstallments || 12);
  const [paymentType, setPaymentType] = useState('cash');

  if (!program) return null;

  const totalTuition = program.investment.tuitionBob;
  const matricula = program.investment.matriculaBob;
  const discountPercent = program.investment.cashDiscountPercent;
  const cashDiscountAmount = (totalTuition * discountPercent) / 100;
  const cashTotal = totalTuition - cashDiscountAmount + matricula;

  const installmentMonthly = Math.round((totalTuition - (program.investment.cuotaInitialBob || 0)) / installmentCount);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.35rem'
            }}>
              <span className={`badge ${program.type === 'Maestría' ? 'badge-orange' : 'badge-blue'}`}>
                {program.type}
              </span>
              <span className="badge badge-green">
                {program.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                {program.code}
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', color: 'var(--color-umsa-blue-dark)', margin: 0 }}>
              {program.title}
            </h2>

            <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              {program.resolution} • Grado que otorga: <strong style={{ color: 'var(--color-accent-orange)' }}>{program.degree}</strong>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Sub-tabs */}
          <div className="tabs-header" style={{ marginBottom: '2rem' }}>
            <button
              className={`tab-btn ${activeTab === 'malla' ? 'active' : ''}`}
              onClick={() => setActiveTab('malla')}
            >
              <BookOpen size={16} />
              <span>1. Malla Curricular Modular</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              <GraduationCap size={16} />
              <span>2. Perfil de Ingreso & Egreso</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'titulacion' ? 'active' : ''}`}
              onClick={() => setActiveTab('titulacion')}
            >
              <Award size={16} />
              <span>3. Modalidades de Titulación</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'inversion' ? 'active' : ''}`}
              onClick={() => setActiveTab('inversion')}
            >
              <CreditCard size={16} />
              <span>4. Inversión & Simulador de Pagos</span>
            </button>
          </div>

          {/* TAB 1: Malla Curricular */}
          {activeTab === 'malla' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-umsa-blue-dark)', margin: 0 }}>
                    Estructura Curricular por Semestres Académicos
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Total: {program.credits} • Modalidad: {program.modality}
                  </div>
                </div>

                <div className="badge badge-orange">
                  SNC-CEUB Homologado
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {program.curriculum.map((sem, sIdx) => (
                  <div key={sIdx} className="glass-panel" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--color-umsa-blue)',
                      borderBottom: '1.5px solid #e2e8f0',
                      paddingBottom: '0.5rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{sem.semester}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: 600 }}>
                        {sem.modules.length} Módulos Especializados
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {sem.modules.map((mod, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.95rem 1.15rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            boxShadow: 'var(--shadow-xs)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                fontFamily: 'var(--font-family-mono)',
                                fontSize: '0.75rem',
                                color: '#0284c7',
                                background: '#f0f9ff',
                                padding: '0.2rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 700,
                                border: '1px solid #bae6fd'
                              }}>
                                {mod.code}
                              </span>
                              <strong style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '0.95rem' }}>{mod.name}</strong>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                              <span><strong>Créditos:</strong> {mod.credits}</span>
                              <span><strong>Carga:</strong> {mod.hours} hrs</span>
                            </div>
                          </div>

                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                            {mod.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Perfil Ingreso & Egreso */}
          {activeTab === 'perfil' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--color-accent-orange)', background: '#ffffff' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} color="var(--color-accent-orange)" />
                  Perfil del Postulante (Requisitos de Ingreso)
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                  {program.targetAudience}
                </p>
                <div style={{
                  background: '#f8fafc',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <strong style={{ color: 'var(--color-umsa-blue-dark)', display: 'block', marginBottom: '0.4rem' }}>
                    Requisitos Académicos Previos:
                  </strong>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--color-text-muted)' }}>
                    <li>Título en Provisión Nacional a nivel Licenciatura.</li>
                    <li>Conocimientos de cálculo, álgebra lineal y probabilidad elemental.</li>
                    <li>Comprensión de lectura de literatura científica en idioma inglés técnico.</li>
                  </ul>
                </div>
              </div>

              <div className="glass-card" style={{ borderLeft: '4px solid #059669', background: '#ffffff' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="#059669" />
                  Competencias de Egreso y Campo Laboral
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                  {program.graduateProfile}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                    <strong style={{ color: '#065f46', display: 'block' }}>Sector Financiero & Asegurador</strong>
                    <span style={{ color: '#047857' }}>Modelos de credit scoring, solvencia y riesgo de mercado.</span>
                  </div>
                  <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd' }}>
                    <strong style={{ color: '#0369a1', display: 'block' }}>Centros de Investigación & Salud</strong>
                    <span style={{ color: '#0284c7' }}>Ensayos clínicos, bioestadística y epidemiología espacial.</span>
                  </div>
                  <div style={{ background: '#fffbeb', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
                    <strong style={{ color: '#92400e', display: 'block' }}>Sector Público & Organismos</strong>
                    <span style={{ color: '#b45309' }}>Encuestas complejas en el INE, ministerios y agencias ONU.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Titulación */}
          {activeTab === 'titulacion' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '1.25rem' }}>
                Modalidades de Graduación Acreditadas (CEUB / FCPN)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {program.titulationOptions.map((opt, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'var(--color-accent-orange-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent-orange)',
                      marginBottom: '0.85rem'
                    }}>
                      <Award size={22} />
                    </div>

                    <h4 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      {opt.name}
                    </h4>

                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0, color: 'var(--color-text-muted)' }}>
                      {opt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Inversión & Simulador de Pagos */}
          {activeTab === 'inversion' && (
            <div className="animate-fade-in">
              <div className="grid-2" style={{ marginBottom: '2rem' }}>
                {/* Cost Details */}
                <div className="glass-card" style={{ background: '#ffffff' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={18} color="var(--color-accent-orange)" />
                    Aranceles Oficiales de Colegiatura
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <span>Colegiatura Total del Programa:</span>
                      <strong style={{ color: 'var(--color-umsa-blue-dark)', fontFamily: 'var(--font-family-mono)' }}>{totalTuition.toLocaleString()} BOB</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <span>Matrícula Universitaria UMSA:</span>
                      <strong style={{ color: 'var(--color-umsa-blue-dark)', fontFamily: 'var(--font-family-mono)' }}>{matricula.toLocaleString()} BOB</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <span>Descuento por Pago al Contado:</span>
                      <strong style={{ color: '#059669', fontFamily: 'var(--font-family-mono)' }}>{discountPercent}% OFF (-{cashDiscountAmount.toLocaleString()} BOB)</strong>
                    </div>

                    <div style={{
                      background: '#f8fafc',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      border: '1px solid #e2e8f0'
                    }}>
                      Código CPT de Recaudación: <strong style={{ color: 'var(--color-accent-orange)' }}>{program.investment.cptCode}</strong>
                    </div>
                  </div>
                </div>

                {/* Simulator Controls */}
                <div className="glass-card" style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '1rem' }}>
                    Simulador Interactivo de Pagos
                  </h3>

                  {/* Payment Type Switch */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    background: '#e2e8f0',
                    padding: '0.3rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem'
                  }}>
                    <button
                      type="button"
                      onClick={() => setPaymentType('cash')}
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: paymentType === 'cash' ? 'var(--color-accent-orange)' : 'transparent',
                        color: paymentType === 'cash' ? '#ffffff' : 'var(--color-text-main)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Pago al Contado
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('installments')}
                      style={{
                        padding: '0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: paymentType === 'installments' ? 'var(--color-accent-orange)' : 'transparent',
                        color: paymentType === 'installments' ? '#ffffff' : 'var(--color-text-main)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Plan en Cuotas
                    </button>
                  </div>

                  {paymentType === 'cash' ? (
                    <div style={{ textAlign: 'center', padding: '1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                        Monto Final con Descuento Institucional ({discountPercent}%):
                      </div>
                      <div style={{
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        color: '#059669',
                        fontFamily: 'var(--font-family-mono)',
                        marginBottom: '0.5rem'
                      }}>
                        {cashTotal.toLocaleString()} BOB
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                        Incluye Matrícula ({matricula} BOB) + Colegiatura con {discountPercent}% de ahorro.
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                          <span>Seleccionar Número de Cuotas Mensuales:</span>
                          <strong style={{ color: 'var(--color-accent-orange)' }}>{installmentCount} Meses</strong>
                        </div>
                        <input
                          type="range"
                          min="3"
                          max={program.investment.maxInstallments}
                          value={installmentCount}
                          onChange={(e) => setInstallmentCount(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--color-accent-orange)', cursor: 'pointer' }}
                        />
                      </div>

                      <div style={{
                        background: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Cuota Inicial / Matrícula:</span>
                          <strong style={{ color: 'var(--color-umsa-blue-dark)' }}>{program.investment.cuotaInitialBob} BOB</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{installmentCount} Cuotas Mensuales de:</span>
                          <strong style={{ color: 'var(--color-accent-orange)', fontSize: '1.15rem', fontFamily: 'var(--font-family-mono)' }}>
                            {installmentMonthly.toLocaleString()} BOB / mes
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment channels */}
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-subtle)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Landmark size={14} color="#0284c7" /> Banco Unión (Caja / Depósito)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <QrCode size={14} color="#059669" /> QR Simple / CPT UMSA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar Ficha
            </button>

            <button
              onClick={() => {
                onClose();
                onApply(program.id);
              }}
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Iniciar Postulación Online</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
