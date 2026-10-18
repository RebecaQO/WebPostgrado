import sys
sys.path.append('backend')
from config import engine
from sqlalchemy import text

with engine.connect() as conn:
    tables = [r[0] for r in conn.execute(text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)).fetchall()]
    print('Existing tables in DB:', tables)
    for t in ['programa_postgrado', 'edicion_programa', 'malla_curricular', 'modulo', 'materia', 'materia_maestria', 'modulo_diplomado', 'integra', 'compone', 'defensa_tesis', 'docente', 'enseña', 'usuarios']:
        cols = [r[0] for r in conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{t}'")).fetchall()]
        print(f"Columns in {t}:", cols)
