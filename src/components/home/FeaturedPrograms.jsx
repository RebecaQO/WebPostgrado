import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Layers, 
  ArrowRight, 
  Clock, 
  BookOpen,
  Users,
  Star,
  Zap,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { apiUrl } from '../../utils/api';

/* ── Helpers ─────────────────────────────────────── */
const resolveTypeLabel = (prog) => {
  const raw = (prog.type || prog.typeFilter || '').toLowerCase();
  if (raw.includes('terminal')) return 'Maestría';
  if (raw.includes('autofinanciada')) return 'Maestría';
  if (raw.includes('convenio')) return 'Convenio';
  if (raw.includes('diplomado')) return 'Diplomado';
  return prog.type || 'Programa';
};

const resolveDuration = (prog) => {
  const raw = (prog.type || '').toLowerCase();
  if (raw.includes('terminal')) return '24 meses (2 años)';
  if (raw.includes('autofinanciada')) return '18 meses';
  if (raw.includes('diplomado') || (prog.credits && prog.credits <= 60)) return '6 meses';
  return `${prog.credits || '—'} créditos`;
};

const resolveDegree = (prog) => {
  const raw = (prog.type || '').toLowerCase();
  if (raw.includes('terminal')) return 'M.Sc. en Estadística (con Tesis)';
  if (raw.includes('autofinanciada')) return 'M.Sc. en Estadística Aplicada';
  if (raw.includes('diplomado')) return 'Diplomado Certificado UMSA';
  return 'Certificación UMSA';
};

const isMaestria = (prog) => resolveTypeLabel(prog) === 'Maestría';

/* Career highlights per program type */
const resolveHighlights = (prog) => {
  const raw = (prog.type || '').toLowerCase();
  if (raw.includes('terminal')) return ['Investigación Científica Avanzada', 'Tesis de Grado Doctoral', 'Publicación en Revistas ISI'];
  if (raw.includes('autofinanciada')) return ['Computación Estadística Intensiva', 'Proyectos con Datos Reales', 'Herramientas: R, Python, SAS'];
  return ['Certificación Profesional UMSA', 'Análisis de Datos Aplicado', 'Software Estadístico Moderno'];
};

/* ── Component ──────────────────────────────────── */
export const FeaturedPrograms = ({ onSelectProgram, onNavigateToAdmission }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl('/api/programas/activos'));
        if (!response.ok) throw new Error('Error al obtener programas');
        const data = await response.json();

        const seen = new Set();
        const unique = (Array.isArray(data) ? data : []).filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });

        // Sort: Maestrías first
        unique.sort((a, b) => {
          const aM = isMaestria(a) ? 0 : 1;
          const bM = isMaestria(b) ? 0 : 1;
          return aM - bM;
        });

        setPrograms(unique);
        setError(null);
      } catch (err) {
        console.error('Error cargando programas destacados:', err);
        setError(err.message);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  return (
    <section style={{
      position: 'relative',
      padding: '5rem 0',
      background: 'linear-gradient(180deg, #f3efe6 0%, #f9f9f6 100%)',
    }}>
      {/* Decorative top border */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, transparent 0%, #267342 35%, #4f7e9f 65%, transparent 100%)'
      }} />

      <div className="container">
        {/* ── Section Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '99px',
            background: 'var(--color-green-inst-subtle)',
            border: '1.5px solid var(--color-green-inst-border)',
            color: 'var(--color-green-inst)',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.07em',
            marginBottom: '1.25rem',
          }}>
            <GraduationCap size={14} />
            <span>OFERTA ACADÉMICA VIGENTE · GESTIÓN 2026</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.85rem, 4vw, 2.8rem)',
            fontWeight: 900,
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            Maestrías y Diplomados con{' '}
            <span style={{
              background: 'linear-gradient(135deg, #267342 0%, #4f7e9f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Convocatoria Abierta
            </span>
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-muted)',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Programas de cuarto nivel estructurados bajo el Sistema Nacional de Acreditación del CEUB,
            orientados a la práctica computacional intensiva y el rigor metodológico estadístico.
          </p>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', gap: '1rem' }}>
            <div style={{
              width: '32px', height: '32px',
              border: '3px solid var(--color-green-inst-subtle)',
              borderTopColor: 'var(--color-green-inst)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Cargando programas desde la base de datos...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div style={{
            textAlign: 'center', padding: '3rem',
            background: 'var(--color-status-danger-bg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-status-danger-border)',
            color: 'var(--color-status-danger)'
          }}>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No se pudieron cargar los programas</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{error}</p>
          </div>
        )}

        {/* ── Programs Grid ── */}
        {!loading && programs.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {programs.map((prog, idx) => {
              const master = isMaestria(prog);
              const typeLabel = resolveTypeLabel(prog);
              const cuposLibres = (prog.cupo_total || 0) - (prog.cupo_usados || 0);
              const highlights = resolveHighlights(prog);
              const isHov = hovered === idx;

              return (
                <div
                  key={prog.id || idx}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: master
                      ? `2px solid ${isHov ? '#267342' : 'rgba(38, 115, 66, 0.3)'}`
                      : `2px solid ${isHov ? '#4f7e9f' : 'rgba(79, 126, 159, 0.3)'}`,
                    boxShadow: isHov
                      ? (master ? '0 16px 48px -8px rgba(38,115,66,0.25)' : '0 16px 48px -8px rgba(79,126,159,0.22)')
                      : '0 4px 16px -4px rgba(50,55,60,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHov ? 'translateY(-6px)' : 'translateY(0)',
                    overflow: 'hidden',
                  }}
                >
                  {/* ── Top Hero Banner ── */}
                  <div style={{
                    position: 'relative',
                    padding: '2rem 1.75rem 1.5rem',
                    background: master
                      ? 'linear-gradient(135deg, #1a4a28 0%, #267342 50%, #3a9160 100%)'
                      : 'linear-gradient(135deg, #2b506b 0%, #4f7e9f 50%, #6596b8 100%)',
                    overflow: 'hidden',
                  }}>
                    {/* Decorative circles */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px', right: '-30px',
                      width: '130px', height: '130px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.07)',
                      pointerEvents: 'none',
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '-20px', left: '-20px',
                      width: '80px', height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      pointerEvents: 'none',
                    }} />

                    {/* Top row: tipo badge + status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '99px',
                        background: 'rgba(255,255,255,0.18)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                      }}>
                        {master ? <GraduationCap size={12} /> : <BookOpen size={12} />}
                        {typeLabel.toUpperCase()}
                      </span>

                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '99px',
                        background: 'rgba(60, 255, 130, 0.2)',
                        border: '1px solid rgba(60, 255, 130, 0.35)',
                        color: '#afffcc',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4dff99', display: 'inline-block' }} />
                        Convocatoria Abierta
                      </span>
                    </div>

                    {/* Program Title */}
                    <h3 style={{
                      fontSize: '1.4rem',
                      color: '#ffffff',
                      fontWeight: 900,
                      lineHeight: 1.25,
                      marginBottom: '0.4rem',
                      letterSpacing: '-0.01em',
                      textShadow: '0 1px 6px rgba(0,0,0,0.2)',
                    }}>
                      {prog.title}
                    </h3>

                    {prog.mencion && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}>
                        <Star size={11} />
                        Mención: {prog.mencion}
                      </div>
                    )}
                  </div>

                  {/* ── Card Body ── */}
                  <div style={{ padding: '1.5rem 1.75rem', flex: 1 }}>
                    {/* Description */}
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.65,
                      marginBottom: '1.25rem',
                    }}>
                      {prog.description}
                    </p>

                    {/* Highlights */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      {highlights.map((h, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.35rem 0',
                          color: 'var(--color-text-main)',
                          fontSize: '0.83rem',
                        }}>
                          <span style={{
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: master ? 'var(--color-green-inst-subtle)' : 'var(--color-blue-steel-subtle)',
                            border: master ? '1.5px solid var(--color-green-inst-border)' : '1.5px solid var(--color-blue-steel-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <span style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              background: master ? 'var(--color-green-inst)' : 'var(--color-blue-steel)',
                            }} />
                          </span>
                          <span style={{ fontWeight: 500 }}>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Meta Pills */}
                    <div style={{
                      background: 'var(--color-bg-primary)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--color-border)',
                      marginBottom: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-main)' }}>
                        <Clock size={14} color="var(--color-green-inst)" />
                        <span><strong>Duración:</strong> {resolveDuration(prog)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-main)' }}>
                        <Award size={14} color="var(--color-blue-steel)" />
                        <span><strong>Grado:</strong> {resolveDegree(prog)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-main)' }}>
                        <Layers size={14} color="#9e7512" />
                        <span><strong>Modalidad:</strong> Híbrida – Noche</span>
                      </div>
                      {prog.cupo_total > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Users size={14} color={cuposLibres < 5 ? 'var(--color-status-danger)' : 'var(--color-green-inst)'} />
                          <span style={{
                            color: cuposLibres < 5 ? 'var(--color-status-danger)' : 'var(--color-green-inst)',
                            fontWeight: 700,
                            fontSize: '0.8rem'
                          }}>
                            {cuposLibres < 5 ? '⚠ ' : ''}{cuposLibres} cupos libres
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Descuento al Contado y Plan de Cuotas */}
                    <div style={{
                      background: 'rgba(38, 115, 66, 0.05)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(38, 115, 66, 0.15)',
                      marginBottom: '1.25rem',
                      fontSize: '0.78rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Pago al Contado:</span>
                        <strong style={{ color: 'var(--color-green-inst)' }}>{prog.descuento_contado_porcentaje || 10}% de Descuento</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Financiamiento en Cuotas:</span>
                        <strong style={{ color: 'var(--color-blue-steel)' }}>{prog.numero_cuotas || (master ? 18 : 6)} cuotas de {prog.monto_cuota || (master ? 850 : 600)} BOB</strong>
                      </div>
                      {prog.resolucion_hcu && (
                        <div style={{ fontSize: '0.72rem', color: '#92400e', marginTop: '0.2rem', fontWeight: 600 }}>
                          📜 {prog.resolucion_hcu}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Card Footer Actions ── */}
                  <div style={{
                    padding: '1rem 1.75rem 1.5rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr',
                    gap: '0.75rem',
                  }}>
                    <button
                      onClick={() => onSelectProgram(prog)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        fontSize: '0.82rem',
                        color: master ? 'var(--color-green-inst)' : 'var(--color-blue-steel)',
                        borderColor: master ? 'var(--color-green-inst-border)' : 'var(--color-blue-steel-border)',
                      }}
                    >
                      Ver Malla & Requisitos
                    </button>

                    <button
                      onClick={() => onNavigateToAdmission(prog.id)}
                      className="btn btn-sm"
                      style={{
                        background: master
                          ? 'linear-gradient(135deg, #267342 0%, #1e5f35 100%)'
                          : 'linear-gradient(135deg, #4f7e9f 0%, #3d6682 100%)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.4rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        boxShadow: master
                          ? '0 4px 14px -3px rgba(38,115,66,0.4)'
                          : '0 4px 14px -3px rgba(79,126,159,0.35)',
                      }}
                    >
                      <Zap size={14} />
                      <span>Postular Ahora</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Maestría "recommended" glow strip */}
                  {master && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '10%',
                      right: '10%',
                      height: '3px',
                      borderRadius: '99px 99px 0 0',
                      background: 'linear-gradient(90deg, #267342, #48bb78, #267342)',
                      opacity: isHov ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom CTA Strip ── */}
        {!loading && programs.length > 0 && (
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, var(--color-green-inst-subtle), var(--color-blue-steel-subtle))',
            border: '1.5px solid var(--color-border)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                ¿Necesitas más información sobre los programas?
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Consulta el catálogo completo, resoluciones y documentos de admisión.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
              <button
                onClick={() => onNavigateToAdmission && onNavigateToAdmission()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <GraduationCap size={16} />
                <span>Iniciar Postulación</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
