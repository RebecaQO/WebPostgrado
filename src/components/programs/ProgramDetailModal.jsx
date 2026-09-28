import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  FileText, 
  Layers,
  MessageCircle,
  Users,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';

export const ProgramDetailModal = ({ program: initialProgram, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [programData, setProgramData] = useState(initialProgram);
  const [loading, setLoading] = useState(!initialProgram?.curriculum);
  const [docentes, setDocentes] = useState([]);
  const [docentesLoading, setDocentesLoading] = useState(true);

  useEffect(() => {
    if (!initialProgram?.id) return;

    const fetchMalla = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/programas/${initialProgram.id}/malla`);
        if (res.ok) {
          const data = await res.json();
          setProgramData(data);
        }
      } catch (err) {
        console.error('Error cargando malla:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMalla();
  }, [initialProgram?.id]);

  // Fetch docentes
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setDocentesLoading(true);
        const res = await fetch('/api/docentes');
        if (res.ok) {
          const data = await res.json();
          setDocentes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error cargando docentes:', err);
      } finally {
        setDocentesLoading(false);
      }
    };
    fetchDocentes();
  }, []);

  if (!initialProgram) return null;

  const prog = programData || initialProgram;
  const isMaster = (prog.type || '').includes('Maestría') || prog.typeFilter === 'terminal' || prog.typeFilter === 'autofinanciada';
  const themeColor = isMaster ? '#1e5f35' : '#1e3a5f';
  const themeLightBg = isMaster ? '#eaf5ec' : '#edf4f9';
  
  const curriculum = prog.curriculum || [];

  const hasPerfilEgreso = Boolean(prog.perfil_egreso && prog.perfil_egreso.trim());
  const hasPerfilAspirante = Boolean(prog.perfil_aspirante && prog.perfil_aspirante.trim());
  const hasRequisitos = Boolean(prog.requisitos_admision && prog.requisitos_admision.trim());
  const hasTitulacion = Boolean(prog.modalidad_titulacion && prog.modalidad_titulacion.trim());

  // Collect unique docente names from curriculum for matching
  const curriculumDocentes = new Set();
  curriculum.forEach(sem => {
    sem.modules.forEach(mod => {
      if (mod.docentes) {
        mod.docentes.split(',').forEach(d => curriculumDocentes.add(d.trim()));
      }
    });
  });

  const tabs = [
    { id: 'perfil', label: 'Perfil del Graduado', icon: GraduationCap },
    { id: 'malla', label: 'Contenido', icon: BookOpen },
    { id: 'docentes', label: 'Equipo Docente', icon: Users },
    { id: 'contacto', label: 'Escríbenos', icon: MessageCircle },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '920px', borderRadius: '12px', overflow: 'hidden' }}
      >
        {/* ══════ HEADER LIMPIO ══════ */}
        <div style={{
          padding: '1.75rem 2rem 1.5rem',
          background: `linear-gradient(135deg, ${themeColor} 0%, ${isMaster ? '#267342' : '#2d5a8a'} 100%)`,
          color: '#ffffff',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={18} />
          </button>

          <div style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            opacity: 0.8,
            marginBottom: '0.5rem'
          }}>
            {isMaster ? 'Programa de Maestría' : 'Diplomado de Especialización'}
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.25,
            paddingRight: '2rem',
            fontFamily: 'var(--font-family-heading)'
          }}>
            {prog.title}
          </h2>

          <div style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            fontSize: '0.82rem',
            opacity: 0.85,
            flexWrap: 'wrap'
          }}>
            {prog.degree && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={14} /> {prog.degree}
              </span>
            )}
            {prog.duration && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {prog.duration}
              </span>
            )}
            {prog.modality && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Layers size={14} /> {prog.modality}
              </span>
            )}
          </div>
        </div>

        {/* ══════ TABS ══════ */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: '1 0 auto',
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? themeColor : '#64748b',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? `3px solid ${themeColor}` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComp size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ══════ BODY ══════ */}
        <div style={{
          padding: '1.75rem 2rem',
          maxHeight: '55vh',
          overflowY: 'auto',
          background: '#fafbfc'
        }}>

          {/* ── TAB: PERFIL DEL GRADUADO ── */}
          {activeTab === 'perfil' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Perfil de Egreso */}
              {hasPerfilEgreso && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  border: `1px solid ${isMaster ? 'rgba(38,115,66,0.15)' : 'rgba(30,58,95,0.15)'}`,
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: themeColor,
                    margin: '0 0 0.85rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}>
                    <GraduationCap size={18} />
                    ¿Cuál es el perfil del graduado?
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#475569',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-line',
                    margin: 0
                  }}>
                    {prog.perfil_egreso}
                  </p>
                </div>
              )}

              {/* Perfil del Aspirante */}
              {hasPerfilAspirante && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#334155',
                    margin: '0 0 0.85rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}>
                    <Users size={18} color={themeColor} />
                    ¿A quién va dirigido?
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#475569',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-line',
                    margin: 0
                  }}>
                    {prog.perfil_aspirante}
                  </p>
                </div>
              )}

              {/* Requisitos de Admisión */}
              {hasRequisitos && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#334155',
                    margin: '0 0 0.85rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}>
                    <FileText size={18} color={themeColor} />
                    Requisitos de Admisión
                  </h3>
                  <div style={{
                    fontSize: '0.88rem',
                    color: '#475569',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line'
                  }}>
                    {prog.requisitos_admision}
                  </div>
                </div>
              )}

              {/* Modalidades de Titulación */}
              {hasTitulacion && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#334155',
                    margin: '0 0 0.85rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}>
                    <Award size={18} color={themeColor} />
                    Modalidades de Titulación
                  </h3>
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#475569',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    margin: 0
                  }}>
                    {prog.modalidad_titulacion}
                  </p>
                </div>
              )}

              {/* Si no hay datos de perfil en absoluto */}
              {!hasPerfilEgreso && !hasPerfilAspirante && !hasRequisitos && !hasTitulacion && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '2.5rem',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}>
                  La información del perfil del graduado estará disponible próximamente.
                </div>
              )}
            </div>
          )}

          {/* ── TAB: CONTENIDO (MALLA CURRICULAR) ── */}
          {activeTab === 'malla' && (
            <div className="animate-fade-in">
              {/* Info básica */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1.35rem',
                flexWrap: 'wrap',
                fontSize: '0.85rem',
                color: '#475569'
              }}>
                {prog.credits && (
                  <span><strong style={{ color: themeColor }}>{prog.credits}</strong> créditos</span>
                )}
                {prog.duration && (
                  <span>Duración: <strong>{prog.duration}</strong></span>
                )}
                {prog.modality && (
                  <span>Modalidad: <strong>{prog.modality}</strong></span>
                )}
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: themeColor, fontWeight: 600 }}>
                  Cargando estructura curricular...
                </div>
              ) : curriculum.length === 0 ? (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  padding: '2.5rem',
                  color: '#94a3b8'
                }}>
                  La malla curricular estará disponible próximamente.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {curriculum.map((sem, sIdx) => (
                    <ModuleAccordion key={sIdx} semester={sem} themeColor={themeColor} themeLightBg={themeLightBg} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: EQUIPO DOCENTE ── */}
          {activeTab === 'docentes' && (
            <div className="animate-fade-in">
              {docentesLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: themeColor, fontWeight: 600 }}>
                  Cargando equipo docente...
                </div>
              ) : docentes.length === 0 ? (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  padding: '2.5rem',
                  color: '#94a3b8'
                }}>
                  La información del equipo docente estará disponible próximamente.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1rem'
                }}>
                  {docentes.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        transition: 'box-shadow 0.2s ease, transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 20px -4px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: `2px solid ${themeColor}`,
                        background: themeLightBg
                      }}>
                        <img
                          src={doc.foto_url}
                          alt={doc.nombre_completo}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'><rect fill='${themeLightBg}' width='52' height='52'/><text x='26' y='30' text-anchor='middle' fill='${themeColor}' font-size='20' font-weight='700'>${(doc.nombre || 'D')[0]}</text></svg>`)}`;
                          }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: '#1e293b',
                          lineHeight: 1.3,
                          marginBottom: '0.2rem'
                        }}>
                          {doc.nombre_completo}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: themeColor,
                          fontWeight: 600,
                          marginBottom: '0.15rem'
                        }}>
                          {doc.titulo || 'Docente'}
                        </div>
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#94a3b8'
                        }}>
                          {doc.especialidad}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: ESCRÍBENOS ── */}
          {activeTab === 'contacto' && (
            <div className="animate-fade-in" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.5rem 0'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)'
              }}>
                <MessageCircle size={32} color="#ffffff" />
              </div>

              <div style={{ textAlign: 'center', maxWidth: '420px' }}>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#1e293b',
                  margin: '0 0 0.5rem 0'
                }}>
                  ¿Tienes preguntas?
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.65,
                  margin: 0
                }}>
                  Nuestro equipo de admisiones está listo para ayudarte. 
                  Escríbenos por WhatsApp y resolveremos todas tus dudas sobre 
                  el programa <strong style={{ color: '#334155' }}>{prog.title}</strong>.
                </p>
              </div>

              <a
                href={`https://wa.me/59176543210?text=${encodeURIComponent(`Hola, me interesa obtener más información sobre el programa: ${prog.title}. ¿Podrían ayudarme?`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '0.85rem 2rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 6px 18px rgba(37, 211, 102, 0.35)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1da855';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(37, 211, 102, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#25D366';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 211, 102, 0.35)';
                }}
              >
                <MessageCircle size={18} />
                <span>Escríbenos por WhatsApp</span>
              </a>

              <div style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                textAlign: 'center',
                lineHeight: 1.5
              }}>
                Respuesta promedio: menos de 24 horas
              </div>
            </div>
          )}

        </div>

        {/* ══════ FOOTER LIMPIO: Solo botón de descargar convocatoria ══════ */}
        <div style={{
          padding: '1rem 2rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: '0 0 12px 12px'
        }}>
          {prog.enlace_convocatoria_drive ? (
            <a
              href={prog.enlace_convocatoria_drive}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: themeColor,
                color: '#ffffff',
                padding: '0.7rem 1.6rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: `0 4px 14px ${isMaster ? 'rgba(30, 95, 53, 0.3)' : 'rgba(30, 58, 95, 0.3)'}`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Download size={16} />
              <span>Descargar Convocatoria</span>
            </a>
          ) : (
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Convocatoria no disponible aún
            </span>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .modal-content-xl {
            margin: 0.5rem !important;
            max-height: 95vh !important;
          }
        }
      `}</style>
    </div>
  );
};


/* ── Componente Accordion para módulos de la malla ── */
const ModuleAccordion = ({ semester, themeColor, themeLightBg }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: open ? themeLightBg : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          gap: '0.5rem'
        }}
      >
        <span style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: themeColor,
          textAlign: 'left'
        }}>
          {semester.semester}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
            {semester.modules.length} asignatura{semester.modules.length !== 1 ? 's' : ''}
          </span>
          {open ? <ChevronUp size={16} color={themeColor} /> : <ChevronDown size={16} color={themeColor} />}
        </div>
      </button>

      {open && (
        <div style={{
          padding: '0.75rem 1.25rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          {semester.modules.map((mod, mIdx) => (
            <div
              key={mIdx}
              style={{
                padding: '0.85rem 1rem',
                background: '#fafbfc',
                borderRadius: '8px',
                border: '1px solid #f1f5f9'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '0.4rem',
                marginBottom: '0.3rem'
              }}>
                <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>
                  {mod.name}
                </strong>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: themeColor,
                  background: themeLightBg,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  {mod.credits} créditos · {mod.hours} hrs
                </span>
              </div>

              {mod.desc && (
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
                  {mod.desc}
                </p>
              )}

              {mod.docentes && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginTop: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Users size={11} />
                  <span>{mod.docentes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
