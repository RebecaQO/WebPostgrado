import React from 'react';
import { Award, Users, BookCheck, ShieldCheck } from 'lucide-react';

export const KpiSection = () => {
  const kpis = [
    {
      number: "+40",
      suffix: "Años",
      label: "Trayectoria y Liderazgo Académico",
      desc: "Formando a los principales estadísticos del país desde 1972.",
      icon: Award,
      color: "var(--color-accent-orange)",
      bg: "var(--color-accent-orange-subtle)"
    },
    {
      number: "100%",
      suffix: "",
      label: "Docentes con Ph.D. y M.Sc.",
      desc: "Claustro de excelencia con posgrados en Europa, Brasil y EE.UU.",
      icon: Users,
      color: "#0284c7",
      bg: "#f0f9ff"
    },
    {
      number: "CEUB",
      suffix: "Acreditado",
      label: "Acreditación Nacional Plena",
      desc: "Reconocimiento y homologación en todo el Sistema Universitario Boliviano.",
      icon: ShieldCheck,
      color: "#059669",
      bg: "#ecfdf5"
    },
    {
      number: "+850",
      suffix: "Graduados",
      label: "Egresados de Posgrado",
      desc: "Liderando centros de analítica, banca, salud y sector público.",
      icon: BookCheck,
      color: "#d97706",
      bg: "#fffbeb"
    }
  ];

  return (
    <section style={{
      padding: '1.5rem 0 4rem 0',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  textAlign: 'center',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-full)',
                  background: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: kpi.color
                }}>
                  <Icon size={26} />
                </div>

                <div className="kpi-number" style={{ fontSize: '2.6rem', marginBottom: '0.25rem', color: 'var(--color-umsa-blue)' }}>
                  {kpi.number} <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-accent-orange)' }}>{kpi.suffix}</span>
                </div>

                <div style={{
                  color: 'var(--color-umsa-blue-dark)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  marginBottom: '0.4rem'
                }}>
                  {kpi.label}
                </div>

                <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
                  {kpi.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
