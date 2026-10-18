from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.institucion_model import InstitucionModel

class InstitucionController:
    @staticmethod
    def get_informacion_carrera():
        try:
            info = InstitucionModel.get_info()
            return jsonify(info)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo obtener información de la carrera", "message": str(exc)}), 500

    @staticmethod
    def update_informacion_carrera():
        payload = request.get_json(silent=True) or {}
        try:
            InstitucionModel.update_info(payload)
            return jsonify({"success": True, "message": "Información de la carrera actualizada correctamente en Neon DB"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo actualizar la información de la carrera", "message": str(exc)}), 500
