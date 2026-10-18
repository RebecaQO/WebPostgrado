import os
import hashlib
from sqlalchemy import text
from config import engine

class ConvocatoriaModel:
    @staticmethod
    def get_all():
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
            return [{
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
            } for row in rows]

    @staticmethod
    def create(payload):
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
        return id_conv

    @staticmethod
    def sincronizar_ediciones():
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
            return sync_count

    @staticmethod
    def delete(id_conv):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM convocatoria_pasada WHERE id_convocatoria = :id"), {"id": id_conv})
