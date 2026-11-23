/* Catálogo inicial PUENTES.
   Fuentes oficiales enlazadas en cada ficha. Revisado el 23-11-2026.
   No se trata de un directorio exhaustivo ni garantiza plazas disponibles. */
window.PUENTES_CONFIG = {
  contactEmail: "", // AÑADIR AQUÍ EL CORREO DE CONTACTO DE PUENTES
  verifiedOn: "23/11/2026"
};

window.PUENTES_ZONES = {
  "Madrid capital": ["Madrid", "Otro municipio o distrito de Madrid"],
  "Corredor del Henares": ["Alcalá de Henares", "Otro municipio del Corredor"],
  "Sur metropolitano": ["Móstoles", "Otro municipio del sur"],
  "Noroeste": ["Las Rozas de Madrid", "Otro municipio del noroeste"],
  "Sierra Norte": ["Buitrago del Lozoya", "La Cabrera", "Otro municipio de la Sierra Norte"],
  "Sierra Oeste": ["San Lorenzo de El Escorial", "Otro municipio de la Sierra Oeste"],
  "Sureste y Vegas": ["Rivas-Vaciamadrid", "Aranjuez", "Otro municipio del sureste"]
};

window.PUENTES_ACTIVITIES = [
  {
    id:"cultura-ca2m", category:"cultura", title:"Museo Centro de Arte Dos de Mayo (CA2M)",
    municipality:"Móstoles", zone:"Sur metropolitano", area:"Sur metropolitano",
    address:"Avda. Constitución, 23, 28931 Móstoles, Madrid",
    summary:"Arte contemporáneo, exposiciones y actividades culturales en un museo público de la Comunidad de Madrid.",
    offer:"Exposiciones y actividades del centro. La entrada al museo y a todas sus actividades es gratuita.",
    access:"Abierto de martes a domingo, de 11:00 a 21:00. Lunes cerrado. Comprueba la agenda antes de ir.",
    price:"Gratis", priceType:"free", age:"Público general; revisa las condiciones de cada actividad.",
    officialUrl:"https://ca2m.org/el-museo/planifica-tu-visita",
    sourceName:"CA2M · Comunidad de Madrid", mapsQuery:"Museo Centro de Arte Dos de Mayo Móstoles",
    note:"El centro publica su calendario de exposiciones y actividades en su web oficial."
  },
  {
    id:"cultura-marpa", category:"cultura", title:"Museo Arqueológico y Paleontológico (MARPA)",
    municipality:"Alcalá de Henares", zone:"Corredor del Henares", area:"Corredor del Henares",
    address:"Plaza de las Bernardas, s/n, 28801 Alcalá de Henares, Madrid",
    summary:"Un recorrido por la historia y el patrimonio arqueológico de la Comunidad de Madrid.",
    offer:"Exposición permanente, exposiciones temporales, visitas guiadas, conferencias, talleres y actividades culturales.",
    access:"Martes a sábado, 11:00–19:00; domingos y festivos, 11:00–15:00. Lunes cerrado. Centro accesible.",
    price:"Entrada y actividades gratuitas", priceType:"free", age:"Público general; algunas actividades pueden tener condiciones específicas.",
    officialUrl:"https://www.comunidad.madrid/centros/museo-arqueologico-paleontologico-comunidad-madrid",
    sourceName:"Comunidad de Madrid · MARPA", mapsQuery:"Museo Arqueológico y Paleontológico Comunidad de Madrid Alcalá de Henares",
    note:"Consulta la agenda oficial para conocer las visitas y talleres disponibles."
  },
  {
    id:"cultura-picasso", category:"cultura", title:"Museo Picasso – Colección Eugenio Arias",
    municipality:"Buitrago del Lozoya", zone:"Sierra Norte", area:"Sierra Norte",
    address:"Plaza de Picasso, 1, 28730 Buitrago del Lozoya, Madrid",
    summary:"Una colección singular de obras, objetos y recuerdos relacionados con la amistad entre Picasso y su barbero Eugenio Arias.",
    offer:"Visita al museo y exposiciones temporales. Las visitas guiadas son gratuitas los domingos, de 12:00 a 13:30, excepto agosto, y no requieren reserva previa.",
    access:"Consulta la información práctica y las exposiciones vigentes en la web oficial antes de desplazarte.",
    price:"Entrada y actividades gratuitas", priceType:"free", age:"Público general.",
    officialUrl:"https://www.comunidad.madrid/centros/museo-picasso-coleccion-eugenio-arias",
    sourceName:"Comunidad de Madrid · Museo Picasso", mapsQuery:"Museo Picasso Colección Eugenio Arias Buitrago del Lozoya",
    note:"La ficha oficial confirma la gratuidad de la entrada y de las actividades organizadas por la Comunidad."
  },
  {
    id:"cultura-cchsn", category:"cultura", title:"Centro Comarcal de Humanidades Sierra Norte",
    municipality:"La Cabrera", zone:"Sierra Norte", area:"Sierra Norte",
    address:"Avda. de la Cabrera, 96, 28751 La Cabrera, Madrid",
    summary:"Espacio cultural de referencia para municipios de la Sierra Norte, con programación artística y comunitaria.",
    offer:"Exposiciones, cine, talleres, teatro, actividades participativas y un gabinete artístico.",
    access:"Consulta la programación mensual y las condiciones de inscripción o compra de entradas de cada actividad.",
    price:"Hay propuestas gratuitas y de pago; depende de la actividad.", priceType:"varies", age:"Público general; cada actividad puede establecer sus propios requisitos.",
    officialUrl:"https://www.comunidad.madrid/centros/centro-comarcal-humanidades-sierra-norte",
    sourceName:"Comunidad de Madrid · CCH Sierra Norte", mapsQuery:"Centro Comarcal de Humanidades Sierra Norte La Cabrera",
    note:"La programación incluye distintos formatos y precios. Comprueba la agenda actualizada."
  },
  {
    id:"cultura-pacorabal", category:"cultura", title:"Centro Cultural Paco Rabal",
    municipality:"Madrid", zone:"Madrid capital", area:"Madrid capital",
    address:"C/ Felipe de Diego, 13, 28018 Madrid",
    summary:"Centro cultural de Vallecas con biblioteca, exposiciones, talleres y programación escénica.",
    offer:"Talleres de teatro, cine, dibujo, pintura, cerámica y otras disciplinas; biblioteca y sala de exposiciones.",
    access:"Las inscripciones a talleres se organizan por convocatorias. Consulta en la web oficial las próximas fechas, plazas y requisitos.",
    price:"El coste depende del taller o actividad.", priceType:"varies", age:"Consulta la edad admitida en cada taller.",
    officialUrl:"https://www.comunidad.madrid/centros/centro-cultural-paco-rabal",
    sourceName:"Comunidad de Madrid · Centro Cultural Paco Rabal", mapsQuery:"Centro Cultural Paco Rabal Madrid",
    note:"No se garantiza que las inscripciones estén abiertas: consulta la convocatoria vigente."
  },

  {
    id:"deporte-madrid", category:"deporte", title:"Clases y escuelas deportivas municipales",
    municipality:"Madrid", zone:"Madrid capital", area:"Madrid capital",
    address:"Varios centros deportivos municipales de Madrid",
    summary:"Actividades deportivas dirigidas en centros municipales de distintos distritos de la ciudad.",
    offer:"Escuelas y clases deportivas. La oferta concreta depende del centro y de las plazas disponibles.",
    access:"La temporada municipal 2026–2027 va del 1 de septiembre de 2026 al 30 de junio de 2027. Consulta la actividad y el centro antes de reservar.",
    price:"Tarifa juvenil publicada para 15–26 años: 10,40 €/mes por una sesión semanal. Actividad abierta: 3 €. Confirma la tarifa de cada centro.", priceType:"published", priceValue:10.4,
    age:"La tarifa juvenil publicada comprende de 15 a 26 años; la admisión depende de la actividad.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Clases-y-escuelas-deportivas/",
    sourceName:"Ayuntamiento de Madrid · Clases y escuelas deportivas", mapsQuery:"",
    note:"La inscripción y disponibilidad se consultan por centro y actividad."
  },
  {
    id:"deporte-navalcarbon", category:"deporte", title:"Polideportivo Dehesa de Navalcarbón",
    municipality:"Las Rozas de Madrid", zone:"Noroeste", area:"Noroeste",
    address:"Avda. Nuestra Señora del Retamar, s/n, Las Rozas de Madrid",
    summary:"Instalación municipal con espacios para practicar deporte de forma dirigida o de uso libre.",
    offer:"Piscina, fitness, pádel, tenis, atletismo, pabellón, ciclo indoor y escuelas infantiles y juveniles, entre otros servicios.",
    access:"Consulta horarios, cursos, condiciones de acceso y disponibilidad en la página municipal.",
    price:"Tarifas según actividad, modalidad y condiciones de uso. Consultar precio vigente.", priceType:"varies",
    age:"La oferta varía por curso y actividad; confirma las edades admitidas.",
    officialUrl:"https://www.lasrozas.es/deportes/instalaciones/navalcarbon",
    sourceName:"Ayuntamiento de Las Rozas · Dehesa de Navalcarbón", mapsQuery:"Polideportivo Dehesa de Navalcarbón Las Rozas",
    note:"La web municipal publica horarios, instalaciones y actividades del centro."
  },
  {
    id:"deporte-andres", category:"deporte", title:"Polideportivo Municipal Andrés Torrejón",
    municipality:"Móstoles", zone:"Sur metropolitano", area:"Sur metropolitano",
    address:"Avda. Iker Casillas, s/n, Móstoles, Madrid",
    summary:"Instalación municipal con espacios deportivos y actividades realizadas también por entidades colaboradoras.",
    offer:"Entre las opciones vinculadas al centro figuran atletismo, BMX, fútbol, patinaje, hockey y otras actividades de clubes.",
    access:"Consulta las plazas en la instalación. Para las actividades del Andrés Torrejón, la información municipal indica la gestión administrativa a través de la Piscina de Las Cumbres.",
    price:"Consultar tarifa y plazas con Móstoles Deporte.", priceType:"varies",
    age:"Confirma con el club o instalación la edad de admisión de cada actividad.",
    officialUrl:"https://www.mostoles.es/MostolesDeporte/es/instalaciones-plazas-libres-solicitud-espacios/directorio-instalaciones/polideportivo-municipal-andres-torrejon",
    sourceName:"Móstoles Deporte · Andrés Torrejón", mapsQuery:"Polideportivo Municipal Andrés Torrejón Móstoles",
    note:"La inscripción requiere comprobar primero la existencia de plazas."
  },
  {
    id:"deporte-cerro", category:"deporte", title:"Polideportivo Cerro del Telégrafo",
    municipality:"Rivas-Vaciamadrid", zone:"Sureste y Vegas", area:"Sureste y Vegas",
    address:"Avenida de los Almendros, s/n, 28522 Rivas-Vaciamadrid, Madrid",
    summary:"Complejo municipal con numerosas instalaciones y servicios deportivos.",
    offer:"Atletismo, baloncesto, béisbol, escalada, fútbol sala, musculación, natación, patinaje, pádel, tenis y voleibol, entre otros.",
    access:"Para acceder a determinadas instalaciones y reservar pistas se requiere alta como usuario y cita previa en el portal municipal.",
    price:"Consultar tarifas y condiciones de uso con la Concejalía de Deportes.", priceType:"varies",
    age:"Comprueba las condiciones de edad de cada actividad o escuela.",
    officialUrl:"https://www.rivasciudad.es/equipamiento/polideportivo-cerro-del-telegrafo/",
    sourceName:"Ayuntamiento de Rivas · Cerro del Telégrafo", mapsQuery:"Polideportivo Cerro del Telégrafo Rivas Vaciamadrid",
    note:"La página oficial explica las instalaciones, servicios y el procedimiento de reserva."
  },
  {
    id:"deporte-agustin", category:"deporte", title:"Polideportivo Municipal Agustín Marañón",
    municipality:"Aranjuez", zone:"Sureste y Vegas", area:"Sureste y Vegas",
    address:"C/ Primero de Mayo, 4, Aranjuez, Madrid",
    summary:"Instalación municipal con deportes de equipo, actividades individuales y espacios de entrenamiento.",
    offer:"Baloncesto, balonmano, hockey patines, patinaje, natación, tenis, gimnasia, karate, bádminton, yoga, judo, taichí y fútbol sala, entre otras opciones.",
    access:"Consulta con el polideportivo las actividades, horarios y plazas disponibles.",
    price:"El Ayuntamiento publica tasas deportivas; el importe depende del servicio.", priceType:"varies",
    age:"Confirma con la instalación las condiciones de edad de cada actividad.",
    officialUrl:"https://www.aranjuez.es/deportes/instalaciones/agustinmaranon/",
    sourceName:"Ayuntamiento de Aranjuez · Agustín Marañón", mapsQuery:"Polideportivo Municipal Agustín Marañón Aranjuez",
    note:"La ficha municipal incluye teléfono, horario, actividades y enlace a las tasas."
  },

  {
    id:"musica-rio-esmeralda", category:"musica", title:"Estudio de Grabación Río Esmeralda",
    municipality:"Madrid", zone:"Madrid capital", area:"Madrid capital",
    address:"Calle Río Esmeralda, 15, 28018 Madrid",
    summary:"Espacio municipal de Puente de Vallecas para aprender, crear y desarrollar proyectos musicales y sonoros.",
    offer:"La información municipal incluye talleres de producción de sonido, clases de piano y batería, asesoría y grabación de sonido.",
    access:"La ficha municipal indica inscripción mediante formulario en línea y confirmación de plaza por correo o teléfono. Comprueba que la convocatoria esté abierta.",
    price:"Gratuito; requisito publicado: estar empadronado/a en el distrito de Puente de Vallecas.", priceType:"free",
    age:"El centro ofrece programación para población juvenil, adulta y mayor; confirma las condiciones de edad de cada actividad musical.",
    officialUrl:"https://www.madrid.es/portales/munimadrid/es/Inicio/El-Ayuntamiento/San-Blas-Canillejas/Actividades-y-eventos/Actividades-en-el-Centro-Intergeneracional-Rio-Esmeralda/?vgnextchannel=3ef6d47ffee28010VgnVCM100000dc0ca8c0RCRD&vgnextfmt=default&vgnextoid=209713a27b142910VgnVCM2000001f4a900aRCRD",
    sourceName:"Ayuntamiento de Madrid · Centro Intergeneracional Río Esmeralda", mapsQuery:"Centro Intergeneracional Río Esmeralda Madrid",
    note:"La gratuidad está sujeta al empadronamiento en Puente de Vallecas. Confirma la convocatoria y las plazas antes de acudir."
  },
  {
    id:"musica-cchsn", category:"musica", title:"Música y conciertos en Sierra Norte",
    municipality:"La Cabrera", zone:"Sierra Norte", area:"Sierra Norte",
    address:"Avda. de la Cabrera, 96, 28751 La Cabrera, Madrid",
    summary:"Programación musical y actividades culturales en el Centro Comarcal de Humanidades Sierra Norte.",
    offer:"La agenda del centro incluye conciertos, música y flamenco, además de talleres y otras propuestas escénicas.",
    access:"Consulta la programación mensual para conocer fechas, reserva y lugar exacto del evento.",
    price:"Hay actividades gratuitas y otras con entrada; depende del evento.", priceType:"varies",
    age:"Comprueba la recomendación de edad de cada espectáculo.",
    officialUrl:"https://www.comunidad.madrid/centros/centro-comarcal-humanidades-sierra-norte",
    sourceName:"Comunidad de Madrid · Agenda CCH Sierra Norte", mapsQuery:"Centro Comarcal de Humanidades Sierra Norte La Cabrera",
    note:"La agenda oficial se actualiza por meses y recoge condiciones de cada evento."
  },
  {
    id:"musica-escorial", category:"musica", title:"Teatro Auditorio de San Lorenzo de El Escorial",
    municipality:"San Lorenzo de El Escorial", zone:"Sierra Oeste", area:"Sierra Oeste",
    address:"Parque Felipe II, 28200 San Lorenzo de El Escorial, Madrid",
    summary:"Auditorio de la Comunidad de Madrid con programación musical y conciertos.",
    offer:"El espacio acoge conciertos y otras propuestas escénicas. La Comunidad de Madrid anunció una temporada de la ORCAM en este auditorio durante 2026.",
    access:"Consulta la cartelera oficial para próximos conciertos, disponibilidad y compra de entradas.",
    price:"Precio según concierto y localidad; consultar cartelera.", priceType:"varies",
    age:"Comprueba las condiciones del espectáculo.",
    officialUrl:"https://www.comunidad.madrid/centros/teatro-auditorio-san-lorenzo-escorial",
    sourceName:"Comunidad de Madrid · Teatro Auditorio", mapsQuery:"Teatro Auditorio San Lorenzo de El Escorial",
    note:"La dirección oficial incluye indicaciones de autobús y tren."
  },
  {
    id:"musica-pilar", category:"musica", title:"Auditorio Pilar Bardem",
    municipality:"Rivas-Vaciamadrid", zone:"Sureste y Vegas", area:"Sureste y Vegas",
    address:"Calle Fundición, 1, 28522 Rivas-Vaciamadrid, Madrid",
    summary:"Auditorio municipal que programa artes escénicas y actuaciones musicales.",
    offer:"Conciertos y actividades de música, además de danza, teatro, pequeñas óperas y zarzuela.",
    access:"Consulta la agenda de Rivas y la taquilla para conocer la fecha, disponibilidad y compra de cada espectáculo.",
    price:"Precio según evento; consultar la agenda oficial.", priceType:"varies",
    age:"Comprueba la recomendación de edad de cada espectáculo.",
    officialUrl:"https://www.rivasciudad.es/equipamiento/auditorio-pilar-bardem/",
    sourceName:"Ayuntamiento de Rivas · Auditorio Pilar Bardem", mapsQuery:"Auditorio Pilar Bardem Rivas Vaciamadrid",
    note:"El Ayuntamiento publica dirección, contacto y datos de taquilla."
  },
  {
    id:"musica-aranjuez", category:"musica", title:"Agenda municipal de música y conciertos de Aranjuez",
    municipality:"Aranjuez", zone:"Sureste y Vegas", area:"Sureste y Vegas",
    address:"Varios espacios municipales de Aranjuez",
    summary:"Agenda oficial para descubrir conciertos, festivales y actividades musicales en Aranjuez.",
    offer:"La programación municipal incluye conciertos, música antigua, festivales y actuaciones en distintos espacios de la ciudad.",
    access:"Consulta la agenda para conocer la ubicación, fecha, reserva y condiciones de cada actuación.",
    price:"Hay eventos gratuitos y otros de pago; el precio se indica en cada evento.", priceType:"varies",
    age:"Comprueba las condiciones de cada evento.",
    officialUrl:"https://www.aranjuez.es/agenda/",
    sourceName:"Ayuntamiento de Aranjuez · Agenda", mapsQuery:"",
    note:"La agenda cambia cada mes; esta ficha enlaza al calendario oficial, no a un evento permanente."
  }
];