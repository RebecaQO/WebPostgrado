import os
import hashlib
from sqlalchemy import text
from config import engine

class DocenteModel:
    @staticmethod
    def get_public():
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
            return [{
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
            } for row in rows]

    @staticmethod
    def get_admin():
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
            return [{
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
            } for row in rows]

    @staticmethod
    def create(payload):
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
            raise ValueError("Nombre, apellido y correo son requeridos")

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
        return id_doc

    @staticmethod
    def update(id_doc, payload):
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

    @staticmethod
    def delete(id_doc):
        with engine.begin() as conn:
            conn.execute(text("DELETE FROM enseña WHERE id_doc = :id"), {"id": id_doc})
            conn.execute(text("DELETE FROM docente WHERE id_doc = :id"), {"id": id_doc})
