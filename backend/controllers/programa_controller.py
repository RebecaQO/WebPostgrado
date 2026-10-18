from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.programa_model import ProgramaModel

class ProgramaController:
    @staticmethod
    def get_programas():
        try:
            programas = ProgramaModel.get_all()
            return jsonify(programas)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo consultar los programas", "message": str(exc)}), 500

    @staticmethod
    def get_programas_activos():
        try:
            activos = ProgramaModel.get_activos()
            return jsonify(activos)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo consultar los programas activos", "message": str(exc)}), 500

    @staticmethod
    def get_programa_by_id(program_id):
        try:
            detalle = ProgramaModel.get_detalle_completo(program_id)
            if not detalle:
                return jsonify({"error": "Programa no encontrado"}), 404
            return jsonify(detalle)
        except SQLAlchemyError as exc:
            return jsonify({"error": "Error al consultar programa", "message": str(exc)}), 500

    @staticmethod
    def get_programa_malla(program_id):
        return ProgramaController.get_programa_by_id(program_id)

    @staticmethod
    def admin_programas():
        try:
            programas = ProgramaModel.get_all()
            return jsonify({"items": programas})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudieron listar programas", "message": str(exc)}), 500

    @staticmethod
    def create_programa():
        payload = request.get_json(silent=True) or {}
        try:
            id_programa = ProgramaModel.create(payload)
            return jsonify({"success": True, "id": id_programa, "message": "Programa guardado correctamente"})
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo guardar el programa", "message": str(exc)}), 500

    @staticmethod
    def update_programa(program_id):
        payload = request.get_json(silent=True) or {}
        try:
            ProgramaModel.update(program_id, payload)
            return jsonify({"success": True, "id": program_id, "message": "Programa actualizado"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo actualizar el programa", "message": str(exc)}), 500

    @staticmethod
    def delete_programa(program_id):
        try:
            ProgramaModel.delete(program_id)
            return jsonify({"success": True, "message": f"Programa {program_id} eliminado correctamente"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar el programa", "message": str(exc)}), 500

    @staticmethod
    def update_program_status(program_id):
        payload = request.get_json(silent=True) or {}
        nuevo_estado = payload.get("estado")
        if nuevo_estado not in {"Activo", "Inactivo", "En reforma"}:
            return jsonify({"error": "Estado inválido"}), 400

        try:
            ProgramaModel.update_status(program_id, nuevo_estado)
            return jsonify({"success": True, "id": program_id, "estado": nuevo_estado})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo actualizar el estado", "message": str(exc)}), 500

    @staticmethod
    def concluir_programa_a_historial(program_id):
        try:
            id_conv, nombre_prog = ProgramaModel.concluir(program_id)
            if not id_conv:
                return jsonify({"error": nombre_prog}), 404
            return jsonify({
                "success": True, 
                "id_convocatoria": id_conv,
                "message": f"Edición del programa {nombre_prog} concluida y archivada en Convocatorias Pasadas exitosamente."
            })
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo concluir la edición del programa", "message": str(exc)}), 500

    @staticmethod
    def admin_get_modulos(program_id):
        try:
            data = ProgramaModel.get_modulos(program_id)
            return jsonify(data)
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudieron obtener los módulos", "message": str(exc)}), 500

    @staticmethod
    def admin_create_modulo():
        payload = request.get_json(silent=True) or {}
        try:
            id_mod, nombre_mod = ProgramaModel.create_modulo(payload)
            return jsonify({"success": True, "id_mod": id_mod, "nombre_mod": nombre_mod})
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo crear el módulo", "message": str(exc)}), 500

    @staticmethod
    def admin_delete_modulo(id_mod):
        try:
            ProgramaModel.delete_modulo(id_mod)
            return jsonify({"success": True, "message": "Módulo eliminado"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar el módulo", "message": str(exc)}), 500

    @staticmethod
    def admin_create_materia():
        payload = request.get_json(silent=True) or {}
        try:
            id_mat, nombre_mat = ProgramaModel.create_materia(payload)
            return jsonify({"success": True, "id_mat": id_mat, "nombre_mat": nombre_mat})
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo guardar la materia", "message": str(exc)}), 500

    @staticmethod
    def admin_delete_materia(id_mat):
        try:
            ProgramaModel.delete_materia(id_mat)
            return jsonify({"success": True, "message": "Materia eliminada"})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo eliminar la materia", "message": str(exc)}), 500

    @staticmethod
    def admin_get_materias():
        try:
            materias = ProgramaModel.get_all_materias()
            return jsonify(materias)
        except Exception as exc:
            return jsonify({"error": "No se pudieron obtener las materias", "message": str(exc)}), 500

    @staticmethod
    def get_mallas():
        id_prog = request.args.get("id_programa")
        try:
            mallas = ProgramaModel.get_mallas_by_programa(id_prog)
            return jsonify(mallas)
        except SQLAlchemyError as exc:
            return jsonify({"error": "Error al obtener mallas curriculares", "message": str(exc)}), 500

    @staticmethod
    def get_wizard_data(program_id):
        try:
            data = ProgramaModel.get_wizard_data(program_id)
            if not data:
                return jsonify({"error": "Programa no encontrado"}), 404
            return jsonify(data)
        except SQLAlchemyError as exc:
            return jsonify({"error": "Error al consultar datos de edición", "message": str(exc)}), 500

    @staticmethod
    def save_wizard_program():
        payload = request.get_json(silent=True) or {}
        try:
            prog_id = ProgramaModel.save_wizard_program(payload)
            return jsonify({
                "success": True,
                "id": prog_id,
                "message": f"Programa y edición {prog_id} guardados exitosamente en la base de datos"
            })
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo guardar la estructura académica", "message": str(exc)}), 500

