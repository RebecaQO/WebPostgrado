import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  X, 
  BookOpen, 
  Layers, 
  Calendar, 
  Users, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { programaService } from '../../services/programaService';
import { docenteService } from '../../services/docenteService';
import './ProgramEditorFixed.css';

export const ProgramEditorFixed = ({ initialProgramId = null, onSaved, onCancel }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modo de malla: 'new' o 'existing'
  const [mallaMode, setMallaMode] = useState('new');
  const [existingMallas, setExistingMallas] = useState([]);

  // Estado del Formulario Multi-pasos
  const [program, setProgram] = useState({
    id: '',
    name: '',
    description: '',
    kind: 'Diplomado',
    type: 'Terminal',
  });

  const [malla, setMalla] = useState({
    id: '',
    name: '',
    modules: [],
    subjects: [],
  });

  const [edition, setEdition] = useState({
    id: '',
    start: '',
    end: '',
    duration: '18 meses',
    schedule: 'Lunes a Jueves 19:00 - 22:00',
    description: '',
    degree: '',
    requirements: '',
    call: '',
    form: '',
    callLink: '',
    banner: '',
    poster: '',
    publicity: '',
    perfilPro: '',
    professions: '',
    competencies: '',
    state: 'En Proceso',
  });

  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherDrafts, setTeacherDrafts] = useState([]);

  // Estado para sub-formulario inline de materia en módulo (SIN modales emergentes)
  const [activeModuleForSubject, setActiveModuleForSubject] = useState(null);
  const [inlineSubjectDraft, setInlineSubjectDraft] = useState({
    id: '',
    name: '',
    description: '',
    credits: 4,
    hours: 64,
  });

  // Contador para autogenerar IDs
  const uid = (prefix) => `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

  // Cargar datos si se está editando un programa existente
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);

        // Cargar lista de docentes del sistema
        const docs = await docenteService.getPublicDocentes().catch(() => []);
        setAvailableTeachers(Array.isArray(docs) ? docs : []);

        if (initialProgramId) {
          const wizardData = await programaService.getWizardData(initialProgramId);
          if (wizardData) {
            setProgram(wizardData.program);
            setMalla(wizardData.malla);
            setExistingMallas(wizardData.mallas || []);
            setEdition(wizardData.edition);
            setSelectedTeachers(wizardData.selectedTeachers || []);
          }
        } else {
          // Inicializar IDs sugeridos para nuevo programa
          const tempId = `PG-EST-${Math.floor(100 + Math.random() * 900)}`;
          setProgram({
            id: tempId,
            name: '',
            description: '',
            kind: 'Maestría',
            type: 'Autosostenible',
          });
          setMalla({
            id: `MALLA-${tempId}`,
            name: `Malla Curricular - ${tempId}`,
            modules: [
              {
                id: `MOD-01`,
                name: 'Módulo I: Fundamentos Estadísticos y Análisis Exploratorio',
                subjects: []
              }
            ],
            subjects: [],
          });
          setEdition({
            id: `ED-2026-${tempId}`,
            start: new Date().toISOString().split('T')[0],
            end: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
            duration: '18 meses',
            schedule: 'Lunes a Jueves 19:00 - 22:00',
            description: 'Programa oficial de postgrado impartido en la modalidad presencial y virtual síncrono.',
            degree: 'Tesis de Maestría y Publicación de Artículo Científico en Revista Indexada',
            requirements: 'Fotocopia legalizada del Título en Provisión Nacional a nivel Licenciatura, CV documentado, 4 fotos 4x4 fondo gris.',
            call: 'https://drive.google.com/drive/folders/posgrado_estadistica_2026',
            form: 'https://docs.google.com/forms/postulacion_2026',
            callLink: 'https://drive.google.com/file/convocatoria_oficial.pdf',
            banner: '',
            poster: '',
            publicity: '',
            perfilPro: 'Profesional altamente calificado para el modelado cuantitativo, inferencia avanzada y toma de decisiones basadas en datos.',
            professions: 'Estadística, Informática, Matemáticas, Ingeniería de Sistemas, Economía e investigadores cuantitativos.',
            competencies: 'Capacidad de diseñar proyectos de investigación de alto impacto, dominar librerías estadísticas R/Python y liderar equipos analíticos.',
            state: 'En Proceso',
          });
        }
      } catch (err) {
        console.error('Error inicializando editor:', err);
        setErrorMessage('No se pudieron cargar los datos del programa para edición');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [initialProgramId]);

  // Manejador de cambio de tipo de programa
  const handleKindChange = (newKind) => {
    setProgram((prev) => ({
      ...prev,
      kind: newKind,
      type: newKind === 'Maestría' ? prev.type || 'Terminal' : 'Terminal',
    }));

    if (newKind === 'Diplomado') {
      setEdition((prev) => ({ ...prev, duration: '6 meses' }));
      // Inicializar materias de diplomado si están vacías
      if (malla.subjects.length === 0) {
        setMalla((prev) => ({
          ...prev,
          subjects: [
            { id: uid('MAT'), name: 'Módulo 1: Métodos de Análisis de Datos', description: 'Fundamentos de analítica y minería de datos.', credits: 4, hours: 64 },
            { id: uid('MAT'), name: 'Módulo 2: Modelación Predictiva y Machine Learning', description: 'Algoritmos supervisados y no supervisados.', credits: 4, hours: 64 }
          ]
        }));
      }
    } else {
      setEdition((prev) => ({ ...prev, duration: '18 meses' }));
    }
  };

  // Funciones para manejar Malla Curricular (Diplomado)
  const addDiplomaSubject = () => {
    const newSubject = {
      id: uid('MAT'),
      name: '',
      description: '',
      credits: 4,
      hours: 64,
    };
    setMalla((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
  };

  const updateDiplomaSubject = (index, field, value) => {
    setMalla((prev) => {
      const updated = [...prev.subjects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, subjects: updated };
    });
  };

  const removeDiplomaSubject = (index) => {
    setMalla((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  // Funciones para manejar Módulos y Materias de Maestría
  const addMasterModule = () => {
    const newModule = {
      id: uid('MOD'),
      name: `Módulo ${malla.modules.length + 1}: `,
      subjects: [],
    };
    setMalla((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
  };

  const updateMasterModule = (modIndex, field, value) => {
    setMalla((prev) => {
      const updated = [...prev.modules];
      updated[modIndex] = { ...updated[modIndex], [field]: value };
      return { ...prev, modules: updated };
    });
  };

  const removeMasterModule = (modIndex) => {
    setMalla((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== modIndex),
    }));
  };

  // Sub-formulario INLINE interactivo para agregar materia a módulo (sin modales emergentes)
  const openInlineSubjectForm = (modIndex) => {
    setActiveModuleForSubject(modIndex);
    setInlineSubjectDraft({
      id: uid('MAT'),
      name: '',
      description: '',
      credits: 4,
      hours: 64,
    });
  };

  const saveInlineSubjectToModule = () => {
    if (!inlineSubjectDraft.name.trim()) {
      alert('Por favor ingrese el nombre de la materia.');
      return;
    }

    setMalla((prev) => {
      const updatedModules = [...prev.modules];
      const targetMod = updatedModules[activeModuleForSubject];
      targetMod.subjects = [...targetMod.subjects, { ...inlineSubjectDraft }];
      return { ...prev, modules: updatedModules };
    });

    setActiveModuleForSubject(null);
  };

  const removeSubjectFromModule = (modIndex, subjIndex) => {
    setMalla((prev) => {
      const updatedModules = [...prev.modules];
      updatedModules[modIndex].subjects = updatedModules[modIndex].subjects.filter((_, i) => i !== subjIndex);
      return { ...prev, modules: updatedModules };
    });
  };

  // Manejo de Docentes
  const toggleTeacherSelection = (teacherId) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const addTeacherDraft = () => {
    setTeacherDrafts((prev) => [
      ...prev,
      { id: uid('DOC'), name: '', last: '', photo: '' },
    ]);
  };

  const updateTeacherDraft = (index, field, value) => {
    setTeacherDrafts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeTeacherDraft = (index) => {
    setTeacherDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const commitTeacherDrafts = () => {
    for (const t of teacherDrafts) {
      if (!t.name.trim() || !t.last.trim()) {
        alert('Complete nombre y apellido de cada docente nuevo.');
        return;
      }
    }

    const newTeachersList = teacherDrafts.map((t) => ({
      id: t.id,
      nombre: t.name,
      apellido: t.last,
      foto_url: t.photo || '',
    }));

    setAvailableTeachers((prev) => [...prev, ...newTeachersList]);
    setSelectedTeachers((prev) => [...prev, ...teacherDrafts.map((t) => t.id)]);
    setTeacherDrafts([]);
  };

  // Validación de pasos
  const validateStep = (s) => {
    if (s === 0) {
      return program.id.trim() && program.name.trim() && program.description.trim();
    }
    if (s === 1) {
      if (!malla.id.trim() || !malla.name.trim()) return false;
      if (program.kind === 'Diplomado') {
        return malla.subjects.length > 0 && malla.subjects.every((s) => s.id && s.name);
      } else {
        return (
          malla.modules.length > 0 &&
          malla.modules.every((m) => m.id && m.name && m.subjects.length > 0)
        );
      }
    }
    if (s === 2) {
      return edition.id.trim() && edition.state && edition.duration;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      if (step === 0) alert('Complete el ID, Nombre y Descripción del programa.');
      else if (step === 1) alert('Complete la malla curricular. En maestrías, cada módulo debe tener al menos una materia.');
      else if (step === 2) alert('Complete los datos obligatorios de la edición (ID, Estado, Duración).');
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  // Guardado Final en Neon PostgreSQL mediante la API REST MVC
  const handleSaveToDatabase = async () => {
    try {
      setSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const payload = {
        program,
        malla,
        edition,
        teachers: teacherDrafts,
        selectedTeachers,
      };

      const result = await programaService.saveWizardProgram(payload);

      setSuccessMessage(`¡El programa ${program.name} (${program.id}) y su estructura curricular se guardaron correctamente en la base de datos!`);
      
      if (onSaved) {
        setTimeout(() => {
          onSaved(result);
        }, 1500);
      }
    } catch (err) {
      console.error('Error guardando en la BD:', err);
      setErrorMessage(err.message || 'Ocurrió un error al guardar en la base de datos.');
    } finally {
      setSaving(false);
    }
  };

  // Descarga de JSON de simulación
  const handleExportJSON = () => {
    const fullRecords = {
      Programa_Postgrado: [{ Id_Programa: program.id, Nombre_Programa: program.name, Descripcion: program.description }],
      Maestria: program.kind === 'Maestría' ? [{ Id_Programa: program.id, Tipo: program.type }] : [],
      Diplomado: program.kind === 'Diplomado' ? [{ Id_Programa: program.id }] : [],
      Malla_Curricular: [{ id_Malla: malla.id, Nombre_Malla: malla.name, id_Programa: program.id }],
      Modulo: malla.modules.map((m) => ({ id_Mod: m.id, Nombre_Mod: m.name, id_Malla: malla.id })),
      Edicion_Programa: [{ ...edition, id_Programa: program.id, id_Malla: malla.id }],
      Docentes_Asignados: selectedTeachers,
    };

    const blob = new Blob([JSON.stringify(fullRecords, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `programa_${program.id || 'posgrado'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepsTitles = [
    { num: 1, title: 'Programa', tag: 'PROGRAMA_POSTGRADO' },
    { num: 2, title: 'Malla curricular', tag: 'MALLA_CURRICULAR' },
    { num: 3, title: 'Edición', tag: 'EDICION_PROGRAMA' },
    { num: 4, title: 'Docentes', tag: 'DOCENTE / ENSEÑA' },
    { num: 5, title: 'Resumen & Guardado', tag: 'VALIDACIÓN FINAL' },
  ];

  if (loading) {
    return (
      <div className="program-editor-fixed" style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando datos del programa...</p>
      </div>
    );
  }

  return (
    <div className="program-editor-fixed">
      {/* Barra Superior del Editor */}
      <div className="editor-header-bar">
        <div>
          <span className="editor-eyebrow">
            {initialProgramId ? 'EDICIÓN ACADÉMICA · BD ACTIVA' : 'NUEVO PROGRAMA · BD POSTGRADOBD'}
          </span>
          <h1>{initialProgramId ? `Editar: ${program.name || program.id}` : 'Crear y Configurar Programa'}</h1>
          <p className="editor-subtitle">
            Formulario integrado en la misma ventana, interactivo y enlazado directamente a las tablas académicas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {onCancel && (
            <button className="editor-btn outline" onClick={onCancel}>
              <X size={15} /> Cancelar / Volver
            </button>
          )}
        </div>
      </div>

      {/* Stepper de Pasos */}
      <div className="editor-steps">
        {stepsTitles.map((s, idx) => (
          <div
            key={idx}
            className={`editor-step ${idx === step ? 'current' : idx < step ? 'done' : ''}`}
            onClick={() => idx < step && setStep(idx)}
          >
            <strong>{idx < step ? <Check size={14} /> : s.num}</strong>
            <div>
              <div>{s.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas */}
      {successMessage && (
        <div className="editor-alert-success">
          ✓ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="editor-hint" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
          <AlertCircle size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          {errorMessage}
        </div>
      )}

      {/* ── PASO 01: PROGRAMA_POSTGRADO ── */}
      {step === 0 && (
        <div className="editor-panel">
          <span className="editor-eyebrow">PASO 01 · PROGRAMA_POSTGRADO</span>
          <h2>Datos Principales del Programa</h2>
          <p>Define la identificación del programa y su clasificación académica oficial.</p>

          <div className="editor-grid">
            <div className="editor-field">
              <label>ID del programa * (ej: PG-EST-002)</label>
              <input
                type="text"
                value={program.id}
                onChange={(e) => setProgram({ ...program, id: e.target.value })}
                placeholder="PG-EST-001"
              />
            </div>

            <div className="editor-field">
              <label>Nombre del programa *</label>
              <input
                type="text"
                value={program.name}
                onChange={(e) => setProgram({ ...program, name: e.target.value })}
                placeholder="Ej: Maestría en Ciencia de Datos y Machine Learning"
              />
            </div>

            <div className="editor-field">
              <label>Tipo de programa *</label>
              <select
                value={program.kind}
                onChange={(e) => handleKindChange(e.target.value)}
              >
                <option value="Maestría">Maestría</option>
                <option value="Diplomado">Diplomado</option>
              </select>
            </div>

            {program.kind === 'Maestría' ? (
              <div className="editor-field">
                <label>Tipo de maestría *</label>
                <select
                  value={program.type}
                  onChange={(e) => setProgram({ ...program, type: e.target.value })}
                >
                  <option value="Terminal">Terminal</option>
                  <option value="Autosostenible">Autosostenible</option>
                </select>
              </div>
            ) : (
              <div className="editor-field">
                <label>Nivel Académico</label>
                <input type="text" value="Diplomado de Especialidad" disabled />
              </div>
            )}

            <div className="editor-field full">
              <label>Descripción general del programa *</label>
              <textarea
                value={program.description}
                onChange={(e) => setProgram({ ...program, description: e.target.value })}
                placeholder="Detalla los objetivos, enfoque y justificación académica..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 02: MALLA_CURRICULAR ── */}
      {step === 1 && (
        <div className="editor-panel">
          <span className="editor-eyebrow">PASO 02 · MALLA_CURRICULAR</span>
          <h2>Estructura Curricular ({program.kind})</h2>
          <p>
            Programa: <b>{program.name || program.id}</b> ({program.kind}
            {program.kind === 'Maestría' ? ` · ${program.type}` : ''})
          </p>

          <div className="editor-actions">
            <button
              className={`editor-btn ${mallaMode === 'new' ? '' : 'outline'}`}
              onClick={() => setMallaMode('new')}
            >
              + Nueva malla curricular
            </button>
            {existingMallas.length > 0 && (
              <button
                className={`editor-btn ${mallaMode === 'existing' ? '' : 'outline'}`}
                onClick={() => setMallaMode('existing')}
              >
                Seleccionar existente ({existingMallas.length})
              </button>
            )}
          </div>

          {mallaMode === 'existing' ? (
            <div>
              <h3>Mallas guardadas para este programa:</h3>
              {existingMallas.map((ex, i) => (
                <div
                  key={i}
                  className={`editor-choice ${malla.id === ex.id ? 'selected' : ''}`}
                  onClick={() => setMalla(JSON.parse(JSON.stringify(ex)))}
                >
                  <b>{ex.name}</b> <span className="editor-tag">{ex.id}</span>
                  <p>
                    {ex.modules.length} módulos ·{' '}
                    {ex.subjects.length + ex.modules.reduce((acc, m) => acc + m.subjects.length, 0)} materias
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="editor-grid">
                <div className="editor-field">
                  <label>ID de la malla *</label>
                  <input
                    type="text"
                    value={malla.id}
                    onChange={(e) => setMalla({ ...malla, id: e.target.value })}
                  />
                </div>
                <div className="editor-field">
                  <label>Nombre de la malla curricular *</label>
                  <input
                    type="text"
                    value={malla.name}
                    onChange={(e) => setMalla({ ...malla, name: e.target.value })}
                  />
                </div>
              </div>

              <hr style={{ margin: '24px 0', borderColor: '#e5eae3' }} />

              {/* Malla para Diplomado */}
              {program.kind === 'Diplomado' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3>Materias del Diplomado ({malla.subjects.length})</h3>
                    <button className="editor-btn" onClick={addDiplomaSubject}>
                      <Plus size={14} /> Agregar Materia
                    </button>
                  </div>

                  {malla.subjects.map((sub, i) => (
                    <div key={i} className="editor-item">
                      <div className="editor-itemhead">
                        <b>Materia {i + 1}</b>
                        <button className="editor-btn danger" onClick={() => removeDiplomaSubject(i)}>
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>

                      <div className="editor-grid">
                        <div className="editor-field">
                          <label>ID Materia *</label>
                          <input
                            type="text"
                            value={sub.id}
                            onChange={(e) => updateDiplomaSubject(i, 'id', e.target.value)}
                          />
                        </div>
                        <div className="editor-field">
                          <label>Nombre de la materia *</label>
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => updateDiplomaSubject(i, 'name', e.target.value)}
                            placeholder="Ej: Análisis Exploratorio de Datos"
                          />
                        </div>
                        <div className="editor-field">
                          <label>Créditos *</label>
                          <input
                            type="number"
                            min="1"
                            value={sub.credits}
                            onChange={(e) => updateDiplomaSubject(i, 'credits', e.target.value)}
                          />
                        </div>
                        <div className="editor-field">
                          <label>Carga Horaria (Horas académicas) *</label>
                          <input
                            type="number"
                            min="1"
                            value={sub.hours}
                            onChange={(e) => updateDiplomaSubject(i, 'hours', e.target.value)}
                          />
                        </div>
                        <div className="editor-field full">
                          <label>Descripción / Contenido mínimo</label>
                          <textarea
                            value={sub.description}
                            onChange={(e) => updateDiplomaSubject(i, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Malla para Maestría */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3>Módulos de la Maestría ({malla.modules.length})</h3>
                    <button className="editor-btn" onClick={addMasterModule}>
                      <Plus size={14} /> Crear Nuevo Módulo
                    </button>
                  </div>

                  {malla.modules.map((mod, modIdx) => (
                    <div key={modIdx} className="editor-item" style={{ borderLeft: '4px solid #267342' }}>
                      <div className="editor-itemhead">
                        <b>Módulo {modIdx + 1}</b>
                        <button className="editor-btn danger" onClick={() => removeMasterModule(modIdx)}>
                          <Trash2 size={13} /> Eliminar Módulo
                        </button>
                      </div>

                      <div className="editor-grid">
                        <div className="editor-field">
                          <label>ID Módulo *</label>
                          <input
                            type="text"
                            value={mod.id}
                            onChange={(e) => updateMasterModule(modIdx, 'id', e.target.value)}
                          />
                        </div>
                        <div className="editor-field">
                          <label>Nombre del módulo *</label>
                          <input
                            type="text"
                            value={mod.name}
                            onChange={(e) => updateMasterModule(modIdx, 'name', e.target.value)}
                            placeholder="Ej: Módulo I: Estadística Teórica"
                          />
                        </div>
                      </div>

                      {/* Lista de materias de este módulo */}
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '750', color: '#435c49' }}>
                            Materias del módulo ({mod.subjects.length}):
                          </span>
                          <button
                            className="editor-btn outline"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => openInlineSubjectForm(modIdx)}
                          >
                            <Plus size={13} /> + Añadir Materia
                          </button>
                        </div>

                        {mod.subjects.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {mod.subjects.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: '#fff',
                                  border: '1px solid #dce6de',
                                  borderRadius: '8px',
                                  padding: '8px 12px',
                                  fontSize: '12px',
                                }}
                              >
                                <div>
                                  <b style={{ color: '#267342' }}>{s.name}</b> ({s.id}) ·{' '}
                                  <span style={{ color: '#6b7b70' }}>
                                    {s.credits} créditos · {s.hours} hrs
                                  </span>
                                </div>
                                <button
                                  className="editor-btn danger"
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                  onClick={() => removeSubjectFromModule(modIdx, sIdx)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="editor-hint" style={{ margin: '6px 0' }}>
                            Este módulo aún no tiene materias asignadas. Haz clic en "+ Añadir Materia".
                          </div>
                        )}

                        {/* Sub-formulario INLINE interactivo (Fijo, sin popups emergentes) */}
                        {activeModuleForSubject === modIdx && (
                          <div className="inline-subform">
                            <div className="inline-subform-title">
                              <BookOpen size={15} />
                              Añadir Materia al Módulo {modIdx + 1} ({mod.name})
                            </div>

                            <div className="editor-grid">
                              <div className="editor-field">
                                <label>ID Materia *</label>
                                <input
                                  type="text"
                                  value={inlineSubjectDraft.id}
                                  onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, id: e.target.value })}
                                />
                              </div>
                              <div className="editor-field">
                                <label>Nombre de la materia *</label>
                                <input
                                  type="text"
                                  value={inlineSubjectDraft.name}
                                  onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, name: e.target.value })}
                                  placeholder="Ej: Inferencia Bayesiana"
                                />
                              </div>
                              <div className="editor-field">
                                <label>Créditos *</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={inlineSubjectDraft.credits}
                                  onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, credits: e.target.value })}
                                />
                              </div>
                              <div className="editor-field">
                                <label>Carga Horaria *</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={inlineSubjectDraft.hours}
                                  onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, hours: e.target.value })}
                                />
                              </div>
                              <div className="editor-field full">
                                <label>Descripción del contenido</label>
                                <textarea
                                  value={inlineSubjectDraft.description}
                                  onChange={(e) => setInlineSubjectDraft({ ...inlineSubjectDraft, description: e.target.value })}
                                  placeholder="Temario y descripción analítica de la asignatura..."
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                              <button className="editor-btn" onClick={saveInlineSubjectToModule}>
                                ✓ Guardar Materia en Módulo
                              </button>
                              <button className="editor-btn outline" onClick={() => setActiveModuleForSubject(null)}>
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── PASO 03: EDICION_PROGRAMA ── */}
      {step === 2 && (
        <div className="editor-panel">
          <span className="editor-eyebrow">PASO 03 · EDICION_PROGRAMA</span>
          <h2>Datos y Convocatoria de la Edición</h2>
          <p>Configure las fechas, horarios, modalidades y enlaces oficiales de difusión.</p>

          <div className="editor-grid">
            <div className="editor-field">
              <label>ID de la edición * (ej: ED-2026-1)</label>
              <input
                type="text"
                value={edition.id}
                onChange={(e) => setEdition({ ...edition, id: e.target.value })}
              />
            </div>

            <div className="editor-field">
              <label>Estado de la edición *</label>
              <select
                value={edition.state}
                onChange={(e) => setEdition({ ...edition, state: e.target.value })}
              >
                <option value="En Proceso">En Proceso</option>
                <option value="Abierta">Abierta</option>
                <option value="En Curso">En Curso</option>
                <option value="Concluida">Concluida</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <div className="editor-field">
              <label>Fecha de inicio *</label>
              <input
                type="date"
                value={edition.start}
                onChange={(e) => setEdition({ ...edition, start: e.target.value })}
              />
            </div>

            <div className="editor-field">
              <label>Fecha de fin *</label>
              <input
                type="date"
                value={edition.end}
                onChange={(e) => setEdition({ ...edition, end: e.target.value })}
              />
            </div>

            <div className="editor-field">
              <label>Duración oficial *</label>
              <input
                type="text"
                value={edition.duration}
                onChange={(e) => setEdition({ ...edition, duration: e.target.value })}
                placeholder="Ej: 18 meses (4 semestres)"
              />
            </div>

            <div className="editor-field">
              <label>Horario y turno *</label>
              <input
                type="text"
                value={edition.schedule}
                onChange={(e) => setEdition({ ...edition, schedule: e.target.value })}
                placeholder="Ej: Lunes a Jueves 19:00 - 22:00"
              />
            </div>

            <div className="editor-field full">
              <label>Descripción y alcance de la edición</label>
              <textarea
                value={edition.description}
                onChange={(e) => setEdition({ ...edition, description: e.target.value })}
              />
            </div>

            <div className="editor-field full">
              <label>Modalidad de Titulación *</label>
              <textarea
                value={edition.degree}
                onChange={(e) => setEdition({ ...edition, degree: e.target.value })}
                placeholder="Ej: Tesis de grado, monografía o proyecto de grado aplicado..."
              />
            </div>

            <div className="editor-field full">
              <label>Requisitos de Admisión *</label>
              <textarea
                value={edition.requirements}
                onChange={(e) => setEdition({ ...edition, requirements: e.target.value })}
                placeholder="Documentos requeridos, títulos y formularios..."
              />
            </div>

            <div className="editor-field">
              <label>Carpeta Drive / Convocatoria (URL)</label>
              <input
                type="text"
                value={edition.call}
                onChange={(e) => setEdition({ ...edition, call: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="editor-field">
              <label>Formulario de Preinscripción (URL)</label>
              <input
                type="text"
                value={edition.form}
                onChange={(e) => setEdition({ ...edition, form: e.target.value })}
                placeholder="https://docs.google.com/forms/..."
              />
            </div>

            <div className="editor-field full">
              <label>Enlace directo al PDF de Convocatoria</label>
              <input
                type="text"
                value={edition.callLink}
                onChange={(e) => setEdition({ ...edition, callLink: e.target.value })}
                placeholder="https://drive.google.com/file/convocatoria.pdf"
              />
            </div>

            <div className="editor-field">
              <label>Banner de Tarjeta (URL Imagen)</label>
              <input
                type="text"
                value={edition.banner}
                onChange={(e) => setEdition({ ...edition, banner: e.target.value })}
                placeholder="URL o ruta de imagen"
              />
            </div>

            <div className="editor-field">
              <label>Póster / Afiche Oficial (URL Imagen)</label>
              <input
                type="text"
                value={edition.poster}
                onChange={(e) => setEdition({ ...edition, poster: e.target.value })}
                placeholder="URL o ruta de imagen"
              />
            </div>

            <div className="editor-field full">
              <label>Perfil Profesional (Perfil de Egreso)</label>
              <textarea
                value={edition.perfilPro}
                onChange={(e) => setEdition({ ...edition, perfilPro: e.target.value })}
              />
            </div>

            <div className="editor-field full">
              <label>Profesiones de Destino (Perfil de Aspirante)</label>
              <textarea
                value={edition.professions}
                onChange={(e) => setEdition({ ...edition, professions: e.target.value })}
              />
            </div>

            <div className="editor-field full">
              <label>Competencias de la Maestría / Programa</label>
              <textarea
                value={edition.competencies}
                onChange={(e) => setEdition({ ...edition, competencies: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 04: DOCENTE / ENSEÑA ── */}
      {step === 3 && (
        <div className="editor-panel">
          <span className="editor-eyebrow">PASO 04 · DOCENTE / ENSEÑA</span>
          <h2>Asignación y Registro de Docentes</h2>
          <p>
            Selecciona los docentes que dictarán clases en la edición <b>{edition.id}</b> o registra docentes nuevos directamente aquí.
          </p>

          <div className="editor-actions">
            <button className="editor-btn" onClick={addTeacherDraft}>
              <Plus size={14} /> + Registrar Nuevo Docente
            </button>
          </div>

          {/* Formulario Inline para registrar docentes nuevos */}
          {teacherDrafts.length > 0 && (
            <div className="inline-subform" style={{ marginBottom: '24px' }}>
              <div className="inline-subform-title">
                <Users size={15} /> Docentes Nuevos por Incorporar ({teacherDrafts.length})
              </div>

              {teacherDrafts.map((td, i) => (
                <div key={i} className="editor-item" style={{ background: '#fff' }}>
                  <div className="editor-itemhead">
                    <b>Docente Nuevo #{i + 1}</b>
                    <button className="editor-btn danger" onClick={() => removeTeacherDraft(i)}>
                      ✕ Quitar
                    </button>
                  </div>
                  <div className="editor-grid">
                    <div className="editor-field">
                      <label>ID Docente *</label>
                      <input
                        type="text"
                        value={td.id}
                        onChange={(e) => updateTeacherDraft(i, 'id', e.target.value)}
                      />
                    </div>
                    <div className="editor-field">
                      <label>Nombres *</label>
                      <input
                        type="text"
                        value={td.name}
                        onChange={(e) => updateTeacherDraft(i, 'name', e.target.value)}
                        placeholder="Ej: Carlos"
                      />
                    </div>
                    <div className="editor-field">
                      <label>Apellidos *</label>
                      <input
                        type="text"
                        value={td.last}
                        onChange={(e) => updateTeacherDraft(i, 'last', e.target.value)}
                        placeholder="Ej: Mamani"
                      />
                    </div>
                    <div className="editor-field">
                      <label>Foto (URL)</label>
                      <input
                        type="text"
                        value={td.photo}
                        onChange={(e) => updateTeacherDraft(i, 'photo', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button className="editor-btn outline" onClick={commitTeacherDrafts}>
                ✓ Añadir a la Lista de Docentes Disponibles
              </button>
            </div>
          )}

          <h3>Docentes Disponibles ({availableTeachers.length}):</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginTop: '12px' }}>
            {availableTeachers.map((t) => {
              const teacherId = t.id || t.id_doc;
              const isSelected = selectedTeachers.includes(teacherId);
              return (
                <div
                  key={teacherId}
                  className={`editor-choice ${isSelected ? 'selected' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}
                  onClick={() => toggleTeacherSelection(teacherId)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <b style={{ display: 'block', fontSize: '13px' }}>
                      {t.nombre_completo || `${t.nombre || t.nombre_doc || ''} ${t.apellido || t.apellido_doc || ''}`}
                    </b>
                    <span className="editor-tag">{teacherId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PASO 05: RESUMEN & GUARDADO FINAL ── */}
      {step === 4 && (
        <div className="editor-panel">
          <span className="editor-eyebrow">PASO 05 · VALIDACIÓN & GUARDADO FINAL</span>
          <h2>Resumen de Operación Académica</h2>
          <p>Verifica los datos que se registrarán en las tablas de PostgreSQL (Neon DB).</p>

          <div className="editor-item">
            <b>{program.name || 'Sin nombre'}</b>
            <p>
              {program.kind} {program.kind === 'Maestría' ? `(${program.type})` : ''} · ID: {program.id}
            </p>
            <span style={{ fontSize: '12px', color: '#435c49' }}>{program.description}</span>
          </div>

          <div className="editor-item">
            <b>Malla Curricular: {malla.name}</b>
            <p>ID: {malla.id}</p>
            {program.kind === 'Diplomado' ? (
              <p>{malla.subjects.length} materias registradas</p>
            ) : (
              <p>
                {malla.modules.length} módulos con{' '}
                {malla.modules.reduce((acc, m) => acc + m.subjects.length, 0)} materias en total
              </p>
            )}
          </div>

          <div className="editor-item">
            <b>Edición: {edition.id}</b>
            <p>
              Estado: <span className="editor-tag">{edition.state}</span> · Duración: {edition.duration}
            </p>
            <p>
              Fechas: {edition.start || 'No definida'} → {edition.end || 'No definida'}
            </p>
          </div>

          <div className="editor-item">
            <b>Docentes Asignados ({selectedTeachers.length})</b>
            <p>
              {availableTeachers
                .filter((t) => selectedTeachers.includes(t.id || t.id_doc))
                .map((t) => t.nombre_completo || `${t.nombre || t.nombre_doc} ${t.apellido || t.apellido_doc}`)
                .join(', ') || 'Ningún docente asignado'}
            </p>
          </div>

          {/* Vista previa JSON */}
          <div style={{ marginTop: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '750', color: '#435c49', display: 'block', marginBottom: '8px' }}>
              Estructura JSON de las tablas (bd.sql):
            </span>
            <pre className="editor-json-preview">
              {JSON.stringify(
                {
                  Programa_Postgrado: [{ Id_Programa: program.id, Nombre_Programa: program.name, Descripcion: program.description }],
                  Maestria: program.kind === 'Maestría' ? [{ Id_Programa: program.id, Tipo: program.type }] : [],
                  Diplomado: program.kind === 'Diplomado' ? [{ Id_Programa: program.id }] : [],
                  Malla_Curricular: [{ id_Malla: malla.id, Nombre_Malla: malla.name, id_Programa: program.id }],
                  Edicion_Programa: [{ id_Edicion: edition.id, Estado: edition.state, Duracion: edition.duration }],
                  Docentes_Enseña: selectedTeachers,
                },
                null,
                2
              )}
            </pre>
          </div>

          <div className="editor-actions" style={{ marginTop: '24px' }}>
            <button
              className="editor-btn"
              style={{ fontSize: '14px', padding: '13px 24px', background: '#1c6235' }}
              onClick={handleSaveToDatabase}
              disabled={saving}
            >
              <Save size={16} /> {saving ? 'Guardando en Base de Datos...' : 'Guardar en Base de Datos (Neon DB)'}
            </button>

            <button className="editor-btn outline" onClick={handleExportJSON}>
              <Download size={15} /> Descargar JSON
            </button>
          </div>
        </div>
      )}

      {/* Footer de Navegación de Pasos */}
      <div className="editor-footer">
        <button
          className="editor-btn outline"
          onClick={handleBack}
          style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
        >
          <ArrowLeft size={14} /> Anterior
        </button>

        <span style={{ fontSize: '13px', color: '#6b7b70', fontWeight: '600' }}>
          Paso {step + 1} de 5
        </span>

        {step < 4 ? (
          <button className="editor-btn" onClick={handleNext}>
            Continuar <ArrowRight size={14} />
          </button>
        ) : (
          <button
            className="editor-btn"
            style={{ background: '#1c6235' }}
            onClick={handleSaveToDatabase}
            disabled={saving}
          >
            <CheckCircle2 size={15} /> {saving ? 'Guardando...' : 'Finalizar y Guardar ✓'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgramEditorFixed;
