# PUENTES · Comunidad y actividades en Madrid

Nueva web estática para el proyecto PUENTES. Sustituye la antigua portada de FindIA Lab y mantiene el dominio personalizado `findialab.me`.

## Estructura
- `index.html`: landing page y buscador.
- `assets/css/puentes.css`: estilos responsive.
- `assets/js/puentes-data.js`: catálogo curado, zonas y configuración de contacto.
- `assets/js/puentes.js`: filtros, selección y borrador de contacto.

## Añadir el correo de contacto
Editar `assets/js/puentes-data.js` y completar:
```js
contactEmail: "vuestro-correo@ejemplo.es"
```

El formulario usa `mailto:` para abrir el gestor de correo del visitante. No hay backend ni se envían datos automáticamente.

## Actualización del catálogo
Cada ficha contiene un enlace a su fuente oficial. Comprobar siempre horarios, tarifas, edades, requisitos y plazas antes de modificar la ficha. La fecha de revisión actual es 23/11/2026; actualizar también `verifiedOn` cuando se vuelva a revisar el catálogo.

## Privacidad y alcance
La web no solicita una dirección exacta, no usa GPS, no incorpora analítica ni almacena selecciones. La lista de actividades vive solo en la memoria de la página mientras está abierta. PUENTES se presenta como iniciativa universitaria en desarrollo, sin afirmar colaboraciones no confirmadas.

El catálogo contiene 15 fichas seleccionadas y no constituye un inventario completo de los recursos de la Comunidad de Madrid.