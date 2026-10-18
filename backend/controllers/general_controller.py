import os
import hashlib
from flask import jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from config import engine, IMAGES_DIR, DOCENTES_UPLOAD_DIR

class GeneralController:
    @staticmethod
    def health_check():
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return jsonify({"status": "ok", "database": "connected"})
        except SQLAlchemyError as exc:
            return jsonify({"status": "error", "database": "disconnected", "message": str(exc)}), 500

    @staticmethod
    def serve_images(filename):
        return send_from_directory(IMAGES_DIR, filename)

    @staticmethod
    def serve_docente_image(filename):
        return send_from_directory(DOCENTES_UPLOAD_DIR, filename)

    @staticmethod
    def upload_foto_docente():
        if 'foto' not in request.files:
            return jsonify({"error": "No se envió ningún archivo de imagen"}), 400
        file = request.files['foto']
        if not file or file.filename == '':
            return jsonify({"error": "Nombre de archivo vacío"}), 400

        filename = secure_filename(file.filename)
        extension = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'jpg'
        if extension not in {'png', 'jpg', 'jpeg', 'webp', 'gif'}:
            return jsonify({"error": "Formato de imagen inválido. Solo se admiten JPG, PNG o WebP"}), 400

        unique_filename = f"doc_{hashlib.sha1(os.urandom(16)).hexdigest()[:10]}.{extension}"
        save_path = os.path.join(DOCENTES_UPLOAD_DIR, unique_filename)
        file.save(save_path)

        url = f"/api/images/docentes/{unique_filename}"
        return jsonify({"success": True, "url": url, "filename": unique_filename})
