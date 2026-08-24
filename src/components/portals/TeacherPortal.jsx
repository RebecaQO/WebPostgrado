import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  Award, 
  FileText, 
  Upload, 
  Download, 
  Save, 
  CheckCircle2, 
  Clock, 
  Search,
  Check
} from 'lucide-react';

export const TeacherPortal = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('calificador');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [studentGrades, setStudentGrades] = useState([
    { id: 1, name: 'Choque Mamani Alejandro', ci: '6834921 LP', p1: 85, p2: 90, final: 88, status: 'Aprobado' },
    { id: 2, name: 'Condori Nina Javier Fernando', ci: '8472910 LP', p1: 92, p2: 95, final: 94, status: 'Aprobado' },
    { id: 3, name: 'Morales Arteaga Gabriela', ci: '6834921 CB', p1: 78, p2: 82, final: 80, status: 'Aprobado' },
    { id: 4, name: 'Rios Calvimontes Silvana', ci: '4920193 SC', p1: 65, p2: 70, final: 68, status: 'Aprobado' },
    { id: 5, name: 'Vargas Alarcon Rodrigo', ci: '5928192 LP', p1: 45, p2: 50, final: 48, status: 'Reprobado' }
  ]);

  const handleGradeChange = (id, field, value) => {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setStudentGrades(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, [field]: num };
      const finalScore = Math.round((updated.p1 + updated.p2) / 2);
      updated.final = finalScore;
      updated.status = finalScore >= 66 ? 'Aprobado' : 'Reprobado';
      return updated;
    }));
  };

  const handleSaveGrades = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const teacher = currentUser || {
    name: 'Dr. Marcelo Ramos Quispe',
    department: 'Departamento de Estadística Matemática',
    email: 'mramos@fcpn.edu.bo'
  };

  return (
    <div className="section-spacing animate-fade-in">
      <div className="container">
        {/* Teacher Profile Banner */}
        <div className="glass-card" style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(13, 27, 48, 0.95) 0%, rgba(10, 20, 36, 0.9) 100%)',
          borderLeft: '4px solid #38bdf8',
          padding: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.5rem',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
              }}>
                MR
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-blue">DOCENTE TITULAR & TUTOR DE POSGRADO</span>
                  <span className="badge badge-green">Gestión I-2026</span>
                </div>
                <h2 style={{ color: '#ffffff', fontSize: '1.5rem', margin: '0.25rem 0' }}>
                  {teacher.name}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {teacher.department} • FCPN - UMSA • {teacher.email}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(10, 20, 36, 0.8)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-glass-border)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Módulo Activo:</div>
              <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>EST-832: Estadística Bayesiana Computacional</strong>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-header" style={{ marginBottom: '2rem' }}>
          <button
            className={`tab-btn ${activeTab === 'calificador' ? 'active' : ''}`}
            onClick={() => setActiveTab('calificador')}
          >
            <BookOpen size={16} />
            <span>Registro de Calificaciones & Actas</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'tutorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutorias')}
          >
            <Users size={16} />
            <span>Tesis Asignadas & Tutorías (3)</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'material' ? 'active' : ''}`}
            onClick={() => setActiveTab('material')}
          >
            <FileText size={16} />
            <span>Material Didáctico & Guías de R/Python</span>
          </button>
        </div>

        {/* TAB 1: Calificador */}
        {activeTab === 'calificador' && (
          <div className="animate-fade-in">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>
                  Acta Modular: EST-832 Estadística Bayesiana (Semestre IV)
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Total Inscritos: 5 maestrandos • Escala de Aprobación Mínima: 66/100 (CEUB)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleSaveGrades}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Save size={15} />
                  <span>{savedSuccess ? '¡Guardado con Éxito!' : 'Guardar Calificaciones'}</span>
                </button>

                <button
                  onClick={() => alert("Generando y Descargando Acta Oficial Firmada en PDF...")}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Download size={15} />
                  <span>Cerrar y Descargar Acta (PDF)</span>
                </button>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Postgraduante</th>
                    <th>C.I.</th>
                    <th style={{ width: '130px' }}>Evaluación Parcial (50%)</th>
                    <th style={{ width: '130px' }}>Proyecto Final MCMC (50%)</th>
                    <th>Nota Final</th>
                    <th>Condición</th>
                  </tr>
                </thead>
                <tbody>
                  {studentGrades.map((s, idx) => (
                    <tr key={s.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{s.name}</td>
                      <td style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-text-subtle)' }}>{s.ci}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={s.p1}
                          onChange={(e) => handleGradeChange(s.id, 'p1', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', width: '80px', textAlign: 'center' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={s.p2}
                          onChange={(e) => handleGradeChange(s.id, 'p2', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.35rem 0.5rem', width: '80px', textAlign: 'center' }}
                        />
                      </td>
                      <td>
                        <strong style={{
                          fontSize: '1.15rem',
                          fontFamily: 'var(--font-family-mono)',
                          color: s.final >= 66 ? 'var(--color-status-success)' : 'var(--color-status-danger)'
                        }}>
                          {s.final}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${s.status === 'Aprobado' ? 'badge-green' : 'badge-red'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Tutorías */}
        {activeTab === 'tutorias' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { name: 'Lic. Rodrigo Gonzalo Paredes', thesis: 'Modelos de Espacio de Estados y Filtro de Kalman para Inflación', date: '28 de Marzo, 2026', status: 'Defensa Programada', badge: 'badge-green' },
              { name: 'Ing. Alejandro Choque Mamani', thesis: 'Modelación de Series de Tiempo con Componente Espacial en el Altiplano', date: 'Capítulo 3', status: 'En Corrección de Cadenas MCMC', badge: 'badge-blue' },
              { name: 'Lic. Mariana Siles Cordero', thesis: 'Estimación Bayesiana en Áreas Pequeñas (SAE) con Microdatos INE', date: 'Capítulo 2', status: 'Marco Teórico', badge: 'badge-yellow' }
            ].map((tut, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{tut.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{tut.thesis}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '0.35rem' }}>
                    Estado actual: <span className={`badge ${tut.badge}`}>{tut.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => alert("Revisando borrador de tesis...")} className="btn btn-secondary btn-sm">
                    Revisar Avance
                  </button>
                  <button onClick={() => alert("Enviando retroalimentación al estudiante...")} className="btn btn-primary btn-sm">
                    Enviar Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Material didáctico */}
        {activeTab === 'material' && (
          <div className="animate-fade-in">
            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Publicar Nueva Guía de Laboratorio (R / Python)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Suba scripts en RMarkdown, Jupyter Notebooks (.ipynb) o datasets para los maestrandos del módulo activo.
              </p>
              <div style={{ border: '2px dashed var(--color-glass-border)', padding: '1.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <Upload size={24} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
                <div>Arrastre archivos o haga clic para seleccionar</div>
                <button onClick={() => alert("Archivo publicado en el Campus Virtual Moodle FCPN.")} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                  Cargar y Sincronizar con Moodle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
