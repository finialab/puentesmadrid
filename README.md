# FINDIA PUENTES

Web estática del proyecto FINDIA PUENTES para descubrir actividades culturales, deportivas y musicales en Madrid capital y facilitar el acompañamiento a jóvenes de 18 a 24 años.

El sitio está publicado actualmente en el dominio personalizado `findialab.me`. El nombre público del proyecto y de la web es **FINDIA PUENTES**.

## Estructura
- `index.html`: portada, buscador y explicación del proyecto.
- `assets/css/puentes.css`: estilos adaptables a móvil y escritorio.
- `assets/js/puentes-data.js`: catálogo de recursos, distritos y configuración del correo.
- `assets/js/puentes.js`: filtros por distrito/categoría, lista de interés y formulario de contacto.

## Configurar el correo de contacto
1. Crear o elegir un buzón del equipo al que queráis recibir las consultas.
2. Abrir `assets/js/puentes-data.js`.
3. Sustituir el valor vacío de `contactEmail` por la dirección real:
```js
contactEmail: "correo-real-del-equipo@ejemplo.es"
```
4. Guardar y publicar el cambio en la rama `main`.

El formulario usa `mailto:`: abre la aplicación de correo del visitante con asunto y mensaje preparados, incluida su lista de actividades y los costes que pide comprobar. La persona debe revisar y enviar el mensaje desde su correo. No existe backend, no se envía nada automáticamente y la web no recibe una copia. Si el visitante no tiene una aplicación de correo configurada, puede copiar la consulta y enviarla manualmente.

## Precios y ordenación
Las opciones se ordenan por prioridad de coste: oportunidades con posibilidades gratuitas primero, después tarifas municipales de bajo coste y finalmente precios que requieren confirmación. Las tarifas deportivas y de música enlazan al documento oficial consultado. Para recursos culturales no existe tarifa única, por lo que se explica que el precio depende del evento. En clubes privados se recomienda comprobar cuota, matrícula, licencia/seguro, equipación y transporte por separado.

## Actualización del catálogo
Cada ficha enlaza a la fuente oficial del Ayuntamiento de Madrid. Comprobar horarios, tarifas, edades, requisitos y plazas antes de modificar una ficha. Actualizar `verifiedOn` cuando se vuelva a revisar el catálogo.

## Alcance y privacidad
El catálogo contiene 15 fichas seleccionadas de Madrid capital (cinco de cultura, cinco de deporte y cinco de música); no es un directorio exhaustivo ni garantiza plazas. La lista de interés es temporal y permanece solo mientras la página está abierta. El buscador permite elegir entre los 21 distritos y prioriza los distritos próximos.

La web no solicita dirección exacta, no usa GPS, no incorpora analítica ni almacena la lista de actividades en un servidor. El equipo debe revisar y aprobar el protocolo de privacidad, consentimiento y responsabilidades antes de iniciar un piloto con participantes. FINDIA PUENTES se presenta como una iniciativa universitaria en desarrollo y no afirma colaboraciones que todavía no estén confirmadas.
