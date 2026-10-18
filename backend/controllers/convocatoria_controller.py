from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.convocatoria_model import ConvocatoriaModel

class ConvocatoriaController:
    @staticmethod
    def get_convocatorias_pasadas():
        try:
            convocatorias = ConvocatoriaModel.get_all()
            return jsonify(convocatorias)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudieron listar convocatorias pasadas", "message": str(exc)}), 500

    @staticmethod
    def create_convocatoria_pasada():
        payload = request.get_json(silent=True) or {}
        try:
            id_conv = ConvocatoriaModel.create(payload)
            return jsonify({"success": True, "id": id_conv, "message": "Convocatoria histórica guardada"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo guardar la convocatoria pasada", "message": str(exc)}), 500

    @staticmethod
    def sincronizar_ediciones_concluidas():
        try:
            sync_count = ConvocatoriaModel.sincronizar_ediciones()
            return jsonify({
                "success": True,
                "count": sync_count,
                "message": f"Se sincronizaron automáticamente {sync_count} ediciones en el historial de convocatorias pasadas."
            })
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudieron sincronizar las ediciones", "message": str(exc)}), 500

    @staticmethod
    def delete_convocatoria_pasada(id_conv):
        try:
            ConvocatoriaModel.delete(id_conv)
            return jsonify({"success": True, "message": "Convocatoria eliminada correctamente"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar convocatoria", "message": str(exc)}), 500
