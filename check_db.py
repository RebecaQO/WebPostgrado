import os
import sqlalchemy
from sqlalchemy import text

db_url = 'postgresql://neondb_owner:npg_Vs6GbIoDc2Hz@ep-lively-unit-anzrd32r-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
engine = sqlalchemy.create_engine(db_url)

with engine.connect() as conn:
    print('=== CONVOCATORIA_PASADA COLUMNS ===')
    for r in conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'convocatoria_pasada'")).fetchall():
        print(r)
    print('=== EDICION_PROGRAMA COLUMNS ===')
    for r in conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'edicion_programa'")).fetchall():
        print(r)
    print('=== PROGRAMA_POSTGRADO COLUMNS ===')
    for r in conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'programa_postgrado'")).fetchall():
        print(r)
    print('=== CONVOCATORIAS PASADAS DATA ===')
    for r in conn.execute(text("SELECT * FROM convocatoria_pasada")).mappings().fetchall():
        print(dict(r))
    print('=== EDICIONES DATA ===')
    for r in conn.execute(text("SELECT * FROM edicion_programa")).mappings().fetchall():
        print(dict(r))
