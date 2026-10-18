from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.defensa_model import DefensaModel

class DefensaController:
    @staticmethod
    def get_defensas_tesis():
        try:
            defensas = DefensaModel.get_all()
            return jsonify(defensas)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudieron listar las defensas de tesis", "message": str(exc)}), 500

    @staticmethod
    def save_defensa_tesis():
        payload = request.get_json(silent=True) or {}
        try:
            id_tit = DefensaModel.save(payload)
            return jsonify({"success": True, "id": id_tit, "message": "Defensa de tesis guardada en Neon DB"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo guardar la defensa de tesis", "message": str(exc)}), 500

    @staticmethod
    def delete_defensa_tesis(id_tit):
        try:
            DefensaModel.delete(id_tit)
            return jsonify({"success": True, "message": "Registro de defensa eliminado correctamente"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar la defensa", "message": str(exc)}), 500
