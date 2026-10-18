from routes.general_routes import general_bp
from routes.auth_routes import auth_bp
from routes.programa_routes import programa_bp
from routes.usuario_routes import usuario_bp
from routes.docente_routes import docente_bp
from routes.convocatoria_routes import convocatoria_bp
from routes.institucion_routes import institucion_bp
from routes.defensa_routes import defensa_bp

def register_routes(app):
    """
    Registra todos los Blueprints del backend en la aplicación Flask
    """
    app.register_blueprint(general_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(programa_bp)
    app.register_blueprint(usuario_bp)
    app.register_blueprint(docente_bp)
    app.register_blueprint(convocatoria_bp)
    app.register_blueprint(institucion_bp)
    app.register_blueprint(defensa_bp)
