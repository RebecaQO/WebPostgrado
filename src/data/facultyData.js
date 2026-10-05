export const facultyData = [
  {
    id: "doc-01",
    name: "Dr. Marcelo Ramos Quispe",
    degree: "Ph.D. en Estadística Matemática",
    university: "Universidade de São Paulo (USP), Brasil",
    specialty: "Inferencia Bayesiana, Modelos Jerárquicos y Métodos MCMC",
    courses: [
      "Inferencia Estadística Avanzada",
      "Estadística Bayesiana Computacional"
    ],
    bio: "Investigador titular de la UMSA con más de 18 años de trayectoria en modelamiento bayesiano y consultoría para organismos multilaterales (BID, CEPAL).",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    links: {
      scholar: "https://scholar.google.com",
      researchgate: "https://researchgate.net",
      orcid: "https://orcid.org/0000-0002-1825-0091",
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "doc-02",
    name: "Dra. Elena Vargas Mercado",
    degree: "Ph.D. en Bioestadística",
    university: "Katholieke Universiteit Leuven, Bélgica",
    specialty: "Análisis de Sobrevida, Ensayos Clínicos y Epidemiología Espacial",
    courses: [
      "Diseño de Estudios Epidemiológicos",
      "Análisis de Sobrevida y Modelos de Cox"
    ],
    bio: "Ex-consultora de la Organización Panamericana de la Salud (OPS/OMS) y líder del grupo de investigación en Modelización Epidemiológica de la FCPN.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    links: {
      scholar: "https://scholar.google.com",
      researchgate: "https://researchgate.net",
      orcid: "https://orcid.org/0000-0003-4921-7723",
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "doc-03",
    name: "M.Sc. Carlos A. Mendoza Flores",
    degree: "M.Sc. en Ciencia de Datos y Computación Científica",
    university: "Universidad Politécnica de Madrid (UPM), España",
    specialty: "Machine Learning, Big Data con Apache Spark y Series de Tiempo",
    courses: [
      "Aprendizaje Estadístico y Machine Learning",
      "Minería de Datos Masivos"
    ],
    bio: "Especialista en arquitecturas de datos distribuidas y aprendizaje profundo. Asesor técnico de entidades financieras y bancarias en Bolivia.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    links: {
      scholar: "https://scholar.google.com",
      researchgate: "https://researchgate.net",
      orcid: "https://orcid.org/0000-0001-9982-3412",
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "doc-04",
    name: "Dr. Víctor Hugo Tarifa Alarcón",
    degree: "Ph.D. en Estadística Aplicada",
    university: "Universidad de Buenos Aires (UBA), Argentina",
    specialty: "Muestreo Complejo, Métodos Robustos y Encuestas de Hogares",
    courses: [
      "Muestreo Complejo y Diseño de Experimentos",
      "Modelos Lineales Generalizados"
    ],
    bio: "Consultor sénior del Instituto Nacional de Estadística (INE) y docente emérito de la Carrera de Estadística UMSA.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    links: {
      scholar: "https://scholar.google.com",
      researchgate: "https://researchgate.net",
      orcid: "https://orcid.org/0000-0002-6651-4190",
      linkedin: "https://linkedin.com"
    }
  }
];

export const authoritiesData = [
  {
    id: "auth-01",
    name: "Dr. Marcelo Ramos Quispe",
    role: "Director de la Unidad de Posgrado e Investigación",
    degree: "Ph.D. en Ciencias Estadísticas & Modelación Estocástica",
    hierarchy: 1,
    isDirector: true,
    email: "marcelo.ramos@umsa.bo",
    phone: "+591 (2) 279-2999 int. 101",
    office: "Dirección de Posgrado · Edificio FCPN, Campus Cota Cota",
    bio: "Responsable de la dirección académica y estratégica de la Unidad de Posgrado, gestión de convenios internacionales y calidad educativa de cuarto nivel.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    tags: ["Dirección Ejecutiva", "Acreditación CEUB", "Convenios"]
  },
  {
    id: "auth-02",
    name: "M.Sc. Carlos A. Mendoza Flores",
    role: "Coordinador Académico de Programas de Posgrado",
    degree: "M.Sc. en Ciencia de Datos y Computación Científica",
    hierarchy: 2,
    isDirector: false,
    email: "coordinacion.posgrado@fcpn.edu.bo",
    phone: "+591 (2) 279-2999 int. 102",
    office: "Coordinación Académica · Campus Cota Cota",
    bio: "Coordinación y seguimiento de los planes curriculares de Maestrías y Diplomados, claustro docente y asesoramiento en defensas de tesis.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    tags: ["Gestión Curricular", "Claustro Docente", "Maestrías & Diplomados"]
  },
  {
    id: "auth-03",
    name: "Dra. Elena Vargas Mercado",
    role: "Directora del Instituto de Estadística Teórica y Aplicada (IETA)",
    degree: "Ph.D. en Bioestadística & Epidemiología Cuantitativa",
    hierarchy: 2,
    isDirector: false,
    email: "ieta.investigacion@fcpn.edu.bo",
    phone: "+591 (2) 279-2999 int. 104",
    office: "Instituto IETA · Laboratorio Central FCPN",
    bio: "Dirección de proyectos de investigación científica, consultorías aplicadas a salud y economía, y comités editoriales de publicaciones.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    tags: ["Investigación Científica", "IETA", "Publicaciones"]
  },
  {
    id: "auth-04",
    name: "Lic. Gabriela Miranda Rios",
    role: "Responsable de Secretaría Académica & Admisiones",
    degree: "Lic. en Administración y Gestión Universitaria",
    hierarchy: 3,
    isDirector: false,
    email: "admisiones.posgrado@fcpn.edu.bo",
    phone: "+591 76543210 / +591 (2) 244-1560",
    office: "Secretaría de Posgrado · Monoblock Central y Cota Cota",
    bio: "Atención al postulante, verificación de requisitos de admisión, matriculación y trámites de homologación de diplomas y títulos de posgrado.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    tags: ["Admisiones", "Recepción de Documentos", "Atención al Postulante"]
  },
  {
    id: "auth-05",
    name: "Ing. David Fernández Choque",
    role: "Administrador de Plataforma Virtual & Soporte Tecnológico",
    degree: "Ing. de Sistemas & Especialista en Infraestructura Cloud",
    hierarchy: 3,
    isDirector: false,
    email: "sistemas.posgrado@fcpn.edu.bo",
    phone: "+591 (2) 279-2999 int. 108",
    office: "Laboratorio de Computación Estadística · Campus Cota Cota",
    bio: "Administración del campus virtual Moodle/Teams, clúster de cómputo para R/Python y soporte técnico permanente a docentes y maestrantes.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    tags: ["Campus Virtual", "Cómputo Científico", "Soporte Técnico"]
  }
];

export const institutionTimeline = [
  {
    year: "1972",
    title: "Creación de la Licenciatura en Estadística",
    desc: "Fundación en el seno de la Facultad de Ciencias Puras y Naturales de la UMSA para atender la necesidad nacional de formación cuantitativa y científica."
  },
  {
    year: "1998",
    title: "Primeros Programas de Especialización y Posgrado",
    desc: "Aprobación de los primeros diplomados en Métodos Estadísticos y Muestreo con apoyo de organismos internacionales."
  },
  {
    year: "2014",
    title: "Acreditación Nacional ante el CEUB",
    desc: "Obtención de la máxima acreditación académica del Comité Ejecutivo de la Universidad Boliviana por su excelencia académica y producción investigativa."
  },
  {
    year: "2020",
    title: "Modernización Curricular & Ciencia de Datos",
    desc: "Incorporación de programas de posgrado orientados a Big Data, Inteligencia Artificial, Bioestadística y computación de alto rendimiento."
  },
  {
    year: "2026",
    title: "Plataforma Digital de Excelencia de Cuarto Nivel",
    desc: "Consolidación de las maestrías virtuales e híbridas con alcance nacional e internacional y acreditación continua."
  }
];
