// Definición de tipos
export interface RedSocial {
  Instagram?: string;
  Facebook?: string;
  X?: string; // Anteriormente Twitter
}

export interface Publicacion {
  titulo: string;
  editorial?: string;
  año?: number;
  rol?: string;
  descripcion?: string;
}

export interface FormacionAcademica {
  titulo: string;
  institucion?: string;
  año?: number;
}

export interface Conferencista {
  id: number;
  nombre: string;
  apellido?: string;
  alt: string;
  titulo?: string | null;
  pais: string;
  tipo: 'internacional' | 'nacional';
  cargo?: string;
  apodo?: string;
  biografia?: string;
  imagen: string;
  redesSociales?: RedSocial;
  areasExperiencia?: string[];
  premios?: string[];
  formacionAcademica?: FormacionAcademica[];
  publicaciones?: Publicacion[];
  metodologiasCreadas?: string[];
  show: boolean;
}

// Datos de conferencistas internacionales
export const conferencistas: Conferencista[] = [
  {
    id: 1,
    show: true,
    alt: 'antonio-sola',
    nombre: 'Antonio Sola',
    apellido: 'Sola',
    pais: 'España',
    tipo: 'internacional',
    titulo: 'La nueva era en la industria del marketing político',
    cargo: 'Estratega y consultor político',
    apodo: 'Creador de Presidentes',
    biografia:
      "Conocido en el mundo de la consultoría política como 'CREADOR DE PRESIDENTES', es hoy uno de los estrategas políticos más destacados y reconocidos a nivel mundial, especialmente en Latinoamérica. Antonio Sola ha participado en más de 500 campañas electorales en más de 40 países y ha sido estratega principal en importantes campañas presidenciales ganadoras como las de Juan Manuel Santos (Colombia), Mariano Rajoy (España), Felipe Calderón y Vicente Fox (México), Michel Martelly y Jovenel Moïse (Haití), José María Aznar (España), Xiomara Castro y Salvador Nasralla (Honduras), Evelyn Weber-Croes (Aruba), Gerrit Schotte (Curazao), Lenin Moreno (Ecuador), Otto Pérez Molina (Guatemala), Biram Dah Abeid (Mauritania), Cyril Ramaphosa y Lindiwe Sisulu (Sudáfrica), y Joseph Boakai (Liberia). También es fundador de la Escuela Política Fratelli Tutti (2021). Esta escuela, que fue lanzada junto con el Papa Francisco y la Fundación Scholas Ocurrentes en mayo de 2021, busca forjar una comunidad global de jóvenes de todas las regiones y culturas, unidos en su llamado a transformar el mundo y la vida de las personas a través de la política. La vocación de la escuela es buscar el encuentro entre personas para solucionar nuestros problemas ya que entiende que solo juntos podemos hacerlo.",
    premios: [
      'Condecorado con la Cruz de Oficial de la Orden del Mérito Civil, concedida por la Monarquía de España, a propuesta del Gobierno de España en 2011',
      "Primer español premiado por The Abolition Institute por su compromiso y trabajo contra la esclavitud y por su defensa de los Derechos Humanos en países como Mauritania, Haití y Sudáfrica, galardonado con el 'Aichana Abeid Boilil Award'",
      'Embajador Itinerante de Haití para el desarrollo de inversiones internacionales',
      'Listado USA Top Ten Consultores de habla hispana en Consultoría Política',
      'Premio de reconocimiento a la trayectoria en el mundo de la consultoría política en 2020 por la Asociación Latinoamericana de Consultores Políticos (ALACOP)',
      'Colaborador Honorífico – Universidad Miguel Hernández de Elche',
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/ANTONIO+SOLA+-+ESPA%C3%91A.png',
    redesSociales: {
      Instagram: 'https://www.instagram.com/antoniosola_',
      Facebook: 'https://www.facebook.com/AntonioSolaRecheOK',
      X: 'https://x.com/antoniosola_',
    },
    areasExperiencia: [
      'Estrategia política',
      'Campañas presidenciales',
      'Consultoría política internacional',
    ],
  },
  {
    id: 2,
    show: true,
    alt: 'angel-beccassino',
    nombre: 'Ángel',
    apellido: 'Beccassino',
    pais: 'Argentina',
    tipo: 'internacional',
    titulo: 'La encrucijada: el miedo al pasado versus el miedo al futuro',
    cargo: 'Estratega de Comunicación, Consultor Político y Autor',
    biografia:
      'Argentino de nacimiento y residente en Colombia desde 1986, Ángel Beccassino es uno de los estrategas de comunicación más influyentes de América Latina. Estudió Economía y Filosofía en la Universidad Nacional de Buenos Aires, formación que complementó con décadas de experiencia práctica en campañas políticas, comunicación gubernamental y gestión de crisis en más de una decena de países. Ha sido creador y asesor de campañas para gobiernos, empresas, medios de comunicación y candidatos presidenciales en Argentina, México, Colombia, Brasil, Venezuela, Bolivia, Ecuador, entre otros. Su trabajo ha dejado huella en procesos electorales emblemáticos de la región, consolidándolo como una referencia obligada en comunicación política electoral y de partidos. Beccassino fue estratega en la segunda vuelta presidencial que reeligió a Juan Manuel Santos en Colombia, así como en las campañas presidenciales de Gustavo Petro (2018) y Rodolfo Hernández (2022). Ha asesorado campañas al Congreso, alcaldías, gobernaciones, plebiscitos y referendos en Colombia, Perú, Nicaragua, Ecuador y Bolivia. Además, jugó un papel fundamental en el posicionamiento inicial del Polo Democrático Alternativo y en la reingeniería del Partido de la U durante el segundo mandato de Santos. En Bolivia, fue consultor estratégico del MAS en la primera campaña de Evo Morales y en la más reciente de Luis Arce. En el campo de la comunicación institucional y la gestión de crisis, ha liderado importantes procesos a través de su firma Beccassino SAS, con clientes como la Agencia Nacional de Infraestructura (ANI), Colciencias, la Fiscalía General, la Contraloría, la Defensoría del Pueblo, el Fondo Nacional del Ahorro, el Ministerio de Trabajo, y la Secretaría de Transparencia de la Presidencia de Colombia, entre otros. Su experticia ha sido clave en el diseño de respuestas efectivas ante situaciones críticas, como el colapso del puente Chirajara o el despliegue del e-Censo en 2018. Como autor, ha publicado más de una decena de libros sobre marketing político, comunicación estratégica, posicionamiento urbano y análisis electoral. Entre sus obras más reconocidas se encuentran Nadie se salva solo (Paidós, 2020), Roy, de abajo hacia arriba (Planeta, 2017), Los Estados Unidos de Trump (Oveja Negra, 2016), y El precio del poder (Aguilar, 2005). Fue coautor del libro premiado por los Victory Awards 2016 de la Washington Academy of Political Arts and Sciences. Ángel Beccassino es también profesor de la especialización en marketing político en la Universidad Externado de Colombia y ha sido docente invitado en instituciones académicas de América Latina y España. Es conferencista habitual en las Cumbres Mundiales de Comunicación Política y de Marketing de Gobierno, donde comparte su visión provocadora, crítica y profundamente estratégica sobre los retos contemporáneos de la política y la comunicación.',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/%C3%81NGEL+BECCASSINO+-+ARGENTINA.png',
    publicaciones: [
      {
        titulo: 'Nadie se salva solo',
        editorial: 'Paidós',
        año: 2020,
      },
      {
        titulo: 'Roy, de abajo hacia arriba',
        editorial: 'Planeta',
        año: 2017,
      },
      {
        titulo: 'Los Estados Unidos de Trump',
        editorial: 'Oveja Negra',
        año: 2016,
      },
      {
        titulo: 'El precio del poder',
        editorial: 'Aguilar',
        año: 2005,
      },
    ],
    areasExperiencia: [
      'Comunicación política',
      'Gestión de crisis',
      'Estrategia electoral',
      'Análisis político',
    ],
  },
  {
    id: 3,
    show: true,
    alt: 'david-ross',
    nombre: 'David',
    apellido: 'Ross',
    titulo: 'La falacia de la mercadotecnia política',
    pais: 'México',
    tipo: 'internacional',
    cargo: 'Fotógrafo Político Retratista',
    apodo: 'Creador del Retrato Emocional',
    biografia:
      "Ingeniero Civil, Maestría en Planeación, Maestría en Mercadotecnia Comercial, Postgrado en Psicología Práctica, Master de Kodak Internacional, Graduado en Mercadotecnia Política, internacionalmente conocido como Líder Mundial del Retrato Político y en el ámbito de la Mercadotecnia Política, como Innovador Disruptivo de esta disciplina, a través de su creación: 'El Retrato Instintivo Emocional'. Único fotógrafo galardonado con la 'Gran Orden de la República' y con la 'Legión de Honor' de México. Premio Política entregado en Colombia ante los tres Poderes de la Unión de ese país. Premio Nacional de Periodismo 2019. Miembro de Número de la Academia de la Comunicación. Más de una docena de Doctorados Honoris Causa. Uno por Investigación, entregado por la SIISDET, corporación dedicada al desarrollo y la investigación científica en el campo de la medicina, otros, por sus aportaciones en investigación a las artes gráficas y otros más, por sus aportaciones a la medicina alternativa, entregados por varias Universidades en la República Mexicana. Su figura es la única que se encuentra en la sala de Expresidentes, en el Museo de Cera de la Ciudad de México, sin haber sido presidente. Profesor Emérito de la PPA, la más importante Asociación de Fotógrafos Profesionales del mundo. El resumen de su libro 'El DO-IN, Innovación Disruptora de la Mercadotecnia Política', ha tenido una distribución internacional de más de 5,000 copias. En 2019 el V Congreso de Mercadotécnica Política en Guayaquil, Ecuador, llevó su nombre y festejó con un homenaje sus 60 años de trayectoria. En el XIX Congreso Internacional de Mercadotecnia Política, realizado en República Dominicana, recibió un testimonio mencionándolo como el mejor Retratista Político de todos tiempos. La aportación de su Retrato de Candidato en las innumerables campañas en las que ha participado, ha sido definitiva para el triunfo electoral, por el retrato mismo y por la lubricación y el impulso que da a todas las actividades que intervienen en la campaña. La expresión carismática y la personalidad del Líder triunfador que proyectan sus retratos a la emoción y al instinto del observador, han sido determinantes y decisivos, no sólo para el éxito electoral, sino de la misma manera para el político en las funciones de su cargo. Ha sido fotógrafo retratista de Presidentes de México, Primeros Ministros y Secretarios de Estado. Gobernadores, Senadores, Diputados, Presidentes Municipales, Primeras Damas, y Líderes Políticos de todas las ideologías, Artistas, Premios Nobel, Empresarios, Personalidades de la Cultura, Las Artes y todos aquellos que en su entorno sean personalidades. Han posado frente a su cámara importantes personajes entre los que se encuentran Presidentes del todo el mundo, Primeros Ministros de todo el mundo, Sultanes, Califas, Príncipes y Miembros de la realeza. En algún momento de su trayectoria contó con más del 80 % de los más destacados capitanes de la industria mexicana y cabe resaltar que prácticamente todos los libros editados que se refieren al Ing. Carlos Slim, llevan alguno de los retratos de este magnate, tomado por David Ross en la portada. Artísticamente ha creado un estilo muy personal: El Retrato Fundido al Negro, que se le denomina: Un 'Ross'. Existen más de 8,000 retratos en el mundo. Abundan los testimonios que resaltan su inigualable dominio de 'La EXPRESIÓN'.",
    premios: [
      'Gran Orden de la República de México',
      'Legión de Honor de México',
      'Premio Política entregado en Colombia ante los tres Poderes de la Unión',
      'Premio Nacional de Periodismo 2019',
      'Más de una docena de Doctorados Honoris Causa',
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/DAVID+ROSS+-+M%C3%89XICO.png',
    publicaciones: [
      {
        titulo: 'El DO-IN, Innovación Disruptora de la Mercadotecnia Política',
        editorial: 'Más de 5,000 copias internacionalmente',
      },
    ],
    areasExperiencia: [
      'Fotografía política',
      'Retrato emocional',
      'Mercadotecnia política',
      'Imagen de candidatos',
    ],
  },
  {
    id: 4,
    show: true,
    alt: 'eugenie-richard',
    nombre: 'Eugenie',
    apellido: 'Richard',
    pais: 'Francia',
    tipo: 'internacional',
    titulo:
      'La comunicación de gobierno: saber construir y comunicar su legado como líder político',
    cargo: 'Consultora en comunicación política y marketing gubernamental',
    biografia:
      'Es una de las referentes más destacadas en América Latina en comunicación política y marketing gubernamental. Politóloga, docente-investigadora de la Facultad de Finanzas, Gobierno y Relaciones Internacionales de la Universidad Externado de Colombia, es candidata a doctora en Estudios Sociales, con maestrías en Comunicación Política y Pública (Université Paris VII) y en Análisis de Problemas Políticos, Económicos e Internacionales Contemporáneos. Desde 2008, ha sido consultora para candidatos, gobiernos e instituciones locales, nacionales e internacionales, a través de La Agencia Consultores. Su experiencia incluye la asesoría a campañas electorales en Colombia y Latinoamérica, el diseño de estrategias de comunicación para alcaldías, gobernaciones y organizaciones civiles, y la capacitación de cientos de líderes, mandatarios y candidatos en temas como storytelling, media training, construcción de legado, comunicación asertiva y equidad de género. Ha sido conferencista en más de 20 eventos nacionales e internacionales, y su trabajo académico ha dado lugar a múltiples publicaciones clave para entender la evolución de la comunicación política en nuestra región. Entre ellas se destacan los libros Manual de Comunicación de Gobierno, Manual de Marketing Político y Comunicación política en Colombia. La Dra. Richard es una voz autorizada para hablar de campañas exitosas, liderazgo con propósito y la proyección efectiva de las políticas públicas a través de una comunicación estratégica y humana.',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/EUGENIE+RICHARD+-+FRANCIA.png',
    redesSociales: {
      Instagram: 'https://www.instagram.com/richard_eugenie',
      X: 'https://x.com/moving_world',
      Facebook: 'https://www.facebook.com/eugenie.richard',
    },
    formacionAcademica: [
      {
        titulo: 'Candidata a Doctora en Estudios Sociales',
        institucion: 'Universidad Externado de Colombia',
      },
      {
        titulo: 'Maestría en Comunicación Política y Pública',
        institucion: 'Université Paris VII',
      },
      {
        titulo:
          'Maestría en Análisis de Problemas Políticos, Económicos e Internacionales Contemporáneos',
        institucion: 'Universidad Externado de Colombia',
      },
    ],
    publicaciones: [
      {
        titulo: 'Manual de Comunicación de Gobierno',
      },
      {
        titulo: 'Manual de Marketing Político',
      },
      {
        titulo: 'Comunicación política en Colombia',
      },
    ],
    areasExperiencia: [
      'Comunicación de gobierno',
      'Marketing gubernamental',
      'Storytelling político',
      'Media training',
      'Equidad de género en política',
    ],
  },
  {
    id: 5,
    show: true,
    alt: 'fernando-dopazo',
    nombre: 'Fernando',
    apellido: 'Dopazo',
    pais: 'Argentina',
    tipo: 'internacional',
    cargo:
      'Fundador y CEO de Infinito Estrategia | Estratega Político Internacional',
    biografia:
      'Fernando Dopazo es uno de los estrategas políticos más reconocidos de habla hispana. Fundador y CEO de Infinito Estrategia, acumula más de 20 años de experiencia liderando campañas electorales y asesorando a líderes políticos en América y Europa. Ha participado activamente en procesos presidenciales, legislativos, regionales y municipales, aportando su conocimiento en estrategia electoral, comunicación política, posicionamiento de candidatos, gestión de crisis y asesoría de gobierno. Su trayectoria incluye el acompañamiento a presidentes, gobernadores, ministros y altos funcionarios en países como Ecuador, Guatemala, Honduras, República Dominicana, Argentina, Perú, España y Estados Unidos, entre otros. Fernando no solo ha construido campañas ganadoras, sino que también ha sido un referente en la consolidación de marcas políticas a largo plazo, generando impacto tanto en etapas electorales como en periodos de gobierno. Su visión estratégica, combinada con un profundo entendimiento del comportamiento del electorado, lo ha posicionado como un consultor integral y de confianza para gobiernos y partidos políticos. Su destacada labor ha sido reconocida con numerosos premios de la industria como los Victory Awards, Napolitan Awards, Reed Latino y Premios ALACOP, galardones que confirman su relevancia y vigencia en el mundo de la consultoría política. Además de su trabajo en el terreno, Fernando es conferencista habitual en cumbres internacionales de comunicación política y marketing gubernamental, donde comparte su experiencia con nuevas generaciones de consultores, líderes políticos y equipos de campaña. Con una mirada crítica, analítica y profundamente práctica, Fernando Dopazo representa una voz autorizada en la evolución del marketing político contemporáneo, destacando por su capacidad para transformar contextos complejos en oportunidades estratégicas.',
    premios: [
      'Victory Awards',
      'Napolitan Awards',
      'Reed Latino',
      'Premios ALACOP',
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/FERNANDO+DOPAZO+-+ARGENTINA.png',
    areasExperiencia: [
      'Estrategia electoral',
      'Comunicación política',
      'Posicionamiento de candidatos',
      'Gestión de crisis',
      'Asesoría de gobierno',
    ],
  },
  {
    id: 6,
    show: true,
    alt: 'helios-ruiz',
    nombre: 'Helios',
    apellido: 'Ruíz',
    titulo: '¿Cómo crear el mensaje político correcto?',
    pais: 'México',
    tipo: 'internacional',
    cargo:
      "Especialista en cultura organizacional, Director General de 'Helitics Consulting' y 'CLIE'",
    biografia:
      "Es especialista en cultura organizacional. Director General de 'Helitics Consulting' y 'CLIE'; Estudió Administración y Derecho, ha participado en campañas federales y locales, ha sido y es asesor de funcionarios públicos, tiene experiencia en los Poderes Ejecutivo (Federal), Legislativo (Local y Federal) y Judicial (Ex Secretario Técnico de la Comisión Nacional de Tribunales Superiores de Justicia de los Estados Unidos Mexicanos). Presidente de la Asociación de Consultores Estrategas e Investigadores Políticos de Latinoamérica ACEIPOL. Autor del libro 'Organización 101', Coautor de los libros 'Consultoría política profesional', 'Ganar y punto', 'Campañas electorales en la era de la inmediatez', 'Esperanza presente de la Ciudad de México' y 'Ganamos, prepárate para gobernar', columnista y colaborador de diversos medios. Cuenta con diversos diplomados y cursos como Habilidades Gerenciales por Harvard Business School, en Comunicación política y social por el Tec de Monterrey, en Derecho parlamentario por la Ibero, Encuentro internacional del Master en Imagen y comunicación política por la Universidad Pontificia de Salamanca España, Claves para gestionar personas por IESE Business School de la Universidad de Navarra España, Desarrollo de ideas innovadoras para nuevas compañías por la Universidad de Maryland USA, Gestión empresarial exitosa para PyMes por la Pontificia Universidad Católica de Chile, Análisis político estratégico por el CIDE, Elecciones, congreso y políticas públicas por el CIDE y Seguridad con Justicia y gobernabilidad por la Ibero.",
    formacionAcademica: [
      {
        titulo: 'Licenciatura en Administración',
        institucion: 'No especificada',
      },
      {
        titulo: 'Licenciatura en Derecho',
        institucion: 'No especificada',
      },
      {
        titulo: 'Diplomado en Habilidades Gerenciales',
        institucion: 'Harvard Business School',
      },
      {
        titulo: 'Diplomado en Comunicación política y social',
        institucion: 'Tec de Monterrey',
      },
      {
        titulo: 'Diplomado en Derecho parlamentario',
        institucion: 'Universidad Iberoamericana',
      },
    ],
    publicaciones: [
      {
        titulo: 'Organización 101',
        rol: 'Autor',
      },
      {
        titulo: 'Consultoría política profesional',
        rol: 'Coautor',
      },
      {
        titulo: 'Ganar y punto',
        rol: 'Coautor',
      },
      {
        titulo: 'Campañas electorales en la era de la inmediatez',
        rol: 'Coautor',
      },
      {
        titulo: 'Esperanza presente de la Ciudad de México',
        rol: 'Coautor',
      },
      {
        titulo: 'Ganamos, prepárate para gobernar',
        rol: 'Coautor',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/HELIOS+RUIZ+-+COLOMBIA.png',
    areasExperiencia: [
      'Cultura organizacional',
      'Consultoría política',
      'Asesoría gubernamental',
      'Campañas electorales',
    ],
  },
  {
    id: 7,
    show: true,
    alt: 'leandro-fagundez',
    nombre: 'Leandro',
    apellido: 'Fagúndez',
    titulo: 'De la pantalla al poder',
    pais: 'Uruguay',
    tipo: 'internacional',
    cargo: 'CEO de OGreat Comunicación & Marketing y co-CEO de Radici Vere',
    biografia:
      'Leandro Fagúndez es Magíster en Marketing Online y Estrategia Digital, y actualmente doctorando en Marketing Social. Con una sólida trayectoria como consultor en comunicación estratégica, marketing político y posicionamiento de marca personal, ha trabajado con líderes políticos, instituciones y empresas en América Latina y Europa. Es CEO de OGreat Comunicación & Marketing, donde lidera proyectos de alto impacto en campañas electorales, comunicación de gobierno, branding político y estrategia digital. También se desempeña como co-CEO de Radici Vere, consultora con base en Italia especializada en procesos de ciudadanía italiana por residencia, desde donde impulsa una propuesta innovadora con foco en identidad, raíces y conexión intercultural. Fagúndez es autor de los libros Emociones con Patas y De la pantalla al poder, donde explora la conexión entre comunicación, emociones y liderazgo en el ecosistema digital y político contemporáneo. Reconocido por su enfoque creativo, visión estratégica y capacidad para traducir ideas complejas en narrativas potentes, combina pensamiento analítico con una fuerte orientación a la acción. Su experiencia abarca consultoría en storytelling, media training, marketing digital, campañas 360° y comunicación institucional. Ha sido conferencista en foros internacionales y colabora activamente con medios y plataformas vinculadas al mundo de la comunicación política. Su trabajo se caracteriza por integrar innovación, análisis de datos y sensibilidad cultural para generar resultados concretos y sostenibles.',
    formacionAcademica: [
      {
        titulo: 'Magíster en Marketing Online y Estrategia Digital',
        institucion: 'No especificada',
      },
      {
        titulo: 'Doctorando en Marketing Social',
        institucion: 'No especificada',
      },
    ],
    publicaciones: [
      {
        titulo: 'Emociones con Patas',
        rol: 'Autor',
      },
      {
        titulo: 'De la pantalla al poder',
        rol: 'Autor',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/LEANDRO+FAGUNDEZ+-+URUGUAY.png',
    areasExperiencia: [
      'Comunicación estratégica',
      'Marketing político',
      'Branding personal',
      'Estrategia digital',
      'Storytelling',
    ],
  },
  {
    id: 8,
    show: true,
    alt: 'giovanni-berroa',
    nombre: 'Giovanni',
    apellido: 'Berroa',
    titulo: '¿Ganas con contenidos?',
    pais: 'Perú',
    tipo: 'internacional',
    cargo: "Subdirector de la Consultora 'Politólogos Digitales'",
    biografia:
      "Subdirector de la Consultora 'Politólogos Digitales'. Asesor en Marketing Personal y ComPol Digital, Estratega digital en Campañas Electorales en distintos países de Latinoamérica. Miembro de la Asociación Internacional de Consultores Políticos Digitales (AICODI), La Sociedad Peruana de Consultores Políticos (SOPECOP) y Red Hispana de Consultores Políticos. Actualmente Rising Star en los Washington Victory Awards 2024. Coautor en el Ebook Politólogos Digitales. Conferencista en la 'Cumbre Mundial de Comunicación Política'",
    premios: ['Rising Star en los Washington Victory Awards 2024'],
    publicaciones: [
      {
        titulo: 'Ebook Politólogos Digitales',
        rol: 'Coautor',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/GIOVANNI+BERROA+-+PER%C3%9A.png',
    areasExperiencia: [
      'Marketing Personal',
      'Comunicación Política Digital',
      'Estrategia digital en campañas electorales',
    ],
  },
  {
    id: 9,
    show: true,
    alt: 'hector-venegas',
    nombre: 'Héctor',
    apellido: 'Venegas',
    titulo: '10 tips para tu campaña digital',
    pais: 'Perú',
    tipo: 'internacional',
    cargo:
      "Fundador y CEO de la Consultora Internacional 'Politólogos Digitales'",
    biografia:
      "Héctor Venegas, Fundador y CEO de la Consultora Internacional 'Politólogos Digitales'. Politólogo, estratega digital y activista. Promotor y capacitador de organizaciones y partidos en la incidencia digital. 'Ser Tendencia y Luego Noticia' es una de sus conferencias en la que nos enseña como entrar en la agenda política desde las redes sociales. Promueve desde hace 15 años la profesionalización de las campañas políticas digitales. trabajo que ha demostrado junto a su equipo en las campañas de: Aruba, Colombia, Ecuador, El Salvador, República Dominicana, Guatemala, Honduras, México, Uruguay y en el país que lo vió nacer, Perú. Co-Autor en el ebook 'Crisis online en época electoral'. Co-Autor del ebook: 'Una Conexión más que digital' ambos premiados en los Napolitan. Y recientemente ganador del Rising Stars de los premios Napolitan Victory Awards. Estratega digital Con Campañas ganadas en las últimas elecciones en México y Ecuador, entre las más innovadoras una ganada con tinder. Premiado por la cumbre mundial de comunicación política por su labor en la innovación de estrategia digital tanto en campañas como en gobiernos de Latinoamérica.",
    premios: [
      'Rising Stars de los premios Napolitan Victory Awards',
      'Premio por innovación en estrategia digital otorgado por la Cumbre Mundial de Comunicación Política',
    ],
    publicaciones: [
      {
        titulo: 'Crisis online en época electoral',
        rol: 'Co-autor',
      },
      {
        titulo: 'Una Conexión más que digital',
        rol: 'Co-autor',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/H%C3%89CTOR+VENEGAS+-+PER%C3%9A.png',
    areasExperiencia: [
      'Estrategia digital',
      'Campañas políticas digitales',
      'Gestión de tendencias en redes sociales',
      'Incidencia digital',
    ],
  },
  {
    id: 10,
    show: true,
    alt: 'estefania-andreina-herrera-guaita',
    nombre: 'Estefanía Andreina',
    apellido: 'Herrera Guaita',
    titulo: '¿Ganas con contenidos?',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/ESTEFAN%C3%8DA+ANDREINA+HERRERA+GUAITA+-+VENEZUELA+.png',
    pais: 'Venezuela',
    tipo: 'internacional',
    cargo: 'Subdirectora de Politólogos Digitales',
    biografia:
      "Es una destacada profesional en el campo de la política y la comunicación digital, con una licenciatura en Estudios Políticos y de Gobierno. Reconocida como una de las figuras emergentes más influyentes en la consultoría política, Estefanía ha sido galardonada con el prestigioso premio 'Rising Stars' en los Napolitans Awards 2024. En su destacada trayectoria, se resalta su papel como Estratega Digital en la campaña 'Juntos Somos Más' en El Salvador (2024), la cual fue premiada en los Napolitans Awards 2024 por 'Excelencia en el Esfuerzo Digital/Tecnológico' y 'Excelencia en Creatividad Audiovisual.' Su trabajo ha sido fundamental en campañas ganadoras de premios internacionales como los Reed Latino, demostrando su capacidad para desarrollar y ejecutar estrategias comunicativas efectivas. Actualmente, Estefanía es Subdirectora de Politólogos Digitales, donde lidera y colabora en equipos interdisciplinarios dedicados a la gestión pública y la comunicación política. También es miembro activo de Aicodi, Asociación Internacional de Consultores Digitales, y ha compartido su experiencia como conferencista en la Cumbre Mundial de Comunicación Política. Coautora del e-book 'Politólogos Digitales: Una Conexión Más que Digital,' Estefanía continúa influenciando y educando a través de su conocimiento en marketing digital, estrategia y comunicación política, tanto para emprendedores como para figuras políticas en Latinoamérica.",
    formacionAcademica: [
      {
        titulo: 'Licenciatura en Estudios Políticos y de Gobierno',
        institucion: 'No especificada',
      },
    ],
    premios: [
      'Rising Stars en los Napolitans Awards 2024',
      'Premio por Excelencia en el Esfuerzo Digital/Tecnológico (campaña Juntos Somos Más)',
      'Premio por Excelencia en Creatividad Audiovisual (campaña Juntos Somos Más)',
    ],
    publicaciones: [
      {
        titulo: 'Politólogos Digitales: Una Conexión Más que Digital',
        rol: 'Coautora',
      },
    ],
    areasExperiencia: [
      'Estrategia digital',
      'Comunicación política',
      'Marketing digital',
      'Campañas electorales',
    ],
  },
  {
    id: 11,
    show: true,
    alt: 'solangel-camarena',
    nombre: 'Solangel',
    apellido: 'Camarena',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/SOLANGEL+CAMARENA+-+PANAM%C3%81.png',
    pais: 'Panamá',
    tipo: 'internacional',
    cargo: 'Estratega de branding con propósito',
    biografia:
      'Estratega de branding con propósito, Solangel Camarena es una apasionada diseñadora de estrategias de branding que transforma la comunicación tradicional para lograr que marcas personales, comerciales y gubernamentales conecten de forma auténtica y humana con sus audiencias. Con más de 20 años de experiencia y una sólida formación en marketing digital, comunicación y sostenibilidad, ha liderado proyectos innovadores en Panamá, Colombia, Ecuador, República Dominicana y México. Ha trabajado con marcas líderes como Kotex, Nestlé, Tigo, Grupo Huggies y UNICEF, así como en campañas de candidaturas nacionales y de gobierno, desarrollando estrategias que generan impacto real y conexión emocional. Es la única integrante de AICODI en Panamá y una activista comprometida con los derechos de las mujeres desde el Movimiento Revolución Femenina. Su propósito es claro: inspirar, empoderar y construir marcas con alma que dejen huella a través de la creatividad y la transformación social.',
    areasExperiencia: [
      'Branding político',
      'Marketing digital',
      'Comunicación estratégica',
      'Derechos de las mujeres',
    ],
  },
  {
    id: 12,
    show: true,
    alt: 'martha-hernandez',
    nombre: 'Martha',
    apellido: 'Hernández',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo:
      'Doctoranda en Ciencias Políticas | Consultora Internacional en Comunicación y Estrategia Política',
    biografia:
      'Martha Hernández es una destacada comunicadora social, periodista y politóloga, con más de 24 años de experiencia profesional en los ámbitos de la comunicación política, el análisis estratégico y la docencia universitaria. Actualmente cursa estudios doctorales en Ciencias Políticas, y es Magíster en la misma área, lo que le ha permitido combinar la rigurosidad académica con una praxis efectiva en campañas, gobiernos y organismos internacionales. A lo largo de su carrera, ha ocupado posiciones clave como Directora Académica de la Cumbre Mundial de Comunicación Política, una de las plataformas más influyentes de pensamiento y formación en el ámbito latinoamericano y europeo. Su trabajo ha trascendido fronteras: participó activamente en la estrategia de comunicaciones de una diputada nacional de Francia perteneciente al partido del presidente Emmanuel Macron. Esta experiencia internacional le valió el prestigioso Napolitan Victory Award como Consultora del Año en un rol de apoyo, uno de los galardones más importantes en el mundo de la consultoría política. Su liderazgo y aporte académico también han sido reconocidos por la Universidad de Harvard, donde fue destacada como una líder influyente en el campo de la política y la comunicación. En 2024, recibió el Premio a la Excelencia Académica Política, consolidando su lugar como una de las voces más autorizadas del sector. Martha también ha desempeñado un papel crucial como docente en programas de posgrado, impartiendo clases en la Maestría en Comunicación Política de IMF Business School de España y en la Universidad de los Hemisferios de Ecuador. Además, ha sido directora editorial de varias revistas académicas en Latinoamérica, y ha formado parte de prestigiosos jurados internacionales como los Polaris Awards del Reino Unido, que reconocen la innovación en campañas políticas globales. Como consultora experta de la Unión Europea, ha brindado asesoría estratégica en temas de gobernanza, comunicación institucional y fortalecimiento democrático en distintos países de la región. En Colombia, se desempeñó durante una década como docente universitaria, donde dejó una huella profunda en nuevas generaciones de comunicadores y politólogos. Su trayectoria integra una visión crítica, ética y técnica de la comunicación política, lo que la convierte en una referente indiscutible para gobiernos, campañas, universidades y organizaciones internacionales que buscan transformar la manera en que se comunican con sus ciudadanos.',
    formacionAcademica: [
      {
        titulo: 'Doctoranda en Ciencias Políticas',
        institucion: 'No especificada',
      },
      {
        titulo: 'Magíster en Ciencias Políticas',
        institucion: 'No especificada',
      },
      {
        titulo: 'Comunicadora Social y Periodista',
        institucion: 'No especificada',
      },
    ],
    premios: [
      'Napolitan Victory Award como Consultora del Año en un rol de apoyo',
      'Reconocimiento como líder influyente por la Universidad de Harvard',
      'Premio a la Excelencia Académica Política (2024)',
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/MARTHA+HERN%C3%81NDEZ+-+COLOMBIA.png',
    areasExperiencia: [
      'Comunicación política',
      'Análisis estratégico',
      'Docencia universitaria',
      'Gobernanza y comunicación institucional',
    ],
  },
  {
    id: 13,
    show: true,
    alt: 'jose-guinand',
    nombre: 'José',
    apellido: 'Guinand',
    pais: 'Colombia',
    tipo: 'nacional',
    titulo: 'No pierda en el 26',
    cargo:
      'Estratega y Consultor Político Internacional | CEO de José Guinand Strategy & Consultancy',
    biografia:
      'José Guinand es uno de los estrategas políticos emergentes más influyentes de Colombia y América Latina. Con más de una década de experiencia, ha logrado posicionarse como una referencia clave en comunicación política disruptiva, diseño de campañas electorales, liderazgo digital y asesoría en comunicación de gobierno. Es CEO de la firma José Guinand Strategy & Consultancy, un laboratorio de estrategia política con enfoque creativo, táctico y de alto impacto, desde donde ha dirigido más de 25 campañas y ha participado en más de 50 procesos electorales en distintos niveles de gobierno. Su enfoque se caracteriza por la precisión narrativa, el manejo de emociones colectivas y el uso eficaz de medios tradicionales y digitales para generar posicionamiento y movilización política. Creador y organizador del Congreso Nacional de Marketing Político, evento que se ha consolidado como el espacio más importante en Colombia para el debate y la actualización de la consultoría política, reuniendo cada año a cientos de líderes, consultores y candidatos. Además, es fundador de ASOCOPOL, la Asociación Nacional de Consultores Políticos, desde donde promueve la profesionalización del sector y la formación de nuevas generaciones de estrategas. José ha sido formador y preparador de candidatos, asesor de gobiernos locales en comunicación pública y conferencista internacional en eventos de comunicación y estrategia política en América Latina. Su capacidad para transformar ideas en victorias y su estilo fresco, directo y auténtico lo han convertido en un consultor altamente solicitado por campañas que buscan marcar diferencia. También ha contribuido al análisis político como columnista de opinión, aportando reflexiones sobre coyuntura, estrategia y cultura política con un enfoque crítico y pedagógico.',
    premios: [
      'Estratega Político Revelación del Año 2024, otorgado por Revista Corrillos y Valdivisión',
      'Condecorado con la Medalla María Manuela Beltrán, reconocimiento a la excelencia por parte de la Municipalidad de El Socorro, Santander',
      'Reconocido en 2016 como el concejal más joven de Colombia',
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/JOS%C3%89+GUINAND+-+COLOMBIA.png',
    redesSociales: {
      Instagram: 'https://www.instagram.com/guinandestrategia',
      X: 'https://x.com/joseguinandc',
    },
    areasExperiencia: [
      'Comunicación política disruptiva',
      'Diseño de campañas electorales',
      'Liderazgo digital',
      'Comunicación de gobierno',
    ],
  },
  {
    id: 14,
    show: true,
    alt: 'darmi-fuentes',
    nombre: 'Darmi',
    apellido: 'Fuentes',
    pais: 'Colombia',
    tipo: 'nacional',
    titulo: 'La contrucción programática',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/DARMI+FUENTES+-+COLOMBIA.png',
  },
  {
    id: 15,
    show: true,
    alt: 'luciana-beccassino',
    nombre: 'Luciana',
    apellido: 'Beccassino',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Psicóloga, Investigadora y Estratega Comunicacional',
    biografia:
      'Psicóloga con maestrías en sociología y ciencia política cum laude de la Universidad de los Andes. Ha trabajado como estratega comunicacional y digital en proyectos empresariales y políticos. Investiga para políticas públicas y programas de intervención en alianzas entre la academia y el sector público. Adicionalmente, se desempeña como creadora de contenido digital, escritora y conferencista sobre filosofía, política y sociología.',
    formacionAcademica: [
      {
        titulo: 'Psicología',
        institucion: 'No especificada',
      },
      {
        titulo: 'Maestría en Sociología (cum laude)',
        institucion: 'Universidad de los Andes',
      },
      {
        titulo: 'Maestría en Ciencia Política (cum laude)',
        institucion: 'Universidad de los Andes',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/LUCIANA+BECCASSINO+-+COLOMBIA.png',

    areasExperiencia: [
      'Estrategia comunicacional',
      'Comunicación digital',
      'Políticas públicas',
      'Filosofía política',
    ],
  },
  {
    id: 16,
    show: true,
    alt: 'jaime-movil',
    nombre: 'Jaime',
    apellido: 'Móvil',
    titulo: 'El contraste define la elección',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Consultor Político',
    biografia:
      "Jaime Alfredo Móvil: Consultor Político Colombiano, galardonado dos veces en el Año 2020 como 'Consultor Político Revelación del año', por The Washington Academy (WAPAS) Y AICODI, ganador del Reed Latino 'Mejor spot de menos de 60 segundos'. Autor del libro 'Del like al voto', asesor de reconocidas campañas en más de 5 países. Politólogo, Consultor en Gobierno y Estrategia Política.",
    premios: [
      'Consultor Político Revelación del año 2020 por The Washington Academy (WAPAS)',
      'Consultor Político Revelación del año 2020 por AICODI',
      "Reed Latino 'Mejor spot de menos de 60 segundos'",
    ],
    publicaciones: [
      {
        titulo: 'Del like al voto',
        rol: 'Autor',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/JAIME+M%C3%93VIL+-+COLOMBIA.png',
    areasExperiencia: [
      'Consultoría política',
      'Estrategia de gobierno',
      'Marketing político digital',
    ],
  },
  {
    id: 17,
    show: true,
    alt: 'erika-caceres',
    nombre: 'Érika',
    apellido: 'Cáceres',
    titulo: '¿Las redes sociales definen al ganador?',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Consultora en Comunicación Política',
    biografia:
      'Consultora en Comunicación Política con más de 8 años de experiencia en gobierno y campañas electorales en Latinoamérica. Ha trabajado en campañas de distintos niveles en México, República Dominicana, Ecuador, Colombia, Guatemala y Perú. Ha sido conferencista en escenarios nacionales e internaciones de estrategia y Compol, docente invitada en diferentes cursos y ha participado como columnista en varias oportunidades en medios afines a temas políticos.',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/ERIKA+C%C3%81CERES+-+COLOMBIA.png',
    areasExperiencia: [
      'Comunicación política',
      'Campañas electorales',
      'Estrategia política',
    ],
  },
  {
    id: 18,
    show: true,
    alt: 'pedro-alexander',
    nombre: 'Pedro Alexander',
    apellido: 'Rodríguez',
    titulo: 'Cómo Ganar sin Perder en la Urnas “Estrategia de Blindaje Electoral”',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Abogado y Consultor Electoral',
    biografia:
      'Abogado egresado de la Universidad Católica de Colombia (2001), con una sólida formación académica y una amplia trayectoria en el ámbito jurídico, electoral y político. Cuenta con especializaciones en Derecho Administrativo (2003) y Derecho Procesal Civil (2006) de la Universidad Externado de Colombia, así como en Derecho de los Negocios Internacionales de la Universidad Complutense de Madrid, España (2008). Ha profundizado su perfil académico con una especialización en Estrategia y Comunicación Política y es candidato a Magíster en Marketing Político por la Universidad Autónoma de Barcelona y el Centro Interamericano de Gerencia Política (Miami - Barcelona, 2022), así como candidato a Magíster en Representación Política y Gestión Pública en la Universidad La Gran Colombia (2023). En el ejercicio público ha ocupado importantes cargos: fue conjuez del Consejo Seccional de la Judicatura de Cundinamarca (2010), magistrado de la Sala Disciplinaria del Consejo Seccional de la Judicatura del Atlántico, conjuez de la Sala Jurisdiccional Disciplinaria del Consejo Superior de la Judicatura y conjuez del Consejo Nacional Electoral. Es consultor y estratega político con más de 20 años de experiencia en procesos electorales, especializado en derecho electoral. Actualmente se desempeña como representante legal y director jurídico de MARKELEC SAS – CDE (Control y Defensa Electoral). Es miembro de Asocopol, Acopol y Alacop, y fundador del Colegio de Abogados y Observatorio Electoral (COADE).',
    formacionAcademica: [
      {
        titulo: 'Abogado',
        institucion: 'Universidad Católica de Colombia',
        año: 2001,
      },
      {
        titulo: 'Especialización en Derecho Administrativo',
        institucion: 'Universidad Externado de Colombia',
        año: 2003,
      },
      {
        titulo: 'Especialización en Derecho Procesal Civil',
        institucion: 'Universidad Externado de Colombia',
        año: 2006,
      },
      {
        titulo: 'Especialización en Derecho de los Negocios Internacionales',
        institucion: 'Universidad Complutense de Madrid, España',
        año: 2008,
      },
      {
        titulo: 'Especialización en Estrategia y Comunicación Política',
        institucion: 'No especificada',
      },
      {
        titulo: 'Candidato a Magíster en Marketing Político',
        institucion:
          'Universidad Autónoma de Barcelona y Centro Interamericano de Gerencia Política',
        año: 2022,
      },
      {
        titulo:
          'Candidato a Magíster en Representación Política y Gestión Pública',
        institucion: 'Universidad La Gran Colombia',
        año: 2023,
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/PEDRO+ALEXANDER+RODR%C3%8DGUEZ+-+COLOMBIA.png',

    areasExperiencia: [
      'Derecho electoral',
      'Consultoría política',
      'Procesos electorales',
      'Gestión pública',
    ],
  },
  {
    id: 19,
    show: true,
    alt: 'jamer-chica',
    nombre: 'Jamer',
    apellido: 'Chica',
    pais: 'Colombia',
    tipo: 'nacional',
    titulo: 'Hazlo o vete al carajo',
    cargo: 'Estratega Político',
    biografia:
      "Estratega Político Colombiano. Abogado, Especialista en Derecho Público, Especialista en Gestión de Gobierno y Campañas Electorales, Especialista en Gerencia Empresarial y estudios en Gerencia de Campañas Políticas en Virginia International University (EE.UU). Ganador en varias ocasiones del Napolitan Victory Awards. Exaltado como 'uno de los cien profesionales más influyentes de la política' según The Washington Compol Magazine. Autor del libro 'El secreto de la victoria electoral'.",
    formacionAcademica: [
      {
        titulo: 'Abogado',
        institucion: 'No especificada',
      },
      {
        titulo: 'Especialista en Derecho Público',
        institucion: 'No especificada',
      },
      {
        titulo: 'Especialista en Gestión de Gobierno y Campañas Electorales',
        institucion: 'No especificada',
      },
      {
        titulo: 'Especialista en Gerencia Empresarial',
        institucion: 'No especificada',
      },
      {
        titulo: 'Estudios en Gerencia de Campañas Políticas',
        institucion: 'Virginia International University (EE.UU)',
      },
    ],
    premios: [
      'Napolitan Victory Awards (múltiples ocasiones)',
      "Reconocido como 'uno de los cien profesionales más influyentes de la política' según The Washington Compol Magazine",
    ],
    publicaciones: [
      {
        titulo: 'El secreto de la victoria electoral',
        rol: 'Autor',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/JAMER+CHICA+-+COLOMBIA.png',

    areasExperiencia: [
      'Estrategia política',
      'Campañas electorales',
      'Derecho público',
      'Gestión de gobierno',
    ],
  },
  {
    id: 20,
    show: false,
    alt: 'jorge-salim',
    nombre: 'Jorge Salim',
    apellido: 'Eljach',
    pais: 'Colombia',
    tipo: 'nacional',
    titulo: 'El próximo presidente de Colombia según las redes',
    imagen: 'jorge-salim.jpg',
    redesSociales: {
      Instagram: 'https://www.instagram.com/jorgesalimeljach',
    },
  },
  {
    id: 21,
    show: true,
    alt: 'arley-bastidas',
    nombre: 'Arley Darío',
    apellido: 'Bastidas',
    titulo: 'El Ascenso del Outsider',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Estratega político, académico y conferencista internacional',
    biografia:
      'Estratega político, académico y conferencista internacional con más de 14 años de trayectoria en la consultoría política y la investigación académica, se ha consolidado como una de las voces más influyentes de la industria política en Hispanoamérica. Ha liderado proyectos de comunicación electoral y de gobierno en diversos países de Sur y Centroamérica, posicionándose como un referente en el diseño de estrategias basadas en la comunicación, la neurociencia política y el liderazgo de alto impacto. En 2024 fue incluido en el listado de los 100 profesionales más influyentes de la industria política por la Revista Washington Compol, y ese mismo año recibió el galardón como Consultor Político Revelación del Año en los prestigiosos Napolitan Victory Awards. Su talento ha sido igualmente reconocido con nominaciones en los Reed Latino Awards en categorías clave como Mejor Estratega Electoral (2023), Mejor Campaña de Contraste y Mejor Imagen Gráfica (2024). Arley es experto en el diseño e implementación de estrategias de comunicación que transforman campañas y gobiernos, combinando una sólida base académica con una mirada innovadora del marketing político contemporáneo.',
    formacionAcademica: [
      {
        titulo: 'Pregrado en Gobierno y Relaciones Internacionales',
        institucion: 'Universidad Externado de Colombia',
      },
      {
        titulo: 'Maestría en Gobierno y Políticas Públicas',
        institucion: 'Columbia University, City of New York',
      },
      {
        titulo: 'Maestría en Comunicación Política',
        institucion: 'Universidad Externado de Colombia',
      },
      {
        titulo:
          'Especialización en Marketing Político y Estrategias de Campaña',
        institucion: 'Universidad Externado de Colombia',
      },
      {
        titulo: 'Especialización en Neuropolítica y Neuroliderazgo',
        institucion: 'Instituto Tech, España',
      },
    ],
    premios: [
      'Incluido en el listado de los 100 profesionales más influyentes de la industria política por la Revista Washington Compol (2024)',
      'Consultor Político Revelación del Año en los Napolitan Victory Awards (2024)',
      'Nominado como Mejor Estratega Electoral en los Reed Latino Awards (2023)',
      'Nominado como Mejor Campaña de Contraste en los Reed Latino Awards (2024)',
      'Nominado como Mejor Imagen Gráfica en los Reed Latino Awards (2024)',
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/ARLEY+DAR%C3%8DO+BASTIDAS+-+COLOMBIA.png',

    areasExperiencia: [
      'Comunicación electoral',
      'Neurociencia política',
      'Estrategias de comunicación',
      'Liderazgo político',
    ],
  },
  {
    id: 22,
    show: true,
    alt: 'heiner-bertel',
    nombre: 'Heiner',
    apellido: 'Bertel',
    titulo: 'El rol de la investigación mixta en la comunicación estratégica',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Estratega político e investigador en comunicación estratégica',
    biografia:
      "Heiner Bertel Benítez es cofundador y director de Creze Consultores S.A.S., una firma referente en investigación aplicada y comunicación estratégica para campañas políticas y gobiernos de alto impacto. Maestría en Comunicación Estratégica de la Universidad de la Sabana, especialista con mención de honor en Opinión Pública y Mercadeo Político de la Universidad Javeriana, y abogado de la Universidad del Rosario. Cuenta con formación complementaria en investigación estratégica, análisis de escenarios políticos-electorales, opinión pública y estrategia de campaña para candidatos y mandatarios en ejercicio. A lo largo de su trayectoria, ha diseñado estrategias electorales y de gobierno exitosas para diversos líderes políticos, consolidando su nombre como uno de los consultores emergentes más influyentes en la región. Es el creador de metodologías innovadoras como 'Del miedo al éxito en los primeros 100 días', y los talleres: '¿Qué debe hacer un líder en tiempos de coronavirus?' y '¿Cómo fortalecerte sin parecer que persigues el voto?', utilizados por líderes que buscan comunicar con propósito y legitimidad. Su enfoque combina investigación cualitativa y cuantitativa, pensamiento estratégico y una comprensión profunda del poder de la narrativa en la política actual.",
    formacionAcademica: [
      {
        titulo: 'Maestría en Comunicación Estratégica',
        institucion: 'Universidad de la Sabana',
      },
      {
        titulo:
          'Especialista en Opinión Pública y Mercadeo Político (con mención de honor)',
        institucion: 'Universidad Javeriana',
      },
      {
        titulo: 'Abogado',
        institucion: 'Universidad del Rosario',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/HEINER+BERTEL+-+COLOMBIA.png',

    metodologiasCreadas: [
      'Del miedo al éxito en los primeros 100 días',
      '¿Qué debe hacer un líder en tiempos de coronavirus?',
      '¿Cómo fortalecerte sin parecer que persigues el voto?',
    ],
    areasExperiencia: [
      'Investigación estratégica',
      'Comunicación estratégica',
      'Análisis de escenarios políticos-electorales',
      'Opinión pública',
    ],
  },
  {
    id: 23,
    show: true,
    alt: 'freddy-serrano',
    nombre: 'Freddy',
    apellido: 'Serrano Díaz',
    titulo: 'Seducción Política para Feos',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Estratega político',
    biografia:
      'Estratega político con una destacada trayectoria de más de 25 años en los sectores público y privado. Comunicador social con especializaciones y maestrías en comunicación y marketing político, es autor de tres libros sobre marketing y comunicación política, y ha liderado diversos trabajos de investigación en estas áreas. Docente universitario y conferencista internacional, ha sido reconocido por su excelencia profesional en múltiples ocasiones. En 2024, fue galardonado con el Premio ALACOP por el Mejor Manejo de Crisis en Campaña Gubernamental y nominado como Consultor Latino del Año. También ha sido premiado en los prestigiosos Napolitans Victory Awards. Es miembro activo de la Asociación Latinoamericana de Consultores Políticos (ALACOP) y ha asesorado en temas de movilidad, ciudades inteligentes, servicio al cliente y gestión de oportunidades, integrando su visión estratégica con soluciones innovadoras para la administración pública y la comunicación política.',
    formacionAcademica: [
      {
        titulo: 'Comunicador social',
        institucion: 'No especificada',
      },
      {
        titulo:
          'Especializaciones y maestrías en comunicación y marketing político',
        institucion: 'No especificada',
      },
    ],
    premios: [
      'Premio ALACOP por el Mejor Manejo de Crisis en Campaña Gubernamental (2024)',
      'Nominado como Consultor Latino del Año (2024)',
      'Napolitans Victory Awards',
    ],
    publicaciones: [
      {
        titulo: 'Tres libros sobre marketing y comunicación política',
        descripcion: 'No se especifican los títulos',
      },
    ],
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/Freddy+Serrano+-+COLOMBIA.png',

    areasExperiencia: [
      'Marketing político',
      'Comunicación estratégica',
      'Gestión de crisis',
      'Movilidad y ciudades inteligentes',
    ],
  },
  {
    id: 24,
    show: true,
    alt: 'felipe-reina',
    nombre: 'Felipe',
    apellido: 'Reina',
    titulo: 'Hazlo o vete al carajo',
    pais: 'Colombia',
    tipo: 'nacional',
    cargo: 'Especialista en marketing político digital',
    biografia:
      'Felipe Reina es especialista en marketing político digital, pionero en antropología digital en Colombia, con amplia experiencia en campañas electorales y asesoría de gobiernos en Colombia, El Salvador, Honduras, México, Guatemala, Panamá y Ecuador.',
    imagen:
      'https://congress-marketing.s3.us-east-2.amazonaws.com/Fotos+Conferencistas-20250504T032610Z-1-001/Fotos+Conferencistas/FELIPE+REINA+-+COLOMBIA.png',
    areasExperiencia: [
      'Marketing político digital',
      'Antropología digital',
      'Campañas electorales',
      'Asesoría de gobiernos',
    ],
  },
];

// Función para obtener todos los conferencistas
export const getAllConferencistas = (): Conferencista[] => {
  return conferencistas.filter((conferencista) => conferencista.show);
};

// Función para obtener conferencistas con título de conferencia
export const getConferencistasConTitulo = (): Conferencista[] => {
  return getAllConferencistas().filter(
    (conferencista) => conferencista.titulo !== null,
  );
};

// Función para obtener un conferencista por ID
export const getConferencistaById = (id: number): Conferencista | undefined => {
  return getAllConferencistas().find(
    (conferencista) => conferencista.id === id,
  );
};

// Función para obtener conferencistas por tipo
export const getConferencistasByTipo = (
  tipo: 'internacional' | 'nacional',
): Conferencista[] => {
  return getAllConferencistas().filter(
    (conferencista) => conferencista.tipo === tipo,
  );
};

// Función para obtener conferencistas por país
export const getConferencistasByPais = (pais: string): Conferencista[] => {
  return getAllConferencistas().filter(
    (conferencista) => conferencista.pais.toLowerCase() === pais.toLowerCase(),
  );
};

// Función para buscar conferencistas por nombre, apellido, país o área de experiencia
export const searchConferencistas = (query: string): Conferencista[] => {
  const lowerQuery = query.toLowerCase();
  return getAllConferencistas().filter((conferencista) => {
    return (
      conferencista.nombre.toLowerCase().includes(lowerQuery) ||
      (conferencista.apellido &&
        conferencista.apellido.toLowerCase().includes(lowerQuery)) ||
      conferencista.pais.toLowerCase().includes(lowerQuery) ||
      (conferencista.areasExperiencia &&
        conferencista.areasExperiencia.some((area) =>
          area.toLowerCase().includes(lowerQuery),
        ))
    );
  });
};

// Función para obtener conferencistas internacionales con título de conferencia
export const getConferencistasInternacionalesConTitulo =
  (): Conferencista[] => {
    return conferencistas.filter(
      (conferencista) =>
        conferencista.titulo !== null &&
        conferencista.tipo === 'internacional' &&
        conferencista.show,
    );
  };

// Función para obtener conferencistas nacionales con título de conferencia
export const getConferencistasNacionalesConTitulo = (): Conferencista[] => {
  return conferencistas.filter(
    (conferencista) =>
      conferencista.titulo !== null &&
      conferencista.tipo === 'nacional' &&
      conferencista.show,
  );
};
