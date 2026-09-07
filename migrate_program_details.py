from backend.app import engine
from sqlalchemy import text

with engine.begin() as conn:
    print("Agregando columnas a programa_postgrado...")
    conn.execute(text("""
        ALTER TABLE programa_postgrado
        ADD COLUMN IF NOT EXISTS perfil_aspirante TEXT,
        ADD COLUMN IF NOT EXISTS perfil_egreso TEXT,
        ADD COLUMN IF NOT EXISTS requisitos_admision TEXT,
        ADD COLUMN IF NOT EXISTS modalidad_titulacion TEXT;
    """))

    print("Actualizando datos para programas existentes en Neon DB...")
    # PG-EST-001: Maestria en Estadistica
    conn.execute(text("""
        UPDATE programa_postgrado
        SET 
            perfil_aspirante = 'Profesionales con grado de Licenciatura en Estadística, Informática, Matemática, Economía, Ingeniería y ramas afines con sólida base cuantitativa.',
            perfil_egreso = 'Magíster capacitado para diseñar investigaciones estadísticas de frontera, liderar análisis de big data y formular modelos estocásticos y predictivos de alta precisión.',
            requisitos_admision = '1. Fotocopia legalizada del Título en Provisión Nacional a nivel Licenciatura.\n2. Cédula de Identidad vigente.\n3. Certificado de Nacimiento original computarizado.\n4. Curriculum Vitae documentado.\n5. Carta de solicitud de admisión dirigida a la Dirección de Posgrado.',
            modalidad_titulacion = 'Defensa pública de Tesis de Grado o Publicación de Artículo Científico en revista indexada (Scopus/SciELO).'
        WHERE id_programa = 'PG-EST-001';
    """))

    # PG-EST-002: Maestria en Ciencia de Datos
    conn.execute(text("""
        UPDATE programa_postgrado
        SET 
            perfil_aspirante = 'Licenciados en áreas cuantitativas, tecnología, ciencias económicas o exactas con interés en minería de datos, machine learning e inteligencia artificial.',
            perfil_egreso = 'Científico de datos capaz de construir pipelines analíticos, implementar modelos de deep learning y resolver problemas complejos en el sector productivo y académico.',
            requisitos_admision = '1. Fotocopia legalizada del Título en Provisión Nacional a nivel Licenciatura.\n2. Cédula de Identidad vigente.\n3. Certificado de Nacimiento computarizado.\n4. Hoja de vida documentada.\n5. Formulario oficial de postulación.',
            modalidad_titulacion = 'Tesis de Maestría o Proyecto de Aplicación Tecnológica con defensa ante tribunal evaluador.'
        WHERE id_programa = 'PG-EST-002';
    """))

    # PG-EST-003: Diplomado en Metodos Estadisticos
    conn.execute(text("""
        UPDATE programa_postgrado
        SET 
            perfil_aspirante = 'Profesionales de cualquier disciplina que requieran dominar herramientas cuantitativas, análisis de datos y modelamiento probabilístico.',
            perfil_egreso = 'Especialista en aplicación de metodologías estadísticas, manejo de software R y Python, e interpretación de encuestas y experimentos.',
            requisitos_admision = '1. Fotocopia simple del Título de Licenciatura.\n2. Cédula de Identidad vigente.\n3. Formulario de inscripción en línea debidamente llenado.',
            modalidad_titulacion = 'Monografía o Trabajo Final de Aplicación Práctica con aprobación de módulos.'
        WHERE id_programa = 'PG-EST-003';
    """))

    print("Migracion completada exitosamente.")
