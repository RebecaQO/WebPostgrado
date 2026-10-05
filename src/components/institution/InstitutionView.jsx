import React, { useState, useEffect } from 'react';
import { facultyData, institutionTimeline } from '../../data/facultyData';
import { 
  Building2, 
  Target, 
  Eye, 
  Users, 
  Microscope, 
  Lightbulb, 
  Compass, 
  History,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useScrollReveal } from '../../utils/reveal';

import slide1 from '../../assets/images/carrusel/slide1.jpg';
import slide2 from '../../assets/images/carrusel/slide2.jpg';
import slide3 from '../../assets/images/carrusel/slide3.jpg';
import slide4 from '../../assets/images/carrusel/slide4.jpg';

export const InstitutionView = () => {
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(0);

  // Inicializar observador de scroll para [data-reveal]
  useScrollReveal();

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

  const toggleAccordion = (index) => {
    setOpenAccordion((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="institution-page" style={{ paddingBottom: 'var(--space-xl)' }}>
      
      {/* ── 1. Hero Institucional (Fluido, humano, no rígido) ── */}
      <section className="section-spacing" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" data-reveal>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow">Nuestra Institución</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h1)', margin: 'var(--space-2xs) 0 var(--space-xs) 0', color: '#0f172a', textWrap: 'balance' }}>
              Excelencia Académica, Investigación &amp; Rigor Estadístico
            </h1>
            <p className="lead" style={{ color: '#475569', margin: '0 0 var(--space-md) 0' }}>
              Unidad de Posgrado e Investigación de la Carrera de Estadística — Facultad de Ciencias Puras y Naturales, Universidad Mayor de San Andrés.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ul className="pill-list pill-list--green" style={{ justifyContent: 'center' }}>
                <li>Acreditación CEUB</li>
                <li>Modelación Estocástica</li>
                <li>Ciencia de Datos &amp; IA</li>
                <li>Bioestadística</li>
                <li>Inferencia Causal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: 'var(--space-lg)' }}>
        
        {/* ── 2. Split 1: Misión Académica y Compromiso Social (Texto + Imagen) ── */}
        <section className="split" data-reveal aria-labelledby="mision-title">
          <div className="split__media">
            <img 
              src={slide1} 
              alt="Campus Universitario Cota Cota - Facultad de Ciencias Puras y Naturales UMSA" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
          <div className="split__content">
            <span className="eyebrow">Misión &amp; Compromiso</span>
            <h2 id="mision-title">Formación de alto nivel para los desafíos cuantitativos de Bolivia</h2>
            <p>
              Formamos investigadores y profesionales de cuarto nivel con sólida fundamentación matemática y estocástica, capaces de formular modelos probabilísticos, diseñar experimentos complejos y liderar la toma de decisiones basada en evidencia para resolver problemáticas del desarrollo científico, social, ambiental y productivo.
            </p>
            <ul className="pill-list" style={{ marginTop: 'var(--space-2xs)' }}>
              <li>Fundamentación Matemática</li>
              <li>Toma de Decisiones basada en Datos</li>
              <li>Impacto Productivo</li>
            </ul>
          </div>
        </section>

        {/* ── 3. Split 2: Investigación & IETA (Alterno data-reverse) ── */}
        <section className="split" data-reverse data-reveal aria-labelledby="ieta-title">
          <div className="split__media">
            <img 
              src={slide3} 
              alt="Laboratorio analítico e investigación en el Instituto de Estadística Teórica y Aplicada" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
          <div className="split__content">
            <span className="eyebrow eyebrow--blue">Investigación de Frontera</span>
            <h2 id="ieta-title">Instituto de Estadística Teórica y Aplicada (IETA)</h2>
            <p>
              El IETA es el motor científico de nuestra unidad, generando modelos analíticos aplicados a salud pública, econometría, cambio climático y optimización industrial. Desarrolla investigación de frontera en métodos Markov Chain Monte Carlo (MCMC), estadística bayesiana y muestreo en poblaciones complejas.
            </p>
            <ul className="pill-list" style={{ marginTop: 'var(--space-2xs)' }}>
              <li>MCMC Bayesiano</li>
              <li>Muestreo Complejo</li>
              <li>Series Temporales</li>
              <li>Modelos Epidemiológicos</li>
            </ul>
          </div>
        </section>

        {/* ── 4. Callout Lateral: Semillero y Club Científico ── */}
        <section className="callout" data-reveal style={{ marginBlock: 'var(--space-xl)' }} aria-labelledby="club-title">
          <div className="callout__media">
            <img 
              src={slide2} 
              alt="Estudiantes y posgraduantes en talleres y hackathons de datos" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
          <div className="callout__body">
            <span className="eyebrow">Comunidad &amp; Talento</span>
            <h2 id="club-title">Club Científico de Estadística</h2>
            <p>
              Semillero activo de jóvenes investigadores y estudiantes de posgrado dedicado a datathons, coloquios de investigación, lectura crítica de papers y talleres intensivos de programación en R, Python y Julia.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginTop: 'var(--space-2xs)' }}>
              <span className="callout__link">Talleres de Programación &amp; Hackathons</span>
            </div>
          </div>
        </section>

        {/* ── 5. Trayectoria Histórica (Acordeón accesible y suave) ── */}
        <section style={{ marginBlock: 'var(--space-xl)' }} data-reveal aria-labelledby="history-title">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto var(--space-md) auto' }}>
            <span className="eyebrow">Trayectoria</span>
            <h2 id="history-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', margin: 'var(--space-2xs) 0 0 0', color: '#0f172a' }}>
              Más de Cinco Décadas al Servicio de la Ciencia
            </h2>
            <p style={{ color: '#64748b', fontSize: 'var(--fs-body)', margin: 'var(--space-2xs) 0 0 0' }}>
              Evolución y consolidación de la formación estocástica en la Universidad Mayor de San Andrés.
            </p>
          </div>

          <div className="accordion container--narrow" data-accordion>
            {institutionTimeline.map((item, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div key={idx} className="accordion__item">
                  <h3 className="accordion__header">
                    <button
                      type="button"
                      className="accordion__trigger"
                      aria-expanded={isOpen}
                      aria-controls={`panel-history-${idx}`}
                      id={`trigger-history-${idx}`}
                      onClick={() => toggleAccordion(idx)}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ 
                          background: 'rgba(38, 115, 66, 0.1)', 
                          color: 'var(--color-green-inst, #006400)', 
                          padding: '0.2rem 0.65rem', 
                          borderRadius: 'var(--radius-pill)', 
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          fontFamily: 'monospace'
                        }}>
                          {item.year}
                        </span>
                        <span>{item.title}</span>
                      </span>
                      <span className="accordion__icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={`panel-history-${idx}`}
                    role="region"
                    aria-labelledby={`trigger-history-${idx}`}
                    className={`accordion__panel ${isOpen ? 'is-open' : ''}`}
                  >
                    <div className="accordion__body">
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 6. Claustro Docente e Investigadores (Grilla Reutilizable) ── */}
        <section style={{ marginBlock: 'var(--space-xl)' }} data-reveal aria-labelledby="faculty-title">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto var(--space-md) auto' }}>
            <span className="eyebrow">Claustro Académico</span>
            <h2 id="faculty-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', margin: 'var(--space-2xs) 0 0 0', color: '#0f172a' }}>
              Docentes e Investigadores de Posgrado
            </h2>
            <p style={{ color: '#64748b', fontSize: 'var(--fs-body)', margin: 'var(--space-2xs) 0 0 0' }}>
              Académicos con grado de Doctorado (Ph.D.) y Maestría (M.Sc.) vinculados activamente a la producción científica nacional e internacional.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-md)'
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
                <article
                  key={doc.id}
                  className="stat"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: 'var(--space-md)'
                  }}
                >
                  <img
                    src={photo}
                    alt={fullName}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                    style={{
                      width: '92px',
                      height: '92px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--color-green-inst, #006400)',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                      marginBottom: 'var(--space-2xs)',
                      background: '#f1f5f9'
                    }}
                  />

                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 0.2rem 0', fontWeight: 800 }}>
                    {fullName}
                  </h3>

                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-green-inst, #006400)',
                    fontWeight: 700,
                    marginBottom: '0.2rem'
                  }}>
                    {degree}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 'var(--space-2xs)' }}>
                    {specialty}
                  </div>

                  <p style={{
                    fontSize: '0.84rem',
                    color: '#475569',
                    lineHeight: 1.55,
                    margin: '0 0 var(--space-sm) 0',
                    flex: 1
                  }}>
                    {bio}
                  </p>

                  {/* Enlaces a Perfiles Académicos */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    paddingTop: 'var(--space-2xs)',
                    borderTop: '1px solid #f1f5f9',
                    width: '100%'
                  }}>
                    <a
                      href={scholarUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-pill)', background: '#f1f5f9', color: '#334155', fontWeight: 600 }}
                    >
                      Scholar
                    </a>
                    <a
                      href={orcidUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-pill)', background: '#f1f5f9', color: '#334155', fontWeight: 600 }}
                    >
                      ORCID
                    </a>
                    <a
                      href={researchgateUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-pill)', background: '#f1f5f9', color: '#334155', fontWeight: 600 }}
                    >
                      ResearchGate
                    </a>
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-pill)', background: '#f1f5f9', color: '#334155', fontWeight: 600 }}
                    >
                      LinkedIn
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
