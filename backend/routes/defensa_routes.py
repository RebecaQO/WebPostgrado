from flask import Blueprint
from controllers.defensa_controller import DefensaController

defensa_bp = Blueprint('defensa', __name__)

defensa_bp.get("/api/defensas-tesis")(DefensaController.get_defensas_tesis)
defensa_bp.post("/api/admin/defensas-tesis")(DefensaController.save_defensa_tesis)
defensa_bp.delete("/api/admin/defensas-tesis/<id_tit>")(DefensaController.delete_defensa_tesis)
