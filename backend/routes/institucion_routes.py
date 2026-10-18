from flask import Blueprint
from controllers.institucion_controller import InstitucionController

institucion_bp = Blueprint('institucion', __name__)

institucion_bp.get("/api/institucion/info")(InstitucionController.get_informacion_carrera)
institucion_bp.put("/api/admin/institucion/info")(InstitucionController.update_informacion_carrera)
