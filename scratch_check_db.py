import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from backend.app import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("=== TABLAS Y COLUMNAS ===")
    cols = conn.execute(text("""
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        ORDER BY table_name, ordinal_position
    """)).fetchall()
    curr_tab = None
    for row in cols:
        if row[0] != curr_tab:
            curr_tab = row[0]
            print(f"\n--- {curr_tab} ---")
        print(f"  {row[1]}: {row[2]}")
