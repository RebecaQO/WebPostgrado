import os
import sys

# Asegurar que el directorio backend esté en el sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from config import (
    engine,
    DATABASE_URL,
    BASE_DIR,
    IMAGES_DIR,
    DOCENTES_UPLOAD_DIR,
    LEGACY_LOGIN_PASSWORDS,
)
from routes import register_routes
from models.programa_model import ProgramaModel
from utils.helpers import (
    normalize_user_role as _normalize_user_role,
    verify_login_password as _verify_login_password,
    map_program_type as _map_program_type,
    type_label as _type_label,
    degree_label as _degree_label,
    duration_label as _duration_label,
)

def create_app():
    """
    Application Factory para inicializar Flask con configuración y rutas MVC.
    """
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}, r"/images/*": {"origins": "*"}})

    # Registrar todos los Blueprints de Rutas
    register_routes(app)

    return app

# Instancia principal expuesta para Gunicorn (Procfile: web: gunicorn --chdir backend app:app)
app = create_app()

# Re-exportaciones para compatibilidad con scripts existentes
get_programas_response = ProgramaModel.get_all
get_programa_detalle_completo = ProgramaModel.get_detalle_completo

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
