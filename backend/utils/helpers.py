from werkzeug.security import check_password_hash
from config import LEGACY_LOGIN_PASSWORDS

def normalize_user_role(raw_role):
    if not raw_role:
        return "estudiante"
    value = str(raw_role).strip().lower()
    if value in {"admin", "administrador", "administrador_general", "administrador_academico"}:
        return "admin"
    if value in {"docente", "teacher", "profesor"}:
        return "docente"
    return "estudiante"

def verify_login_password(raw_hash, salt, password):
    if not raw_hash:
        return False

    # Check 1: Direct Werkzeug hash check
    try:
        if check_password_hash(raw_hash, password):
            return True
    except Exception:
        pass

    # Check 2: Werkzeug check with salt string (legacy records)
    if salt:
        try:
            if check_password_hash(raw_hash, f"{password}{salt}"):
                return True
        except Exception:
            pass

    # Check 3: Plain text match
    if raw_hash == password:
        return True

    # Check 4: Legacy dev accounts (hash_ejemplo_X)
    if raw_hash.startswith("hash_ejemplo_"):
        if password in ["admin123", "Admin123!", "docente123", "Docente123!", "estudiante123", "Estudiante123!", "123456", "admin", "password"]:
            return True
        expected = LEGACY_LOGIN_PASSWORDS.get(password) or LEGACY_LOGIN_PASSWORDS.get(password.lower())
        if expected is not None:
            return True

    return False

def map_program_type(tipo):
    tipo = (tipo or "").strip().lower()
    if tipo == "terminal":
        return "terminal"
    if tipo == "autofinanciada":
        return "autofinanciada"
    if tipo == "convenio":
        return "convenio"
    return "maestria"

def type_label(tipo):
    if tipo == "Terminal":
        return "Maestría"
    if tipo == "Autofinanciada":
        return "Maestría"
    if tipo == "Convenio":
        return "Convenio"
    return "Diplomado"

def degree_label(tipo):
    if tipo in ("Terminal", "Autofinanciada"):
        return "M.Sc. en Estadística"
    return "Diplomado Certificado UMSA"

def duration_label(tipo, credits):
    if tipo == "Terminal":
        return "24 meses"
    if tipo == "Autofinanciada":
        return "18 meses"
    return "6 meses"
