import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Download,
  Share2,
  MessageCircle,
  Users,
  Compass,
  Laptop,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  BarChart3,
  Brain,
  Database,
  Code2,
  Lightbulb,
  FileCheck2,
  CheckSquare,
  Square
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { facultyData } from '../../data/facultyData';
import { programsData } from '../../data/programsData';

// Helper to produce a direct download URL (handles Google Drive links directly)
const getDirectDownloadLink = (url) => {
  if (!url) return null;
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  }
  return url;
};

export const ProgramDetailView = ({ programId, program: initialProgram, onBack, onNavigateToAdmission }) => {
  const [programData, setProgramData] = useState(initialProgram || null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('perfil');
  const [activeSemesterTab, setActiveSemesterTab] = useState(0);

  // Interactive Document Checklist State for "Requisitos"
  const [checkedDocs, setCheckedDocs] = useState({
    doc1: false,
    doc2: false,
    doc3: false,
    doc4: false,
    doc5: false,
    doc6: false
  });

  const toggleCheckDoc = (key) => {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecked = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = Object.keys(checkedDocs).length;
  const progressPercent = Math.round((totalChecked / totalDocs) * 100);

  // Load program by ID or initialProgram
  useEffect(() => {
    const targetId = programId || initialProgram?.id || initialProgram?.code;
    if (!targetId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchFullData = async () => {
      try {
        setLoading(true);
        let res;
        try {
          res = await fetch(`/api/programas/${targetId}/malla`);
          if (!res.ok) throw new Error();
        } catch {
          res = await apiFetch(`/api/programas/${targetId}/malla`);
        }

        if (res && res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProgramData(data);
          }
        } else {
          const fallback = programsData.find(
            (p) => p.id === targetId || p.code === targetId || p.title === targetId
          );
          if (isMounted && fallback) {
            setProgramData((prev) => prev || fallback);
          }
        }
      } catch (err) {
        console.warn('Error cargando datos del programa:', err);
        const fallback = programsData.find(
          (p) => p.id === targetId || p.code === targetId
        );
        if (isMounted && fallback) {
          setProgramData((prev) => prev || fallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullData();
    return () => {
      isMounted = false;
    };
  }, [programId, initialProgram?.id]);

  const prog = programData || initialProgram;

  const handleBackNavigation = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = 'programas';
    }
  };

  if (loading && !prog) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1.25rem' }} />
          <h3 style={{ color: '#373A40', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Cargando programa académico...</h3>
          <p style={{ color: '#646973', fontSize: '0.9rem' }}>Consultando base de datos oficial de posgrado UMSA</p>
        </div>
      </div>
    );
  }

  if (!prog) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem', minHeight: '60vh' }}>
        <h2 style={{ color: '#373A40', marginBottom: '1rem', fontWeight: 800 }}>Programa no encontrado</h2>
        <p style={{ color: '#646973', marginBottom: '2rem' }}>
          El programa solicitado no existe o no se encuentra activo actualmente.
        </p>
        <button onClick={handleBackNavigation} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Volver al Catálogo de Programas</span>
        </button>
      </div>
    );
  }

  const isMaster = (prog.type || '').toLowerCase().includes('maestr') ||
    prog.typeFilter === 'maestria' ||
    prog.typeFilter === 'terminal' ||
    prog.typeFilter === 'autofinanciada' ||
    (prog.title || '').toLowerCase().includes('maestr');

  const curriculum = prog.curriculum || [];
  const targetAudienceText = prog.perfil_aspirante || prog.targetAudience || 
    'Profesionales con grado de Licenciatura en Estadística, Informática, Sistemas, Matemáticas, Economía, Ingeniería y carreras afines interesadas en la modelación cuantitativa, analítica avanzada y computación científica.';

  const graduateProfileText = prog.perfil_egreso || prog.graduateProfile || 
    'El egresado poseerá sólidas competencias teóricas y metodológicas aplicadas para formular modelos estocásticos, procesar grandes volúmenes de datos, liderar equipos analíticos y formular soluciones innovadoras en organizaciones públicas, privadas o centros de investigación.';

  const titulationText = prog.modalidad_titulacion || 
    (prog.titulationOptions && prog.titulationOptions.map(t => `${t.name}: ${t.desc}`).join('\n\n')) ||
    '1. Tesis de Grado de Maestría con sustentación pública ante tribunal evaluador.\n2. Publicación de artículo científico indexado (Scopus / SciELO / Web of Science).\n3. Trabajo Dirigido de Posgrado con impacto institucional medible.';

  // Links directos de descarga
  const rawConvocatoriaUrl = prog.enlace_convocatoria_drive || prog.enlace_pdf_programa || 'https://drive.google.com/file/d/1FIBzOG85Nbnv3e-qpM-oTp6ovy1WEqo7/view?usp=drive_link';
  const directDownloadConvocatoria = getDirectDownloadLink(rawConvocatoriaUrl) || rawConvocatoriaUrl;

  const rawMallaUrl = prog.enlace_pdf_programa || prog.enlace_convocatoria_drive || 'https://drive.google.com/file/d/1FIBzOG85Nbnv3e-qpM-oTp6ovy1WEqo7/view?usp=drive_link';
  const directDownloadMalla = getDirectDownloadLink(rawMallaUrl) || rawMallaUrl;

  const whatsappMessage = encodeURIComponent(
    `Hola, solicito información y orientación sobre el programa: ${prog.title} (Código: ${prog.code || prog.id || ''})`
  );

  /* ═══════════════════════════════════════════════════════════════════
     PALETA DE COLORES WEB CORPORATIVA - UNIDAD DE POSGRADO (UMSA)
     • Fondo Principal: #F5F5F5
     • Fondo Tarjetas: #EBE6DA
     • Títulos y Texto: #373A40 | Textos Secundarios: #646973
     • Verde Primario: #006400 | Acento Verde: #32CD32
     • Azul Secundario: #4682B4 | Acento Azul: #6495ED
     • Alertas: #DCF5DC (éxito) | #FFF5DC (advertencia)
     • Divisores: #DCE1E6 | Bordes: #C8CDD2
     • WhatsApp Fosforescente: #00FF66 / #25F46C con resplandor neón
     ═══════════════════════════════════════════════════════════════════ */

  const tabConfigs = [
    {
      id: 'perfil',
      label: '1. Perfil Académico',
      icon: Compass,
      color: '#4682B4',
      gradient: 'linear-gradient(135deg, #2A5A84 0%, #4682B4 100%)',
      subtleBg: '#E6EBF5',
      borderColor: '#B8CBE0',
      textColor: '#2A5A84'
    },
    {
      id: 'materias',
      label: `2. Materias & Malla ${curriculum.length > 0 ? `(${curriculum.length})` : ''}`,
      icon: BookOpen,
      color: '#006400',
      gradient: 'linear-gradient(135deg, #004D00 0%, #006400 100%)',
      subtleBg: '#DCF5DC',
      borderColor: '#98DF98',
      textColor: '#006400'
    },
    {
      id: 'docentes',
      label: '3. Docentes',
      icon: Users,
      color: '#6495ED',
      gradient: 'linear-gradient(135deg, #3C68B5 0%, #6495ED 100%)',
      subtleBg: '#E6EBF5',
      borderColor: '#B8CBE0',
      textColor: '#2A5A84'
    },
    {
      id: 'requisitos',
      label: '4. Requisitos de Admisión',
      icon: FileText,
      color: '#006400',
      gradient: 'linear-gradient(135deg, #005000 0%, #006400 100%)',
      subtleBg: '#FFF5DC',
      borderColor: '#E6D2A8',
      textColor: '#373A40'
    },
    {
      id: 'titulacion',
      label: '5. Titulación',
      icon: Award,
      color: '#32CD32',
      gradient: 'linear-gradient(135deg, #006400 0%, #228B22 100%)',
      subtleBg: '#DCF5DC',
      borderColor: '#98DF98',
      textColor: '#006400'
    },
    {
      id: 'fechas',
      label: '6. Fechas & Horarios',
      icon: CalendarDays,
      color: '#4682B4',
      gradient: 'linear-gradient(135deg, #2E5D82 0%, #4682B4 100%)',
      subtleBg: '#E6EBF5',
      borderColor: '#B8CBE0',
      textColor: '#2A5A84'
    }
  ];

  return (
    <div className="program-detail-root animate-fade-in" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', color: '#373A40', paddingBottom: '5rem' }}>
      
      {/* ── 1. Top Bar Navigation (Limpia con fondo corporativo #F0F2F5) ── */}
      <nav style={{
        background: '#F0F2F5',
        borderBottom: '1px solid #DCE1E6',
        padding: '0.85rem 0',
        position: 'sticky',
        top: '78px',
        zIndex: 40,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <button
              onClick={handleBackNavigation}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#006400',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#DCF5DC'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft size={16} />
              <span>Volver al Catálogo</span>
            </button>
            <span style={{ color: '#C8CDD2' }}>/</span>
            <span style={{ color: '#646973', fontWeight: 600 }}>{prog.type || (isMaster ? 'Maestría' : 'Diplomado')}</span>
            <span style={{ color: '#C8CDD2' }}>/</span>
            <span style={{ color: '#373A40', fontWeight: 700, maxWidth: '420px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {prog.title}
            </span>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section Corporativo (Verde Institucional #006400 y Azul UMSA) ── */}
      <section style={{
        background: 'linear-gradient(135deg, #003800 0%, #006400 55%, #1B3F63 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        padding: '3rem 0 3.75rem 0'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '960px' }}>
            
            {/* Título Principal */}
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.9rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.18,
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              {prog.title}
            </h1>

            {/* Descripción Breve */}
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: '#E6EBF5',
              marginBottom: '2rem',
              maxWidth: '850px'
            }}>
              {prog.description || 'Formación de alto nivel en métodos estadísticos aplicados a ciencias sociales, salud y economía bajo estándares del CEUB y la FCPN UMSA.'}
            </p>

            {/* Acciones del Hero: Descarga Directa + WhatsApp FOSFORESCENTE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              
              {/* DESCARGA DIRECTA DE CONVOCATORIA OFICIAL (#006400 primario corporativo) */}
              <a
                href={directDownloadConvocatoria}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  background: '#006400',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  border: '1.5px solid #32CD32',
                  boxShadow: '0 4px 18px rgba(0, 100, 0, 0.45)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#004D00';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 22px rgba(50, 205, 50, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#006400';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 100, 0, 0.45)';
                }}
              >
                <Download size={19} />
                <span>Descargar Convocatoria Oficial (PDF)</span>
              </a>

              {/* CONSULTAR POR WHATSAPP */}
              <a
                href={`https://wa.me/59176543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  padding: '0.8rem 1.4rem',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  transition: 'background 0.18s ease, transform 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#20BA5A';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#25D366';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <MessageCircle size={19} color="#FFFFFF" strokeWidth={2.2} />
                <span>Consultar por WhatsApp</span>
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Quick Info Strip con Colores Corporativos ── */}
      <section style={{ position: 'relative', marginTop: '-24px', zIndex: 20 }}>
        <div className="container">
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #DCE1E6',
            boxShadow: '0 8px 24px rgba(55, 58, 64, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            padding: '1.25rem 1.5rem',
            gap: '1.25rem'
          }} className="quick-info-strip">

            <div style={{ borderRight: '1px solid #DCE1E6', paddingRight: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MODALIDAD
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#373A40', marginTop: '0.2rem' }}>
                {prog.modality || 'Híbrida – Turno Noche'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#646973' }}>
                Clases virtuales síncronas grabadas
              </div>
            </div>

            <div style={{ borderRight: '1px solid #DCE1E6', paddingRight: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DURACIÓN & CRÉDITOS
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#373A40', marginTop: '0.2rem' }}>
                {prog.duration || (isMaster ? '24 meses' : '6 Meses')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#646973' }}>
                {prog.credits ? `${prog.credits} Créditos CEUB` : 'Acreditado SNC-CEUB'}
              </div>
            </div>

            <div style={{ borderRight: '1px solid #DCE1E6', paddingRight: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SEDE & CAMPUS
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#373A40', marginTop: '0.2rem' }}>
                Campus Universitario Cota Cota
              </div>
              <div style={{ fontSize: '0.78rem', color: '#646973' }}>
                Edificio FCPN • La Paz, Bolivia
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                GRADO ACADÉMICO
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#373A40', marginTop: '0.2rem' }}>
                {prog.degree || (isMaster ? 'M.Sc. en Ciencia de Datos' : 'Diploma de Posgrado')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#646973' }}>
                Homologación CEUB - UMSA
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Main Clean Tabs Navigation (Alineado con Paleta Corporativa UMSA) ── */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        
        {/* TAB BUTTONS BAR */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #DCE1E6'
        }} className="program-nav-tabs">
          
          {tabConfigs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: isActive ? `1.5px solid ${tab.color}` : `1.5px solid ${tab.borderColor}`,
                  background: isActive ? tab.gradient : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#373A40',
                  boxShadow: isActive ? '0 4px 14px rgba(0, 100, 0, 0.25)' : '0 1px 3px rgba(55,58,64,0.04)',
                  fontSize: '0.885rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = tab.subtleBg;
                    e.currentTarget.style.borderColor = tab.color;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = tab.borderColor;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? 'rgba(255, 255, 255, 0.22)' : tab.subtleBg,
                  color: isActive ? '#FFFFFF' : tab.color
                }}>
                  <IconComponent size={15} />
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}

        </div>

        {/* ── TAB 1: PERFIL ACADÉMICO (Azul Acero #4682B4 & Azul Apoyo #6495ED) ── */}
        {activeTab === 'perfil' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Visual Header Banner Corporativo */}
            <div style={{
              background: 'linear-gradient(135deg, #2A5A84 0%, #4682B4 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              boxShadow: '0 6px 20px rgba(70, 130, 180, 0.25)'
            }}>
              <div style={{ maxWidth: '640px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.18)', padding: '0.25rem 0.65rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                  <Sparkles size={14} />
                  <span>Excelencia Académica de Posgrado</span>
                </div>
                <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Perfil Académico & Oportunidades Profesionales
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#E6EBF5', lineHeight: 1.5 }}>
                  Formación rigurosa orientada a resolver problemas cuantitativos complejos en sectores estratégicos.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(8px)', padding: '0.65rem 1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>100%</div>
                  <div style={{ fontSize: '0.72rem', color: '#E6EBF5' }}>Acreditado CEUB</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(8px)', padding: '0.65rem 1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>4to Nivel</div>
                  <div style={{ fontSize: '0.72rem', color: '#E6EBF5' }}>Grado Científico</div>
                </div>
              </div>
            </div>

            {/* Perfil del Aspirante & Áreas */}
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#E6EBF5', '#4682B4')}>
                <div style={iconBadgeStyle('#E6EBF5', '#4682B4')}>
                  <Compass size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>¿A quiénes va dirigido? (Perfil del Aspirante)</h3>
                  <p style={sectionSubtitleStyle}>Requisitos de formación previa y perfil de ingreso idóneo</p>
                </div>
              </div>

              <div style={{
                background: '#EBE6DA',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #DCE1E6',
                fontSize: '0.98rem',
                color: '#373A40',
                lineHeight: 1.75,
                whiteSpace: 'pre-line'
              }}>
                {targetAudienceText}
              </div>

              {/* Tarjetas Visuales con Iconos de Áreas Profesionales */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lightbulb size={16} color="#006400" />
                  <span>Áreas Disciplinares y Profesionales Idóneas:</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.85rem'
                }}>
                  {[
                    { title: 'Estadística & Biometría', desc: 'Modelación, muestreo e inferencia', icon: BarChart3, color: '#006400', bg: '#DCF5DC' },
                    { title: 'Informática & Sistemas', desc: 'Arquitectura de datos y computación', icon: Code2, color: '#4682B4', bg: '#E6EBF5' },
                    { title: 'Matemáticas & Física', desc: 'Fundamentación probabilística', icon: Brain, color: '#006400', bg: '#DCF5DC' },
                    { title: 'Economía & Finanzas', desc: 'Econometría y series de tiempo', icon: Database, color: '#4682B4', bg: '#E6EBF5' }
                  ].map((area, idx) => {
                    const AreaIcon = area.icon;
                    return (
                      <div key={idx} style={{
                        background: '#FFFFFF',
                        border: '1.5px solid #DCE1E6',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease'
                      }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: area.bg, color: area.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <AreaIcon size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#373A40' }}>{area.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#646973', marginTop: '0.15rem' }}>{area.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Perfil del Graduado */}
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#DCF5DC', '#006400')}>
                <div style={iconBadgeStyle('#DCF5DC', '#006400')}>
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>Perfil del Graduado & Competencias</h3>
                  <p style={sectionSubtitleStyle}>Capacidades científicas, analíticas y de liderazgo que desarrollará el egresado</p>
                </div>
              </div>

              <div style={{
                background: '#EBE6DA',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #DCE1E6',
                fontSize: '0.98rem',
                color: '#373A40',
                lineHeight: 1.75,
                whiteSpace: 'pre-line',
                marginBottom: '1.5rem'
              }}>
                {graduateProfileText}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#006400' }} />
                    <div style={{ fontWeight: 800, color: '#373A40', fontSize: '0.95rem' }}>
                      Modelación & Analítica Avanzada
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Capacidad para estructurar e interpretar modelos estocásticos, algoritmos predictivos y aprendizaje automático sobre datos complejos.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4682B4' }} />
                    <div style={{ fontWeight: 800, color: '#373A40', fontSize: '0.95rem' }}>
                      Toma de Decisiones Estratégicas
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Liderazgo de proyectos analíticos en instituciones financieras, entidades públicas, organismos internacionales e industria tecnológica.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#32CD32' }} />
                    <div style={{ fontWeight: 800, color: '#373A40', fontSize: '0.95rem' }}>
                      Investigación Reproducible
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Generación de nuevo conocimiento mediante publicaciones indexadas y proyectos reproducibles con R, Python y entornos modernos.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: MATERIAS & MALLA CURRICULAR (#006400 Institucional) ── */}
        {activeTab === 'materias' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Header del bloque con botón de Descarga Directa */}
            <div style={{
              background: 'linear-gradient(135deg, #004D00 0%, #006400 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 6px 20px rgba(0, 100, 0, 0.3)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Plan de Estudios & Estructura Modular
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#DCF5DC', marginTop: '0.25rem' }}>
                  Homologado por el CEUB • Total: <strong>{prog.credits || '72'} créditos</strong> • Modalidad: <strong>{prog.modality || 'Híbrida'}</strong>
                </div>
              </div>

              {/* BOTÓN DESCARGA DIRECTA DE MALLA EN PDF */}
              <a
                href={directDownloadMalla}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  background: '#FFFFFF',
                  color: '#006400',
                  borderRadius: '6px',
                  padding: '0.7rem 1.35rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  border: '1.5px solid #32CD32',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer'
                }}
              >
                <Download size={17} />
                <span>Descargar Malla Curricular (PDF)</span>
              </a>
            </div>

            {/* Render de asignaturas */}
            {curriculum.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1.5px dashed #C8CDD2',
                borderRadius: '10px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#646973'
              }}>
                <BookOpen size={40} style={{ color: '#006400', marginBottom: '0.75rem' }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#373A40', fontWeight: 800 }}>Plan de Estudios Modular</h4>
                <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                  El plan de estudios detallado se encuentra registrado en el documento oficial de convocatoria descargable.
                </p>
                <a
                  href={directDownloadConvocatoria}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: '#006400', color: '#006400' }}
                >
                  <Download size={14} />
                  <span>Descargar Convocatoria con Malla (PDF)</span>
                </a>
              </div>
            ) : (
              <div>
                {/* Selector de Semestre / Módulo si hay varios */}
                {curriculum.length > 1 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    overflowX: 'auto',
                    paddingBottom: '0.65rem',
                    marginBottom: '1.25rem',
                    borderBottom: '1px solid #DCE1E6'
                  }}>
                    {curriculum.map((sem, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setActiveSemesterTab(sIdx)}
                        style={{
                          background: activeSemesterTab === sIdx ? '#006400' : '#FFFFFF',
                          color: activeSemesterTab === sIdx ? '#FFFFFF' : '#373A40',
                          border: activeSemesterTab === sIdx ? '1.5px solid #006400' : '1.5px solid #DCE1E6',
                          borderRadius: '6px',
                          padding: '0.6rem 1.15rem',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: activeSemesterTab === sIdx ? '0 2px 8px rgba(0, 100, 0, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sem.semester}
                        <span style={{
                          marginLeft: '0.45rem',
                          fontSize: '0.75rem',
                          opacity: activeSemesterTab === sIdx ? 0.95 : 0.7,
                          background: activeSemesterTab === sIdx ? 'rgba(255,255,255,0.25)' : '#E6EBF5',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '99px'
                        }}>
                          {sem.modules?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mostrar materias del semestre activo */}
                {curriculum[activeSemesterTab] && (
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      padding: '0.25rem 0'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#373A40' }}>
                        {curriculum[activeSemesterTab].semester}
                      </div>
                      <span style={{ fontSize: '0.825rem', color: '#006400', fontWeight: 700, background: '#DCF5DC', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                        {curriculum[activeSemesterTab].modules.length} materias programadas
                      </span>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {curriculum[activeSemesterTab].modules.map((mod, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            background: '#FFFFFF',
                            border: '1.5px solid #DCE1E6',
                            borderRadius: '8px',
                            padding: '1.25rem 1.5rem',
                            boxShadow: '0 2px 6px rgba(55, 58, 64, 0.03)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: '0.825rem',
                                color: '#006400',
                                background: '#DCF5DC',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '4px',
                                border: '1px solid #98DF98'
                              }}>
                                {mod.code}
                              </span>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#373A40' }}>
                                {mod.name}
                              </h4>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#373A40',
                                background: '#E6EBF5',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px'
                              }}>
                                {mod.credits} Créditos ({mod.hours} hrs)
                              </span>
                              <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                color: '#006400',
                                background: '#DCF5DC',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '4px',
                                border: '1px solid #98DF98'
                              }}>
                                {mod.type || 'Teórico-Práctica'}
                              </span>
                            </div>
                          </div>

                          {mod.desc && (
                            <p style={{ fontSize: '0.9rem', color: '#646973', margin: '0.5rem 0', lineHeight: 1.6 }}>
                              {mod.desc}
                            </p>
                          )}

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            fontSize: '0.825rem',
                            color: '#646973',
                            flexWrap: 'wrap',
                            borderTop: '1px dashed #DCE1E6',
                            paddingTop: '0.65rem',
                            marginTop: '0.5rem'
                          }}>
                            {mod.software && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#006400', fontWeight: 600 }}>
                                <Laptop size={14} color="#006400" />
                                <span><strong>Herramientas:</strong> {mod.software}</span>
                              </div>
                            )}
                            {mod.prerequisites && mod.prerequisites !== 'Ninguno' && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#B8860B' }}>
                                <span><strong>Prerrequisito:</strong> {mod.prerequisites}</span>
                              </div>
                            )}
                            {mod.docentes && (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4682B4' }}>
                                <Users size={14} color="#4682B4" />
                                <span><strong>Docente:</strong> {mod.docentes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: EQUIPO DOCENTE (#4682B4 Azul Acero & #6495ED) ── */}
        {activeTab === 'docentes' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#E6EBF5', '#4682B4')}>
                <div style={iconBadgeStyle('#E6EBF5', '#4682B4')}>
                  <Users size={22} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={sectionTitleStyle}>Planta Docente & Investigadores</h3>
                    <p style={sectionSubtitleStyle}>Profesores con títulos de Doctorado (Ph.D.) y Maestría de universidades de prestigio</p>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#006400', fontWeight: 700, background: '#DCF5DC', border: '1px solid #98DF98', padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                    Catedráticos Acreditados CEUB
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem'
              }}>
                {facultyData.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #DCE1E6',
                      borderRadius: '8px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(70, 130, 180, 0.05)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2.5px solid #4682B4'
                          }}
                        />
                        <div>
                          <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '1rem', fontWeight: 800, color: '#373A40' }}>
                            {doc.name}
                          </h4>
                          <div style={{ fontSize: '0.82rem', color: '#006400', fontWeight: 700 }}>
                            {doc.degree}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#646973' }}>
                            {doc.university}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#646973', lineHeight: 1.55, margin: '0 0 0.85rem 0' }}>
                        {doc.bio}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #DCE1E6', paddingTop: '0.75rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#646973', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Especialidad / Línea:
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#373A40', fontWeight: 600 }}>
                        {doc.specialty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 4: REQUISITOS DE ADMISIÓN (Verde Corporativo & Checklist Interactivo) ── */}
        {activeTab === 'requisitos' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Banner de Descarga Directa de Requisitos */}
            <div style={{
              background: 'linear-gradient(135deg, #004D00 0%, #006400 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              boxShadow: '0 6px 20px rgba(0, 100, 0, 0.3)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Documento Oficial de Convocatoria & Requisitos
                </h3>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#DCF5DC', maxWidth: '600px' }}>
                  Descarga directa en formato PDF con las bases, perfil de postulación, cronograma y etapas de selección.
                </p>
              </div>

              {/* BOTÓN DESCARGA DIRECTA */}
              <a
                href={directDownloadConvocatoria}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  background: '#FFFFFF',
                  color: '#006400',
                  borderRadius: '6px',
                  padding: '0.8rem 1.6rem',
                  fontSize: '0.925rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  border: '1.5px solid #32CD32',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  cursor: 'pointer'
                }}
              >
                <Download size={18} />
                <span>Descargar PDF de Requisitos</span>
              </a>
            </div>

            {/* Checklist Interactivo y Fácil de Usar para Postulantes */}
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#DCF5DC', '#006400')}>
                <div style={iconBadgeStyle('#DCF5DC', '#006400')}>
                  <FileCheck2 size={22} />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={sectionTitleStyle}>Verificador Interactivo de Documentación</h3>
                    <p style={sectionSubtitleStyle}>Marca los documentos que tienes listos para calcular tu avance de postulación</p>
                  </div>
                  
                  <div style={{
                    background: progressPercent === 100 ? '#DCF5DC' : '#FFF5DC',
                    border: `1.5px solid ${progressPercent === 100 ? '#98DF98' : '#E6D2A8'}`,
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    color: progressPercent === 100 ? '#006400' : '#B8860B'
                  }}>
                    {totalChecked} de {totalDocs} documentos listos ({progressPercent}%)
                  </div>
                </div>
              </div>

              {/* Barra de progreso interactiva (#006400 / #32CD32) */}
              <div style={{ width: '100%', height: '8px', background: '#DCE1E6', borderRadius: '99px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: progressPercent === 100 ? 'linear-gradient(90deg, #32CD32, #006400)' : 'linear-gradient(90deg, #4682B4, #006400)',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Lista interactiva de checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'doc1', title: 'Fotocopia legalizada del Título en Provisión Nacional (Grado Licenciatura).' },
                  { id: 'doc2', title: 'Fotocopia legalizada del Diploma Académico de Licenciatura.' },
                  { id: 'doc3', title: 'Certificado de Nacimiento original y Cédula de Identidad vigente.' },
                  { id: 'doc4', title: 'Currículum Vitae documentado y foliado según reglamento.' },
                  { id: 'doc5', title: 'Carta de motivación y solicitud de postulación dirigida al Coordinador.' },
                  { id: 'doc6', title: 'Formulario oficial de preinscripción digital completado.' }
                ].map((item) => {
                  const isChecked = checkedDocs[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheckDoc(item.id)}
                      style={{
                        background: isChecked ? '#DCF5DC' : '#FFFFFF',
                        border: isChecked ? '1.5px solid #006400' : '1.5px solid #DCE1E6',
                        borderRadius: '6px',
                        padding: '0.9rem 1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ color: isChecked ? '#006400' : '#C8CDD2', display: 'flex', alignItems: 'center' }}>
                        {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <span style={{
                        fontSize: '0.925rem',
                        color: isChecked ? '#006400' : '#373A40',
                        fontWeight: isChecked ? 700 : 500
                      }}>
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Steps / Pasos de Postulación */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                borderTop: '1px solid #DCE1E6',
                paddingTop: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4682B4', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 1
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Preinscripción Digital
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Completar el formulario en línea y cargar comprobante digital.
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 2
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Entrega de Carpeta
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Presentación de títulos legalizados y foliados en Posgrado.
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4682B4', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 3
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Evaluación de Méritos
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Revisión por la Comisión Académica Evaluadora.
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '6px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#006400', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Paso 4
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#373A40', marginBottom: '0.2rem' }}>
                    Admisión & Matrícula
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#646973' }}>
                    Generación de código CPT y habilitación de campus virtual.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 5: MODALIDADES DE TITULACIÓN (Verde Institucional & Verde Acento) ── */}
        {activeTab === 'titulacion' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#DCF5DC', '#006400')}>
                <div style={iconBadgeStyle('#DCF5DC', '#006400')}>
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>Modalidades de Titulación Aprobadas</h3>
                  <p style={sectionSubtitleStyle}>Vías normadas por el Comité Ejecutivo de la Universidad Boliviana (CEUB)</p>
                </div>
              </div>

              <div style={{
                background: '#EBE6DA',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid #DCE1E6',
                fontSize: '0.95rem',
                color: '#373A40',
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                marginBottom: '1.5rem'
              }}>
                {titulationText}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem'
              }}>
                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#DCF5DC', color: '#006400', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <Award size={20} />
                  </div>
                  <div style={{ fontWeight: 800, color: '#373A40', fontSize: '1rem', marginBottom: '0.35rem' }}>
                    1. Tesis de Maestría
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Investigación científica original de rigor metodológico guiada por un docente tutor acreditado y defendida públicamente.
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#E6EBF5', color: '#4682B4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ fontWeight: 800, color: '#373A40', fontSize: '1rem', marginBottom: '0.35rem' }}>
                    2. Artículo Científico Indexado
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Publicación de al menos un artículo científico como autor principal en revistas indexadas (Scopus, SciELO o Web of Science).
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #DCE1E6', borderRadius: '8px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(55,58,64,0.03)' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#DCF5DC', color: '#006400', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div style={{ fontWeight: 800, color: '#373A40', fontSize: '1rem', marginBottom: '0.35rem' }}>
                    3. Trabajo Dirigido
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#646973', lineHeight: 1.55 }}>
                    Solución práctica de un problema metodológico o analítico concreto en una institución pública o del sector productivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: FECHAS & HORARIOS (Azul Acero #4682B4 & #E6EBF5) ── */}
        {activeTab === 'fechas' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={cleanPanelStyle}>
              <div style={sectionHeaderStyle('#E6EBF5', '#4682B4')}>
                <div style={iconBadgeStyle('#E6EBF5', '#4682B4')}>
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 style={sectionTitleStyle}>Cronograma Académico & Horarios de Clases</h3>
                  <p style={sectionSubtitleStyle}>Calendario de convocatoria, etapas del proceso y turnos de docencia</p>
                </div>
              </div>

              {/* Grid de fechas con iconos */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#DCF5DC', '#006400')}>Paso 1</div>
                  <div style={dateTitleStyle}>Publicación de Bases</div>
                  <div style={dateValueStyle}>Gestión 2026</div>
                  <div style={dateDescStyle}>Apertura de inscripciones y descarga de guías académicas.</div>
                </div>

                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#FFF5DC', '#B8860B')}>Paso 2</div>
                  <div style={dateTitleStyle}>Recepción de Carpetas</div>
                  <div style={dateValueStyle}>Ventanilla de Posgrado</div>
                  <div style={dateDescStyle}>Entrega de expedientes y títulos legalizados.</div>
                </div>

                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#E6EBF5', '#4682B4')}>Paso 3</div>
                  <div style={dateTitleStyle}>Evaluación de Méritos</div>
                  <div style={dateValueStyle}>Comité de Posgrado</div>
                  <div style={dateDescStyle}>Calificación curricular y publicación de listas de admitidos.</div>
                </div>

                <div style={dateCardStyle}>
                  <div style={dateBadgeStyle('#DCF5DC', '#006400')}>Paso 4</div>
                  <div style={dateTitleStyle}>Inicio de Clases</div>
                  <div style={dateValueStyle}>Semestre I - 2026</div>
                  <div style={dateDescStyle}>Sesiones síncronas programadas e inducción a la plataforma.</div>
                </div>
              </div>

              {/* Horarios y Turnos */}
              <div style={{ background: '#EBE6DA', padding: '1.5rem', borderRadius: '8px', border: '1px solid #DCE1E6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <Clock size={18} color="#006400" />
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#373A40' }}>
                    Horario de Clases & Turnos
                  </h4>
                </div>
                <div style={{ fontSize: '0.92rem', color: '#646973', lineHeight: 1.7 }}>
                  • <strong>Días de Clases:</strong> Lunes a Jueves (Turno Noche: 19:00 a 22:00 h).<br />
                  • <strong>Modalidad:</strong> Clases virtuales síncronas mediante plataforma Zoom / Meet de la UMSA, con grabación disponible 24/7.<br />
                  • <strong>Talleres Prácticos:</strong> Laboratorios de computación estadística en Campus Cota Cota (programados en fines de semana o virtuales).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BANNER INFERIOR DE AYUDA Y CONTACTO CON WHATSAPP FOSFORESCENTE ── */}
        <section style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, #003800 0%, #006400 50%, #1B3F63 100%)',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 8px 30px rgba(0, 100, 0, 0.3)'
        }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
              ¿Tienes consultas sobre este programa?
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#E6EBF5', maxWidth: '600px', lineHeight: 1.6 }}>
              La Coordinación de Posgrado de la Carrera de Estadística te brinda atención personalizada sobre requisitos, convalidaciones y proceso de postulación.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/59176543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                padding: '0.8rem 1.45rem',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                transition: 'background 0.18s ease, transform 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#20BA5A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#25D366';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={19} color="#FFFFFF" strokeWidth={2.2} />
              <span>Contactar por WhatsApp</span>
            </a>

            <button
              onClick={handleBackNavigation}
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 700,
                fontSize: '0.925rem',
                padding: '0.85rem 1.35rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.24)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'}
            >
              <ArrowLeft size={16} />
              <span>Volver a Programas</span>
            </button>
          </div>
        </section>

      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .quick-info-strip {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 520px) {
          .quick-info-strip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// ── Shared UI Styles con la Paleta Corporativa UMSA ──
const cleanPanelStyle = {
  background: '#FFFFFF',
  borderRadius: '10px',
  border: '1px solid #DCE1E6',
  padding: '1.75rem 2rem',
  boxShadow: '0 2px 10px rgba(55, 58, 64, 0.03)'
};

const sectionHeaderStyle = (bg, color) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #DCE1E6'
});

const iconBadgeStyle = (bg, color) => ({
  width: '42px',
  height: '42px',
  borderRadius: '8px',
  background: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: '#373A40',
  margin: '0 0 0.2rem 0',
  letterSpacing: '-0.01em'
};

const sectionSubtitleStyle = {
  fontSize: '0.825rem',
  color: '#646973',
  margin: 0
};

const dateCardStyle = {
  background: '#FFFFFF',
  border: '1.5px solid #DCE1E6',
  borderRadius: '8px',
  padding: '1.15rem'
};

const dateBadgeStyle = (bg, color) => ({
  display: 'inline-block',
  background: bg,
  color: color,
  fontSize: '0.72rem',
  fontWeight: 800,
  padding: '0.2rem 0.55rem',
  borderRadius: '4px',
  marginBottom: '0.4rem',
  border: `1px solid ${color}40`
});

const dateTitleStyle = {
  fontSize: '0.92rem',
  fontWeight: 800,
  color: '#373A40',
  marginBottom: '0.2rem'
};

const dateValueStyle = {
  fontSize: '0.825rem',
  fontWeight: 700,
  color: '#006400',
  marginBottom: '0.35rem'
};

const dateDescStyle = {
  fontSize: '0.78rem',
  color: '#646973',
  lineHeight: 1.45
};
