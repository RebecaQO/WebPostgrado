from flask import Blueprint
from controllers.programa_controller import ProgramaController

programa_bp = Blueprint('programa', __name__)

# Rutas públicas
programa_bp.get("/api/programas")(ProgramaController.get_programas)
programa_bp.get("/api/programas/activos")(ProgramaController.get_programas_activos)
programa_bp.get("/api/programas/<program_id>")(ProgramaController.get_programa_by_id)
programa_bp.get("/api/programas/<program_id>/malla")(ProgramaController.get_programa_malla)

# Rutas de administración de programas
programa_bp.get("/api/admin/programas")(ProgramaController.admin_programas)
programa_bp.post("/api/admin/programas")(ProgramaController.create_programa)
programa_bp.put("/api/admin/programas/<program_id>")(ProgramaController.update_programa)
programa_bp.delete("/api/admin/programas/<program_id>")(ProgramaController.delete_programa)
programa_bp.patch("/api/admin/programas/<program_id>/estado")(ProgramaController.update_program_status)
programa_bp.post("/api/admin/programas/<program_id>/concluir")(ProgramaController.concluir_programa_a_historial)

# Rutas de módulos y materias
programa_bp.get("/api/admin/programas/<program_id>/modulos")(ProgramaController.admin_get_modulos)
programa_bp.post("/api/admin/modulos")(ProgramaController.admin_create_modulo)
programa_bp.delete("/api/admin/modulos/<id_mod>")(ProgramaController.admin_delete_modulo)
programa_bp.post("/api/admin/materias")(ProgramaController.admin_create_materia)
programa_bp.delete("/api/admin/materias/<id_mat>")(ProgramaController.admin_delete_materia)

# Rutas del Asistente Académico / Editor Fijo (5 Pasos)
programa_bp.get("/api/admin/mallas")(ProgramaController.get_mallas)
programa_bp.get("/api/admin/programas/<program_id>/wizard-data")(ProgramaController.get_wizard_data)
programa_bp.post("/api/admin/programas/wizard-save")(ProgramaController.save_wizard_program)

