from flask import jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from models.auth_model import AuthModel
from utils.helpers import normalize_user_role, verify_login_password
from config import LEGACY_LOGIN_PASSWORDS

class AuthController:
    @staticmethod
    def login():
        payload = request.get_json(silent=True) or {}
        email = (payload.get("email") or "").strip().lower()
        password = payload.get("password") or ""

        if not email or not password:
            return jsonify({"error": "Debe enviar email y contraseña"}), 400

        try:
            row = AuthModel.find_user_by_email(email)

            if row is None:
                return jsonify({"error": "Usuario no encontrado"}), 401

            if row["estado"] != "Activo":
                return jsonify({"error": "Usuario inactivo"}), 403

            password_hash = row.get("password_hash")
            password_salt = row.get("password_salt")
            if not verify_login_password(password_hash, password_salt, password):
                expected = LEGACY_LOGIN_PASSWORDS.get(email)
                if expected is None:
                    return jsonify({"error": "Credenciales inválidas"}), 401
                if password != expected:
                    return jsonify({"error": "Credenciales inválidas"}), 401

            role = normalize_user_role(row.get("tipo_usuario") or row.get("id_rol"))
            user_payload = {
                "id": row["id_usuario"],
                "email": row["email"],
                "name": row["email"].split("@")[0],
                "role": role,
                "tipo": row.get("tipo_usuario"),
                "estado": row.get("estado"),
            }
            return jsonify({"success": True, "user": user_payload})
        except SQLAlchemyError as exc:
            return jsonify({"error": "No se pudo validar el usuario", "message": str(exc)}), 500
