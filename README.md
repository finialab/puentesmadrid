# FINDIA PUENTES

Web estática del proyecto FINDIA PUENTES para descubrir actividades culturales, deportivas y musicales en Madrid capital y facilitar el acompañamiento a jóvenes de 18 a 24 años.

El sitio está publicado actualmente en el dominio personalizado `findialab.me`. El nombre público del proyecto y de la web es **FINDIA PUENTES**.

## Estructura
- `index.html`: portada, buscador y explicación del proyecto.
- `assets/css/puentes.css`: estilos adaptables a móvil y escritorio.
- `assets/js/puentes-data.js`: catálogo de recursos, distritos y configuración del correo.
- `assets/js/puentes.js`: filtros por distrito/categoría, lista de interés y formulario de contacto.

## Configurar el correo de contacto
El formulario envía sus datos mediante un POST HTML nativo a una aplicación web de Google Apps Script. El script utiliza el servicio oficial MailApp y remite cada solicitud a un destinatario fijo.

1. Abrir https://script.google.com/home/projects/create con la cuenta Google que enviará las solicitudes.
2. Copiar apps-script/Code.gs al archivo Code.gs del proyecto. En el editor, mostrar el archivo de manifiesto appsscript.json y sustituirlo por el contenido del repositorio.
3. Seleccionar y ejecutar authorizeServices una vez; conceder el permiso para enviar correo.
4. En Deploy → New deployment → Web app, seleccionar Execute as: Me y Who has access: Anyone. Publicar y copiar la URL terminada en /exec.
5. Comprobar que esa URL aparece en submissionEndpoint dentro de assets/js/puentes-data.js y en el atributo action del formulario de mi-lista.html. El destinatario por defecto es contacto@findialab.me.
6. Cada vez que se cambie Code.gs, abrir Deploy → Manage deployments → Edit → New version → Deploy. Guardar el código en el editor no actualiza por sí solo la versión publicada.

El botón utiliza el POST nativo del navegador; no depende de AJAX, de una clave Turnstile ni de un servicio de terceros. El formulario también incluye un campo trampa, validación de datos, una casilla obligatoria de aceptación del aviso de privacidad y las condiciones de uso, un máximo de 30 correos diarios, una pausa global de ocho segundos y un envío por dirección cada 60 segundos. Si el JavaScript de la página no carga, el servidor construye un mensaje alternativo con los campos rellenados.

Para una prueba de entrega independiente, ejecutar manualmente testMailDelivery desde el editor; envía un único correo de prueba al destinatario actual. Si se prefiere entregar directamente a otro buzón y evitar el alias/reenvío del dominio, añadir la propiedad privada MAIL_RECIPIENT en Script Properties. No guardar direcciones personales ni secretos en el repositorio.

El correo sale desde la cuenta Google propietaria de la aplicación y utiliza la dirección del visitante como Reply-To. La publicación de una nueva versión de Apps Script y la autorización del correo requieren una acción del propietario de esa cuenta. No deben compartirse contraseñas ni claves privadas.
## Precios y ordenación
Las opciones se ordenan por prioridad de coste: oportunidades con posibilidades gratuitas primero, después tarifas municipales de bajo coste y finalmente precios que requieren confirmación. Las tarifas deportivas y de música enlazan al documento oficial consultado. Para recursos culturales no existe tarifa única, por lo que se explica que el precio depende del evento. En clubes privados se recomienda comprobar cuota, matrícula, licencia/seguro, equipación y transporte por separado.

## Actualización del catálogo
Cada ficha enlaza a la fuente oficial del Ayuntamiento de Madrid. Comprobar horarios, tarifas, edades, requisitos y plazas antes de modificar una ficha. Actualizar `verifiedOn` cuando se vuelva a revisar el catálogo.

## Alcance y privacidad
El catálogo contiene 15 fichas seleccionadas de Madrid capital (cinco de cultura, cinco de deporte y cinco de música); no es un directorio exhaustivo ni garantiza plazas. La lista de interés permanece en `sessionStorage` durante la sesión de esa pestaña y se puede revisar en `mi-lista.html`. El buscador permite elegir entre los 21 distritos y prioriza los distritos próximos.

La web no solicita dirección exacta, no usa GPS, no incorpora analítica ni almacena la lista de actividades en un servidor. El equipo debe revisar y aprobar el protocolo de privacidad, el consentimiento, el tratamiento de datos por Google Apps Script y las responsabilidades antes de iniciar un piloto con participantes. FINDIA PUENTES se presenta como una iniciativa universitaria en desarrollo y no afirma colaboraciones que todavía no estén confirmadas.
