from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.usuario_model import UsuarioModel

class UsuarioController:
    @staticmethod
    def admin_usuarios():
        try:
            usuarios = UsuarioModel.get_all()
            return jsonify(usuarios)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo listar usuarios", "message": str(exc)}), 500

    @staticmethod
    def update_usuario_estado(id_usuario):
        payload = request.get_json(silent=True) or {}
        nuevo_estado = payload.get("estado")
        if nuevo_estado not in {"Activo", "Inactivo", "Bloqueado", "Pendiente"}:
            return jsonify({"error": "Estado inválido"}), 400

        try:
            UsuarioModel.update_estado(id_usuario, nuevo_estado)
            return jsonify({"success": True, "id": id_usuario, "estado": nuevo_estado})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo actualizar usuario", "message": str(exc)}), 500

    @staticmethod
    def delete_usuario(id_usuario):
        try:
            UsuarioModel.delete(id_usuario)
            return jsonify({"success": True, "message": "Usuario eliminado"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar usuario", "message": str(exc)}), 500

    @staticmethod
    def admin_roles():
        try:
            roles = UsuarioModel.get_roles()
            return jsonify(roles)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo listar roles", "message": str(exc)}), 500

    @staticmethod
    def create_usuario():
        payload = request.get_json(silent=True) or {}
        try:
            id_usuario, email, tipo = UsuarioModel.create(payload)
            return jsonify({
                "success": True, 
                "id_usuario": id_usuario, 
                "email": email, 
                "tipo": tipo, 
                "message": "Usuario guardado correctamente en la BD"
            })
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo crear el usuario en la BD", "message": str(exc)}), 500
