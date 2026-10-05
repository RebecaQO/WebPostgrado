import React from 'react';
import { Award, Users, BookCheck, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../../utils/reveal';

export const KpiSection = () => {
  // Inicializar observador de scroll y contadores animados
  useScrollReveal();

  const metrics = [
    {
      count: 40,
      prefix: '+',
      suffix: '',
      unit: 'Años',
      label: 'Trayectoria y Liderazgo Académico',
      note: 'Formando a los principales estadísticos e investigadores desde 1972',
      icon: Award
    },
    {
      count: 100,
      prefix: '',
      suffix: '%',
      unit: '',
      label: 'Docentes con Ph.D. y M.Sc.',
      note: 'Claustro de posgrado graduado en Europa, Brasil, EE.UU. y la región',
      icon: Users
    },
    {
      isText: true,
      text: 'CEUB',
      unit: 'Acreditado',
      label: 'Acreditación Nacional Plena',
      note: 'Reconocimiento y homologación en todo el Sistema Universitario Boliviano',
      icon: ShieldCheck
    },
    {
      count: 850,
      prefix: '+',
      suffix: '',
      unit: 'Graduados',
      label: 'Egresados de Posgrado',
      note: 'Liderando equipos de analítica, banca, salud, bioestadística y políticas públicas',
      icon: BookCheck
    }
  ];

  return (
    <section
      className="section-spacing"
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f2 100%)' }}
      aria-label="Métricas de impacto institucional"
    >
      <div className="container">

        <div className="section-header" data-reveal>
          <div className="section-tag">
            <ShieldCheck size={13} />
            <span>Impacto Cuantitativo</span>
          </div>
          <h2 className="section-title">
            Cinco décadas de <span className="highlight">rigor científico</span> y liderazgo
          </h2>
          <p className="section-subtitle">
            Números que reflejan el compromiso académico de la Unidad de Posgrado en Estadística – UMSA.
          </p>
        </div>

        {/* Grilla de Métricas Premium */}
        <div className="stats">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            const accentColors = [
              { bg: 'linear-gradient(135deg, #0e2d19, #1e5f35)', icon: '#68d391', text: '#68d391', border: 'rgba(104,211,145,0.3)' },
              { bg: 'linear-gradient(135deg, #163a5f, #1e4f80)', icon: '#7ec8f7', text: '#7ec8f7', border: 'rgba(126,200,247,0.3)' },
              { bg: 'linear-gradient(135deg, #2e1a4e, #4a2e7a)', icon: '#c084fc', text: '#c084fc', border: 'rgba(192,132,252,0.3)' },
              { bg: 'linear-gradient(135deg, #1a3a20, #2d6338)', icon: '#86efac', text: '#86efac', border: 'rgba(134,239,172,0.3)' },
            ];
            const ac = accentColors[idx % accentColors.length];

            return (
              <article
                key={idx}
                className="stat"
                data-reveal
                style={{
                  background: ac.bg,
                  border: `1px solid ${ac.border}`,
                  boxShadow: `0 8px 28px -6px rgba(0,0,0,0.3)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 18px 40px -8px rgba(0,0,0,0.4)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 8px 28px -6px rgba(0,0,0,0.3)`;
                }}
              >
                {/* Decoración de fondo */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: '-20px', right: '-20px',
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${ac.icon}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Ícono */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${ac.icon}20`,
                  border: `1px solid ${ac.icon}40`,
                  color: ac.icon,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-xs)',
                }}>
                  <Icon size={21} />
                </div>

                {/* Número */}
                {item.isText ? (
                  <strong style={{ color: ac.text }}>{item.text}</strong>
                ) : (
                  <strong
                    data-count={item.count}
                    data-prefix={item.prefix}
                    data-suffix={item.suffix}
                    style={{ color: ac.text }}
                  >
                    0
                  </strong>
                )}

                {/* Etiqueta */}
                <span style={{ color: 'rgba(255,255,255,0.92)' }}>
                  {item.unit && (
                    <small style={{ display: 'inline', color: ac.icon, fontWeight: 800, marginRight: '4px' }}>
                      {item.unit}
                    </small>
                  )}
                  {item.label}
                </span>

                <small style={{ color: 'rgba(255,255,255,0.58)' }}>{item.note}</small>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};

