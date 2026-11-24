# FINDIA PUENTES

Web estática del proyecto FINDIA PUENTES para descubrir actividades culturales, deportivas y musicales en Madrid capital y facilitar el acompañamiento a jóvenes de 18 a 24 años.

El sitio está publicado actualmente en el dominio personalizado `findialab.me`. El nombre público del proyecto y de la web es **FINDIA PUENTES**.

## Estructura
- `index.html`: portada, buscador y explicación del proyecto.
- `assets/css/puentes.css`: estilos adaptables a móvil y escritorio.
- `assets/js/puentes-data.js`: catálogo de recursos, distritos y configuración del correo.
- `assets/js/puentes.js`: filtros por distrito/categoría, lista de interés y formulario de contacto.

## Configurar el correo de contacto
El envío no usa FormSubmit. La web estática publica el formulario y envía sus datos mediante POST a una aplicación web de Google Apps Script. El script usa el servicio oficial `MailApp` para remitir la solicitud desde la cuenta Google que autoriza y publica el backend.

1. Abrir [Google Apps Script](https://script.google.com/home/projects/create) con la cuenta de Google que enviará las solicitudes.
2. Copiar el contenido de `apps-script/Code.gs` al archivo `Code.gs` del proyecto.
3. En el editor, seleccionar y ejecutar `authorizeMail`; conceder el permiso para enviar correo.
4. Pulsar **Deploy → New deployment → Web app**.
5. Elegir **Execute as: Me** y **Who has access: Anyone**, y publicar.
6. Copiar la URL de la aplicación web, que termina en `/exec`, y pegarla en `submissionEndpoint` dentro de `assets/js/puentes-data.js`.
7. Publicar el cambio en `main` y realizar una solicitud de prueba. El endpoint se configura en `assets/js/puentes-data.js`; debe mantenerse la URL `/exec` de la implementación activa.

El destinatario se define en la constante `CONFIG.recipient` de `apps-script/Code.gs`. El valor inicial es `contacto@findialab.me`; si se usa un alias de reenvío de Namecheap, ese servicio seguirá reenviando el mensaje a los buzones configurados. Para evitar ese salto, se puede cambiar el destinatario por el buzón real del equipo directamente dentro del script (sin publicarlo en el repositorio).

La aplicación solo envía a ese destinatario fijo, valida los campos, exige consentimiento, usa un campo trampa antispam, aplica una pausa global de ocho segundos, limita cada dirección a un envío por minuto y fija un máximo de 30 envíos diarios. El endpoint público puede ser invocado por terceros; estos límites reducen el abuso, pero no sustituyen un sistema CAPTCHA si aumenta el tráfico. No guarda solicitudes en una base de datos propia. El correo sale desde la cuenta Google propietaria de la aplicación y usa la dirección del visitante como Reply-To. La publicación del backend y la autorización de correo requieren una acción del propietario de esa cuenta; no deben publicarse contraseñas ni claves privadas.

No se incluye IA generativa: el mensaje se redacta mediante una plantilla automática en el navegador.
## Precios y ordenación
Las opciones se ordenan por prioridad de coste: oportunidades con posibilidades gratuitas primero, después tarifas municipales de bajo coste y finalmente precios que requieren confirmación. Las tarifas deportivas y de música enlazan al documento oficial consultado. Para recursos culturales no existe tarifa única, por lo que se explica que el precio depende del evento. En clubes privados se recomienda comprobar cuota, matrícula, licencia/seguro, equipación y transporte por separado.

## Actualización del catálogo
Cada ficha enlaza a la fuente oficial del Ayuntamiento de Madrid. Comprobar horarios, tarifas, edades, requisitos y plazas antes de modificar una ficha. Actualizar `verifiedOn` cuando se vuelva a revisar el catálogo.

## Alcance y privacidad
El catálogo contiene 15 fichas seleccionadas de Madrid capital (cinco de cultura, cinco de deporte y cinco de música); no es un directorio exhaustivo ni garantiza plazas. La lista de interés permanece en `sessionStorage` durante la sesión de esa pestaña y se puede revisar en `mi-lista.html`. El buscador permite elegir entre los 21 distritos y prioriza los distritos próximos.

La web no solicita dirección exacta, no usa GPS, no incorpora analítica ni almacena la lista de actividades en un servidor. El equipo debe revisar y aprobar el protocolo de privacidad, el consentimiento, el tratamiento de datos por Google Apps Script y las responsabilidades antes de iniciar un piloto con participantes. FINDIA PUENTES se presenta como una iniciativa universitaria en desarrollo y no afirma colaboraciones que todavía no estén confirmadas.
