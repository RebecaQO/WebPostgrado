import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  Building, 
  CheckCircle2,
  Navigation
} from 'lucide-react';

export const ContactView = () => {
  const [selectedCampus, setSelectedCampus] = useState('cota');
  const [submitted, setSubmitted] = useState(false);
  const [info, setInfo] = useState({
    direccion: 'Calle 27 de Cota Cota s/n, Campus Universitario UMSA, Edif. Estadística (2do Piso)',
    telefono: '+591 (2) 279-2999',
    whatsapp: '+591 76543210',
    email_principal: 'estapost@fcpn.edu.bo',
    horario_atencion: 'Lunes a Viernes 08:30 a 16:30 (Continuo)',
    director_nombre: 'Dirección de la Carrera de Estadística y Posgrado',
    ieta_descripcion: 'Instituto de Estadística Teórica y Aplicada (Investigación & Proyectos)',
    club_cientifico_descripcion: 'Club Científico de Estudiantes e Investigadores de Estadística'
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('/api/institucion/info');
        if (res.ok) {
          const data = await res.json();
          if (data && data.email_principal) {
            setInfo(prev => ({ ...prev, ...data }));
          }
        }
      } catch (err) {
        console.error('Error cargando info institucional en ContactView:', err);
      }
    };
    fetchInfo();
  }, []);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: 'Información sobre Convocatoria 2026',
    mensaje: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: 'Información sobre Convocatoria 2026',
        mensaje: ''
      });
      alert("¡Consulta recibida! Un asesor de la Unidad de Posgrado se comunicará a la brevedad.");
    }, 1000);
  };

  return (
    <div className="section-spacing animate-fade-in">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <MapPin size={14} />
            <span>SEDES & ATENCIÓN AL POSTULANTE</span>
          </div>
          <h1 className="section-title">
            Ubicación y Canales de Contacto
          </h1>
          <p className="section-subtitle">
            Visite nuestras oficinas en el Campus Universitario de Cota Cota o en el Monoblock Central de la UMSA.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Left Column: Campus Selector & Interactive Map representation */}
          <div>
            <div className="tabs-header" style={{ marginBottom: '1.5rem' }}>
              <button
                className={`tab-btn ${selectedCampus === 'cota' ? 'active' : ''}`}
                onClick={() => setSelectedCampus('cota')}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Building size={16} />
                <span>Campus Cota Cota (Sede Principal)</span>
              </button>

              <button
                className={`tab-btn ${selectedCampus === 'monoblock' ? 'active' : ''}`}
                onClick={() => setSelectedCampus('monoblock')}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Building size={16} />
                <span>Monoblock Central (Enlace)</span>
              </button>
            </div>

            {/* Map Visual Box */}
            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
              {selectedCampus === 'cota' ? (
                <div>
                  <div style={{
                    height: '240px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #0a1424 0%, #172a45 100%)',
                    border: '1px solid var(--color-glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    marginBottom: '1.25rem'
                  }}>
                    {/* Visual Stylized Map Grid */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(rgba(242, 104, 28, 0.25) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      opacity: 0.6
                    }} />

                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'center',
                      padding: '1rem'
                    }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'var(--color-accent-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        margin: '0 auto 0.75rem auto',
                        boxShadow: '0 0 25px rgba(242, 104, 28, 0.6)'
                      }}>
                        <MapPin size={28} />
                      </div>
                      <strong style={{ color: '#ffffff', fontSize: '1.1rem', display: 'block' }}>
                        Campus Universitario Cota Cota — FCPN
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {info.direccion}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                    <div><strong style={{ color: '#ffffff' }}>Dirección:</strong> Calle 27 de Cota Cota, Campus Universitario UMSA, La Paz.</div>
                    <div><strong style={{ color: '#ffffff' }}>Líneas de Transporte:</strong> Minibuses 231, 284, 801, Trurifrutas hacia Cota Cota y Pumakatari (Ruta Chasquipampa).</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{
                    height: '240px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #003876 0%, #0a1424 100%)',
                    border: '1px solid var(--color-glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'center',
                      padding: '1rem'
                    }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0a1424',
                        margin: '0 auto 0.75rem auto',
                        boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)'
                      }}>
                        <Building size={28} />
                      </div>
                      <strong style={{ color: '#ffffff', fontSize: '1.1rem', display: 'block' }}>
                        Monoblock Central UMSA
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Av. Villazón Nº 1995, Plaza del Bicentenario
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                    <div><strong style={{ color: '#ffffff' }}>Oficina de Enlace:</strong> Edificio Viejo Monoblock, Ventanilla de Posgrado FCPN.</div>
                    <div><strong style={{ color: '#ffffff' }}>Atención:</strong> Recepción y derivación de expedientes físicos y títulos legalizados.</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact info & Quick Inquiry Form */}
          <div>
            <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'rgba(13, 27, 48, 0.75)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem' }}>
                Datos Institucionales de Contacto
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent-orange)', marginBottom: '0.2rem' }}>
                    <Phone size={14} /> <strong>Teléfonos Fijos:</strong>
                  </div>
                  <span>{info.telefono}</span>
                  <div style={{ color: 'var(--color-text-subtle)' }}>Secretaría de Posgrado</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', marginBottom: '0.2rem' }}>
                    <MessageCircle size={14} /> <strong>WhatsApp Directo:</strong>
                  </div>
                  <a href={`https://wa.me/${(info.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#4ade80', fontWeight: 600 }}>
                    {info.whatsapp}
                  </a>
                  <div style={{ color: 'var(--color-text-subtle)' }}>Atención rápida</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', marginBottom: '0.2rem' }}>
                    <Mail size={14} /> <strong>Correo Oficial:</strong>
                  </div>
                  <a href={`mailto:${info.email_principal}`} style={{ color: '#38bdf8', fontWeight: 700 }}>
                    {info.email_principal}
                  </a>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', marginBottom: '0.2rem' }}>
                    <Clock size={14} /> <strong>Horario de Atención:</strong>
                  </div>
                  <span style={{ color: 'var(--color-text-muted)' }}>{info.horario_atencion}</span>
                </div>
              </div>

              {/* Unidades Institucionales Adscritas */}
              <div style={{
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.825rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ffffff' }}>
                  <Building size={14} color="var(--color-accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Dirección:</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>{info.director_nombre}</span>
                    {info.director_nombre && <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Director: {info.director_nombre}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ffffff' }}>
                  <CheckCircle2 size={14} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>IETA:</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>{info.ieta_descripcion}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#ffffff' }}>
                  <CheckCircle2 size={14} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Club Científico:</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>{info.club_cientifico_descripcion}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick message form */}
            <div className="glass-card">
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1rem' }}>
                Formulario de Consulta Directa
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Asunto de la Consulta</label>
                  <select
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    className="form-select"
                  >
                    <option value="Información sobre Convocatoria 2026">Información sobre Convocatoria 2026</option>
                    <option value="Validación de Títulos Extranjeros">Validación de Títulos Extranjeros</option>
                    <option value="Simulación de Pagos y CPT">Simulación de Pagos y CPT</option>
                    <option value="Tesis y Asignación de Tutor">Tesis y Asignación de Tutor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mensaje o Pregunta Específica *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escriba su consulta aquí..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Send size={16} />
                  <span>Enviar Mensaje a Secretaría de Posgrado</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
