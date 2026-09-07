import React, { useState, useEffect } from 'react';
import { facultyData, institutionTimeline } from '../../data/facultyData';
import { 
  Building2, 
  ShieldCheck, 
  Target, 
  Eye, 
  BookOpen, 
  Award, 
  History, 
  Users, 
  GraduationCap, 
  ExternalLink,
  BookMarked,
  Microscope,
  Compass,
  Lightbulb
} from 'lucide-react';

export const InstitutionView = () => {
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoadingDocentes(true);
        const res = await fetch('/api/docentes');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDocentes(data);
          } else {
            setDocentes(facultyData);
          }
        } else {
          setDocentes(facultyData);
        }
      } catch (err) {
        console.error('Error cargando docentes:', err);
        setDocentes(facultyData);
      } finally {
        setLoadingDocentes(false);
      }
    };
    fetchDocentes();
  }, []);

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Building2 size={14} />
            <span>NUESTRA INSTITUCIÓN</span>
          </div>
          <h1 className="section-title">
            Excelencia Académica, Investigación & Rigor Estadístico
          </h1>
          <p className="section-subtitle">
            Unidad de Posgrado e Investigación — Carrera de Estadística, Facultad de Ciencias Puras y Naturales, Universidad Mayor de San Andrés.
          </p>
        </div>

        {/* Misión y Visión Cards */}
        <div className="grid-2" style={{ marginBottom: '4.5rem' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--color-green-inst)', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-green-inst-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={22} color="var(--color-green-inst)" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-umsa-blue-dark)' }}>Misión Académica</h3>
            </div>
            <p style={{ lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Formar investigadores y profesionales de cuarto nivel con sólida fundamentación matemática y estocástica, capaces de formular modelos probabilísticos, diseñar experimentos complejos y liderar la toma de decisiones basada en datos para resolver problemáticas prioritarias del desarrollo científico, social, ambiental y productivo del Estado Plurinacional de Bolivia.
            </p>
          </div>

          <div className="glass-card" style={{ borderLeft: '4px solid #0284c7', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Eye size={22} color="#0284c7" />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-umsa-blue-dark)' }}>Visión Estratégica 2030</h3>
            </div>
            <p style={{ lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              Consolidarse como el centro de posgrado e investigación de referencia internacional en Estadística y Ciencia de Datos en la región andina, acreditado con los más altos estándares del Sistema de la Universidad Boliviana (CEUB), impulsando la innovación analítica y la generación de conocimiento transferible.
            </p>
          </div>
        </div>

        {/* ── ENTIDADES INSTITUCIONALES (Dirección, IETA, Club Científico) ── */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag">
              <Compass size={14} />
              <span>ESTRUCTURA INSTITUCIONAL & CIENTÍFICA</span>
            </div>
            <h2>Unidades Académicas y Semilleros de Investigación</h2>
            <p className="section-subtitle">
              Conexión directa entre la gestión académica, la investigación de frontera y la comunidad estudiantil de posgrado.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* 1. Dirección de la Carrera */}
            <div className="glass-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--color-green-inst-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={24} color="var(--color-green-inst)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-umsa-blue-dark)', margin: 0, fontWeight: 800 }}>
                    Dirección de la Carrera
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>FCPN · Campus Cota Cota Calle 27</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Órgano de conducción y administración académica de la Carrera de Estadística y sus programas de postgrado e investigación. Responsable de convenios interinstitucionales y homologaciones curriculares ante el CEUB.
              </p>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-main)', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                📍 <strong>Ubicación:</strong> Edificio Carrera de Estadística, 2do Piso, Campus Cota Cota.
              </div>
            </div>

            {/* 2. IETA */}
            <div className="glass-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--color-blue-steel-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Microscope size={24} color="var(--color-blue-steel)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-umsa-blue-dark)', margin: 0, fontWeight: 800 }}>
                    IETA
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Instituto de Estadística Teórica y Aplicada</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Instituto de investigación científica dedicado a la generación de modelos probabilísticos, bioestadística, series temporales y asesoramiento analítico a instituciones gubernamentales y productivas de Bolivia.
              </p>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-main)', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                🔬 <strong>Líneas:</strong> MCMC Bayesiano, Muestreo Complejo, Aprendizaje Estadístico.
              </div>
            </div>

            {/* 3. Club Científico */}
            <div className="glass-card" style={{ background: '#ffffff', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(242, 104, 28, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={24} color="var(--color-accent-orange)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-umsa-blue-dark)', margin: 0, fontWeight: 800 }}>
                    Club Científico
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Semillero de Jóvenes Investigadores</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Comunidad activa de estudiantes y posgraduantes dedicada a hackathons de datos, grupos de lectura científica, talleres de programación en R/Python y difusión del conocimiento cuantitativo.
              </p>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-main)', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                💡 <strong>Actividades:</strong> Coloquios estadísticos, datathons y divulgación.
              </div>
            </div>
          </div>
        </div>

        {/* Reseña Histórica & Timeline */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-tag">
              <History size={14} />
              <span>TRAYECTORIA HISTÓRICA</span>
            </div>
            <h2>Más de Cinco Décadas al Servicio de la Ciencia</h2>
          </div>

          <div style={{
            position: 'relative',
            maxWidth: '850px',
            margin: '0 auto',
            paddingLeft: '2rem',
            borderLeft: '3px solid var(--color-green-inst)'
          }}>
            {institutionTimeline.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                {/* Node point */}
                <div style={{
                  position: 'absolute',
                  left: '-2.72rem',
                  top: '0.2rem',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '3px solid var(--color-green-inst)',
                  boxShadow: '0 0 10px rgba(38, 115, 66, 0.4)'
                }} />

                <div className="glass-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    background: 'var(--color-green-inst)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-family-mono)'
                  }}>
                    {item.year}
                  </div>
                  <h4 style={{ color: 'var(--color-umsa-blue-dark)', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PLANTEL DOCENTE E INVESTIGADORES (Desde la BD) ── */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-tag">
              <Users size={14} />
              <span>NUESTRO PLANTEL DOCENTE</span>
            </div>
            <h2>Claustro Docente e Investigadores</h2>
            <p className="section-subtitle">
              Profesores con grado de Doctorado (Ph.D.) y Maestría (M.Sc.) de universidades de renombre internacional, administrados activamente en la base de datos de posgrado.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '2rem'
          }}>
            {docentes.map((doc) => {
              const fullName = doc.nombre_completo || doc.name || `${doc.nombre || ''} ${doc.apellido || ''}`;
              const degree = doc.titulo || doc.degree || 'MSc en Estadística';
              const specialty = doc.especialidad || doc.specialty || 'Estadística Aplicada';
              const photo = doc.foto_url || doc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              const bio = doc.bio || 'Docente e Investigador de la Carrera de Estadística (FCPN-UMSA).';

              const scholarUrl = doc.scholar || doc.links?.scholar || 'https://scholar.google.com';
              const orcidUrl = doc.orcid || doc.links?.orcid || 'https://orcid.org';
              const researchgateUrl = doc.researchgate || doc.links?.researchgate || 'https://researchgate.net';
              const linkedinUrl = doc.linkedin || doc.links?.linkedin || 'https://linkedin.com';

              return (
                <div
                  key={doc.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: '#ffffff',
                    border: '1.5px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1.5rem'
                  }}
                >
                  <img
                    src={photo}
                    alt={fullName}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                    style={{
                      width: '104px',
                      height: '104px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--color-green-inst)',
                      boxShadow: '0 4px 14px rgba(38, 115, 66, 0.25)',
                      marginBottom: '1.25rem',
                      background: '#f1f5f9'
                    }}
                  />

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-umsa-blue-dark)', marginBottom: '0.25rem', fontWeight: 800 }}>
                    {fullName}
                  </h3>

                  <div style={{
                    fontSize: '0.825rem',
                    color: 'var(--color-green-inst)',
                    fontWeight: 800,
                    marginBottom: '0.35rem'
                  }}>
                    {degree}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: '1rem' }}>
                    {specialty}
                  </div>

                  {/* Bio brief */}
                  <p style={{
                    fontSize: '0.825rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    textAlign: 'center',
                    flex: 1
                  }}>
                    {bio}
                  </p>

                  {/* Academic Profile Links */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9',
                    width: '100%'
                  }}>
                    <a
                      href={scholarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem' }}
                      title="Google Scholar"
                    >
                      Scholar
                    </a>
                    <a
                      href={orcidUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem' }}
                      title="ORCID"
                    >
                      ORCID
                    </a>
                    <a
                      href={researchgateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem' }}
                      title="ResearchGate"
                    >
                      ResearchGate
                    </a>
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.5rem' }}
                      title="LinkedIn"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
