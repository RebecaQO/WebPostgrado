from flask import Blueprint
from controllers.docente_controller import DocenteController

docente_bp = Blueprint('docente', __name__)

docente_bp.get("/api/docentes")(DocenteController.get_public_docentes)
docente_bp.get("/api/admin/docentes")(DocenteController.admin_docentes)
docente_bp.post("/api/admin/docentes")(DocenteController.create_docente)
docente_bp.put("/api/admin/docentes/<id_doc>")(DocenteController.update_docente)
docente_bp.delete("/api/admin/docentes/<id_doc>")(DocenteController.delete_docente)
