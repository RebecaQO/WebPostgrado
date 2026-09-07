import os
import hashlib
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_Vs6GbIoDc2Hz@ep-lively-unit-anzrd32r-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
IMAGES_DIR = os.path.join(BASE_DIR, 'images')
DOCENTES_UPLOAD_DIR = os.path.join(IMAGES_DIR, 'docentes')
os.makedirs(DOCENTES_UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}, r"/images/*": {"origins": "*"}})

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

LEGACY_LOGIN_PASSWORDS = {
    "admin@umsa.bo": "Admin123!",
    "cmamani@umsa.bo": "Docente123!",
    "arojas@umsa.bo": "Docente123!",
    "mtorres@email.com": "Estudiante123!",
    "lgutierrez@email.com": "Estudiante123!",
    "postulante@email.com": "Postulante123!",
}


def _normalize_user_role(raw_role):
    if not raw_role:
        return "estudiante"
    value = str(raw_role).strip().lower()
    if value in {"admin", "administrador", "administrador_general", "administrador_academico"}:
        return "admin"
    if value in {"docente", "teacher", "profesor"}:
        return "docente"
    return "estudiante"


def _verify_login_password(raw_hash, salt, password):
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


@app.get("/api/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return jsonify({"status": "ok", "database": "connected"})
    except SQLAlchemyError as exc:
        return jsonify({"status": "error", "database": "disconnected", "message": str(exc)}), 500


@app.get("/images/<path:filename>")
def serve_images(filename):
    return send_from_directory(IMAGES_DIR, filename)


@app.get("/api/images/docentes/<filename>")
def serve_docente_image(filename):
    return send_from_directory(DOCENTES_UPLOAD_DIR, filename)


@app.post("/api/admin/docentes/upload-foto")
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


@app.post("/api/auth/login")
def login_usuario():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Debe enviar email y contraseña"}), 400

    try:
        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT id_usuario, email, tipo_usuario, estado, password_hash, password_salt, id_rol FROM usuario WHERE LOWER(email) = LOWER(:email) LIMIT 1"),
                {"email": email},
            ).mappings().first()

        if row is None:
            return jsonify({"error": "Usuario no encontrado"}), 401

        if row["estado"] != "Activo":
            return jsonify({"error": "Usuario inactivo"}), 403

        password_hash = row.get("password_hash")
        password_salt = row.get("password_salt")
        if not _verify_login_password(password_hash, password_salt, password):
            expected = LEGACY_LOGIN_PASSWORDS.get(email)
            if expected is None:
                return jsonify({"error": "Credenciales inválidas"}), 401
            if password != expected:
                return jsonify({"error": "Credenciales inválidas"}), 401

        role = _normalize_user_role(row.get("tipo_usuario") or row.get("id_rol"))
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


@app.get("/api/programas")
def get_programas():
    try:
        programas = get_programas_response()
        return jsonify(programas)
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo consultar los programas", "message": str(exc)}), 500


@app.get("/api/programas/activos")
def get_programas_activos():
    programas = get_programas_response()
    activos = [p for p in programas if p.get("status") == "Activo"]
    return jsonify(activos)


@app.get("/api/programas/<program_id>")
def get_programa_by_id(program_id):
    detalle = get_programa_detalle_completo(program_id)
    if not detalle:
        return jsonify({"error": "Programa no encontrado"}), 404
    return jsonify(detalle)


@app.get("/api/programas/<program_id>/malla")
def get_programa_malla(program_id):
    detalle = get_programa_detalle_completo(program_id)
    if not detalle:
        return jsonify({"error": "Programa no encontrado"}), 404
    return jsonify(detalle)


def get_programa_detalle_completo(program_id):
    programas = get_programas_response()
    prog = next((p for p in programas if p["id"] == program_id), None)
    if not prog:
        return None

    # Consultar módulos y materias de la BD
    with engine.connect() as conn:
        mod_rows = conn.execute(
            text(
                """
                SELECT 
                    mo.id_mod,
                    mo.nombre_mod,
                    mat.id_mat,
                    mat.nombre_mat,
                    mat.creditos,
                    mat.carga_horaria,
                    mat.descripcion,
                    mat.tipo,
                    mat.software_requerido,
                    (
                        SELECT string_agg(d.nombre_doc || ' ' || d.apellido_doc, ', ')
                        FROM enseña en
                        JOIN docente d ON en.id_doc = d.id_doc
                        WHERE en.id_mat = mat.id_mat
                    ) AS docentes,
                    (
                        SELECT string_agg(pm2.nombre_mat, ', ')
                        FROM prerequisito_materia pr
                        JOIN materia pm2 ON pr.id_prerequisito = pm2.id_mat
                        WHERE pr.id_materia = mat.id_mat
                    ) AS prerequisitos
                FROM modulo mo
                JOIN edicion_programa ep ON mo.id_edicion = ep.id_edicion
                LEFT JOIN materia mat ON mat.id_mod = mo.id_mod
                WHERE ep.id_programa = :id_prog
                ORDER BY mo.id_mod, mat.id_mat
                """
            ),
            {"id_prog": program_id}
        ).mappings().all()

        # Horarios de la edición
        horario_rows = conn.execute(
            text(
                """
                SELECT h.dia_semana, h.hora_inicio, h.hora_fin, h.aula, h.tipo_turno
                FROM horario h
                JOIN edicion_programa ep ON h.id_edicion = ep.id_edicion
                WHERE ep.id_programa = :id_prog
                """
            ),
            {"id_prog": program_id}
        ).mappings().all()

        # Costos de edición
        ed_row = conn.execute(
            text(
                """
                SELECT costo_mensualidad, valor_matricula, periodo_academico, cupo_maximo, sede
                FROM edicion_programa
                WHERE id_programa = :id_prog
                ORDER BY fecha_inicio DESC LIMIT 1
                """
            ),
            {"id_prog": program_id}
        ).mappings().first()

    # Construir estructura de malla modular (sin mostrar docentes)
    modules_by_name = {}
    for r in mod_rows:
        mod_name = r["nombre_mod"]
        if mod_name not in modules_by_name:
            modules_by_name[mod_name] = []
        if r["id_mat"]:
            modules_by_name[mod_name].append({
                "code": r["id_mat"],
                "name": r["nombre_mat"],
                "credits": r["creditos"] or 4,
                "hours": r["carga_horaria"] or 64,
                "desc": r["descripcion"] or "Contenido curricular de especialidad estadística y computacional.",
                "type": r["tipo"] or "Teórico-Práctica",
                "software": r["software_requerido"] or "R, Python",
                "prerequisites": r["prerequisitos"] or "Ninguno"
            })

    # Solo incluimos módulos que existan en la Base de Datos
    curriculum = []
    if modules_by_name:
        for idx, (m_name, m_list) in enumerate(modules_by_name.items(), 1):
            curriculum.append({
                "semester": m_name,
                "modules": m_list if m_list else []
            })

    # Inversión
    matricula = float(prog.get("valor_matricula") if prog.get("valor_matricula") is not None else (float(ed_row["valor_matricula"]) if ed_row and ed_row["valor_matricula"] is not None else (0.0 if prog["typeFilter"] == "terminal" else 350.0)))
    mensualidad = float(prog.get("monto_cuota") or (float(ed_row["costo_mensualidad"]) if ed_row and ed_row["costo_mensualidad"] is not None else (0.0 if prog["typeFilter"] == "terminal" else 850.0)))
    meses = int(prog.get("numero_cuotas") or (18 if prog["type"] == "Maestría" else 6))
    descuento_contado = int(prog.get("descuento_contado_porcentaje") or 10)
    tuition = mensualidad * meses

    horarios = [
        {"dia": h["dia_semana"], "inicio": str(h["hora_inicio"]), "fin": str(h["hora_fin"]), "aula": h["aula"] or "Aula Magna", "turno": h["tipo_turno"]}
        for h in horario_rows
    ] if horario_rows else [
        {"dia": "Lunes a Jueves", "inicio": "19:00", "fin": "22:00", "aula": "Campus Cota Cota - FCPN / Virtual Síncrono", "turno": "Noche"}
    ]

    return {
        **prog,
        "curriculum": curriculum,
        "investment": {
            "tuitionBob": int(tuition),
            "matriculaBob": int(matricula),
            "monthlyBob": int(mensualidad),
            "cashDiscountPercent": descuento_contado,
            "maxInstallments": meses,
            "cuotaInitialBob": int(matricula),
            "cptCode": f"CPT-UMSA-{prog['id']}"
        },
        "targetAudience": prog.get("perfil_aspirante"),
        "graduateProfile": prog.get("perfil_egreso"),
        "requirements": prog.get("requisitos_admision"),
        "titulationOptions": prog.get("modalidad_titulacion"),
        "horarios": horarios
    }


@app.get("/api/admin/programas")
def admin_programas():
    programas = get_programas_response()
    return jsonify({"items": programas})


@app.post("/api/admin/programas")
def create_programa():
    payload = request.get_json(silent=True) or {}
    id_programa = (payload.get("id") or payload.get("id_programa") or "").strip()
    nombre = (payload.get("title") or payload.get("nombre_programa") or "").strip()
    descripcion = payload.get("description") or payload.get("descripcion") or ""
    area = payload.get("area") or payload.get("area_conocimiento") or "Ciencias Exactas"
    facultad = payload.get("faculty") or payload.get("facultad") or "FCPN-UMSA"
    creditos = int(payload.get("credits") or payload.get("creditos_totales") or 60)
    tipo = payload.get("tipo_programa") or payload.get("tipo") or "Autofinanciada"
    mencion = payload.get("mencion") or ""
    estado = payload.get("status") or payload.get("estado") or "Activo"
    resolucion = payload.get("resolution") or payload.get("resolucion_aprobacion_sub") or "CU-RES-2026-001"
    cupo_max = int(payload.get("cupo_total") or payload.get("cupo_maximo") or 25)

    enlace_drive = payload.get("enlace_convocatoria_drive") or "https://drive.google.com/drive/folders/1umsa_posgrado_estadistica_2026_convocatoria"
    enlace_pdf = payload.get("enlace_pdf_programa") or "https://drive.google.com/file/d/1_desc_programa_estadistica_fcpn_2026/view"
    enlace_form = payload.get("enlace_formulario_inscripcion") or "https://docs.google.com/forms/d/e/1FAIpQLSd_posgrado_estadistica_umsa_postulacion_2026/viewform"
    res_hcu = payload.get("resolucion_hcu") or "Resolución HCU N° 284/2024 - Aprobación Plena UMSA"
    desc_contado = int(payload.get("descuento_contado_porcentaje") or 10)
    num_cuotas = int(payload.get("numero_cuotas") or (6 if "diplomado" in nombre.lower() else 18))
    monto_cuota_val = float(payload.get("monto_cuota") or (600.0 if "diplomado" in nombre.lower() else 850.0))

    perfil_aspirante = payload.get("perfil_aspirante") or ""
    perfil_egreso = payload.get("perfil_egreso") or ""
    requisitos_admision = payload.get("requisitos_admision") or ""
    modalidad_titulacion = payload.get("modalidad_titulacion") or ""

    if not id_programa:
        id_programa = f"PG-EST-{hashlib.sha1(nombre.encode('utf-8')).hexdigest()[:4].upper()}"

    if not nombre:
        return jsonify({"error": "El nombre del programa es obligatorio"}), 400

    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO programa_postgrado (
                        id_programa, nombre_programa, descripcion, area_conocimiento, facultad, 
                        creditos_totales, resolucion_aprobacion_sub, tipo_programa, mencion, estado,
                        enlace_convocatoria_drive, enlace_pdf_programa, enlace_formulario_inscripcion,
                        resolucion_hcu, descuento_contado_porcentaje, numero_cuotas, monto_cuota,
                        perfil_aspirante, perfil_egreso, requisitos_admision, modalidad_titulacion
                    )
                    VALUES (
                        :id_prog, :nombre, :desc, :area, :fac, :cred, :res, :tipo, :mencion, :estado,
                        :enlace_drive, :enlace_pdf, :enlace_form, :res_hcu, :desc_contado, :num_cuotas, :monto_cuota,
                        :perfil_asp, :perfil_egr, :reqs, :mod_tit
                    )
                    ON CONFLICT (id_programa) DO UPDATE SET
                        nombre_programa = EXCLUDED.nombre_programa,
                        descripcion = EXCLUDED.descripcion,
                        area_conocimiento = EXCLUDED.area_conocimiento,
                        creditos_totales = EXCLUDED.creditos_totales,
                        resolucion_aprobacion_sub = EXCLUDED.resolucion_aprobacion_sub,
                        tipo_programa = EXCLUDED.tipo_programa,
                        mencion = EXCLUDED.mencion,
                        estado = EXCLUDED.estado,
                        enlace_convocatoria_drive = EXCLUDED.enlace_convocatoria_drive,
                        enlace_pdf_programa = EXCLUDED.enlace_pdf_programa,
                        enlace_formulario_inscripcion = EXCLUDED.enlace_formulario_inscripcion,
                        resolucion_hcu = EXCLUDED.resolucion_hcu,
                        descuento_contado_porcentaje = EXCLUDED.descuento_contado_porcentaje,
                        numero_cuotas = EXCLUDED.numero_cuotas,
                        monto_cuota = EXCLUDED.monto_cuota,
                        perfil_aspirante = EXCLUDED.perfil_aspirante,
                        perfil_egreso = EXCLUDED.perfil_egreso,
                        requisitos_admision = EXCLUDED.requisitos_admision,
                        modalidad_titulacion = EXCLUDED.modalidad_titulacion
                    """
                ),
                {
                    "id_prog": id_programa,
                    "nombre": nombre,
                    "desc": descripcion,
                    "area": area,
                    "fac": facultad,
                    "cred": creditos,
                    "res": resolucion,
                    "tipo": tipo if tipo in ["Terminal", "Autofinanciada", "Convenio"] else "Autofinanciada",
                    "mencion": mencion,
                    "estado": estado,
                    "enlace_drive": enlace_drive,
                    "enlace_pdf": enlace_pdf,
                    "enlace_form": enlace_form,
                    "res_hcu": res_hcu,
                    "desc_contado": desc_contado,
                    "num_cuotas": num_cuotas,
                    "monto_cuota": monto_cuota_val,
                    "perfil_asp": perfil_aspirante,
                    "perfil_egr": perfil_egreso,
                    "reqs": requisitos_admision,
                    "mod_tit": modalidad_titulacion
                }
            )

            # Clasificar en tabla especializada
            if "Diplomado" in nombre:
                conn.execute(text("INSERT INTO diplomado (id_programa) VALUES (:id_prog) ON CONFLICT DO NOTHING"), {"id_prog": id_programa})
            else:
                conn.execute(text("INSERT INTO maestria (id_programa) VALUES (:id_prog) ON CONFLICT DO NOTHING"), {"id_prog": id_programa})

            # Crear edición por defecto si no existe
            id_edicion = f"ED-2026-1-{id_programa}"
            conn.execute(
                text(
                    """
                    INSERT INTO edicion_programa (id_edicion, fecha_inicio, fecha_fin, cupo_maximo, cupo_minimo, sede, fecha_limite_inscripcion, periodo_academico, estado, id_programa, costo_mensualidad)
                    VALUES (:id_ed, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', :cupo, 10, 'Campus Cota Cota – FCPN', CURRENT_DATE + INTERVAL '30 days', '2026-1', 'Activo', :id_prog, :costo)
                    ON CONFLICT (id_edicion) DO UPDATE SET 
                        cupo_maximo = EXCLUDED.cupo_maximo,
                        costo_mensualidad = EXCLUDED.costo_mensualidad
                    """
                ),
                {"id_ed": id_edicion, "cupo": cupo_max, "id_prog": id_programa, "costo": monto_cuota_val}
            )

        return jsonify({"success": True, "id": id_programa, "message": "Programa guardado correctamente"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo guardar el programa", "message": str(exc)}), 500


@app.put("/api/admin/programas/<program_id>")
def update_programa(program_id):
    payload = request.get_json(silent=True) or {}
    nombre = payload.get("title") or payload.get("nombre_programa")
    descripcion = payload.get("description") or payload.get("descripcion")
    creditos = payload.get("credits") or payload.get("creditos_totales")
    tipo = payload.get("tipo_programa") or payload.get("typeFilter")
    mencion = payload.get("mencion")
    estado = payload.get("status") or payload.get("estado")
    resolucion = payload.get("resolution") or payload.get("resolucion_aprobacion_sub")
    cupo_max = payload.get("cupo_total") or payload.get("cupo_maximo")

    enlace_drive = payload.get("enlace_convocatoria_drive")
    enlace_pdf = payload.get("enlace_pdf_programa")
    enlace_form = payload.get("enlace_formulario_inscripcion")
    res_hcu = payload.get("resolucion_hcu")
    desc_contado = payload.get("descuento_contado_porcentaje")
    num_cuotas = payload.get("numero_cuotas")
    monto_cuota = payload.get("monto_cuota")

    perfil_aspirante = payload.get("perfil_aspirante")
    perfil_egreso = payload.get("perfil_egreso")
    requisitos_admision = payload.get("requisitos_admision")
    modalidad_titulacion = payload.get("modalidad_titulacion")

    try:
        with engine.begin() as conn:
            update_fields = []
            params = {"id_prog": program_id}

            if nombre:
                update_fields.append("nombre_programa = :nombre")
                params["nombre"] = nombre
            if descripcion is not None:
                update_fields.append("descripcion = :desc")
                params["desc"] = descripcion
            if creditos:
                update_fields.append("creditos_totales = :cred")
                params["cred"] = int(creditos)
            if mencion is not None:
                update_fields.append("mencion = :mencion")
                params["mencion"] = mencion
            if estado:
                update_fields.append("estado = :estado")
                params["estado"] = estado
            if resolucion:
                update_fields.append("resolucion_aprobacion_sub = :res")
                params["res"] = resolucion
            if tipo in ["Terminal", "Autofinanciada", "Convenio"]:
                update_fields.append("tipo_programa = :tipo")
                params["tipo"] = tipo

            if enlace_drive is not None:
                update_fields.append("enlace_convocatoria_drive = :enlace_drive")
                params["enlace_drive"] = enlace_drive
            if enlace_pdf is not None:
                update_fields.append("enlace_pdf_programa = :enlace_pdf")
                params["enlace_pdf"] = enlace_pdf
            if enlace_form is not None:
                update_fields.append("enlace_formulario_inscripcion = :enlace_form")
                params["enlace_form"] = enlace_form
            if res_hcu is not None:
                update_fields.append("resolucion_hcu = :res_hcu")
                params["res_hcu"] = res_hcu
            if desc_contado is not None:
                update_fields.append("descuento_contado_porcentaje = :desc_contado")
                params["desc_contado"] = int(desc_contado)
            if num_cuotas is not None:
                update_fields.append("numero_cuotas = :num_cuotas")
                params["num_cuotas"] = int(num_cuotas)
            if monto_cuota is not None:
                update_fields.append("monto_cuota = :monto_cuota")
                params["monto_cuota"] = float(monto_cuota)

            if perfil_aspirante is not None:
                update_fields.append("perfil_aspirante = :perfil_asp")
                params["perfil_asp"] = perfil_aspirante
            if perfil_egreso is not None:
                update_fields.append("perfil_egreso = :perfil_egr")
                params["perfil_egr"] = perfil_egreso
            if requisitos_admision is not None:
                update_fields.append("requisitos_admision = :reqs")
                params["reqs"] = requisitos_admision
            if modalidad_titulacion is not None:
                update_fields.append("modalidad_titulacion = :mod_tit")
                params["mod_tit"] = modalidad_titulacion

            if update_fields:
                query = f"UPDATE programa_postgrado SET {', '.join(update_fields)} WHERE id_programa = :id_prog"
                conn.execute(text(query), params)

            if cupo_max is not None or monto_cuota is not None:
                ed_updates = []
                ed_params = {"id_prog": program_id}
                if cupo_max is not None:
                    ed_updates.append("cupo_maximo = :cupo")
                    ed_params["cupo"] = int(cupo_max)
                if monto_cuota is not None:
                    ed_updates.append("costo_mensualidad = :costo")
                    ed_params["costo"] = float(monto_cuota)
                if ed_updates:
                    conn.execute(
                        text(f"UPDATE edicion_programa SET {', '.join(ed_updates)} WHERE id_programa = :id_prog"),
                        ed_params
                    )

        return jsonify({"success": True, "id": program_id, "message": "Programa actualizado"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo actualizar el programa", "message": str(exc)}), 500


@app.delete("/api/admin/programas/<program_id>")
def delete_programa(program_id):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM programa_postgrado WHERE id_programa = :id"), {"id": program_id})
        return jsonify({"success": True, "message": f"Programa {program_id} eliminado correctamente"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar el programa", "message": str(exc)}), 500


@app.patch("/api/admin/programas/<program_id>/estado")
def update_program_status(program_id):
    payload = request.get_json(silent=True) or {}
    nuevo_estado = payload.get("estado")
    if nuevo_estado not in {"Activo", "Inactivo", "En reforma"}:
        return jsonify({"error": "Estado inválido"}), 400

    try:
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE programa_postgrado SET estado = :estado WHERE id_programa = :id"),
                {"estado": nuevo_estado, "id": program_id},
            )
        return jsonify({"success": True, "id": program_id, "estado": nuevo_estado})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo actualizar el estado", "message": str(exc)}), 500


@app.get("/api/admin/usuarios")
def admin_usuarios():
    try:
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
        return jsonify([{
            "id": row["id_usuario"],
            "email": row["email"],
            "tipo": row["tipo_usuario"],
            "estado": row["estado"],
            "email_verificado": row["email_verificado"],
            "rol": row["id_rol"],
            "fecha_creacion": row["fecha_creacion"].isoformat() if row["fecha_creacion"] else None,
        } for row in rows])
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo listar usuarios", "message": str(exc)}), 500


@app.patch("/api/admin/usuarios/<id_usuario>/estado")
def update_usuario_estado(id_usuario):
    payload = request.get_json(silent=True) or {}
    nuevo_estado = payload.get("estado")
    if nuevo_estado not in {"Activo", "Inactivo", "Bloqueado", "Pendiente"}:
        return jsonify({"error": "Estado inválido"}), 400

    try:
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE usuario SET estado = :estado WHERE id_usuario = :id"),
                {"estado": nuevo_estado, "id": id_usuario}
            )
        return jsonify({"success": True, "id": id_usuario, "estado": nuevo_estado})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo actualizar usuario", "message": str(exc)}), 500


@app.delete("/api/admin/usuarios/<id_usuario>")
def delete_usuario(id_usuario):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM usuario WHERE id_usuario = :id"), {"id": id_usuario})
        return jsonify({"success": True, "message": "Usuario eliminado"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar usuario", "message": str(exc)}), 500


@app.get("/api/docentes")
def get_public_docentes():
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT id_doc, nombre_doc, apellido_doc, email, telefono, titulo_academico, 
                           especialidad, categoria_docente, foto_url, bio, scholar, researchgate, linkedin, orcid, estado
                    FROM docente
                    WHERE estado = 'Activo'
                    ORDER BY apellido_doc ASC
                    """
                )
            ).mappings().all()
        return jsonify([{
            "id": row["id_doc"],
            "nombre": row["nombre_doc"],
            "apellido": row["apellido_doc"],
            "nombre_completo": f"{row['nombre_doc']} {row['apellido_doc']}",
            "email": row["email"],
            "telefono": row["telefono"],
            "titulo": row["titulo_academico"],
            "especialidad": row["especialidad"] or "Estadística Aplicada",
            "categoria": row["categoria_docente"] or "Titular",
            "foto_url": row["foto_url"] or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "bio": row["bio"] or "Docente e Investigador de la Carrera de Estadística (FCPN-UMSA).",
            "scholar": row["scholar"] or "https://scholar.google.com",
            "researchgate": row["researchgate"] or "https://researchgate.net",
            "linkedin": row["linkedin"] or "https://linkedin.com",
            "orcid": row["orcid"] or "https://orcid.org",
            "estado": row["estado"],
        } for row in rows])
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo listar docentes", "message": str(exc)}), 500


@app.get("/api/admin/docentes")
def admin_docentes():
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT id_doc, nombre_doc, apellido_doc, email, telefono, titulo_academico, 
                           especialidad, categoria_docente, tipo_contrato, estado, foto_url, bio, 
                           scholar, researchgate, linkedin, orcid
                    FROM docente
                    ORDER BY apellido_doc ASC
                    """
                )
            ).mappings().all()
        return jsonify([{
            "id": row["id_doc"],
            "nombre": row["nombre_doc"],
            "apellido": row["apellido_doc"],
            "nombre_completo": f"{row['nombre_doc']} {row['apellido_doc']}",
            "email": row["email"],
            "telefono": row["telefono"],
            "titulo": row["titulo_academico"],
            "especialidad": row["especialidad"],
            "categoria": row["categoria_docente"],
            "contrato": row["tipo_contrato"],
            "foto_url": row["foto_url"] or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "bio": row["bio"] or "",
            "scholar": row["scholar"] or "",
            "researchgate": row["researchgate"] or "",
            "linkedin": row["linkedin"] or "",
            "orcid": row["orcid"] or "",
            "estado": row["estado"],
        } for row in rows])
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo listar docentes", "message": str(exc)}), 500


@app.post("/api/admin/docentes")
def create_docente():
    payload = request.get_json(silent=True) or {}
    id_doc = payload.get("id") or f"DOC-{hashlib.sha1((payload.get('email') or os.urandom(8).hex()).encode()).hexdigest()[:4].upper()}"
    nombre = (payload.get("nombre") or "").strip()
    apellido = (payload.get("apellido") or "").strip()
    email = (payload.get("email") or "").strip()
    telefono = (payload.get("telefono") or "").strip()
    titulo = payload.get("titulo") or "MSc en Estadística"
    especialidad = payload.get("especialidad") or "Estadística Aplicada"
    foto_url = payload.get("foto_url") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    bio = payload.get("bio") or ""
    scholar = payload.get("scholar") or "https://scholar.google.com"
    researchgate = payload.get("researchgate") or "https://researchgate.net"
    linkedin = payload.get("linkedin") or "https://linkedin.com"
    orcid = payload.get("orcid") or "https://orcid.org"
    categoria = payload.get("categoria") or "Titular"
    estado = payload.get("estado") or "Activo"

    if not nombre or not apellido or not email:
        return jsonify({"error": "Nombre, apellido y correo son requeridos"}), 400

    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO docente (
                        id_doc, nombre_doc, apellido_doc, email, telefono, titulo_academico, 
                        especialidad, estado, foto_url, bio, scholar, researchgate, linkedin, orcid, categoria_docente
                    )
                    VALUES (
                        :id, :nom, :ape, :email, :tel, :tit, 
                        :esp, :estado, :foto, :bio, :scholar, :rg, :li, :orcid, :cat
                    )
                    ON CONFLICT (id_doc) DO UPDATE SET
                        nombre_doc = EXCLUDED.nombre_doc,
                        apellido_doc = EXCLUDED.apellido_doc,
                        email = EXCLUDED.email,
                        telefono = EXCLUDED.telefono,
                        titulo_academico = EXCLUDED.titulo_academico,
                        especialidad = EXCLUDED.especialidad,
                        estado = EXCLUDED.estado,
                        foto_url = EXCLUDED.foto_url,
                        bio = EXCLUDED.bio,
                        scholar = EXCLUDED.scholar,
                        researchgate = EXCLUDED.researchgate,
                        linkedin = EXCLUDED.linkedin,
                        orcid = EXCLUDED.orcid,
                        categoria_docente = EXCLUDED.categoria_docente
                    """
                ),
                {
                    "id": id_doc, "nom": nombre, "ape": apellido, "email": email, "tel": telefono, 
                    "tit": titulo, "esp": especialidad, "estado": estado, "foto": foto_url, 
                    "bio": bio, "scholar": scholar, "rg": researchgate, "li": linkedin, "orcid": orcid,
                    "cat": categoria
                }
            )
        return jsonify({"success": True, "id": id_doc, "message": "Docente guardado correctamente"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo guardar docente", "message": str(exc)}), 500


@app.put("/api/admin/docentes/<id_doc>")
def update_docente(id_doc):
    payload = request.get_json(silent=True) or {}
    try:
        with engine.begin() as conn:
            updates = []
            params = {"id": id_doc}
            field_map = {
                "nombre": "nombre_doc",
                "apellido": "apellido_doc",
                "email": "email",
                "telefono": "telefono",
                "titulo": "titulo_academico",
                "especialidad": "especialidad",
                "estado": "estado",
                "foto_url": "foto_url",
                "bio": "bio",
                "scholar": "scholar",
                "researchgate": "researchgate",
                "linkedin": "linkedin",
                "orcid": "orcid",
                "categoria": "categoria_docente"
            }
            for key, col in field_map.items():
                if key in payload:
                    updates.append(f"{col} = :{key}")
                    params[key] = payload[key]

            if updates:
                conn.execute(text(f"UPDATE docente SET {', '.join(updates)} WHERE id_doc = :id"), params)

        return jsonify({"success": True, "id": id_doc, "message": "Docente actualizado correctamente"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo actualizar docente", "message": str(exc)}), 500


@app.delete("/api/admin/docentes/<id_doc>")
def delete_docente(id_doc):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM enseña WHERE id_doc = :id"), {"id": id_doc})
            conn.execute(text("DELETE FROM docente WHERE id_doc = :id"), {"id": id_doc})
        return jsonify({"success": True, "message": f"Docente {id_doc} eliminado"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar docente", "message": str(exc)}), 500


# CONVOCATORIAS PASADAS
@app.get("/api/convocatorias-pasadas")
def get_convocatorias_pasadas():
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT id_convocatoria, gestion, titulo, programa, nivel, resolucion_hcu, 
                           fecha_publicacion, enlace_drive, enlace_pdf, estado, descripcion,
                           id_edicion, id_programa
                    FROM convocatoria_pasada
                    ORDER BY fecha_publicacion DESC NULLS LAST, gestion DESC
                    """
                )
            ).mappings().all()
        return jsonify([{
            "id": row["id_convocatoria"],
            "gestion": row["gestion"],
            "titulo": row["titulo"],
            "programa": row["programa"],
            "nivel": row["nivel"],
            "resolucion_hcu": row["resolucion_hcu"] or "Resolución HCU Aprobada",
            "fecha_publicacion": row["fecha_publicacion"].isoformat() if row["fecha_publicacion"] else None,
            "enlace_drive": row["enlace_drive"] or "https://drive.google.com",
            "enlace_pdf": row["enlace_pdf"] or "https://drive.google.com",
            "estado": row["estado"] or "Concluida",
            "descripcion": row["descripcion"] or "",
            "id_edicion": row["id_edicion"],
            "id_programa": row["id_programa"]
        } for row in rows])
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudieron listar convocatorias pasadas", "message": str(exc)}), 500


@app.post("/api/admin/convocatorias-pasadas")
def create_convocatoria_pasada():
    payload = request.get_json(silent=True) or {}
    id_conv = payload.get("id") or f"CONV-{payload.get('gestion', '2025').replace(' ', '-')}-{hashlib.sha1(os.urandom(6)).hexdigest()[:4].upper()}"
    gestion = payload.get("gestion") or "Gestión 2025"
    titulo = payload.get("titulo") or "Convocatoria Pública de Posgrado"
    programa = payload.get("programa") or "Programa de Posgrado"
    nivel = payload.get("nivel") or "Maestría"
    resolucion_hcu = payload.get("resolucion_hcu") or "Resolución HCU Aprobada"
    enlace_drive = payload.get("enlace_drive") or "https://drive.google.com"
    enlace_pdf = payload.get("enlace_pdf") or "https://drive.google.com"
    descripcion = payload.get("descripcion") or ""
    id_edicion = payload.get("id_edicion")
    id_programa = payload.get("id_programa")

    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO convocatoria_pasada (
                        id_convocatoria, gestion, titulo, programa, nivel, resolucion_hcu,
                        fecha_publicacion, enlace_drive, enlace_pdf, estado, descripcion,
                        id_edicion, id_programa
                    )
                    VALUES (
                        :id, :ges, :tit, :prog, :niv, :hcu,
                        CURRENT_DATE, :drive, :pdf, 'Concluida', :desc,
                        :id_ed, :id_prg
                    )
                    ON CONFLICT (id_convocatoria) DO UPDATE SET
                        gestion = EXCLUDED.gestion,
                        titulo = EXCLUDED.titulo,
                        programa = EXCLUDED.programa,
                        nivel = EXCLUDED.nivel,
                        resolucion_hcu = EXCLUDED.resolucion_hcu,
                        enlace_drive = EXCLUDED.enlace_drive,
                        enlace_pdf = EXCLUDED.enlace_pdf,
                        descripcion = EXCLUDED.descripcion,
                        id_edicion = EXCLUDED.id_edicion,
                        id_programa = EXCLUDED.id_programa
                    """
                ),
                {
                    "id": id_conv, "ges": gestion, "tit": titulo, "prog": programa, "niv": nivel,
                    "hcu": resolucion_hcu, "drive": enlace_drive, "pdf": enlace_pdf, "desc": descripcion,
                    "id_ed": id_edicion, "id_prg": id_programa
                }
            )
        return jsonify({"success": True, "id": id_conv, "message": "Convocatoria histórica guardada"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo guardar la convocatoria pasada", "message": str(exc)}), 500


@app.post("/api/admin/programas/<program_id>/concluir")
def concluir_programa_a_historial(program_id):
    try:
        with engine.begin() as conn:
            prog_row = conn.execute(
                text("SELECT * FROM programa_postgrado WHERE id_programa = :id"),
                {"id": program_id}
            ).mappings().first()

            if not prog_row:
                return jsonify({"error": f"Programa {program_id} no encontrado"}), 404

            ed_row = conn.execute(
                text("SELECT * FROM edicion_programa WHERE id_programa = :id ORDER BY fecha_inicio DESC LIMIT 1"),
                {"id": program_id}
            ).mappings().first()

            if ed_row:
                conn.execute(
                    text("UPDATE edicion_programa SET estado = 'Concluido' WHERE id_edicion = :id_ed"),
                    {"id_ed": ed_row["id_edicion"]}
                )
            conn.execute(
                text("UPDATE programa_postgrado SET estado = 'Inactivo' WHERE id_programa = :id"),
                {"id": program_id}
            )

            year = ed_row["fecha_inicio"].year if (ed_row and ed_row["fecha_inicio"]) else 2025
            gestion = f"Gestión {year}"
            id_conv = f"CONV-{year}-{program_id.replace('PG-', '')}"
            titulo_conv = f"Convocatoria Pública - {prog_row['nombre_programa']}"
            nombre_prog = prog_row['nombre_programa']
            nivel = "Maestría" if "Maestría" in nombre_prog or "Maestria" in nombre_prog else ("Doctorado" if "Doctorado" in nombre_prog else "Diplomado")
            hcu = prog_row['resolucion_hcu'] or prog_row['resolucion_aprobacion_sub'] or "Resolución HCU Aprobada"
            enlace_drive = prog_row['enlace_convocatoria_drive'] or "https://drive.google.com"
            enlace_pdf = prog_row['enlace_pdf_programa'] or "https://drive.google.com"
            desc = prog_row['descripcion'] or f"Convocatoria histórica del programa {nombre_prog} ({gestion})."
            id_edicion = ed_row["id_edicion"] if ed_row else None

            conn.execute(
                text(
                    """
                    INSERT INTO convocatoria_pasada (
                        id_convocatoria, gestion, titulo, programa, nivel, resolucion_hcu,
                        fecha_publicacion, enlace_drive, enlace_pdf, estado, descripcion,
                        id_edicion, id_programa
                    )
                    VALUES (
                        :id, :ges, :tit, :prog, :niv, :hcu,
                        CURRENT_DATE, :drive, :pdf, 'Concluida', :desc,
                        :id_ed, :id_prg
                    )
                    ON CONFLICT (id_convocatoria) DO UPDATE SET
                        gestion = EXCLUDED.gestion,
                        titulo = EXCLUDED.titulo,
                        programa = EXCLUDED.programa,
                        nivel = EXCLUDED.nivel,
                        resolucion_hcu = EXCLUDED.resolucion_hcu,
                        enlace_drive = EXCLUDED.enlace_drive,
                        enlace_pdf = EXCLUDED.enlace_pdf,
                        descripcion = EXCLUDED.descripcion,
                        id_edicion = EXCLUDED.id_edicion,
                        id_programa = EXCLUDED.id_programa
                    """
                ),
                {
                    "id": id_conv, "ges": gestion, "tit": titulo_conv, "prog": nombre_prog, "niv": nivel,
                    "hcu": hcu, "drive": enlace_drive, "pdf": enlace_pdf, "desc": desc,
                    "id_ed": id_edicion, "id_prg": program_id
                }
            )

        return jsonify({
            "success": True, 
            "id_convocatoria": id_conv,
            "message": f"Edición del programa {prog_row['nombre_programa']} concluida y archivada en Convocatorias Pasadas exitosamente."
        })
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo concluir la edición del programa", "message": str(exc)}), 500


@app.post("/api/admin/convocatorias-pasadas/sincronizar-ediciones")
def sincronizar_ediciones_concluidas():
    """
    Escanea todas las ediciones de programas concluidas, inactivas o vencidas
    y las inserta/sincroniza automáticamente en la tabla convocatoria_pasada.
    """
    try:
        with engine.begin() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT ep.id_edicion, ep.id_programa, ep.fecha_inicio, ep.fecha_fin, ep.periodo_academico,
                           pp.nombre_programa, pp.tipo_programa, pp.resolucion_hcu, pp.resolucion_aprobacion_sub,
                           pp.enlace_convocatoria_drive, pp.enlace_pdf_programa, pp.descripcion
                    FROM edicion_programa ep
                    JOIN programa_postgrado pp ON ep.id_programa = pp.id_programa
                    WHERE ep.estado IN ('Concluido', 'Finalizado', 'Cerrada', 'Inactivo')
                       OR pp.estado IN ('Inactivo', 'Concluido')
                       OR (ep.fecha_fin IS NOT NULL AND ep.fecha_fin < CURRENT_DATE)
                    """
                )
            ).mappings().all()

            sync_count = 0
            for r in rows:
                year = r["fecha_inicio"].year if r["fecha_inicio"] else 2025
                gestion = f"Gestión {year}"
                id_conv = f"CONV-{year}-{r['id_programa'].replace('PG-', '')}"
                titulo_conv = f"Convocatoria Pública - {r['nombre_programa']}"
                nombre_prog = r['nombre_programa']
                nivel = "Maestría" if "Maestría" in nombre_prog or "Maestria" in nombre_prog else ("Doctorado" if "Doctorado" in nombre_prog else "Diplomado")
                hcu = r['resolucion_hcu'] or r['resolucion_aprobacion_sub'] or "Resolución HCU Aprobada"
                enlace_drive = r['enlace_convocatoria_drive'] or "https://drive.google.com"
                enlace_pdf = r['enlace_pdf_programa'] or "https://drive.google.com"
                desc = r['descripcion'] or f"Convocatoria histórica del programa {nombre_prog} ({gestion})."

                conn.execute(
                    text(
                        """
                        INSERT INTO convocatoria_pasada (
                            id_convocatoria, gestion, titulo, programa, nivel, resolucion_hcu,
                            fecha_publicacion, enlace_drive, enlace_pdf, estado, descripcion,
                            id_edicion, id_programa
                        )
                        VALUES (
                            :id, :ges, :tit, :prog, :niv, :hcu,
                            CURRENT_DATE, :drive, :pdf, 'Concluida', :desc,
                            :id_ed, :id_prg
                        )
                        ON CONFLICT (id_convocatoria) DO UPDATE SET
                            gestion = EXCLUDED.gestion,
                            titulo = EXCLUDED.titulo,
                            programa = EXCLUDED.programa,
                            nivel = EXCLUDED.nivel,
                            resolucion_hcu = EXCLUDED.resolucion_hcu,
                            enlace_drive = EXCLUDED.enlace_drive,
                            enlace_pdf = EXCLUDED.enlace_pdf,
                            descripcion = EXCLUDED.descripcion,
                            id_edicion = EXCLUDED.id_edicion,
                            id_programa = EXCLUDED.id_programa
                        """
                    ),
                    {
                        "id": id_conv, "ges": gestion, "tit": titulo_conv, "prog": nombre_prog, "niv": nivel,
                        "hcu": hcu, "drive": enlace_drive, "pdf": enlace_pdf, "desc": desc,
                        "id_ed": r["id_edicion"], "id_prg": r["id_programa"]
                    }
                )
                sync_count += 1

        return jsonify({
            "success": True,
            "count": sync_count,
            "message": f"Se sincronizaron automáticamente {sync_count} ediciones en el historial de convocatorias pasadas."
        })
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudieron sincronizar las ediciones", "message": str(exc)}), 500


@app.delete("/api/admin/convocatorias-pasadas/<id_conv>")
def delete_convocatoria_pasada(id_conv):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM convocatoria_pasada WHERE id_convocatoria = :id"), {"id": id_conv})
        return jsonify({"success": True, "message": "Convocatoria eliminada correctamente"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar convocatoria", "message": str(exc)}), 500


@app.get("/api/admin/programas/<program_id>/modulos")
def admin_get_modulos(program_id):
    try:
        with engine.connect() as conn:
            ed_row = conn.execute(
                text("SELECT id_edicion FROM edicion_programa WHERE id_programa = :id_prog ORDER BY fecha_inicio DESC LIMIT 1"),
                {"id_prog": program_id}
            ).mappings().first()

            if not ed_row:
                id_edicion = f"ED-2026-1-{program_id}"
                with engine.begin() as wconn:
                    wconn.execute(
                        text("INSERT INTO edicion_programa (id_edicion, fecha_inicio, cupo_maximo, id_programa, periodo_academico, estado) VALUES (:id_ed, CURRENT_DATE, 25, :id_prog, '2026-1', 'Activo') ON CONFLICT DO NOTHING"),
                        {"id_ed": id_edicion, "id_prog": program_id}
                    )
            else:
                id_edicion = ed_row["id_edicion"]

            rows = conn.execute(
                text(
                    """
                    SELECT 
                        mo.id_mod,
                        mo.nombre_mod,
                        mat.id_mat,
                        mat.nombre_mat,
                        mat.creditos,
                        mat.carga_horaria,
                        mat.descripcion,
                        mat.tipo,
                        mat.software_requerido,
                        mat.estado,
                        (
                            SELECT d.id_doc
                            FROM enseña en
                            JOIN docente d ON en.id_doc = d.id_doc
                            WHERE en.id_mat = mat.id_mat
                            LIMIT 1
                        ) AS id_docente,
                        (
                            SELECT d.nombre_doc || ' ' || d.apellido_doc
                            FROM enseña en
                            JOIN docente d ON en.id_doc = d.id_doc
                            WHERE en.id_mat = mat.id_mat
                            LIMIT 1
                        ) AS nombre_docente,
                        (
                            SELECT pm2.nombre_mat
                            FROM prerequisito_materia pr
                            JOIN materia pm2 ON pr.id_prerequisito = pm2.id_mat
                            WHERE pr.id_materia = mat.id_mat
                            LIMIT 1
                        ) AS prerequisito_nombre
                    FROM modulo mo
                    LEFT JOIN materia mat ON mat.id_mod = mo.id_mod
                    WHERE mo.id_edicion = :id_ed
                    ORDER BY mo.id_mod, mat.id_mat
                    """
                ),
                {"id_ed": id_edicion}
            ).mappings().all()

        modules_map = {}
        for r in rows:
            m_id = r["id_mod"]
            if m_id not in modules_map:
                modules_map[m_id] = {
                    "id_mod": m_id,
                    "nombre_mod": r["nombre_mod"],
                    "id_edicion": id_edicion,
                    "materias": []
                }
            if r["id_mat"]:
                modules_map[m_id]["materias"].append({
                    "id_mat": r["id_mat"],
                    "nombre_mat": r["nombre_mat"],
                    "creditos": r["creditos"],
                    "carga_horaria": r["carga_horaria"],
                    "descripcion": r["descripcion"],
                    "tipo": r["tipo"],
                    "software_requerido": r["software_requerido"],
                    "estado": r["estado"],
                    "id_docente": r["id_docente"],
                    "nombre_docente": r["nombre_docente"],
                    "prerequisito": r["prerequisito_nombre"]
                })

        return jsonify({
            "id_programa": program_id,
            "id_edicion": id_edicion,
            "modulos": list(modules_map.values())
        })
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudieron obtener los módulos", "message": str(exc)}), 500


@app.post("/api/admin/modulos")
def admin_create_modulo():
    payload = request.get_json(silent=True) or {}
    id_programa = payload.get("id_programa")
    nombre_mod = (payload.get("nombre_mod") or "").strip()

    if not id_programa or not nombre_mod:
        return jsonify({"error": "Debe especificar el programa y nombre del módulo"}), 400

    try:
        with engine.begin() as conn:
            ed = conn.execute(
                text("SELECT id_edicion FROM edicion_programa WHERE id_programa = :p ORDER BY fecha_inicio DESC LIMIT 1"),
                {"p": id_programa}
            ).mappings().first()

            if not ed:
                id_edicion = f"ED-2026-1-{id_programa}"
                conn.execute(
                    text("INSERT INTO edicion_programa (id_edicion, fecha_inicio, cupo_maximo, id_programa, periodo_academico, estado) VALUES (:ed, CURRENT_DATE, 25, :p, '2026-1', 'Activo') ON CONFLICT DO NOTHING"),
                    {"ed": id_edicion, "p": id_programa}
                )
            else:
                id_edicion = ed["id_edicion"]

            id_mod = payload.get("id_mod") or f"MOD-{hashlib.sha1((nombre_mod + id_edicion).encode()).hexdigest()[:6].upper()}"

            conn.execute(
                text(
                    """
                    INSERT INTO modulo (id_mod, nombre_mod, id_edicion)
                    VALUES (:id_mod, :nombre, :id_ed)
                    ON CONFLICT (id_mod) DO UPDATE SET nombre_mod = EXCLUDED.nombre_mod
                    """
                ),
                {"id_mod": id_mod, "nombre": nombre_mod, "id_ed": id_edicion}
            )

        return jsonify({"success": True, "id_mod": id_mod, "nombre_mod": nombre_mod})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo crear el módulo", "message": str(exc)}), 500


@app.delete("/api/admin/modulos/<id_mod>")
def admin_delete_modulo(id_mod):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM modulo WHERE id_mod = :id"), {"id": id_mod})
        return jsonify({"success": True, "message": "Módulo eliminado"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar el módulo", "message": str(exc)}), 500


@app.post("/api/admin/materias")
def admin_create_materia():
    payload = request.get_json(silent=True) or {}
    id_mod = payload.get("id_mod")
    id_mat = payload.get("id_mat") or f"MAT-{hashlib.sha1((payload.get('nombre_mat') or '').encode()).hexdigest()[:5].upper()}"
    nombre_mat = (payload.get("nombre_mat") or "").strip()
    creditos = int(payload.get("creditos") or 4)
    carga_horaria = int(payload.get("carga_horaria") or 64)
    descripcion = payload.get("descripcion") or ""
    tipo = payload.get("tipo") or "Teórico-Práctica"
    software = payload.get("software_requerido") or "R, Python"
    id_doc = payload.get("id_docente")

    if not id_mod or not nombre_mat:
        return jsonify({"error": "El módulo y el nombre de la materia son obligatorios"}), 400

    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO materia (id_mat, nombre_mat, creditos, carga_horaria, descripcion, tipo, software_requerido, estado, id_mod)
                    VALUES (:id_mat, :nombre, :cred, :carga, :desc, :tipo, :soft, 'Activa', :id_mod)
                    ON CONFLICT (id_mat) DO UPDATE SET
                        nombre_mat = EXCLUDED.nombre_mat,
                        creditos = EXCLUDED.creditos,
                        carga_horaria = EXCLUDED.carga_horaria,
                        descripcion = EXCLUDED.descripcion,
                        tipo = EXCLUDED.tipo,
                        software_requerido = EXCLUDED.software_requerido,
                        id_mod = EXCLUDED.id_mod
                    """
                ),
                {
                    "id_mat": id_mat,
                    "nombre": nombre_mat,
                    "cred": creditos,
                    "carga": carga_horaria,
                    "desc": descripcion,
                    "tipo": tipo,
                    "soft": software,
                    "id_mod": id_mod
                }
            )

            # Asignar docente si se proporcionó
            if id_doc:
                ed = conn.execute(text("SELECT id_edicion FROM modulo WHERE id_mod = :m"), {"m": id_mod}).mappings().first()
                if ed:
                    conn.execute(
                        text(
                            """
                            INSERT INTO enseña (id_doc, id_mat, id_edicion, rol)
                            VALUES (:id_doc, :id_mat, :id_ed, 'Titular')
                            ON CONFLICT (id_doc, id_mat, id_edicion) DO NOTHING
                            """
                        ),
                        {"id_doc": id_doc, "id_mat": id_mat, "id_ed": ed["id_edicion"]}
                    )

        return jsonify({"success": True, "id_mat": id_mat, "nombre_mat": nombre_mat})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo guardar la materia", "message": str(exc)}), 500


@app.delete("/api/admin/materias/<id_mat>")
def admin_delete_materia(id_mat):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM materia WHERE id_mat = :id"), {"id": id_mat})
        return jsonify({"success": True, "message": "Materia eliminada"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar la materia", "message": str(exc)}), 500


@app.get("/api/admin/roles")
def admin_roles():
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text("SELECT id_rol, nombre_rol, descripcion, nivel FROM rol ORDER BY nivel DESC")
            ).mappings().all()
        return jsonify([
            {
                "id": row["id_rol"],
                "nombre": row["nombre_rol"],
                "descripcion": row["descripcion"],
                "nivel": row["nivel"],
            }
            for row in rows
        ])
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo listar roles", "message": str(exc)}), 500


@app.post("/api/admin/usuarios")
def create_usuario():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    tipo = payload.get("tipo") or "Estudiante"
    rol = payload.get("rol")
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Debe proporcionar correo y contraseña"}), 400

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

    try:
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

            # Si es administrador, registrar en la tabla perfil_administrador
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

        return jsonify({"success": True, "id_usuario": id_usuario, "email": email, "tipo": tipo, "message": "Usuario guardado correctamente en la BD"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo crear el usuario en la BD", "message": str(exc)}), 500


def get_programas_response():
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT DISTINCT ON (pp.id_programa)
                    pp.id_programa,
                    pp.nombre_programa,
                    pp.descripcion,
                    pp.area_conocimiento,
                    pp.facultad,
                    pp.creditos_totales,
                    pp.tipo_programa,
                    pp.mencion,
                    pp.estado,
                    pp.fecha_creacion,
                    pp.resolucion_aprobacion_sub,
                    pp.enlace_convocatoria_drive,
                    pp.enlace_pdf_programa,
                    pp.enlace_formulario_inscripcion,
                    pp.resolucion_hcu,
                    pp.descuento_contado_porcentaje,
                    pp.numero_cuotas,
                    pp.monto_cuota,
                    pp.perfil_aspirante,
                    pp.perfil_egreso,
                    pp.requisitos_admision,
                    pp.modalidad_titulacion,
                    ep.costo_mensualidad,
                    ep.valor_matricula,
                    CASE
                        WHEN dip.id_programa IS NOT NULL OR pp.nombre_programa ILIKE '%%Diplomado%%' THEN 'Diplomado'
                        ELSE 'Maestría'
                    END AS nivel_academico,
                    COALESCE(ep.periodo_academico, '2026-1') AS periodo_academico,
                    COALESCE(
                        (SELECT COUNT(*) FROM inscribe i
                         WHERE i.id_edicion = ep.id_edicion
                           AND i.estado_inscripcion = 'Activa'), 0
                    ) AS cupos_usados,
                    COALESCE(
                        (SELECT cupo_maximo FROM edicion_programa ep2
                         WHERE ep2.id_programa = pp.id_programa
                         ORDER BY ep2.fecha_inicio DESC LIMIT 1), 0
                    ) AS cupo_total
                FROM programa_postgrado pp
                LEFT JOIN diplomado dip ON dip.id_programa = pp.id_programa
                LEFT JOIN maestria mae ON mae.id_programa = pp.id_programa
                LEFT JOIN edicion_programa ep ON ep.id_programa = pp.id_programa
                ORDER BY pp.id_programa, ep.fecha_inicio DESC NULLS LAST
                """
            )
        ).mappings().all()

    programas = []
    for row in rows:
        nivel = row["nivel_academico"]
        tipo_raw = row["tipo_programa"]
        es_diplomado = nivel == "Diplomado"

        descuento_pct = int(row.get("descuento_contado_porcentaje") or 10)
        num_cuotas = int(row.get("numero_cuotas") or (6 if es_diplomado else 18))
        monto_cuota_val = float(row.get("monto_cuota") or (row.get("costo_mensualidad") or (600 if es_diplomado else 850)))
        matricula_val = float(row.get("valor_matricula") if row.get("valor_matricula") is not None else (0 if tipo_raw == "Terminal" else 350))

        programas.append({
            "id": row["id_programa"],
            "code": row["id_programa"],
            "title": row["nombre_programa"],
            "description": row["descripcion"] or "Programa de postgrado vigente.",
            "area": row["area_conocimiento"],
            "faculty": row["facultad"],
            "credits": row["creditos_totales"],
            "type": nivel,
            "typeFilter": "diplomado" if es_diplomado else ("terminal" if tipo_raw == "Terminal" else "autofinanciada"),
            "mencion": row["mencion"],
            "status": row["estado"],
            "resolution": row["resolucion_aprobacion_sub"] or "Resolución pendiente",
            "resolucion_hcu": row.get("resolucion_hcu") or "Resolución HCU N° 284/2024 - Aprobación Plena UMSA",
            "enlace_convocatoria_drive": row.get("enlace_convocatoria_drive") or "https://drive.google.com/drive/folders/1umsa_posgrado_estadistica_2026_convocatoria",
            "enlace_pdf_programa": row.get("enlace_pdf_programa") or "https://drive.google.com/file/d/1_desc_programa_estadistica_fcpn_2026/view",
            "enlace_formulario_inscripcion": row.get("enlace_formulario_inscripcion") or "https://docs.google.com/forms/d/e/1FAIpQLSd_posgrado_estadistica_umsa_postulacion_2026/viewform",
            "descuento_contado_porcentaje": descuento_pct,
            "numero_cuotas": num_cuotas,
            "monto_cuota": monto_cuota_val,
            "costo_mensualidad": monto_cuota_val,
            "valor_matricula": matricula_val,
            "perfil_aspirante": row.get("perfil_aspirante") or "",
            "perfil_egreso": row.get("perfil_egreso") or "",
            "requisitos_admision": row.get("requisitos_admision") or "",
            "modalidad_titulacion": row.get("modalidad_titulacion") or "",
            "featured": row["estado"] == "Activo",
            "periodo": row["periodo_academico"],
            "cupo_total": int(row["cupo_total"] or 0),
            "cupo_usados": int(row["cupos_usados"] or 0),
            "degree": "Diplomado Certificado UMSA" if es_diplomado else ("M.Sc. en Estadística Aplicada" if "Aplicada" in (row["nombre_programa"] or "") else "M.Sc. en Ciencia de Datos"),
            "duration": "6 meses" if es_diplomado else ("24 meses" if tipo_raw == "Terminal" else "18 meses"),
            "modality": "Híbrida – Turno Noche",
            "fecha_creacion": row["fecha_creacion"].isoformat() if row["fecha_creacion"] else None,
        })
    return programas


def _map_program_type(tipo):
    tipo = (tipo or "").strip().lower()
    if tipo == "terminal":
        return "terminal"
    if tipo == "autofinanciada":
        return "autofinanciada"
    if tipo == "convenio":
        return "convenio"
    return "maestria"


def _type_label(tipo):
    if tipo == "Terminal":
        return "Maestría"
    if tipo == "Autofinanciada":
        return "Maestría"
    if tipo == "Convenio":
        return "Convenio"
    return "Diplomado"


def _degree_label(tipo):
    if tipo in ("Terminal", "Autofinanciada"):
        return "M.Sc. en Estadística"
    return "Diplomado Certificado UMSA"


def _duration_label(tipo, credits):
    if tipo == "Terminal":
        return "24 meses"
    if tipo == "Autofinanciada":
        return "18 meses"
    return "6 meses"


# ==========================================
# INFORMACIÓN INSTITUCIONAL DE LA CARRERA
# ==========================================
@app.get("/api/institucion/info")
def get_informacion_carrera():
    try:
        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM informacion_carrera WHERE id_info = 'CONFIG_POSTGRADO' LIMIT 1")
            ).mappings().first()

            if not row:
                return jsonify({
                    "direccion": "Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística, La Paz - Bolivia",
                    "email_principal": "estapost@fcpn.edu.bo",
                    "campus_virtual_url": "https://maestria.estadistica.fcpn.edu.bo",
                    "ieta_descripcion": "Instituto de Estadística Teórica y Aplicada (IETA): Centro de investigación cuantitativa avanzada y consultoría estadística aplicada.",
                    "club_cientifico_descripcion": "Club Científico de Estadística: Comunidad de investigación formativa, semilleros y hackathons de ciencia de datos.",
                    "telefono": "+591 (2) 279-2999",
                    "whatsapp": "+591 76543210",
                    "horario_atencion": "Lunes a Viernes 08:30 - 18:30",
                    "director_nombre": "Dirección de la Carrera de Estadística y Posgrado"
                })

            return jsonify({
                "direccion": row["direccion"] or "",
                "email_principal": row["email_principal"] or "estapost@fcpn.edu.bo",
                "campus_virtual_url": row["campus_virtual_url"] or "https://maestria.estadistica.fcpn.edu.bo",
                "ieta_descripcion": row["ieta_descripcion"] or "",
                "club_cientifico_descripcion": row["club_cientifico_descripcion"] or "",
                "telefono": row["telefono"] or "+591 (2) 279-2999",
                "whatsapp": row["whatsapp"] or "+591 76543210",
                "horario_atencion": row["horario_atencion"] or "Lunes a Viernes 08:30 - 18:30",
                "director_nombre": row["director_nombre"] or "Dirección de la Carrera de Estadística"
            })
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo obtener información de la carrera", "message": str(exc)}), 500


@app.put("/api/admin/institucion/info")
def update_informacion_carrera():
    payload = request.get_json(silent=True) or {}
    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO informacion_carrera (
                        id_info, direccion, email_principal, campus_virtual_url,
                        ieta_descripcion, club_cientifico_descripcion, telefono,
                        whatsapp, horario_atencion, director_nombre
                    )
                    VALUES (
                        'CONFIG_POSTGRADO', :dir, :email, :campus,
                        :ieta, :club, :tel, :wa, :horario, :dir_nom
                    )
                    ON CONFLICT (id_info) DO UPDATE SET
                        direccion = EXCLUDED.direccion,
                        email_principal = EXCLUDED.email_principal,
                        campus_virtual_url = EXCLUDED.campus_virtual_url,
                        ieta_descripcion = EXCLUDED.ieta_descripcion,
                        club_cientifico_descripcion = EXCLUDED.club_cientifico_descripcion,
                        telefono = EXCLUDED.telefono,
                        whatsapp = EXCLUDED.whatsapp,
                        horario_atencion = EXCLUDED.horario_atencion,
                        director_nombre = EXCLUDED.director_nombre
                    """
                ),
                {
                    "dir": payload.get("direccion", ""),
                    "email": payload.get("email_principal", "estapost@fcpn.edu.bo"),
                    "campus": payload.get("campus_virtual_url", "https://maestria.estadistica.fcpn.edu.bo"),
                    "ieta": payload.get("ieta_descripcion", ""),
                    "club": payload.get("club_cientifico_descripcion", ""),
                    "tel": payload.get("telefono", "+591 (2) 279-2999"),
                    "wa": payload.get("whatsapp", "+591 76543210"),
                    "horario": payload.get("horario_atencion", "Lunes a Viernes 08:30 - 18:30"),
                    "dir_nom": payload.get("director_nombre", "Dirección de Posgrado")
                }
            )
        return jsonify({"success": True, "message": "Información de la carrera actualizada correctamente en Neon DB"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo actualizar la información de la carrera", "message": str(exc)}), 500


# ==========================================
# DEFENSAS DE TESIS & TITULACIÓN
# ==========================================
@app.get("/api/defensas-tesis")
def get_defensas_tesis():
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT t.id_titulacion, t.titulo_trabajo, t.modalidad, t.fecha_sustentacion,
                           t.hora_sustentacion, t.lugar_sustentacion, t.nota_defensa, t.estado,
                           t.postulante_nombre, t.programa_nombre, t.tutor_nombre, t.tribunal_nombres,
                           t.enlace_acta_pdf
                    FROM titulacion t
                    ORDER BY t.fecha_sustentacion DESC NULLS LAST, t.id_titulacion DESC
                    """
                )
            ).mappings().all()

        return jsonify([{
            "id": r["id_titulacion"],
            "titulo": r["titulo_trabajo"] or "Trabajo de Grado de Posgrado",
            "modalidad": r["modalidad"] or "Tesis",
            "fecha": r["fecha_sustentacion"].isoformat() if r["fecha_sustentacion"] else None,
            "hora": r["hora_sustentacion"] or "16:00",
            "lugar": r["lugar_sustentacion"] or "Auditorio de Posgrado FCPN - Campus Cota Cota Calle 27",
            "nota": float(r["nota_defensa"]) if r["nota_defensa"] is not None else None,
            "estado": r["estado"] or "Programada",
            "postulante": r["postulante_nombre"] or "Postgraduante",
            "programa": r["programa_nombre"] or "Programa de Maestría",
            "tutor": r["tutor_nombre"] or "Docente Tutor",
            "tribunal": r["tribunal_nombres"] or "Tribunal Examinador FCPN",
            "enlace_acta": r["enlace_acta_pdf"] or ""
        } for r in rows])
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudieron listar las defensas de tesis", "message": str(exc)}), 500


@app.post("/api/admin/defensas-tesis")
def save_defensa_tesis():
    payload = request.get_json(silent=True) or {}
    id_tit = payload.get("id") or f"TIT-{hashlib.sha1(os.urandom(6)).hexdigest()[:5].upper()}"
    titulo = payload.get("titulo") or "Trabajo de Grado de Posgrado"
    modalidad = payload.get("modalidad") or "Tesis"
    fecha = payload.get("fecha") or None
    hora = payload.get("hora") or "16:00"
    lugar = payload.get("lugar") or "Auditorio de Posgrado FCPN - Campus Cota Cota Calle 27"
    nota = payload.get("nota")
    estado = payload.get("estado") or "Programada"
    postulante = payload.get("postulante") or "Postgraduante"
    programa = payload.get("programa") or "Programa de Posgrado"
    tutor = payload.get("tutor") or "Docente Tutor"
    tribunal = payload.get("tribunal") or "Tribunal Examinador FCPN"
    enlace_acta = payload.get("enlace_acta") or ""

    try:
        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO titulacion (
                        id_titulacion, titulo_trabajo, modalidad, fecha_sustentacion,
                        hora_sustentacion, lugar_sustentacion, nota_defensa, estado,
                        postulante_nombre, programa_nombre, tutor_nombre, tribunal_nombres,
                        enlace_acta_pdf
                    )
                    VALUES (
                        :id, :tit, :mod, :fecha,
                        :hora, :lug, :nota, :est,
                        :post, :prog, :tut, :trib,
                        :acta
                    )
                    ON CONFLICT (id_titulacion) DO UPDATE SET
                        titulo_trabajo = EXCLUDED.titulo_trabajo,
                        modalidad = EXCLUDED.modalidad,
                        fecha_sustentacion = EXCLUDED.fecha_sustentacion,
                        hora_sustentacion = EXCLUDED.hora_sustentacion,
                        lugar_sustentacion = EXCLUDED.lugar_sustentacion,
                        nota_defensa = EXCLUDED.nota_defensa,
                        estado = EXCLUDED.estado,
                        postulante_nombre = EXCLUDED.postulante_nombre,
                        programa_nombre = EXCLUDED.programa_nombre,
                        tutor_nombre = EXCLUDED.tutor_nombre,
                        tribunal_nombres = EXCLUDED.tribunal_nombres,
                        enlace_acta_pdf = EXCLUDED.enlace_acta_pdf
                    """
                ),
                {
                    "id": id_tit, "tit": titulo, "mod": modalidad, "fecha": fecha if fecha else None,
                    "hora": hora, "lug": lugar, "nota": float(nota) if (nota is not None and str(nota).strip() != '') else None,
                    "est": estado, "post": postulante, "prog": programa, "tut": tutor,
                    "trib": tribunal, "acta": enlace_acta
                }
            )
        return jsonify({"success": True, "id": id_tit, "message": "Defensa de tesis guardada en Neon DB"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo guardar la defensa de tesis", "message": str(exc)}), 500


@app.delete("/api/admin/defensas-tesis/<id_tit>")
def delete_defensa_tesis(id_tit):
    try:
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM titulacion WHERE id_titulacion = :id"), {"id": id_tit})
        return jsonify({"success": True, "message": "Registro de defensa eliminado correctamente"})
    except SQLAlchemyError as exc:
        return jsonify({"error": "No se pudo eliminar la defensa", "message": str(exc)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

