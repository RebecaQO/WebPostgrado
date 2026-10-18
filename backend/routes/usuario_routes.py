from flask import Blueprint
from controllers.usuario_controller import UsuarioController

usuario_bp = Blueprint('usuario', __name__)

usuario_bp.get("/api/admin/usuarios")(UsuarioController.admin_usuarios)
usuario_bp.post("/api/admin/usuarios")(UsuarioController.create_usuario)
usuario_bp.patch("/api/admin/usuarios/<id_usuario>/estado")(UsuarioController.update_usuario_estado)
usuario_bp.delete("/api/admin/usuarios/<id_usuario>")(UsuarioController.delete_usuario)
usuario_bp.get("/api/admin/roles")(UsuarioController.admin_roles)
