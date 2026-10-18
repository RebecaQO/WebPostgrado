import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Cargar variables de entorno
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_Vs6GbIoDc2Hz@ep-lively-unit-anzrd32r-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
IMAGES_DIR = os.path.join(BASE_DIR, 'images')
DOCENTES_UPLOAD_DIR = os.path.join(IMAGES_DIR, 'docentes')
os.makedirs(DOCENTES_UPLOAD_DIR, exist_ok=True)

# Motor de conexión a la Base de Datos
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Credenciales históricas/desarrollo de respaldo
LEGACY_LOGIN_PASSWORDS = {
    "admin@umsa.bo": "Admin123!",
    "cmamani@umsa.bo": "Docente123!",
    "arojas@umsa.bo": "Docente123!",
    "mtorres@email.com": "Estudiante123!",
    "lgutierrez@email.com": "Estudiante123!",
    "postulante@email.com": "Postulante123!",
}
