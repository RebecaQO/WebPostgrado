import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: '¿Cuáles son los requisitos generales para postular a una Maestría?',
    answer: 'Para postular a cualquier maestría de la Unidad de Posgrado en Estadística UMSA se requiere: título de licenciatura en áreas afines (Estadística, Matemáticas, Economía, Ingeniería, Ciencias de la Salud u otras), fotocopia legalizada del diploma académico, hoja de vida actualizada, nota de presentación institucional y aprobar el proceso de admisión (examen de nivelación y/o entrevista académica). Los requisitos específicos se detallan en cada convocatoria.',
  },
  {
    question: '¿Cuál es la diferencia entre una Maestría y un Diplomado?',
    answer: 'Las Maestrías tienen una duración de 4 semestres (aproximadamente 18 meses) y otorgan el grado académico de Máster en Ciencias (M.Sc.), requiriendo la aprobación de una tesis o proyecto de grado. Los Diplomados son programas de 6 meses de especialización intensiva que otorgan un diploma de posgrado, con enfoque práctico y aplicado, sin tesis. Ambos están avalados por el CEUB y la UMSA.',
  },
  {
    question: '¿Los programas están acreditados y reconocidos oficialmente?',
    answer: 'Sí. Todos los programas de la Unidad de Posgrado en Estadística están aprobados mediante Resolución del Honorable Consejo Universitario (HCU) de la UMSA y registrados en el Comité Ejecutivo de la Universidad Boliviana (CEUB), garantizando el reconocimiento a nivel nacional. Los títulos son emitidos por la Universidad Mayor de San Andrés.',
  },
  {
    question: '¿Cuál es la modalidad de estudio y los horarios?',
    answer: 'Ofrecemos modalidad híbrida: clases presenciales en el Campus Cota Cota (FCPN-UMSA) complementadas con sesiones virtuales síncronas. Los horarios son principalmente en turno de noche (19:00 – 22:00 hrs) de lunes a jueves, pensados para profesionales activos. Algunos programas ofrecen opción completamente virtual síncrona.',
  },
  {
    question: '¿Cómo puedo saber si una convocatoria está vigente?',
    answer: 'Las convocatorias activas aparecen directamente en la página de inicio y en la sección "Programas Académicos". También puede consultar el estado actualizado mediante nuestro canal de WhatsApp o siguiendo la página oficial de la Carrera de Estadística UMSA. Las convocatorias anteriores están disponibles en la sección "Convocatorias Anteriores".',
  },
  {
    question: '¿Existe financiamiento o becas disponibles?',
    answer: 'La UMSA ofrece becas institucionales para personal académico, administrativo y estudiantes de la universidad. Adicionalmente, se otorgan descuentos por pago al contado. Para mayor información sobre planes de financiamiento, becas parciales o acuerdos con instituciones, comuníquese directamente con la Unidad de Posgrado a través del WhatsApp o al correo institucional.',
  },
  {
    question: '¿Puedo iniciar el proceso de postulación en línea?',
    answer: 'Sí. El proceso de postulación se realiza a través de un formulario en línea (Google Forms) disponible en cada convocatoria. Adicionalmente, deberá presentar físicamente la documentación requerida en la secretaría de la Unidad de Posgrado (Edificio Monoblock, Campus Cota Cota) dentro de los plazos establecidos en la convocatoria.',
  },
  {
    question: '¿Con qué software y herramientas trabajan los programas?',
    answer: 'Los programas utilizan R / RStudio, Python (Jupyter, Pandas, Scikit-learn, PyTorch), SPSS, Stata, SAS Analytics, Stan (inferencia bayesiana) y herramientas de Big Data como Apache Spark. Los estudiantes tienen acceso a licencias institucionales y entornos de cómputo del laboratorio de la FCPN-UMSA.',
  },
];

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <section
      className="section-spacing"
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
        position: 'relative',
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <HelpCircle size={14} />
            <span>PREGUNTAS FRECUENTES</span>
          </div>
          <h2 className="section-title">
            Todo lo que necesitas saber
          </h2>
          <p className="section-subtitle">
            Respuestas a las dudas más comunes sobre nuestros programas de Maestría y Diplomado en Estadística y Ciencia de Datos.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '860px', margin: '0 auto' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${isOpen ? 'var(--color-green-inst-border)' : '#e2e8f0'}`,
                  borderLeft: `3px solid ${isOpen ? 'var(--color-green-inst)' : '#e2e8f0'}`,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                  boxShadow: isOpen ? '0 4px 16px -4px rgba(38, 115, 66, 0.12)' : 'none',
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '1.1rem 1.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: isOpen ? 'var(--color-green-inst)' : 'var(--color-text-main)',
                    lineHeight: 1.4,
                    transition: 'color 0.2s ease',
                  }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    color={isOpen ? 'var(--color-green-inst)' : 'var(--color-text-subtle)'}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    className="animate-fade-in"
                    style={{
                      padding: '0 1.35rem 1.25rem',
                      fontSize: '0.9rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.75,
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem',
          padding: '1.75rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          maxWidth: '640px',
          margin: '2.5rem auto 0',
        }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            ¿No encontraste lo que buscas? Escríbenos directamente y te responderemos a la brevedad.
          </p>
          <a
            href="https://wa.me/59176543210?text=Hola%2C%20tengo%20una%20consulta%20sobre%20los%20programas%20de%20Posgrado%20en%20Estadística%20UMSA"
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm"
            style={{
              background: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.65rem 1.5rem',
              textDecoration: 'none',
            }}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
