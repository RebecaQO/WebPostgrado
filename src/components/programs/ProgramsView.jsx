import React, { useEffect, useState, useMemo } from 'react';
import { ProgramDetailModal } from './ProgramDetailModal';
import { 
  GraduationCap, 
  Search, 
  Layers, 
  Award, 
  Clock, 
  FileText,
  Filter,
  MessageCircle,
  ArrowRight,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

import slide1 from '../../assets/images/carrusel/slide1.jpg';
import slide2 from '../../assets/images/carrusel/slide2.jpg';
import slide3 from '../../assets/images/carrusel/slide3.jpg';
import slide4 from '../../assets/images/carrusel/slide4.jpg';

const CARD_IMAGES = [slide1, slide2, slide3, slide4];

export const ProgramsView = ({ onNavigateToAdmission, initialFilter = null }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Top Banner Filters ("Encuentra tu programa")
  const [topLevel, setTopLevel] = useState(initialFilter?.level || 'todos');
  const [topDomain, setTopDomain] = useState(initialFilter?.area || 'todas');
  const [topCampus, setTopCampus] = useState(initialFilter?.modality || 'todas');

  // Sidebar Filters ("Filtros")
  const [keyword, setKeyword] = useState(initialFilter?.search || '');
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedModalities, setSelectedModalities] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  // Accordion toggle states
  const [accordions, setAccordions] = useState({
    duracion: true,
    modalidad: true,
    dominio: true,
    nivel: true
  });

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync state if initialFilter prop changes
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.level) setTopLevel(initialFilter.level);
      if (initialFilter.search !== undefined) setKeyword(initialFilter.search || '');
      if (initialFilter.area) setTopDomain(initialFilter.area);
      if (initialFilter.modality) setTopCampus(initialFilter.modality);
    }
  }, [initialFilter]);

  // Fetch programs from DB
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/programas/activos');
        const data = await response.json();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando programas desde la BD:', error);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    loadPrograms();
  }, []);

  // Dynamic filter options extracted from the active DB records
  const filterOptions = useMemo(() => {
    const levels = [...new Set(programs.map((p) => p.type).filter(Boolean))].sort();
    const domains = [
      ...new Set(
        programs.flatMap((p) => [p.mencion, p.area].filter((v) => Boolean(v) && v.trim().length > 0))
      )
    ].sort();
    const modalities = [...new Set(programs.map((p) => p.modality).filter(Boolean))].sort();
    const durations = [...new Set(programs.map((p) => p.duration).filter(Boolean))].sort();

    return { levels, domains, modalities, durations };
  }, [programs]);

  // Filter application logic
  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      // 1. Top banner level selector
      if (topLevel && topLevel !== 'todos') {
        const qLvl = topLevel.toLowerCase();
        const pType = (prog.type || '').toLowerCase();
        const pFilter = (prog.typeFilter || '').toLowerCase();
        if (!pType.includes(qLvl) && !pFilter.includes(qLvl)) return false;
      }

      // 2. Top banner domain selector
      if (topDomain && topDomain !== 'todas') {
        const qDom = topDomain.toLowerCase();
        const pArea = (prog.area || '').toLowerCase();
        const pMencion = (prog.mencion || '').toLowerCase();
        const pTitle = (prog.title || '').toLowerCase();
        if (!pArea.includes(qDom) && !pMencion.includes(qDom) && !pTitle.includes(qDom)) return false;
      }

      // 3. Top banner campus / modality selector
      if (topCampus && topCampus !== 'todas') {
        const qCam = topCampus.toLowerCase();
        const pMod = (prog.modality || '').toLowerCase();
        if (!pMod.includes(qCam)) return false;
      }

      // 4. Keyword search (input)
      if (keyword.trim()) {
        const q = keyword.toLowerCase().trim();
        const matchTitle = (prog.title || '').toLowerCase().includes(q);
        const matchDesc = (prog.description || '').toLowerCase().includes(q);
        const matchArea = (prog.area || '').toLowerCase().includes(q);
        const matchMencion = (prog.mencion || '').toLowerCase().includes(q);
        const matchCode = (prog.id || prog.code || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchArea && !matchMencion && !matchCode) return false;
      }

      // 5. Sidebar Duración (multi-checkbox)
      if (selectedDurations.length > 0) {
        if (!selectedDurations.includes(prog.duration)) return false;
      }

      // 6. Sidebar Modalidad (multi-checkbox)
      if (selectedModalities.length > 0) {
        if (!selectedModalities.includes(prog.modality)) return false;
      }

      // 7. Sidebar Dominio / Especialidad (multi-checkbox)
      if (selectedDomains.length > 0) {
        const hasMatch = selectedDomains.some((d) => 
          (prog.mencion || '').toLowerCase().includes(d.toLowerCase()) || 
          (prog.area || '').toLowerCase().includes(d.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      // 8. Sidebar Nivel Académico (multi-checkbox)
      if (selectedLevels.length > 0) {
        if (!selectedLevels.includes(prog.type)) return false;
      }

      return true;
    });
  }, [
    programs,
    topLevel,
    topDomain,
    topCampus,
    keyword,
    selectedDurations,
    selectedModalities,
    selectedDomains,
    selectedLevels
  ]);

  const hasActiveFilters =
    topLevel !== 'todos' ||
    topDomain !== 'todas' ||
    topCampus !== 'todas' ||
    keyword.trim() !== '' ||
    selectedDurations.length > 0 ||
    selectedModalities.length > 0 ||
    selectedDomains.length > 0 ||
    selectedLevels.length > 0;

  const handleResetFilters = () => {
    setTopLevel('todos');
    setTopDomain('todas');
    setTopCampus('todas');
    setKeyword('');
    setSelectedDurations([]);
    setSelectedModalities([]);
    setSelectedDomains([]);
    setSelectedLevels([]);
  };

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="section-spacing animate-fade-in" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* ── Encabezado Principal estilo Referencia ── */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'var(--font-family-heading)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem 0'
          }}>
            Nuestros programas y formación
          </h1>
          {/* Barra de acento con el verde institucional */}
          <div style={{
            width: '48px',
            height: '4px',
            backgroundColor: 'var(--color-green-inst)',
            borderRadius: '2px'
          }} />
        </div>

        {/* ── Barra Superior "Encuentra tu programa" estilo Referencia ── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 18px -4px rgba(0, 0, 0, 0.06)',
          marginBottom: '2rem'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'var(--font-family-heading)',
            marginBottom: '1rem'
          }}>
            Encuentra tu programa
          </div>

          <div className="emlyon-homepage-filter-banner-form">
            {/* 1. Eres... */}
            <div className="filter-input-group">
              <Users size={17} className="filter-input-icon" style={{ color: 'var(--color-green-inst)' }} />
              <select
                value={topLevel}
                onChange={(e) => setTopLevel(e.target.value)}
                className="banner-filter-select"
                aria-label="Filtrar por nivel o perfil"
              >
                <option value="todos">Eres...</option>
                <option value="maestria">Maestrías (M.Sc.)</option>
                <option value="diplomado">Diplomados</option>
              </select>
            </div>

            {/* 2. Tu dominio */}
            <div className="filter-input-group">
              <GraduationCap size={18} className="filter-input-icon" style={{ color: 'var(--color-green-inst)' }} />
              <select
                value={topDomain}
                onChange={(e) => setTopDomain(e.target.value)}
                className="banner-filter-select"
                aria-label="Filtrar por dominio o especialidad"
              >
                <option value="todas">Tu dominio</option>
                {filterOptions.domains.map((dom) => (
                  <option key={dom} value={dom}>{dom}</option>
                ))}
              </select>
            </div>

            {/* 3. Tu modalidad */}
            <div className="filter-input-group">
              <Layers size={17} className="filter-input-icon" style={{ color: 'var(--color-green-inst)' }} />
              <select
                value={topCampus}
                onChange={(e) => setTopCampus(e.target.value)}
                className="banner-filter-select"
                aria-label="Filtrar por modalidad"
              >
                <option value="todas">Tu modalidad</option>
                {filterOptions.modalities.map((mod) => (
                  <option key={mod} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            {/* Botón Ver programas */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('programs-results-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                background: 'var(--color-green-inst)',
                color: '#ffffff',
                border: 'none',
                padding: '0.82rem 1.6rem',
                borderRadius: '4px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s ease, transform 0.15s ease',
                boxShadow: '0 4px 12px rgba(38, 115, 66, 0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-green-inst-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-green-inst)'}
            >
              <span>Ver programas</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* ── Contador de Resultados estilo Referencia ── */}
        <div id="programs-results-section" style={{
          fontSize: '0.95rem',
          color: '#0f172a',
          fontWeight: 700,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            Resultados <span style={{ color: 'var(--color-green-inst)', fontWeight: 800 }}>{filteredPrograms.length}</span> formaciones
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              style={{
                background: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#475569',
                borderRadius: '4px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dc2626';
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <RotateCcw size={13} />
              <span>Limpiar todos los filtros</span>
            </button>
          )}
        </div>

        {/* ── Layout en Dos Columnas: Sidebar Filtros + Grilla de Tarjetas ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: '1.75rem',
          alignItems: 'start'
        }} className="programs-catalog-grid-wrapper">

          {/* ══════════ COLUMNA IZQUIERDA: SIDEBAR FILTROS ══════════ */}
          <aside style={{
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            position: 'sticky',
            top: '85px'
          }}>
            {/* Header del Sidebar */}
            <div style={{
              padding: '1.2rem 1.4rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{
                fontSize: '1.28rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                fontFamily: 'var(--font-family-heading)'
              }}>
                Filtros
              </h2>
            </div>

            {/* Búsqueda por palabras clave */}
            <div style={{
              padding: '1.25rem 1.4rem',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '0.6rem'
              }}>
                Por palabras clave
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Introduzca una palabra clave"
                  style={{
                    width: '100%',
                    padding: '0.62rem 2.2rem 0.62rem 0.75rem',
                    fontSize: '0.82rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    outline: 'none',
                    color: '#1e293b',
                    background: '#ffffff',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-green-inst)'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-green-inst)',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

            {/* 1. Acordeón: Duración */}
            {filterOptions.durations.length > 0 && (
              <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('duracion')}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.4rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                >
                  <span>Duración</span>
                  {accordions.duracion ? <ChevronUp size={16} color="var(--color-green-inst)" /> : <ChevronDown size={16} color="var(--color-green-inst)" />}
                </button>
                {accordions.duracion && (
                  <div style={{ padding: '0 1.4rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filterOptions.durations.map((dur) => (
                      <label
                        key={dur}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          fontSize: '0.82rem',
                          color: '#475569',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDurations.includes(dur)}
                          onChange={() => toggleFilter(selectedDurations, setSelectedDurations, dur)}
                          style={{ accentColor: '#1e5f35', width: '15px', height: '15px' }}
                        />
                        <span>{dur}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Acordeón: Modalidad */}
            {filterOptions.modalities.length > 0 && (
              <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('modalidad')}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.4rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                >
                  <span>Modalidad</span>
                  {accordions.modalidad ? <ChevronUp size={16} color="var(--color-green-inst)" /> : <ChevronDown size={16} color="var(--color-green-inst)" />}
                </button>
                {accordions.modalidad && (
                  <div style={{ padding: '0 1.4rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filterOptions.modalities.map((mod) => (
                      <label
                        key={mod}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          fontSize: '0.82rem',
                          color: '#475569',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedModalities.includes(mod)}
                          onChange={() => toggleFilter(selectedModalities, setSelectedModalities, mod)}
                          style={{ accentColor: '#1e5f35', width: '15px', height: '15px' }}
                        />
                        <span>{mod}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Acordeón: Especialidad / Dominio */}
            {filterOptions.domains.length > 0 && (
              <div style={{ borderBottom: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('dominio')}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.4rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                >
                  <span>Especialidad</span>
                  {accordions.dominio ? <ChevronUp size={16} color="var(--color-green-inst)" /> : <ChevronDown size={16} color="var(--color-green-inst)" />}
                </button>
                {accordions.dominio && (
                  <div style={{ padding: '0 1.4rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filterOptions.domains.map((dom) => (
                      <label
                        key={dom}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          fontSize: '0.82rem',
                          color: '#475569',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDomains.includes(dom)}
                          onChange={() => toggleFilter(selectedDomains, setSelectedDomains, dom)}
                          style={{ accentColor: '#1e5f35', width: '15px', height: '15px' }}
                        />
                        <span>{dom}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Acordeón: Nivel Académico */}
            {filterOptions.levels.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('nivel')}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.4rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                >
                  <span>Nivel Académico</span>
                  {accordions.nivel ? <ChevronUp size={16} color="var(--color-green-inst)" /> : <ChevronDown size={16} color="var(--color-green-inst)" />}
                </button>
                {accordions.nivel && (
                  <div style={{ padding: '0 1.4rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filterOptions.levels.map((lvl) => {
                      const isMae = lvl.toLowerCase().includes('maestr');
                      const lvlColor = isMae ? '#1e5f35' : '#1e3a5f';
                      return (
                        <label
                          key={lvl}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                            fontSize: '0.82rem',
                            color: '#475569',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(lvl)}
                            onChange={() => toggleFilter(selectedLevels, setSelectedLevels, lvl)}
                            style={{ accentColor: lvlColor, width: '15px', height: '15px' }}
                          />
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: lvlColor,
                              display: 'inline-block'
                            }} />
                            <span style={{ color: selectedLevels.includes(lvl) ? lvlColor : '#334155' }}>{lvl}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* ══════════ COLUMNA DERECHA: GRILLA DE TARJETAS ══════════ */}
          <div>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                color: 'var(--color-green-inst)',
                fontWeight: 700
              }}>
                Cargando programas de posgrado desde la base de datos...
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <Filter size={42} color="var(--color-green-inst)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '0.5rem' }}>
                  No se encontraron programas con los filtros seleccionados
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Prueba modificando las palabras clave o restableciendo los selectores de búsqueda.
                </p>
                <button
                  onClick={handleResetFilters}
                  style={{
                    background: 'var(--color-green-inst)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(38, 115, 66, 0.25)',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-green-inst-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-green-inst)'}
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}>
                {filteredPrograms.map((prog, idx) => {
                  const cardImg = prog.imagen || CARD_IMAGES[idx % CARD_IMAGES.length];
                  const isMaster = (prog.type || '').toLowerCase().includes('maestr') ||
                    prog.typeFilter === 'maestria' ||
                    prog.typeFilter === 'terminal' ||
                    prog.typeFilter === 'autofinanciada' ||
                    (prog.title || '').toLowerCase().includes('maestr');
                  const categoryLabel = isMaster ? 'PROGRAMA DE MAESTRÍA (M.SC.)' : 'DIPLOMADO DE ESPECIALIZACIÓN';
                  const themeColor = isMaster ? '#1e5f35' : '#1e3a5f';

                  return (
                    <div
                      key={prog.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        borderTop: `4px solid ${themeColor}`,
                        boxShadow: '0 4px 18px -4px rgba(0, 0, 0, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(0, 0, 0, 0.14)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 18px -4px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <div>
                        {/* ── Imagen Superior de la Tarjeta con Insignia de Nivel ── */}
                        <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
                          <img
                            src={cardImg}
                            alt={prog.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                          {/* Badge de Nivel: Verde para Maestría | Azul para Diplomado */}
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: themeColor,
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            letterSpacing: '0.06em',
                            padding: '0.28rem 0.7rem',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            boxShadow: '0 3px 8px rgba(0,0,0,0.28)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            {isMaster ? <GraduationCap size={13} /> : <Award size={13} />}
                            <span>{isMaster ? 'MAESTRÍA' : 'DIPLOMADO'}</span>
                          </div>
                        </div>

                        {/* ── Cuerpo de la Tarjeta ── */}
                        <div style={{ padding: '1.35rem 1.4rem 1rem' }}>
                          
                          {/* Pastilla Institucional de Categoría (Verde: Maestría, Azul: Diplomado) */}
                          <span style={{
                            display: 'inline-block',
                            background: themeColor,
                            color: '#ffffff',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                            padding: '0.25rem 0.7rem',
                            borderRadius: '99px',
                            textTransform: 'uppercase',
                            marginBottom: '0.8rem',
                            boxShadow: isMaster ? '0 2px 6px rgba(30,95,53,0.22)' : '0 2px 6px rgba(30,58,95,0.22)'
                          }}>
                            {categoryLabel}
                          </span>

                          {/* Título del Programa */}
                          <h3 style={{
                            fontSize: '1.22rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            lineHeight: 1.3,
                            marginBottom: '0.75rem',
                            fontFamily: 'var(--font-family-heading)',
                            minHeight: '3.1rem'
                          }}>
                            {prog.title}
                          </h3>

                          {/* Modalidad del programa */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            color: themeColor,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            marginBottom: '0.9rem'
                          }}>
                            <Layers size={15} color={themeColor} style={{ flexShrink: 0 }} />
                            <span>Modalidad: {prog.modality || 'Híbrida'}</span>
                          </div>

                          {/* Descripción resumida */}
                          <p style={{
                            fontSize: '0.85rem',
                            color: '#475569',
                            lineHeight: 1.6,
                            margin: '0 0 1.1rem 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {prog.description}
                          </p>

                          {/* Metadata pills */}
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.45rem',
                            marginBottom: '0.5rem'
                          }}>
                            {prog.duration && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: '#f1f5f9',
                                color: '#334155',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.22rem 0.55rem',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0'
                              }}>
                                <Clock size={11} color="#64748b" /> {prog.duration}
                              </span>
                            )}
                            {prog.degree && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: '#f1f5f9',
                                color: '#334155',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.22rem 0.55rem',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0'
                              }}>
                                <Award size={11} color="#0284c7" /> {prog.degree}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── Acciones de la Tarjeta con Botón de Postular con tono #1e5f35 ── */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto',
                        gap: '0.55rem',
                        padding: '1rem 1.4rem 1.25rem',
                        borderTop: '1px solid #f1f5f9',
                        background: '#ffffff'
                      }}>
                        <button
                          onClick={() => setSelectedProgram(prog)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            borderRadius: '4px',
                            justifyContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            padding: '0.55rem 0.65rem'
                          }}
                        >
                          <FileText size={14} color="var(--color-green-inst)" />
                          <span>Más info</span>
                        </button>

                        {/* Botón de Postular con tono institucional #1e5f35 */}
                        <a
                          href={prog.enlace_formulario_inscripcion || 'https://docs.google.com/forms/d/e/1FAIpQLSd_posgrado_estadistica_umsa_postulacion_2026/viewform'}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm"
                          style={{
                            background: '#1e5f35',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            justifyContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            boxShadow: '0 3px 10px rgba(30, 95, 53, 0.35)',
                            padding: '0.55rem 0.75rem',
                            transition: 'background 0.2s ease, transform 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#164627';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#1e5f35';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <span>Postular</span>
                          <ArrowRight size={13} />
                        </a>

                        {/* WhatsApp directo */}
                        <a
                          href={`https://wa.me/59176543210?text=${encodeURIComponent(`Hola, deseo más información sobre el programa: ${prog.title}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Consultar por WhatsApp"
                          className="btn btn-sm"
                          style={{
                            background: '#25D366',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            justifyContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.55rem 0.65rem',
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={15} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Detalle */}
        {selectedProgram && (
          <ProgramDetailModal
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
            onApply={(progId) => {
              setSelectedProgram(null);
              if (onNavigateToAdmission) {
                onNavigateToAdmission(progId);
              }
            }}
          />
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .programs-catalog-grid-wrapper {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
