from flask import Blueprint
from controllers.convocatoria_controller import ConvocatoriaController

convocatoria_bp = Blueprint('convocatoria', __name__)

convocatoria_bp.get("/api/convocatorias-pasadas")(ConvocatoriaController.get_convocatorias_pasadas)
convocatoria_bp.post("/api/admin/convocatorias-pasadas")(ConvocatoriaController.create_convocatoria_pasada)
convocatoria_bp.post("/api/admin/convocatorias-pasadas/sincronizar-ediciones")(ConvocatoriaController.sincronizar_ediciones_concluidas)
convocatoria_bp.delete("/api/admin/convocatorias-pasadas/<id_conv>")(ConvocatoriaController.delete_convocatoria_pasada)
