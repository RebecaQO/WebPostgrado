import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Plus, Minus, BookOpen, Users, Calendar, Award, Laptop, HelpCircle } from 'lucide-react';

const faqs = [
  {
    icon: BookOpen,
    category: 'Requisitos',
    question: '¿Cuáles son los requisitos generales para postular?',
    answer: 'Se requiere título de licenciatura en áreas afines (Estadística, Matemáticas, Economía, Ingeniería, Ciencias de la Salud u otras), fotocopia legalizada del diploma académico, hoja de vida actualizada, nota de presentación institucional y aprobar el proceso de admisión (examen de nivelación y/o entrevista académica).',
  },
  {
    icon: Award,
    category: 'Programas',
    question: '¿Cuál es la diferencia entre una Maestría y un Diplomado?',
    answer: 'Las Maestrías duran 4 semestres (~18 meses) y otorgan el grado M.Sc., requiriendo tesis. Los Diplomados son 6 meses de especialización intensiva con diploma de posgrado, sin tesis. Ambos están avalados por el CEUB y la UMSA.',
  },
  {
    icon: Users,
    category: 'Acreditación',
    question: '¿Los programas están acreditados y reconocidos oficialmente?',
    answer: 'Sí. Todos los programas están aprobados mediante Resolución del Honorable Consejo Universitario (HCU) de la UMSA y registrados en el CEUB, garantizando reconocimiento nacional. Los títulos son emitidos por la UMSA.',
  },
  {
    icon: Calendar,
    category: 'Modalidad',
    question: '¿Cuál es la modalidad de estudio y los horarios?',
    answer: 'Ofrecemos modalidad híbrida: clases presenciales en Campus Cota Cota (FCPN-UMSA) complementadas con sesiones virtuales síncronas. Horario principalmente nocturno (19:00–22:00 hrs) de lunes a jueves, pensado para profesionales activos.',
  },
  {
    icon: HelpCircle,
    category: 'Convocatorias',
    question: '¿Cómo saber si una convocatoria está vigente?',
    answer: 'Las convocatorias activas aparecen en la página de inicio y en "Programas Académicos". También puede consultar vía WhatsApp o siguiendo la página oficial de la Carrera de Estadística UMSA.',
  },
  {
    icon: Award,
    category: 'Financiamiento',
    question: '¿Existe financiamiento o becas disponibles?',
    answer: 'La UMSA ofrece becas institucionales para personal académico, administrativo y estudiantes. También se otorgan descuentos por pago al contado. Para más información sobre planes de financiamiento, comuníquese vía WhatsApp o correo institucional.',
  },
  {
    icon: Users,
    category: 'Postulación',
    question: '¿Puedo iniciar el proceso de postulación en línea?',
    answer: 'Sí. La postulación se realiza a través de un formulario en línea (Google Forms) disponible en cada convocatoria. También deberá presentar físicamente la documentación en la secretaría de la Unidad de Posgrado (Edificio Monoblock, Campus Cota Cota).',
  },
  {
    icon: Laptop,
    category: 'Software',
    question: '¿Con qué software y herramientas trabajan los programas?',
    answer: 'R / RStudio, Python (Jupyter, Pandas, Scikit-learn, PyTorch), SPSS, Stata, SAS Analytics, Stan (inferencia bayesiana) y herramientas de Big Data como Apache Spark. Los estudiantes tienen acceso a licencias institucionales y entornos de cómputo del laboratorio FCPN-UMSA.',
  },
];

const categoryColors = {
  'Requisitos':     { bg: '#eaf5ec', text: '#267342', dot: '#267342' },
  'Programas':      { bg: '#edf4f9', text: '#4f7e9f', dot: '#4f7e9f' },
  'Acreditación':   { bg: '#f5f0fa', text: '#7c5cbf', dot: '#7c5cbf' },
  'Modalidad':      { bg: '#fdf7e7', text: '#9e7512', dot: '#9e7512' },
  'Convocatorias':  { bg: '#fff0ee', text: '#b3392f', dot: '#b3392f' },
  'Financiamiento': { bg: '#eaf5ec', text: '#267342', dot: '#267342' },
  'Postulación':    { bg: '#edf4f9', text: '#4f7e9f', dot: '#4f7e9f' },
  'Software':       { bg: '#f0f4ff', text: '#4060bf', dot: '#4060bf' },
};

const FAQItem = ({ faq, isOpen, onToggle, index }) => {
  const panelRef = useRef(null);
  const Icon = faq.icon;
  const catStyle = categoryColors[faq.category] || { bg: '#eaf5ec', text: '#267342', dot: '#267342' };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '6px',
        overflow: 'hidden',
        border: `1px solid ${isOpen ? catStyle.dot + '50' : '#e2e8f0'}`,
        boxShadow: isOpen
          ? `0 8px 24px -4px ${catStyle.dot}18`
          : '0 2px 6px -2px rgba(0,0,0,0.04)',
        transition: 'all 0.22s ease',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          background: isOpen ? `linear-gradient(135deg, ${catStyle.bg} 0%, #ffffff 100%)` : 'transparent',
          border: 'none',
          padding: '1.15rem 1.35rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.9rem',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
      >
        {/* Icon square */}
        <span style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          background: catStyle.bg,
          border: `1px solid ${catStyle.dot}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2px',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'scale(1.05)' : 'scale(1)',
        }}>
          <Icon size={17} color={catStyle.text} strokeWidth={2.2} />
        </span>

        <div style={{ flex: 1 }}>
          {/* Category tag */}
          <span style={{
            display: 'inline-block',
            fontSize: '0.64rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: catStyle.text,
            marginBottom: '0.25rem',
          }}>
            {faq.category}
          </span>
          {/* Question */}
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 700,
            color: isOpen ? catStyle.text : '#33373d',
            lineHeight: 1.4,
            transition: 'color 0.22s ease',
          }}>
            {faq.question}
          </p>
        </div>

        {/* Toggle icon */}
        <span style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isOpen ? catStyle.dot : '#f1f4f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '4px',
          transition: 'all 0.22s ease',
        }}>
          {isOpen
            ? <Minus size={14} color="#ffffff" strokeWidth={2.5} />
            : <Plus size={14} color="#5f656d" strokeWidth={2.5} />
          }
        </span>
      </button>

      {/* Answer panel with CSS grid animation */}
      <div
        ref={panelRef}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          overflow: 'hidden',
        }}
      >
        <div style={{ minHeight: 0 }}>
          <p style={{
            margin: 0,
            padding: '0 1.35rem 1.25rem 4.35rem',
            fontSize: '0.9rem',
            color: '#5f656d',
            lineHeight: 1.75,
            borderTop: '1px solid #f0f4f1',
            paddingTop: '1rem',
          }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  // Split into two columns
  const half = Math.ceil(faqs.length / 2);
  const col1 = faqs.slice(0, half);
  const col2 = faqs.slice(half);

  return (
    <section
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        background: 'linear-gradient(180deg, #f9f9f6 0%, #f3f7f4 60%, #edf4f9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(38,115,66,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute',
        bottom: '-60px',
        left: '-60px',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,126,159,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container">
        {/* Section header */}
        <div className="section-header" data-reveal>
          <div className="section-tag">
            <HelpCircle size={13} />
            <span>Centro de Ayuda</span>
          </div>
          <h2 className="section-title">
            Preguntas <span className="highlight">frecuentes</span>
          </h2>
          <p className="section-subtitle">
            Todo lo que necesitas saber sobre nuestros programas de Maestría y Diplomado en Estadística.
          </p>
        </div>

        {/* Two-column FAQ grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: '0.75rem',
          alignItems: 'start',
        }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {col1.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {col2.map((faq, i) => {
              const globalIdx = half + i;
              return (
                <FAQItem
                  key={globalIdx}
                  faq={faq}
                  index={globalIdx}
                  isOpen={openIdx === globalIdx}
                  onToggle={() => toggle(globalIdx)}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(2rem, 4vw, 3rem)',
          padding: '1.8rem 2rem',
          background: 'linear-gradient(135deg, #0e2d19 0%, #164828 60%, #1a3a58 100%)',
          borderRadius: '18px',
          maxWidth: '580px',
          margin: 'clamp(2rem, 4vw, 3rem) auto 0',
          boxShadow: '0 12px 36px -8px rgba(14,45,25,0.35)',
        }}>
          <p style={{ color: 'rgba(220,235,228,0.9)', marginBottom: '1.1rem', fontSize: '0.96rem', margin: '0 0 1.1rem' }}>
            ¿Tienes más preguntas? Escríbenos por WhatsApp y te respondemos de inmediato.
          </p>
          <a
            href="https://wa.me/59176543210?text=Hola%2C%20tengo%20una%20consulta%20sobre%20los%20programas%20de%20Posgrado%20en%20Estadística%20UMSA"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: '99px',
              padding: '0.7rem 1.6rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.3)';
            }}
          >
            <MessageCircle size={18} strokeWidth={2.2} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};


