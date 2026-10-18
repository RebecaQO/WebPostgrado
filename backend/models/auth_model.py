from sqlalchemy import text
from config import engine

class AuthModel:
    @staticmethod
    def find_user_by_email(email):
        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT id_usuario, email, tipo_usuario, estado, password_hash, password_salt, id_rol FROM usuario WHERE LOWER(email) = LOWER(:email) LIMIT 1"),
                {"email": email},
            ).mappings().first()
            return row
