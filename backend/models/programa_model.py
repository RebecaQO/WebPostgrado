import os
import hashlib
from sqlalchemy import text
from config import engine

class ProgramaModel:
    @staticmethod
    def get_all():
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
                        pp.banner,
                        pp.afiche,
                        pp.modalidad AS modalidad_db,
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
                "banner": row.get("banner") or "",
                "afiche": row.get("afiche") or "",
                "imagen": row.get("banner") or "",
                "featured": row["estado"] == "Activo",
                "periodo": row["periodo_academico"],
                "cupo_total": int(row["cupo_total"] or 0),
                "cupo_usados": int(row["cupos_usados"] or 0),
                "degree": "Diplomado Certificado UMSA" if es_diplomado else ("M.Sc. en Estadística Aplicada" if "Aplicada" in (row["nombre_programa"] or "") else "M.Sc. en Ciencia y Análisis de Datos"),
                "duration": "6 meses" if es_diplomado else ("24 meses" if tipo_raw == "Terminal" else "20 meses"),
                "modality": row.get("modalidad_db") or ("Semipresencial" if not es_diplomado and tipo_raw != "Terminal" else ("Presencial" if tipo_raw == "Terminal" else "Semipresencial")),
                "fecha_creacion": row["fecha_creacion"].isoformat() if row["fecha_creacion"] else None,
            })
        return programas

    @staticmethod
    def get_activos():
        programas = ProgramaModel.get_all()
        return [p for p in programas if p.get("status") == "Activo"]

    @staticmethod
    def get_detalle_completo(program_id):
        programas = ProgramaModel.get_all()
        prog = next((p for p in programas if p["id"] == program_id), None)
        if not prog:
            return None

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
                    "prerequisites": r["prerequisitos"] or "Ninguno",
                    "docentes": r["docentes"] or None
                })

        curriculum = []
        if modules_by_name:
            for idx, (m_name, m_list) in enumerate(modules_by_name.items(), 1):
                curriculum.append({
                    "semester": m_name,
                    "modules": m_list if m_list else []
                })

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

    @staticmethod
    def create(payload):
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
            raise ValueError("El nombre del programa es obligatorio")

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
                    "id_prog": id_programa, "nombre": nombre, "desc": descripcion, "area": area, "fac": facultad,
                    "cred": creditos, "res": resolucion, "tipo": tipo if tipo in ["Terminal", "Autofinanciada", "Convenio"] else "Autofinanciada",
                    "mencion": mencion, "estado": estado, "enlace_drive": enlace_drive, "enlace_pdf": enlace_pdf,
                    "enlace_form": enlace_form, "res_hcu": res_hcu, "desc_contado": desc_contado, "num_cuotas": num_cuotas,
                    "monto_cuota": monto_cuota_val, "perfil_asp": perfil_aspirante, "perfil_egr": perfil_egreso,
                    "reqs": requisitos_admision, "mod_tit": modalidad_titulacion
                }
            )

            if "Diplomado" in nombre:
                conn.execute(text("INSERT INTO diplomado (id_programa) VALUES (:id_prog) ON CONFLICT DO NOTHING"), {"id_prog": id_programa})
            else:
                conn.execute(text("INSERT INTO maestria (id_programa) VALUES (:id_prog) ON CONFLICT DO NOTHING"), {"id_prog": id_programa})

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
        return id_programa

    @staticmethod
    def update(program_id, payload):
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

    @staticmethod
    def delete(program_id):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM programa_postgrado WHERE id_programa = :id"), {"id": program_id})

    @staticmethod
    def update_status(program_id, nuevo_estado):
        with engine.begin() as conn:
            conn.execute(
                text("UPDATE programa_postgrado SET estado = :estado WHERE id_programa = :id"),
                {"estado": nuevo_estado, "id": program_id},
            )

    @staticmethod
    def concluir(program_id):
        with engine.begin() as conn:
            prog_row = conn.execute(
                text("SELECT * FROM programa_postgrado WHERE id_programa = :id"),
                {"id": program_id}
            ).mappings().first()

            if not prog_row:
                return None, f"Programa {program_id} no encontrado"

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
            return id_conv, prog_row['nombre_programa']

    @staticmethod
    def get_modulos(program_id):
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

        return {
            "id_programa": program_id,
            "id_edicion": id_edicion,
            "modulos": list(modules_map.values())
        }

    @staticmethod
    def create_modulo(payload):
        id_programa = payload.get("id_programa")
        nombre_mod = (payload.get("nombre_mod") or "").strip()

        if not id_programa or not nombre_mod:
            raise ValueError("Debe especificar el programa y nombre del módulo")

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
            return id_mod, nombre_mod

    @staticmethod
    def delete_modulo(id_mod):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM modulo WHERE id_mod = :id"), {"id": id_mod})

    @staticmethod
    def create_materia(payload):
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
            raise ValueError("El módulo y el nombre de la materia son obligatorios")

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
                    "id_mat": id_mat, "nombre": nombre_mat, "cred": creditos, "carga": carga_horaria,
                    "desc": descripcion, "tipo": tipo, "soft": software, "id_mod": id_mod
                }
            )

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
            return id_mat, nombre_mat

    @staticmethod
    def delete_materia(id_mat):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM materia WHERE id_mat = :id"), {"id": id_mat})

    @staticmethod
    def get_all_materias():
        with engine.connect() as conn:
            res = conn.execute(
                text("""
                    SELECT id_mat, nombre_mat, creditos, carga_horaria, descripcion
                    FROM materia
                    ORDER BY nombre_mat ASC
                """)
            ).mappings().all()
            return [
                {
                    "id": r["id_mat"],
                    "id_mat": r["id_mat"],
                    "nombre": r["nombre_mat"],
                    "name": r["nombre_mat"],
                    "creditos": r["creditos"] or 4,
                    "credits": r["creditos"] or 4,
                    "carga_horaria": r["carga_horaria"] or 64,
                    "hours": r["carga_horaria"] or 64,
                    "descripcion": r["descripcion"] or "",
                    "description": r["descripcion"] or ""
                }
                for r in res
            ]

    @staticmethod
    def get_mallas_by_programa(id_programa=None):
        with engine.connect() as conn:
            query = "SELECT id_malla, nombre_malla, id_programa FROM malla_curricular"
            params = {}
            if id_programa:
                query += " WHERE id_programa = :id_prog"
                params["id_prog"] = id_programa
            query += " ORDER BY id_malla"

            malla_rows = conn.execute(text(query), params).mappings().all()
            mallas = []

            for m in malla_rows:
                m_id = m["id_malla"]
                # Cargar módulos de maestría
                mod_rows = conn.execute(
                    text("SELECT id_mod, nombre_mod FROM modulo WHERE id_malla = :m_id ORDER BY id_mod"),
                    {"m_id": m_id}
                ).mappings().all()

                modules = []
                for mod in mod_rows:
                    subj_rows = conn.execute(
                        text("""
                            SELECT mat.id_mat, mat.nombre_mat, mat.descripcion, mm.creditos, mm.carga_horaria
                            FROM compone c
                            JOIN materia_maestria mm ON c.id_mat = mm.id_mat
                            JOIN materia mat ON mm.id_mat = mat.id_mat
                            WHERE c.id_mod = :mod_id
                            ORDER BY mat.id_mat
                        """),
                        {"mod_id": mod["id_mod"]}
                    ).mappings().all()

                    modules.append({
                        "id": mod["id_mod"],
                        "name": mod["nombre_mod"],
                        "subjects": [{
                            "id": s["id_mat"],
                            "name": s["nombre_mat"],
                            "description": s["descripcion"] or "",
                            "credits": s["creditos"] or 4,
                            "hours": s["carga_horaria"] or 64
                        } for s in subj_rows]
                    })

                # Cargar materias de diplomado (integra)
                dip_subjects = conn.execute(
                    text("""
                        SELECT mat.id_mat, mat.nombre_mat, mat.descripcion, i.creditos, i.carga_horaria
                        FROM integra i
                        JOIN materia mat ON i.id_mat = mat.id_mat
                        WHERE i.id_malla = :m_id
                        ORDER BY mat.id_mat
                    """),
                    {"m_id": m_id}
                ).mappings().all()

                subjects = [{
                    "id": ds["id_mat"],
                    "name": ds["nombre_mat"],
                    "description": ds["descripcion"] or "",
                    "credits": ds["creditos"] or 4,
                    "hours": ds["carga_horaria"] or 64
                } for ds in dip_subjects]

                mallas.append({
                    "id": m["id_malla"],
                    "name": m["nombre_malla"],
                    "id_programa": m["id_programa"],
                    "modules": modules,
                    "subjects": subjects
                })

            return mallas

    @staticmethod
    def get_wizard_data(id_programa):
        with engine.connect() as conn:
            p_row = conn.execute(
                text("SELECT * FROM programa_postgrado WHERE id_programa = :id"),
                {"id": id_programa}
            ).mappings().first()

            if not p_row:
                return None

            # Detectar tipo
            mae_row = conn.execute(
                text("SELECT tipo FROM maestria WHERE id_programa = :id"),
                {"id": id_programa}
            ).mappings().first()

            dip_row = conn.execute(
                text("SELECT 1 FROM diplomado WHERE id_programa = :id"),
                {"id": id_programa}
            ).first()

            is_dip = dip_row is not None or "Diplomado" in (p_row["nombre_programa"] or "")
            kind = "Diplomado" if is_dip else "Maestría"
            type_val = (mae_row["tipo"] if mae_row and mae_row["tipo"] else "Terminal") if not is_dip else "Terminal"

            # Buscar Malla asociada
            mallas = ProgramaModel.get_mallas_by_programa(id_programa)
            active_malla = mallas[0] if mallas else {
                "id": f"MALLA-{id_programa}",
                "name": f"Malla Curricular - {p_row['nombre_programa']}",
                "modules": [],
                "subjects": []
            }

            # Buscar última Edición
            ed_row = conn.execute(
                text("SELECT * FROM edicion_programa WHERE id_programa = :id ORDER BY fecha_inicio DESC LIMIT 1"),
                {"id": id_programa}
            ).mappings().first()

            edition_data = {
                "id": ed_row["id_edicion"] if ed_row else f"ED-2026-{id_programa}",
                "start": ed_row["fecha_inicio"].isoformat() if (ed_row and ed_row["fecha_inicio"]) else "",
                "end": ed_row["fecha_fin"].isoformat() if (ed_row and ed_row["fecha_fin"]) else "",
                "duration": ed_row.get("duracion") or ("6 meses" if is_dip else "18 meses") if ed_row else ("6 meses" if is_dip else "18 meses"),
                "schedule": ed_row.get("horario") or "Lunes a Jueves 19:00 - 22:00" if ed_row else "Lunes a Jueves 19:00 - 22:00",
                "description": ed_row.get("descripcion") or p_row.get("descripcion") or "" if ed_row else p_row.get("descripcion") or "",
                "degree": ed_row.get("modalidad_titulacion") or p_row.get("modalidad_titulacion") or "" if ed_row else p_row.get("modalidad_titulacion") or "",
                "requirements": ed_row.get("requisitos") or p_row.get("requisitos_admision") or "" if ed_row else p_row.get("requisitos_admision") or "",
                "call": ed_row.get("convocatoria") or p_row.get("enlace_convocatoria_drive") or "" if ed_row else "",
                "form": ed_row.get("formulario") or p_row.get("enlace_formulario_inscripcion") or "" if ed_row else "",
                "callLink": ed_row.get("enlace_convocatoria") or p_row.get("enlace_pdf_programa") or "" if ed_row else "",
                "banner": ed_row.get("banner") or p_row.get("banner") or "" if ed_row else p_row.get("banner") or "",
                "poster": ed_row.get("poster") or p_row.get("afiche") or "" if ed_row else p_row.get("afiche") or "",
                "publicity": ed_row.get("publicidad") or "" if ed_row else "",
                "perfilPro": ed_row.get("perfilpro") or p_row.get("perfil_egreso") or "" if ed_row else p_row.get("perfil_egreso") or "",
                "professions": ed_row.get("profesiones") or p_row.get("perfil_aspirante") or "" if ed_row else p_row.get("perfil_aspirante") or "",
                "competencies": ed_row.get("competenciasmaestria") or "" if ed_row else "",
                "state": ed_row.get("estado") or "En Proceso" if ed_row else "En Proceso"
            }

            # Docentes asignados en enseña
            selected_teachers = []
            if ed_row:
                teachers_rows = conn.execute(
                    text("SELECT DISTINCT id_doc FROM enseña WHERE id_edicion = :ed_id"),
                    {"ed_id": ed_row["id_edicion"]}
                ).fetchall()
                selected_teachers = [t[0] for t in teachers_rows]

            return {
                "program": {
                    "id": p_row["id_programa"],
                    "name": p_row["nombre_programa"],
                    "description": p_row["descripcion"] or "",
                    "kind": kind,
                    "type": type_val
                },
                "malla": active_malla,
                "mallas": mallas,
                "edition": edition_data,
                "selectedTeachers": selected_teachers
            }

    @staticmethod
    def save_wizard_program(payload):
        program = payload.get("program") or {}
        malla = payload.get("malla") or {}
        edition = payload.get("edition") or {}
        teachers = payload.get("teachers") or []
        selected_teachers = payload.get("selectedTeachers") or []

        p_id = (program.get("id") or "").strip()
        p_name = (program.get("name") or "").strip()
        p_desc = program.get("description") or ""
        p_kind = program.get("kind") or "Diplomado"
        p_type = program.get("type") or "Terminal"

        if not p_id:
            p_id = f"PG-EST-{hashlib.sha1(os.urandom(4)).hexdigest()[:4]}"
        if not p_name:
            p_name = "Programa Académico sin título"

        m_id = (malla.get("id") or f"MALLA-{p_id}").strip()
        m_name = (malla.get("name") or f"Malla Curricular - {p_name}").strip()
        ed_id = (edition.get("id") or f"ED-2026-{p_id}").strip()

        # Calcular o asignar creditos_totales (NOT NULL en tabla programa_postgrado)
        total_credits = 0
        if p_kind == "Diplomado":
            total_credits = sum(int(s.get("credits") or 4) for s in (malla.get("subjects") or []))
        else:
            for m in (malla.get("modules") or []):
                total_credits += sum(int(s.get("credits") or 4) for s in (m.get("subjects") or []))
        if total_credits <= 0:
            total_credits = 60 if p_kind == "Maestría" else 20

        with engine.begin() as conn:
            # 1. Programa_Postgrado
            conn.execute(
                text("""
                    INSERT INTO programa_postgrado (
                        id_programa, nombre_programa, descripcion, estado, tipo_programa, creditos_totales
                    )
                    VALUES (:id, :nom, :desc, 'Activo', :tipo, :cred)
                    ON CONFLICT (id_programa) DO UPDATE SET
                        nombre_programa = EXCLUDED.nombre_programa,
                        descripcion = EXCLUDED.descripcion,
                        tipo_programa = EXCLUDED.tipo_programa,
                        creditos_totales = EXCLUDED.creditos_totales
                """),
                {
                    "id": p_id, 
                    "nom": p_name, 
                    "desc": p_desc, 
                    "tipo": "Terminal" if p_type == "Terminal" else "Autofinanciada",
                    "cred": total_credits
                }
            )

            # 2. Maestria / Diplomado
            if p_kind == "Maestría":
                conn.execute(
                    text("""
                        INSERT INTO maestria (id_programa, tipo)
                        VALUES (:id, :tipo)
                        ON CONFLICT (id_programa) DO UPDATE SET tipo = EXCLUDED.tipo
                    """),
                    {"id": p_id, "tipo": p_type if p_type in ["Terminal", "Autosostenible"] else "Autosostenible"}
                )
                conn.execute(text("DELETE FROM diplomado WHERE id_programa = :id"), {"id": p_id})
            else:
                conn.execute(
                    text("INSERT INTO diplomado (id_programa) VALUES (:id) ON CONFLICT DO NOTHING"),
                    {"id": p_id}
                )
                conn.execute(text("DELETE FROM maestria WHERE id_programa = :id"), {"id": p_id})

            # 3. Malla_Curricular
            conn.execute(
                text("""
                    INSERT INTO malla_curricular (id_malla, nombre_malla, id_programa)
                    VALUES (:m_id, :m_name, :p_id)
                    ON CONFLICT (id_malla) DO UPDATE SET
                        nombre_malla = EXCLUDED.nombre_malla,
                        id_programa = EXCLUDED.id_programa
                """),
                {"m_id": m_id, "m_name": m_name, "p_id": p_id}
            )

            # 4. Módulos y Materias
            all_mat_ids = []
            if p_kind == "Diplomado":
                dip_mod_id = f"MOD-DIP-{p_id}"
                conn.execute(
                    text("""
                        INSERT INTO modulo (id_mod, nombre_mod, id_malla)
                        VALUES (:mod_id, 'Módulos del Diplomado', :m_id)
                        ON CONFLICT (id_mod) DO UPDATE SET id_malla = EXCLUDED.id_malla
                    """),
                    {"mod_id": dip_mod_id, "m_id": m_id}
                )

                subjects = malla.get("subjects") or []
                if not subjects:
                    subjects = [{"id": f"MAT-DIP-{p_id}", "name": "Módulo General", "description": "", "credits": 4, "hours": 64}]

                for s in subjects:
                    s_id = (s.get("id") or f"MAT-{p_id}-{hashlib.sha1(os.urandom(4)).hexdigest()[:4]}").strip()
                    all_mat_ids.append(s_id)
                    s_name = (s.get("name") or "Materia Diplomado").strip()
                    s_desc = s.get("description") or ""
                    credits_val = int(s.get("credits") or 4)
                    hours_val = int(s.get("hours") or 64)

                    conn.execute(
                        text("""
                            INSERT INTO materia (id_mat, nombre_mat, descripcion, creditos, carga_horaria, estado, id_mod)
                            VALUES (:id, :nom, :desc, :cred, :carga, 'Activa', :mod_id)
                            ON CONFLICT (id_mat) DO UPDATE SET
                                nombre_mat = EXCLUDED.nombre_mat,
                                descripcion = EXCLUDED.descripcion,
                                creditos = EXCLUDED.creditos,
                                carga_horaria = EXCLUDED.carga_horaria,
                                id_mod = EXCLUDED.id_mod
                        """),
                        {"id": s_id, "nom": s_name, "desc": s_desc, "cred": credits_val, "carga": hours_val, "mod_id": dip_mod_id}
                    )

                    conn.execute(
                        text("INSERT INTO modulo_diplomado (id_mat) VALUES (:id) ON CONFLICT DO NOTHING"),
                        {"id": s_id}
                    )

                    conn.execute(
                        text("""
                            INSERT INTO integra (id_mat, id_malla, creditos, carga_horaria)
                            VALUES (:s_id, :m_id, :cred, :carga)
                            ON CONFLICT (id_mat, id_malla) DO UPDATE SET
                                creditos = EXCLUDED.creditos,
                                carga_horaria = EXCLUDED.carga_horaria
                        """),
                        {"s_id": s_id, "m_id": m_id, "cred": credits_val, "carga": hours_val}
                    )
            else:
                modules = malla.get("modules") or []
                if not modules:
                    modules = [{
                        "id": f"MOD-{p_id}-1",
                        "name": "Módulo I: Fundamentos",
                        "subjects": [{"id": f"MAT-{p_id}-1", "name": "Materia I", "description": "", "credits": 4, "hours": 64}]
                    }]

                for mod in modules:
                    mod_id = (mod.get("id") or f"MOD-{p_id}-{hashlib.sha1(os.urandom(4)).hexdigest()[:4]}").strip()
                    mod_name = (mod.get("name") or "Módulo de Maestría").strip()

                    conn.execute(
                        text("""
                            INSERT INTO modulo (id_mod, nombre_mod, id_malla)
                            VALUES (:id, :nom, :m_id)
                            ON CONFLICT (id_mod) DO UPDATE SET
                                nombre_mod = EXCLUDED.nombre_mod,
                                id_malla = EXCLUDED.id_malla
                        """),
                        {"id": mod_id, "nom": mod_name, "m_id": m_id}
                    )

                    m_subjs = mod.get("subjects") or []
                    if not m_subjs:
                        m_subjs = [{"id": f"MAT-{mod_id}-1", "name": "Asignatura Base", "description": "", "credits": 4, "hours": 64}]

                    for s in m_subjs:
                        s_id = (s.get("id") or f"MAT-{mod_id}-{hashlib.sha1(os.urandom(4)).hexdigest()[:4]}").strip()
                        all_mat_ids.append(s_id)
                        s_name = (s.get("name") or "Materia Maestría").strip()
                        s_desc = s.get("description") or ""
                        credits_val = int(s.get("credits") or 4)
                        hours_val = int(s.get("hours") or 64)

                        conn.execute(
                            text("""
                                INSERT INTO materia (id_mat, nombre_mat, descripcion, creditos, carga_horaria, estado, id_mod)
                                VALUES (:id, :nom, :desc, :cred, :carga, 'Activa', :mod_id)
                                ON CONFLICT (id_mat) DO UPDATE SET
                                    nombre_mat = EXCLUDED.nombre_mat,
                                    descripcion = EXCLUDED.descripcion,
                                    creditos = EXCLUDED.creditos,
                                    carga_horaria = EXCLUDED.carga_horaria,
                                    id_mod = EXCLUDED.id_mod
                            """),
                            {"id": s_id, "nom": s_name, "desc": s_desc, "cred": credits_val, "carga": hours_val, "mod_id": mod_id}
                        )

                        conn.execute(
                            text("""
                                INSERT INTO materia_maestria (id_mat, creditos, carga_horaria, id_mod, descripcion)
                                VALUES (:id, :cred, :carga, :mod_id, :desc)
                                ON CONFLICT (id_mat) DO UPDATE SET
                                    creditos = EXCLUDED.creditos,
                                    carga_horaria = EXCLUDED.carga_horaria,
                                    id_mod = EXCLUDED.id_mod,
                                    descripcion = EXCLUDED.descripcion
                            """),
                            {"id": s_id, "cred": credits_val, "carga": hours_val, "mod_id": mod_id, "desc": s_desc}
                        )

                        conn.execute(
                            text("""
                                INSERT INTO compone (id_mod, id_mat)
                                VALUES (:mod_id, :s_id)
                                ON CONFLICT DO NOTHING
                            """),
                            {"mod_id": mod_id, "s_id": s_id}
                        )

            # 5. Edicion_Programa
            ed_start = edition.get("start") or None
            ed_end = edition.get("end") or None

            # Mapear estado para cumplir con CHECK constraint de PostgreSQL
            state_raw = (edition.get("state") or "Activo").strip()
            state_map = {
                "En Proceso": "Planificada",
                "Abierta": "Activo",
                "En Curso": "En curso",
                "Concluida": "Concluido",
                "Cancelada": "Inactivo"
            }
            db_state = state_map.get(state_raw, "Activo")

            conn.execute(
                text("""
                    INSERT INTO edicion_programa (
                        id_edicion, fecha_inicio, fecha_fin, duracion, horario, descripcion,
                        modalidad_titulacion, requisitos, convocatoria, formulario, enlace_convocatoria,
                        banner, poster, publicidad, perfilpro, profesiones, competenciasmaestria,
                        estado, id_malla, id_programa, cupo_maximo, cupo_minimo, fecha_limite_inscripcion,
                        periodo_academico, sede
                    )
                    VALUES (
                        :ed_id, 
                        COALESCE(CAST(:start AS DATE), CURRENT_DATE), 
                        COALESCE(CAST(:end AS DATE), CURRENT_DATE + INTERVAL '180 days'),
                        :dur, :hor, :desc, :mod_tit, :req, :call, :form, :link_call,
                        :ban, :post, :pub, :perfil, :prof, :comp,
                        :state, :m_id, :p_id, 25, 10, 
                        COALESCE(CAST(:start AS DATE), CURRENT_DATE),
                        '2026-I', 'Campus Cota Cota – FCPN'
                    )
                    ON CONFLICT (id_edicion) DO UPDATE SET
                        fecha_inicio = EXCLUDED.fecha_inicio,
                        fecha_fin = EXCLUDED.fecha_fin,
                        duracion = EXCLUDED.duracion,
                        horario = EXCLUDED.horario,
                        descripcion = EXCLUDED.descripcion,
                        modalidad_titulacion = EXCLUDED.modalidad_titulacion,
                        requisitos = EXCLUDED.requisitos,
                        convocatoria = EXCLUDED.convocatoria,
                        formulario = EXCLUDED.formulario,
                        enlace_convocatoria = EXCLUDED.enlace_convocatoria,
                        banner = EXCLUDED.banner,
                        poster = EXCLUDED.poster,
                        publicidad = EXCLUDED.publicidad,
                        perfilpro = EXCLUDED.perfilpro,
                        profesiones = EXCLUDED.profesiones,
                        competenciasmaestria = EXCLUDED.competenciasmaestria,
                        estado = EXCLUDED.estado,
                        id_malla = EXCLUDED.id_malla,
                        id_programa = EXCLUDED.id_programa
                """),
                {
                    "ed_id": ed_id, 
                    "start": ed_start, 
                    "end": ed_end,
                    "dur": edition.get("duration") or "6 meses",
                    "hor": edition.get("schedule") or "Lunes a Viernes 19:00 - 22:00",
                    "desc": edition.get("description") or "",
                    "mod_tit": edition.get("degree") or "",
                    "req": edition.get("requirements") or "",
                    "call": edition.get("call") or "",
                    "form": edition.get("form") or "",
                    "link_call": edition.get("callLink") or "",
                    "ban": edition.get("banner") or "",
                    "post": edition.get("poster") or "",
                    "pub": edition.get("publicity") or "",
                    "perfil": edition.get("perfilPro") or "",
                    "prof": edition.get("professions") or "",
                    "comp": edition.get("competencies") or "",
                    "state": db_state,
                    "m_id": m_id,
                    "p_id": p_id
                }
            )

            # 6. Docentes nuevos (si hay)
            for t in teachers:
                t_id = (t.get("id") or f"DOC-{hashlib.sha1(os.urandom(4)).hexdigest()[:4]}").strip()
                t_email = f"{t_id.lower().replace('-', '_')}@fcpn.edu.bo"
                conn.execute(
                    text("""
                        INSERT INTO docente (id_doc, nombre_doc, apellido_doc, email, titulo_academico, foto, foto_url, estado, especialidad)
                        VALUES (:id, :nom, :ape, :email, 'Docente Posgrado', :foto, :foto, 'Activo', 'Estadística Aplicada')
                        ON CONFLICT (id_doc) DO UPDATE SET
                            nombre_doc = EXCLUDED.nombre_doc,
                            apellido_doc = EXCLUDED.apellido_doc,
                            foto = EXCLUDED.foto,
                            foto_url = EXCLUDED.foto_url
                    """),
                    {
                        "id": t_id,
                        "nom": t.get("name") or "Docente",
                        "ape": t.get("last") or "Posgrado",
                        "email": t_email,
                        "foto": t.get("photo") or ""
                    }
                )

            # 7. Asignación a Enseña (id_doc, id_mat, id_edicion)
            conn.execute(text("DELETE FROM enseña WHERE id_edicion = :ed_id"), {"ed_id": ed_id})
            first_mat = all_mat_ids[0] if all_mat_ids else f"MAT-GEN-{p_id}"
            for doc_id in selected_teachers:
                if doc_id:
                    d_id = str(doc_id).strip()
                    # Asegurar que el docente exista en la tabla docente para evitar violación de clave foránea
                    conn.execute(
                        text("""
                            INSERT INTO docente (id_doc, nombre_doc, apellido_doc, email, titulo_academico, estado)
                            VALUES (:id, 'Docente', :id, :email, 'Docente Posgrado', 'Activo')
                            ON CONFLICT (id_doc) DO NOTHING
                        """),
                        {"id": d_id, "email": f"{d_id.lower().replace('-', '_')}@fcpn.edu.bo"}
                    )

                    conn.execute(
                        text("""
                            INSERT INTO enseña (id_doc, id_mat, id_edicion, rol, fecha_asignacion)
                            VALUES (:doc_id, :mat_id, :ed_id, 'Titular', CURRENT_DATE)
                            ON CONFLICT (id_doc, id_mat, id_edicion) DO NOTHING
                        """),
                        {"doc_id": d_id, "mat_id": first_mat, "ed_id": ed_id}
                    )

        return p_id

