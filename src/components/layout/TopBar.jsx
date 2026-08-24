import React from 'react';
import { Phone, ExternalLink, MessageCircle, ShieldCheck, BookOpen } from 'lucide-react';

export const TopBar = () => {
  return (
    <div style={{
      background: '#00224d', // Azul UMSA profundo de alto contraste
      color: '#ffffff',
      fontSize: '0.8rem',
      padding: '0.5rem 0',
      position: 'relative',
      zIndex: 50,
      borderBottom: '2px solid var(--color-accent-orange)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {/* Left institutional badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#fed7aa',
            fontWeight: 800,
            fontSize: '0.75rem',
            background: 'rgba(242, 104, 28, 0.25)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)'
          }}>
            <ShieldCheck size={14} color="#f97316" /> CONVOCATORIAS 2026
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: '#f1f5f9', fontWeight: 500 }}>
            Acreditación Nacional CEUB • Facultad de Ciencias Puras y Naturales (FCPN - UMSA)
          </span>
        </div>

        {/* Right fast links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <a
            href="tel:+59122792999"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff' }}
            title="Secretaría de Posgrado"
          >
            <Phone size={13} style={{ color: '#fb923c' }} />
            <span>+591 (2) 279-2999</span>
          </a>

          <a
            href="https://moodle.fcpn.edu.bo"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#38bdf8',
              fontWeight: 600
            }}
          >
            <BookOpen size={13} />
            <span>Campus Virtual Moodle</span>
            <ExternalLink size={11} style={{ opacity: 0.8 }} />
          </a>

          <a
            href="https://wa.me/59176543210?text=Hola,%20deseo%20información%20sobre%20los%20programas%20de%20Posgrado%20en%20Estadística%20UMSA"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#4ade80',
              fontWeight: 700
            }}
          >
            <MessageCircle size={14} />
            <span>Mesa de Ayuda WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
