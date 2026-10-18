from sqlalchemy import text
from config import engine

class InstitucionModel:
    @staticmethod
    def get_info():
        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM informacion_carrera WHERE id_info = 'CONFIG_POSTGRADO' LIMIT 1")
            ).mappings().first()

            if not row:
                return {
                    "direccion": "Campus Universitario Cota Cota, Calle 27, Edificio FCPN - Carrera de Estadística, La Paz - Bolivia",
                    "email_principal": "estapost@fcpn.edu.bo",
                    "campus_virtual_url": "https://maestria.estadistica.fcpn.edu.bo",
                    "ieta_descripcion": "Instituto de Estadística Teórica y Aplicada (IETA): Centro de investigación cuantitativa avanzada y consultoría estadística aplicada.",
                    "club_cientifico_descripcion": "Club Científico de Estadística: Comunidad de investigación formativa, semilleros y hackathons de ciencia de datos.",
                    "telefono": "+591 (2) 279-2999",
                    "whatsapp": "+591 76543210",
                    "horario_atencion": "Lunes a Viernes 08:30 - 18:30",
                    "director_nombre": "Dirección de la Carrera de Estadística y Posgrado"
                }

            return {
                "direccion": row["direccion"] or "",
                "email_principal": row["email_principal"] or "estapost@fcpn.edu.bo",
                "campus_virtual_url": row["campus_virtual_url"] or "https://maestria.estadistica.fcpn.edu.bo",
                "ieta_descripcion": row["ieta_descripcion"] or "",
                "club_cientifico_descripcion": row["club_cientifico_descripcion"] or "",
                "telefono": row["telefono"] or "+591 (2) 279-2999",
                "whatsapp": row["whatsapp"] or "+591 76543210",
                "horario_atencion": row["horario_atencion"] or "Lunes a Viernes 08:30 - 18:30",
                "director_nombre": row["director_nombre"] or "Dirección de la Carrera de Estadística"
            }

    @staticmethod
    def update_info(payload):
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
