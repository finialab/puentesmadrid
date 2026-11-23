# PUENTES

Web estática del proyecto PUENTES para descubrir actividades culturales, deportivas y musicales en Madrid capital y facilitar el acompañamiento a jóvenes de 18 a 24 años.

El sitio está publicado actualmente en el dominio personalizado `findialab.me`. El nombre público del proyecto y de la web es **PUENTES**.

## Estructura
- `index.html`: portada, buscador y explicación del proyecto.
- `assets/css/puentes.css`: estilos adaptables a móvil y escritorio.
- `assets/js/puentes-data.js`: catálogo de recursos, distritos y configuración del correo.
- `assets/js/puentes.js`: filtros por distrito/categoría, lista de interés y formulario de contacto.

## Añadir el correo de contacto
Editar `assets/js/puentes-data.js` y completar `contactEmail`:
```js
contactEmail: "vuestro-correo@ejemplo.es"
```

El formulario utiliza `mailto:` para abrir el gestor de correo del visitante. No hay backend ni se envían datos automáticamente.

## Actualización del catálogo
Cada ficha enlaza a la fuente oficial del Ayuntamiento de Madrid. Comprobar horarios, tarifas, edades, requisitos y plazas antes de modificar una ficha. Actualizar `verifiedOn` cuando se vuelva a revisar el catálogo.

## Alcance y privacidad
El catálogo contiene 15 fichas seleccionadas de Madrid capital (cinco de cultura, cinco de deporte y cinco de música); no es un directorio exhaustivo ni garantiza plazas. El buscador permite elegir entre los 21 distritos y prioriza los distritos próximos.

La web no solicita dirección exacta, no usa GPS, no incorpora analítica ni almacena la lista de actividades. PUENTES se presenta como una iniciativa universitaria en desarrollo y no afirma colaboraciones que todavía no estén confirmadas.
