import sys
sys.path.append('backend')
from config import engine
from sqlalchemy import text

with engine.connect() as conn:
    for t in ['maestria', 'diplomado', 'modulo', 'materia', 'enseña', 'edicion_programa']:
        cols = conn.execute(text(f"""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = '{t}'
        """)).fetchall()
        print(f"\n--- {t} ---")
        for c in cols:
            print(f"  {c[0]} ({c[1]}, nullable={c[2]})")
