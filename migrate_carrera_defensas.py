import sqlalchemy
from sqlalchemy import text

db_url = 'postgresql://neondb_owner:npg_Vs6GbIoDc2Hz@ep-lively-unit-anzrd32r-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
engine = sqlalchemy.create_engine(db_url)

with engine.begin() as conn:
    print('1. Creando tabla informacion_carrera...')
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS informacion_carrera (
            id_info VARCHAR(50) PRIMARY KEY DEFAULT 'CONFIG_POSTGRADO',
            direccion TEXT DEFAULT 'Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística, La Paz - Bolivia',
            email_principal VARCHAR(150) DEFAULT 'estapost@fcpn.edu.bo',
            campus_virtual_url TEXT DEFAULT 'https://maestria.estadistica.fcpn.edu.bo',
            ieta_descripcion TEXT DEFAULT 'Instituto de Estadística Teórica y Aplicada (IETA): Centro de investigación cuantitativa avanzada y consultoría estadística aplicada.',
            club_cientifico_descripcion TEXT DEFAULT 'Club Científico de Estadística: Comunidad de investigación formativa, seminarios científicos y hackathons de ciencia de datos.',
            telefono VARCHAR(50) DEFAULT '+591 (2) 279-2999',
            whatsapp VARCHAR(50) DEFAULT '+591 76543210',
            horario_atencion TEXT DEFAULT 'Lunes a Viernes 08:30 - 18:30',
            director_nombre VARCHAR(150) DEFAULT 'Dirección de Posgrado e Investigación FCPN - UMSA'
        );
    """))

    conn.execute(text("""
        INSERT INTO informacion_carrera (
            id_info, direccion, email_principal, campus_virtual_url,
            ieta_descripcion, club_cientifico_descripcion, telefono, whatsapp,
            horario_atencion, director_nombre
        ) VALUES (
            'CONFIG_POSTGRADO',
            'Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística, La Paz - Bolivia',
            'estapost@fcpn.edu.bo',
            'https://maestria.estadistica.fcpn.edu.bo',
            'Instituto de Estadística Teórica y Aplicada (IETA): Centro de investigación cuantitativa avanzada y consultoría estadística aplicada para el desarrollo nacional.',
            'Club Científico de Estadística: Comunidad estudiantil y académica de investigación formativa, semilleros y proyectos de ciencia de datos.',
            '+591 (2) 279-2999',
            '+591 76543210',
            'Lunes a Viernes 08:30 - 18:30',
            'Dirección de la Carrera de Estadística y Posgrado'
        ) ON CONFLICT (id_info) DO NOTHING;
    """))

    print('2. Actualizando tabla titulacion (Defensas de Tesis)...')
    conn.execute(text("""
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS postulante_nombre VARCHAR(200);
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS programa_nombre VARCHAR(200);
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS tutor_nombre VARCHAR(200);
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS tribunal_nombres TEXT;
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS hora_sustentacion VARCHAR(20);
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS lugar_sustentacion TEXT;
        ALTER TABLE titulacion ADD COLUMN IF NOT EXISTS enlace_acta_pdf TEXT;
    """))

    # Populate sample defense if needed
    conn.execute(text("""
        UPDATE titulacion SET 
            postulante_nombre = COALESCE(postulante_nombre, 'Lic. Marcelo Torres Condori'),
            programa_nombre = COALESCE(programa_nombre, 'Maestría en Estadística y Ciencia de Datos'),
            tutor_nombre = COALESCE(tutor_nombre, 'Dr. Carlos Mamani Quispe'),
            tribunal_nombres = COALESCE(tribunal_nombres, 'Dr. Álvaro Rojas, M.Sc. Sonia Flores, Dr. Juan Pérez'),
            hora_sustentacion = COALESCE(hora_sustentacion, '16:00'),
            lugar_sustentacion = COALESCE(lugar_sustentacion, 'Auditorio de Posgrado FCPN - Campus Cota Cota Calle 27')
        WHERE id_titulacion = 'TIT-001';
    """))

    print('Migraciones de base de datos completadas con éxito!')
