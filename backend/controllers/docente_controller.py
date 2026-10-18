from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.docente_model import DocenteModel

class DocenteController:
    @staticmethod
    def get_public_docentes():
        try:
            docentes = DocenteModel.get_public()
            return jsonify(docentes)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo listar docentes", "message": str(exc)}), 500

    @staticmethod
    def admin_docentes():
        try:
            docentes = DocenteModel.get_admin()
            return jsonify(docentes)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo listar docentes", "message": str(exc)}), 500

    @staticmethod
    def create_docente():
        payload = request.get_json(silent=True) or {}
        try:
            id_doc = DocenteModel.create(payload)
            return jsonify({"success": True, "id": id_doc, "message": "Docente guardado correctamente"})
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo guardar docente", "message": str(exc)}), 500

    @staticmethod
    def update_docente(id_doc):
        payload = request.get_json(silent=True) or {}
        try:
            DocenteModel.update(id_doc, payload)
            return jsonify({"success": True, "id": id_doc, "message": "Docente actualizado correctamente"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo actualizar docente", "message": str(exc)}), 500

    @staticmethod
    def delete_docente(id_doc):
        try:
            DocenteModel.delete(id_doc)
            return jsonify({"success": True, "message": f"Docente {id_doc} eliminado"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar docente", "message": str(exc)}), 500
