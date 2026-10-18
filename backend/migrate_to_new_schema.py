import sys
sys.path.append('backend')
from config import engine
from sqlalchemy import text

def run_migration():
    print("Iniciando ajuste de la base de datos según el nuevo esquema...")
    with engine.begin() as conn:
        # 1. Ajuste en Maestria (columna Tipo)
        conn.execute(text("""
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'maestria' AND column_name = 'tipo'
                ) THEN
                    ALTER TABLE maestria ADD COLUMN tipo VARCHAR(20) DEFAULT 'Autosostenible';
                END IF;
            END $$;
        """))
        print("[OK] Tabla maestria ajustada")

        # 2. Crear tabla Malla_Curricular
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS malla_curricular (
                id_malla VARCHAR(50) PRIMARY KEY,
                nombre_malla VARCHAR(50) NOT NULL,
                id_programa VARCHAR(50) NOT NULL REFERENCES programa_postgrado(id_programa) ON DELETE CASCADE
            );
        """))
        print("[OK] Tabla malla_curricular lista")

        # 3. Ajuste de columnas en Edicion_Programa
        edicion_cols = [
            ("duracion", "VARCHAR(50) DEFAULT '18 meses'"),
            ("horario", "VARCHAR(50) DEFAULT 'Lunes a Jueves 19:00 - 22:00'"),
            ("descripcion", "TEXT DEFAULT ''"),
            ("modalidad_titulacion", "TEXT DEFAULT ''"),
            ("requisitos", "TEXT DEFAULT ''"),
            ("convocatoria", "TEXT DEFAULT ''"),
            ("formulario", "TEXT DEFAULT ''"),
            ("enlace_convocatoria", "TEXT DEFAULT ''"),
            ("banner", "TEXT DEFAULT ''"),
            ("poster", "TEXT DEFAULT ''"),
            ("publicidad", "TEXT DEFAULT ''"),
            ("perfilpro", "TEXT DEFAULT ''"),
            ("profesiones", "TEXT DEFAULT ''"),
            ("competenciasmaestria", "TEXT DEFAULT ''"),
            ("id_malla", "VARCHAR(50) REFERENCES malla_curricular(id_malla) ON DELETE SET NULL")
        ]
        for col_name, col_def in edicion_cols:
            conn.execute(text(f"""
                DO $$ 
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'edicion_programa' AND column_name = '{col_name}'
                    ) THEN
                        ALTER TABLE edicion_programa ADD COLUMN {col_name} {col_def};
                    END IF;
                END $$;
            """))
        print("[OK] Columnas de edicion_programa ajustadas")

        # 4. Crear tabla Defensa_Tesis
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS defensa_tesis (
                id_defensa VARCHAR(50) PRIMARY KEY,
                fecha_defensa DATE NOT NULL DEFAULT CURRENT_DATE,
                hora_defensa TIME NOT NULL DEFAULT '16:00:00',
                lugar_defensa VARCHAR(50) NOT NULL DEFAULT 'Auditorio Posgrado FCPN',
                nombre_defen VARCHAR(50) NOT NULL DEFAULT 'Postgraduante',
                estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada')),
                id_edicion VARCHAR(50) NOT NULL REFERENCES edicion_programa(id_edicion) ON DELETE CASCADE
            );
        """))
        print("[OK] Tabla defensa_tesis lista")

        # 5. Ajustar tabla Modulo
        conn.execute(text("""
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'modulo' AND column_name = 'id_malla'
                ) THEN
                    ALTER TABLE modulo ADD COLUMN id_malla VARCHAR(50) REFERENCES malla_curricular(id_malla) ON DELETE SET NULL;
                END IF;
                ALTER TABLE modulo ALTER COLUMN id_edicion DROP NOT NULL;
            END $$;
        """))
        print("[OK] Tabla modulo ajustada")

        # 6. Crear tabla Modulo_Diplomado
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS modulo_diplomado (
                id_mat VARCHAR(50) PRIMARY KEY REFERENCES materia(id_mat) ON DELETE CASCADE
            );
        """))
        print("[OK] Tabla modulo_diplomado lista")

        # 7. Crear tabla Materia_Maestria
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS materia_maestria (
                id_mat VARCHAR(50) PRIMARY KEY REFERENCES materia(id_mat) ON DELETE CASCADE,
                creditos INT NOT NULL DEFAULT 4,
                carga_horaria INT NOT NULL DEFAULT 64,
                id_mod VARCHAR(50) NOT NULL REFERENCES modulo(id_mod) ON DELETE CASCADE,
                descripcion TEXT NOT NULL DEFAULT ''
            );
        """))
        print("[OK] Tabla materia_maestria lista")

        # 8. Crear tabla Integra
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS integra (
                id_mat VARCHAR(50) NOT NULL REFERENCES modulo_diplomado(id_mat) ON DELETE CASCADE,
                id_malla VARCHAR(50) NOT NULL REFERENCES malla_curricular(id_malla) ON DELETE CASCADE,
                creditos INT NOT NULL DEFAULT 4,
                carga_horaria INT NOT NULL DEFAULT 64,
                PRIMARY KEY (id_mat, id_malla)
            );
        """))
        print("[OK] Tabla integra lista")

        # 9. Crear tabla Compone
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS compone (
                id_mod VARCHAR(50) NOT NULL REFERENCES modulo(id_mod) ON DELETE CASCADE,
                id_mat VARCHAR(50) NOT NULL REFERENCES materia_maestria(id_mat) ON DELETE CASCADE,
                PRIMARY KEY (id_mod, id_mat)
            );
        """))
        print("[OK] Tabla compone lista")

        # 10. Ajustar tabla Docente (columna Foto)
        conn.execute(text("""
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'docente' AND column_name = 'foto'
                ) THEN
                    ALTER TABLE docente ADD COLUMN foto TEXT;
                END IF;
            END $$;
        """))
        print("[OK] Tabla docente ajustada")

        # 11. Ajustar tabla Enseña para permitir (id_doc, id_edicion)
        conn.execute(text("""
            DO $$ 
            BEGIN
                ALTER TABLE enseña ALTER COLUMN id_mat DROP NOT NULL;
                ALTER TABLE enseña ALTER COLUMN fecha_asignacion DROP NOT NULL;
                ALTER TABLE enseña ALTER COLUMN rol DROP NOT NULL;
                ALTER TABLE enseña ALTER COLUMN rol SET DEFAULT 'Titular';
            EXCEPTION WHEN OTHERS THEN
                NULL;
            END $$;
        """))
        print("[OK] Tabla enseña ajustada")

        # 12. Crear tabla Usuarios
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id_usuario BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'usuario')),
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
            );
        """))
        print("[OK] Tabla usuarios lista")

    print("\n¡Migración y ajuste de base de datos completada con éxito!")

if __name__ == '__main__':
    run_migration()
