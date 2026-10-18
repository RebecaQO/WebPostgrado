import os
import hashlib
from sqlalchemy import text
from werkzeug.security import generate_password_hash
from config import engine

class UsuarioModel:
    @staticmethod
    def get_all():
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT id_usuario, email, tipo_usuario, estado, email_verificado, id_rol, fecha_creacion
                    FROM usuario
                    ORDER BY fecha_creacion DESC
                    """
                )
            ).mappings().all()
            return [{
                "id": row["id_usuario"],
                "email": row["email"],
                "tipo": row["tipo_usuario"],
                "estado": row["estado"],
                "email_verificado": row["email_verificado"],
                "rol": row["id_rol"],
                "fecha_creacion": row["fecha_creacion"].isoformat() if row["fecha_creacion"] else None,
            } for row in rows]

    @staticmethod
    def update_estado(id_usuario, nuevo_estado):
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE usuario SET estado = :estado WHERE id_usuario = :id"),
                {"estado": nuevo_estado, "id": id_usuario}
            )

    @staticmethod
    def delete(id_usuario):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM usuario WHERE id_usuario = :id"), {"id": id_usuario})

    @staticmethod
    def get_roles():
        with engine.connect() as conn:
            rows = conn.execute(
                text("SELECT id_rol, nombre_rol, descripcion, nivel FROM rol ORDER BY nivel DESC")
            ).mappings().all()
            return [
                {
                    "id": row["id_rol"],
                    "nombre": row["nombre_rol"],
                    "descripcion": row["descripcion"],
                    "nivel": row["nivel"],
                }
                for row in rows
            ]

    @staticmethod
    def create(payload):
        email = (payload.get("email") or "").strip().lower()
        tipo = payload.get("tipo") or "Estudiante"
        rol = payload.get("rol")
        password = payload.get("password") or ""

        if not email or not password:
            raise ValueError("Debe proporcionar correo y contraseña")

        if not rol:
            if tipo == "Administrador":
                rol = "ROL-001"
            elif tipo == "Docente":
                rol = "ROL-003"
            elif tipo == "Postulante":
                rol = "ROL-005"
            else:
                rol = "ROL-004"

        password_salt = hashlib.sha256(os.urandom(16)).hexdigest()
        password_hash = generate_password_hash(password)
        id_usuario = f"USR-{hashlib.sha1(email.encode('utf-8')).hexdigest()[:8].upper()}"

        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO usuario (id_usuario, email, password_hash, password_salt, tipo_usuario, estado, email_verificado, id_rol)
                    VALUES (:id_usuario, :email, :password_hash, :password_salt, :tipo, :estado, :email_verificado, :rol)
                    ON CONFLICT (id_usuario) DO UPDATE SET
                        email = EXCLUDED.email,
                        password_hash = EXCLUDED.password_hash,
                        password_salt = EXCLUDED.password_salt,
                        tipo_usuario = EXCLUDED.tipo_usuario,
                        estado = EXCLUDED.estado,
                        id_rol = EXCLUDED.id_rol
                    """
                ),
                {
                    "id_usuario": id_usuario,
                    "email": email,
                    "password_hash": password_hash,
                    "password_salt": password_salt,
                    "tipo": tipo,
                    "estado": "Activo",
                    "email_verificado": True,
                    "rol": rol,
                },
            )

            if tipo == "Administrador":
                nombre_def = email.split("@")[0].capitalize()
                conn.execute(
                    text(
                        """
                        INSERT INTO perfil_administrador (id_usuario, nombre, apellido, nivel_acceso, departamento, fecha_asignacion)
                        VALUES (:id_u, :nom, 'Administración', 'Supervisor', 'Posgrado Estadística', CURRENT_DATE)
                        ON CONFLICT (id_usuario) DO UPDATE SET nivel_acceso = EXCLUDED.nivel_acceso
                        """
                    ),
                    {"id_u": id_usuario, "nom": nombre_def}
                )

        return id_usuario, email, tipo
