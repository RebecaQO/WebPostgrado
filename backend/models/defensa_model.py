import os
import hashlib
from sqlalchemy import text
from config import engine

class DefensaModel:
    @staticmethod
    def get_all():
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

            return [{
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
            } for r in rows]

    @staticmethod
    def save(payload):
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
        return id_tit

    @staticmethod
    def delete(id_tit):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM titulacion WHERE id_titulacion = :id"), {"id": id_tit})
