/* Catálogo PUENTES: recursos seleccionados dentro del municipio de Madrid.
   Fuentes municipales oficiales. Revisión: 23/11/2026.
   La selección no es un directorio exhaustivo ni garantiza plazas. */
window.PUENTES_CONFIG = {
  contactEmail: "", // AÑADIR AQUÍ EL CORREO DE CONTACTO DE PUENTES
  verifiedOn: "23/11/2026"
};

window.PUENTES_DISTRICTS = [
  "Arganzuela", "Barajas", "Carabanchel", "Centro", "Chamartín",
  "Chamberí", "Ciudad Lineal", "Fuencarral-El Pardo", "Hortaleza",
  "Latina", "Moncloa-Aravaca", "Moratalaz", "Puente de Vallecas",
  "Retiro", "Salamanca", "San Blas-Canillejas", "Tetuán", "Usera",
  "Vicálvaro", "Villa de Vallecas", "Villaverde"
];

/* Distritos colindantes aproximados para ordenar alternativas.
   No calcula kilómetros ni sustituye una ruta real. */
window.PUENTES_ADJACENCY = {
  "Arganzuela":["Centro","Retiro","Usera","Carabanchel"],
  "Barajas":["Hortaleza","San Blas-Canillejas"],
  "Carabanchel":["Latina","Usera","Arganzuela","Centro"],
  "Centro":["Arganzuela","Retiro","Salamanca","Chamberí","Moncloa-Aravaca","Latina"],
  "Chamartín":["Tetuán","Chamberí","Salamanca","Fuencarral-El Pardo","Hortaleza","Ciudad Lineal"],
  "Chamberí":["Centro","Salamanca","Chamartín","Tetuán","Moncloa-Aravaca"],
  "Ciudad Lineal":["Salamanca","Chamartín","Hortaleza","San Blas-Canillejas","Moratalaz"],
  "Fuencarral-El Pardo":["Tetuán","Chamartín","Hortaleza","Moncloa-Aravaca"],
  "Hortaleza":["Chamartín","Fuencarral-El Pardo","Ciudad Lineal","Barajas","San Blas-Canillejas"],
  "Latina":["Moncloa-Aravaca","Carabanchel","Centro"],
  "Moncloa-Aravaca":["Centro","Chamberí","Tetuán","Latina","Fuencarral-El Pardo"],
  "Moratalaz":["Retiro","Puente de Vallecas","Vicálvaro","Ciudad Lineal"],
  "Puente de Vallecas":["Retiro","Moratalaz","Usera","Villa de Vallecas","Vicálvaro"],
  "Retiro":["Centro","Arganzuela","Salamanca","Moratalaz","Puente de Vallecas"],
  "Salamanca":["Centro","Chamartín","Chamberí","Retiro","Ciudad Lineal"],
  "San Blas-Canillejas":["Ciudad Lineal","Hortaleza","Vicálvaro","Barajas"],
  "Tetuán":["Chamberí","Chamartín","Fuencarral-El Pardo","Moncloa-Aravaca"],
  "Usera":["Carabanchel","Arganzuela","Villaverde","Puente de Vallecas"],
  "Vicálvaro":["Moratalaz","Puente de Vallecas","Villa de Vallecas","San Blas-Canillejas"],
  "Villa de Vallecas":["Puente de Vallecas","Vicálvaro","Villaverde"],
  "Villaverde":["Usera","Carabanchel","Villa de Vallecas"]
};

window.PUENTES_ACTIVITIES = [
  /* CULTURA */
  {
    id:"cultura-lavapies", category:"cultura",
    title:"Programación del Centro Cultural Lavapiés",
    municipality:"Madrid", zone:"Centro", area:"Embajadores",
    address:"Calle del Olivar, 46, 28012 Madrid",
    summary:"Centro cultural municipal en el barrio de Embajadores, con espacios para actividades, talleres y actos culturales.",
    offer:"Consulta la programación cultural y los cursos y talleres municipales publicados para el centro.",
    access:"Horario general publicado: lunes a sábado, 9:00–14:00 y 16:30–21:15. Los horarios de actividades y secretaría pueden ser distintos.",
    price:"Precio según actividad; consultar la programación.", priceType:"varies",
    age:"Cada curso, taller o espectáculo indica sus propias condiciones.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/El-Ayuntamiento/Centro/Direcciones-y-telefonos/Centro-Cultural-Lavapies-Centro-/?vgnextchannel=cac1d47ffee28010VgnVCM100000dc0ca8c0RCRD&vgnextoid=5f891e79ee71c010VgnVCM1000000b205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Centro Cultural Lavapiés",
    mapsQuery:"Centro Cultural Lavapiés Calle Olivar 46 Madrid",
    note:"Centro municipal accesible. Comprueba en la agenda qué actividades tienen inscripción abierta."
  },
  {
    id:"cultura-casa-reloj", category:"cultura",
    title:"Centro Cultural Casa del Reloj",
    municipality:"Madrid", zone:"Arganzuela", area:"Chopera",
    address:"Paseo de la Chopera, 6, 28045 Madrid",
    summary:"Equipamiento cultural municipal de Arganzuela con programación cultural y espacios expositivos.",
    offer:"Talleres, exposiciones, conferencias y actividades culturales. Algunas propuestas se celebran también en la Nave de Terneras y en la sala La Lonja.",
    access:"Consulta la ficha de cada actividad para conocer el espacio, fecha, reserva y aforo.",
    price:"Hay actividades gratuitas; otras pueden tener condiciones propias.", priceType:"varies",
    age:"Depende de la actividad; revisa la recomendación de edad publicada.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Vivienda-urbanismo-y-obras/Direcciones-y-telefonos/Actividades-en-el-Centro-Cultural-Casa-del-Reloj/?vgnextchannel=acff31d3b28fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=b8ce2420dc891910VgnVCM1000001d4a900aRCRD",
    sourceName:"Ayuntamiento de Madrid · Casa del Reloj",
    mapsQuery:"Centro Cultural Casa del Reloj Paseo de la Chopera 6 Madrid",
    note:"La agenda municipal señala el lugar de celebración y las condiciones de cada propuesta."
  },
  {
    id:"cultura-nicolas-salmeron", category:"cultura",
    title:"Centro Cultural Nicolás Salmerón",
    municipality:"Madrid", zone:"Chamartín", area:"Ciudad Jardín",
    address:"Calle de Mantuano, 51, 28002 Madrid",
    summary:"Centro cultural municipal de Chamartín con sala de exposiciones, auditorio y aulas.",
    offer:"Exposiciones, actos y programación cultural del distrito. La ficha municipal recoge una sala de exposiciones, auditorio y 20 aulas.",
    access:"Horario del centro publicado: lunes a viernes, 7:30–22:00; sábados y domingos, 9:00–21:00. Consulta los horarios concretos de las actividades.",
    price:"Precio según actividad; consultar la agenda.", priceType:"varies",
    age:"Cada actividad establece sus condiciones de acceso.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Medio-ambiente/Parques-y-jardines/Direcciones-y-telefonos/Centro-Cultural-Nicolas-Salmeron-Chamartin-/?vgnextchannel=ebb679ed268fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=ee4a1e79ee71c010VgnVCM1000000b205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Nicolás Salmerón",
    mapsQuery:"Centro Cultural Nicolás Salmerón Calle Mantuano 51 Madrid",
    note:"Centro municipal accesible; la web oficial enlaza su programación y cursos."
  },
  {
    id:"cultura-eduardo-urculo", category:"cultura",
    title:"Centro Cultural Eduardo Úrculo",
    municipality:"Madrid", zone:"Tetuán", area:"Almenara",
    address:"Plaza de Donoso, 5, 28029 Madrid",
    summary:"Equipamiento cultural de Tetuán con salas de exposiciones, auditorio, aulas y programación de actividades.",
    offer:"Exposiciones, actividades culturales, cursos y talleres del distrito. Dispone de auditorio y aulas.",
    access:"Horario general publicado: lunes a sábado, 9:30–21:30. Domingos y festivos cerrado, salvo actividades programadas.",
    price:"Precio según actividad; consultar la programación.", priceType:"varies",
    age:"Comprueba la edad o los requisitos de cada taller o espectáculo.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Cultura-ocio-y-deporte/Cultura-y-ocio/Direcciones-y-telefonos/Centro-Cultural-Eduardo-Urculo-Tetuan-/?vgnextchannel=76f3efff228fe410VgnVCM2000000c205a0aRCRD&vgnextoid=f8f9338588355210VgnVCM1000000b205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Eduardo Úrculo",
    mapsQuery:"Centro Cultural Eduardo Urculo Plaza Donoso 5 Madrid",
    note:"La instalación municipal declara accesibilidad y bucle de inducción magnético."
  },
  {
    id:"cultura-antonio-machado", category:"cultura",
    title:"Centro Cultural Antonio Machado",
    municipality:"Madrid", zone:"San Blas-Canillejas", area:"Arcos",
    address:"Calle de San Román del Valle, 8, 28037 Madrid",
    summary:"Centro cultural municipal de San Blas-Canillejas con auditorio, salas de exposición, aulas y biblioteca.",
    offer:"Programación cultural del distrito. En noviembre de 2026 se publican espectáculos gratuitos y actividades periódicas.",
    access:"La ficha municipal publica horario general de 9:00 a 21:30. Para espectáculos gratuitos, la entrada se reparte una hora antes, hasta completar aforo, según la programación consultada.",
    price:"Los espectáculos indicados en la programación consultada son gratuitos; talleres y otras actividades pueden variar.", priceType:"varies",
    age:"La recomendación de edad se indica en cada actividad.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/El-Ayuntamiento/Chamartin/Direcciones-y-telefonos/Actividades-en-el-Centro-Cultural-Antonio-Machado/?vgnextchannel=b562d47ffee28010VgnVCM100000dc0ca8c0RCRD&vgnextfmt=default&vgnextoid=74f47a01d8641910VgnVCM2000001f4a900aRCRD",
    sourceName:"Ayuntamiento de Madrid · Actividades Antonio Machado",
    mapsQuery:"Centro Cultural Antonio Machado Calle San Roman del Valle 8 Madrid",
    note:"La ficha de programación muestra actividades y condiciones de entrada actualizadas por el distrito."
  },

  /* DEPORTE */
  {
    id:"deporte-san-anton", category:"deporte",
    title:"Centro Deportivo Municipal Escuelas de San Antón",
    municipality:"Madrid", zone:"Centro", area:"Justicia",
    address:"Calle de la Farmacia, 13, 28004 Madrid",
    summary:"Centro deportivo municipal en el distrito Centro. Comprueba directamente qué instalaciones, clases y plazas están disponibles.",
    offer:"Instalación deportiva municipal incluida en el directorio oficial de centros deportivos de Madrid.",
    access:"La inscripción, los horarios y las modalidades dependen de la instalación y del programa deportivo vigente.",
    price:"Consultar tarifa y disponibilidad con el centro.", priceType:"varies",
    age:"Las actividades municipales incluyen grupos jóvenes de 15 a 26 años; confirma la admisión en la actividad concreta.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/CulturaOcioDeporte/Deportes/Instalaciones/Listado-de-Centros-Deportivos-Municipales/?vgnextchannel=9b08151c238fe410VgnVCM2000000c205a0aRCRD&vgnextfmt=default&vgnextoid=cedc463ce6b74210VgnVCM2000000c205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Directorio de centros deportivos",
    mapsQuery:"Centro Deportivo Municipal Escuelas de San Anton Calle Farmacia 13 Madrid",
    note:"El directorio municipal publica dirección y datos de contacto. Consulta el centro antes de acudir."
  },
  {
    id:"deporte-arganzuela", category:"deporte",
    title:"Centro Deportivo Municipal Centro Integrado Arganzuela",
    municipality:"Madrid", zone:"Arganzuela", area:"Palos de la Frontera",
    address:"Calle de Palos de la Frontera, 40, 28045 Madrid",
    summary:"Centro deportivo municipal de Arganzuela incluido en la red de instalaciones del Ayuntamiento.",
    offer:"Consulta en el portal municipal las instalaciones, actividades dirigidas y modalidades disponibles en este centro.",
    access:"Las clases y escuelas municipales de la temporada 2026–2027 se desarrollan del 1 de septiembre de 2026 al 30 de junio de 2027. La oferta concreta depende del centro.",
    price:"Tarifas municipales según actividad y modalidad; consultar antes de inscribirse.", priceType:"varies",
    age:"La tarifa joven municipal comprende de 15 a 26 años para las actividades que la contemplen.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Cultura-ocio-y-deporte/Deportes/Instalaciones/Listado-de-Centros-Deportivos-Municipales/?vgnextchannel=9b08151c238fe410VgnVCM2000000c205a0aRCRD&vgnextfmt=default&vgnextoid=cedc463ce6b74210VgnVCM2000000c205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Directorio de centros deportivos",
    mapsQuery:"Centro Deportivo Municipal Centro Integrado Arganzuela Palos de la Frontera 40",
    note:"Comprueba en el centro los horarios, el sistema de inscripción y las plazas."
  },
  {
    id:"deporte-daoiz", category:"deporte",
    title:"Centro Deportivo Municipal Daoíz y Velarde 1",
    municipality:"Madrid", zone:"Retiro", area:"Pacífico",
    address:"Plaza de Daoíz y Velarde, 5, 28007 Madrid",
    summary:"Instalación deportiva municipal de Retiro, con atención y reservas a través de los canales municipales.",
    offer:"Consulta instalaciones, clases dirigidas y opciones de práctica deportiva disponibles en el centro.",
    access:"La disponibilidad de actividades y las inscripciones se gestionan por el centro y los canales deportivos municipales.",
    price:"Consultar tarifa y disponibilidad con el centro.", priceType:"varies",
    age:"Consulta las condiciones de edad de cada clase o instalación.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/CulturaOcioDeporte/Deportes/Instalaciones/Listado-de-Centros-Deportivos-Municipales/?vgnextchannel=9b08151c238fe410VgnVCM2000000c205a0aRCRD&vgnextfmt=default&vgnextoid=cedc463ce6b74210VgnVCM2000000c205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Directorio de centros deportivos",
    mapsQuery:"Centro Deportivo Municipal Daoiz y Velarde 1 Plaza Daoiz y Velarde 5 Madrid",
    note:"El directorio municipal indica que la instalación cuenta con accesibilidad para personas con movilidad reducida."
  },
  {
    id:"deporte-cea", category:"deporte",
    title:"Centro Deportivo Municipal Cea Bermúdez",
    municipality:"Madrid", zone:"Chamberí", area:"Vallehermoso",
    address:"Calle de Cea Bermúdez, 3, 28003 Madrid",
    summary:"Centro deportivo situado en Chamberí e incluido en el directorio oficial municipal.",
    offer:"Consulta directamente el catálogo del centro para conocer las instalaciones, actividades dirigidas y plazas.",
    access:"Los horarios, las reservas y las inscripciones dependen de la actividad y del sistema del centro.",
    price:"Consultar tarifas del centro y de cada actividad.", priceType:"varies",
    age:"Comprueba los requisitos y grupos de edad de cada modalidad.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/CulturaOcioDeporte/Deportes/Instalaciones/Listado-de-Centros-Deportivos-Municipales/?vgnextchannel=9b08151c238fe410VgnVCM2000000c205a0aRCRD&vgnextfmt=default&vgnextoid=cedc463ce6b74210VgnVCM2000000c205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Directorio de centros deportivos",
    mapsQuery:"Centro Deportivo Municipal Cea Bermudez Calle Cea Bermudez 3 Madrid",
    note:"El directorio municipal incluye dirección y teléfono; consulta la oferta antes de desplazarte."
  },
  {
    id:"deporte-triangulo", category:"deporte",
    title:"Centro Deportivo Municipal Triángulo de Oro",
    municipality:"Madrid", zone:"Tetuán", area:"Valdeacederas",
    address:"Calle de Bravo Murillo, 376, 28020 Madrid",
    summary:"Centro deportivo municipal situado en el distrito de Tetuán.",
    offer:"Consulta las instalaciones, modalidades y clases disponibles en el centro mediante el directorio y el portal de deportes municipal.",
    access:"La inscripción y las plazas dependen de cada actividad y temporada.",
    price:"Consultar tarifas y condiciones vigentes.", priceType:"varies",
    age:"Confirma las condiciones de edad para cada actividad.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/CulturaOcioDeporte/Deportes/Instalaciones/Listado-de-Centros-Deportivos-Municipales/?vgnextchannel=9b08151c238fe410VgnVCM2000000c205a0aRCRD&vgnextfmt=default&vgnextoid=cedc463ce6b74210VgnVCM2000000c205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Directorio de centros deportivos",
    mapsQuery:"Centro Deportivo Municipal Triangulo de Oro Calle Bravo Murillo 376 Madrid",
    note:"La ficha municipal informa de la accesibilidad de la instalación."
  },

  /* MÚSICA */
  {
    id:"musica-maria-dolores", category:"musica",
    title:"Escuela Municipal de Música y Danza María Dolores Pradera",
    municipality:"Madrid", zone:"Centro", area:"Justicia",
    address:"Calle de la Farmacia, 13, 28004 Madrid",
    summary:"Escuela municipal de música y danza ubicada en el distrito Centro.",
    offer:"Enseñanzas municipales de música y danza. Consulta con la escuela las especialidades, edades y proceso de admisión del curso.",
    access:"Secretaría telefónica de lunes a viernes, de 17:00 a 20:00, según el directorio municipal. La matrícula depende de convocatoria y plazas.",
    price:"Consultar tasas municipales y proceso de admisión.", priceType:"varies",
    age:"Consulta con la escuela las edades y requisitos por enseñanza.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Educacion-y-empleo/Educacion/Direcciones-y-telefonos/Escuelas-Municipales-de-Musica-y-Danza/?idCapitulo=3026067&vgnextchannel=c031c5dee78fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=5e62d16aad6ba010VgnVCM10000026205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Escuelas Municipales de Música y Danza",
    mapsQuery:"Escuela Municipal de Música y Danza Maria Dolores Pradera Calle Farmacia 13 Madrid",
    note:"Teléfono 917 959 898. Correo municipal: emcentro@madrid.es."
  },
  {
    id:"musica-almudena-cano", category:"musica",
    title:"Escuela Municipal de Música Almudena Cano",
    municipality:"Madrid", zone:"Arganzuela", area:"Palos de la Frontera",
    address:"Pasaje de Tortosa, 4, 28045 Madrid",
    summary:"Escuela municipal de música del distrito de Arganzuela.",
    offer:"Formación musical municipal. Pregunta por especialidades instrumentales, grupos, admisión y vacantes.",
    access:"Atención telefónica de lunes a viernes, de 17:00 a 20:00, según el directorio municipal. Comprueba el plazo de solicitud del curso.",
    price:"Consultar tasas municipales y proceso de admisión.", priceType:"varies",
    age:"Consulta con la escuela las edades y requisitos por enseñanza.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Educacion-y-empleo/Educacion/Direcciones-y-telefonos/Escuelas-Municipales-de-Musica-y-Danza/?idCapitulo=3026067&vgnextchannel=c031c5dee78fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=5e62d16aad6ba010VgnVCM10000026205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Escuelas Municipales de Música y Danza",
    mapsQuery:"Escuela Municipal de Música Almudena Cano Pasaje Tortosa 4 Madrid",
    note:"Teléfono 915 062 722. Correo municipal: emarganzuela@madrid.es."
  },
  {
    id:"musica-placido", category:"musica",
    title:"Escuela Municipal de Música y Danza Plácido Domingo",
    municipality:"Madrid", zone:"Retiro", area:"Adelfas",
    address:"Calle de Téllez, 31, 28007 Madrid",
    summary:"Escuela municipal de música y danza situada en el distrito de Retiro.",
    offer:"Formación municipal en música y danza. Consulta asignaturas, instrumentos, grupos y plazas para el curso vigente.",
    access:"Atención telefónica de lunes a viernes, de 17:00 a 20:00, según el directorio municipal. La admisión depende del proceso anual.",
    price:"Consultar tasas municipales y proceso de admisión.", priceType:"varies",
    age:"Consulta con la escuela las edades y requisitos por enseñanza.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Educacion-y-empleo/Educacion/Direcciones-y-telefonos/Escuelas-Municipales-de-Musica-y-Danza/?idCapitulo=3026067&vgnextchannel=c031c5dee78fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=5e62d16aad6ba010VgnVCM10000026205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Escuelas Municipales de Música y Danza",
    mapsQuery:"Escuela Municipal de Música y Danza Placido Domingo Calle Tellez 31 Madrid",
    note:"Teléfono 914 338 558. Correo municipal: emplacidodomingo@madrid.es."
  },
  {
    id:"musica-maria-rodrigo", category:"musica",
    title:"Escuela Municipal de Música María Rodrigo",
    municipality:"Madrid", zone:"Chamartín", area:"Ciudad Jardín",
    address:"Calle de Mantuano, 51, 28002 Madrid",
    summary:"Escuela municipal de música situada en el distrito de Chamartín.",
    offer:"Enseñanza musical municipal. Contacta con la escuela para conocer especialidades, admisión y disponibilidad de plazas.",
    access:"Atención telefónica de lunes a viernes, de 17:00 a 20:00, según el directorio municipal.",
    price:"Consultar tasas municipales y proceso de admisión.", priceType:"varies",
    age:"Consulta con la escuela las edades y requisitos por enseñanza.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Educacion-y-empleo/Educacion/Direcciones-y-telefonos/Escuelas-Municipales-de-Musica-y-Danza/?idCapitulo=3026067&vgnextchannel=c031c5dee78fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=5e62d16aad6ba010VgnVCM10000026205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Escuelas Municipales de Música y Danza",
    mapsQuery:"Escuela Municipal de Música Maria Rodrigo Calle Mantuano 51 Madrid",
    note:"Teléfono 915 152 351. Correo municipal: emmrodrigo@madrid.es."
  },
  {
    id:"musica-vazquez-montalban", category:"musica",
    title:"Escuela Municipal de Música Manuel Vázquez Montalbán",
    municipality:"Madrid", zone:"Tetuán", area:"Bellas Vistas",
    address:"Calle de Francos Rodríguez, 67, 28039 Madrid",
    summary:"Escuela municipal de música del distrito de Tetuán.",
    offer:"Enseñanza musical municipal. Consulta con el centro la oferta instrumental, los grupos y el proceso de acceso.",
    access:"Atención telefónica de lunes a viernes, de 17:00 a 20:00, según el directorio municipal.",
    price:"Consultar tasas municipales y proceso de admisión.", priceType:"varies",
    age:"Consulta con la escuela las edades y requisitos por enseñanza.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/Educacion-y-empleo/Educacion/Direcciones-y-telefonos/Escuelas-Municipales-de-Musica-y-Danza/?idCapitulo=3026067&vgnextchannel=c031c5dee78fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=5e62d16aad6ba010VgnVCM10000026205a0aRCRD",
    sourceName:"Ayuntamiento de Madrid · Escuelas Municipales de Música y Danza",
    mapsQuery:"Escuela Municipal de Música Manuel Vazquez Montalban Calle Francos Rodriguez 67 Madrid",
    note:"Teléfono 913 118 748. Correo municipal: emmvmontalban@madrid.es."
  }
];