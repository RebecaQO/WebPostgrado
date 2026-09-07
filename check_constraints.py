import os
import sqlalchemy
from sqlalchemy import text

db_url = 'postgresql://neondb_owner:npg_Vs6GbIoDc2Hz@ep-lively-unit-anzrd32r-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
engine = sqlalchemy.create_engine(db_url)

with engine.begin() as conn:
    print('--- CONSTRAINTS ---')
    cons = conn.execute(text("""
        SELECT conname, pg_get_constraintdef(c.oid) 
        FROM pg_constraint c 
        JOIN pg_class t ON c.conrelid = t.oid 
        WHERE t.relname = 'edicion_programa'
    """)).fetchall()
    for c in cons:
        print(c)

    # Let's drop the old constraint and re-add it with 'Concluido', 'Finalizado', 'Cerrado', 'Inactivo', 'Activo', 'Planificada', 'En curso'
    conn.execute(text("ALTER TABLE edicion_programa DROP CONSTRAINT IF EXISTS edicion_programa_estado_check;"))
    conn.execute(text("""
        ALTER TABLE edicion_programa ADD CONSTRAINT edicion_programa_estado_check 
        CHECK (estado IN ('Activo', 'Inactivo', 'Concluido', 'Finalizado', 'Cerrado', 'Planificada', 'En curso'));
    """))
    print('Constraint edicion_programa_estado_check updated successfully!')
