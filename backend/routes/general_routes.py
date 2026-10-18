from flask import Blueprint
from controllers.general_controller import GeneralController

general_bp = Blueprint('general', __name__)

general_bp.get("/api/health")(GeneralController.health_check)
general_bp.get("/images/<path:filename>")(GeneralController.serve_images)
general_bp.get("/api/images/docentes/<filename>")(GeneralController.serve_docente_image)
general_bp.post("/api/admin/docentes/upload-foto")(GeneralController.upload_foto_docente)
