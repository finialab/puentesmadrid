# FINDIA PUENTES

Web del proyecto FINDIA PUENTES para descubrir actividades culturales, deportivas y musicales en Madrid capital. Está abierta a personas españolas y extranjeras, sin límite de edad.

El sitio está publicado actualmente en el dominio personalizado `findialab.me`. El nombre público del proyecto y de la web es **FINDIA PUENTES**.

## Estructura
- `index.html`: portada, buscador, explicación del proyecto, fuentes y privacidad.
- `mi-lista.html`: actividades guardadas y formulario de solicitud con Turnstile.
- `gracias.html`: página estática de confirmación.
- `assets/css/puentes.css`: estilos responsive, accesibilidad y componentes visuales.
- `assets/js/puentes-data.js`: catálogo de recursos, distritos y configuración del correo.
- `assets/js/puentes.js`: filtros por distrito/categoría y lista de interés.
- `assets/js/mi-lista.js`: gestión de actividades guardadas y resumen estructurado del correo.
- `apps-script/Code.gs`: validación del formulario, Siteverify y envío de correo.
- `apps-script/appsscript.json`: permisos del proyecto de Apps Script.

## Configurar el correo y Cloudflare Turnstile

El formulario envía los datos mediante POST HTML nativo a una aplicación web de Google Apps Script. El script usa MailApp y solo envía la solicitud después de validar el token de Cloudflare Turnstile con Siteverify.

1. Usa el proyecto de Apps Script cuyo despliegue termina en la URL configurada en `submissionEndpoint` de `assets/js/puentes-data.js`. No crees un proyecto nuevo si el endpoint actual ya está vinculado al formulario.
2. Copia `apps-script/Code.gs` y `apps-script/appsscript.json` de este repositorio a ese proyecto. El manifiesto debe conservar los permisos `script.send_mail` y `script.external_request`.
3. En Configuración del proyecto → Propiedades de la secuencia de comandos, crea `TURNSTILE_SECRET_KEY` y pega como valor la **Secret Key** del widget FINDIA PUENTES de Cloudflare. No uses la Sitekey pública como valor. No guardes nunca la clave secreta en este repositorio ni en JavaScript/HTML público.
4. Ejecuta `authorizeServices` desde el editor y concede los permisos solicitados.
5. Ejecuta `testTurnstileConnection`. El resultado esperado es: “Conexión con Cloudflare correcta”. La prueba envía un token deliberadamente inválido para confirmar que Apps Script alcanza Siteverify y que Cloudflare acepta la clave secreta; no envía ningún correo.
6. En Cloudflare, el widget debe autorizar el hostname `findialab.me`. El formulario envía la acción `submit_request`; el servidor comprueba ambos valores.
7. En Implementar → Gestionar implementaciones → Editar, selecciona Nueva versión y pulsa Implementar. Actualizar el código del editor no modifica por sí solo la versión activa. Mantén el mismo despliegue para conservar la URL /exec que ya usa la web.
8. Enviar una solicitud de prueba desde `https://findialab.me/mi-lista.html` y comprobar que llega el correo. Solo entonces Cloudflare registrará la llamada real del formulario en sus métricas.

Si `testTurnstileConnection` indica que falta la propiedad, se ha añadido en otro proyecto o con otro nombre. Si indica que Cloudflare rechaza la clave, revisa que sea la Secret Key del mismo widget. Si el diagnóstico funciona pero el formulario no, comprueba la versión desplegada, la URL /exec, el token `cf-turnstile-response`, hostname y acción.

El formulario también incluye un campo trampa, validación de datos, casilla obligatoria de privacidad, un máximo de 30 correos diarios, una pausa global de ocho segundos y un envío por dirección cada 60 segundos. Si el JavaScript de la página no carga, el servidor puede construir un mensaje alternativo, pero no puede saltarse la validación obligatoria de Turnstile.

Para una prueba de entrega independiente, ejecutar manualmente `testMailDelivery`; envía un único correo al destinatario actual. El destino por defecto es `contacto@findialab.me`; se puede configurar un destino privado mediante la propiedad `MAIL_RECIPIENT`.

El correo sale desde la cuenta Google propietaria de la aplicación y utiliza la dirección del visitante como Reply-To. El asunto identifica a la persona solicitante y el cuerpo incluye una sección de contacto, preferencias, actividades seleccionadas, precios, fuentes oficiales, observaciones y confirmación del consentimiento. Se envía en formato HTML y texto plano. No deben compartirse contraseñas ni claves privadas.

## Precios y ordenación
Las opciones se ordenan por prioridad de coste: oportunidades con posibilidades gratuitas primero, después tarifas municipales de bajo coste y finalmente precios que requieren confirmación. Las tarifas deportivas y de música enlazan al documento oficial consultado. Para recursos culturales no existe tarifa única, por lo que se explica que el precio depende del evento. En clubes privados se recomienda comprobar cuota, matrícula, licencia/seguro, equipación y transporte por separado.


## Seguridad y protección de datos del formulario

- El formulario valida los datos en el servidor, exige la casilla de privacidad, usa un campo trampa y limita la frecuencia de los envíos.
- Cloudflare Turnstile está integrado en el formulario: el token se valida en servidor mediante Siteverify. La activación depende de que el proyecto propietario de Apps Script tenga configurada la propiedad privada `TURNSTILE_SECRET_KEY` y de que la última versión esté publicada.
- Los datos enviados se entregan al buzón de FINDIA PUENTES mediante Google Apps Script/MailApp. No existe una base de datos propia de solicitudes. Antes del piloto, el equipo debe definir y publicar responsable del tratamiento, base jurídica, conservación de correos y cómo ejercer derechos.
- No publicar contraseñas, claves privadas ni datos personales en el repositorio.

## Actualización del catálogo
Cada ficha enlaza a la fuente oficial del Ayuntamiento de Madrid. Comprobar horarios, tarifas, edades, requisitos y plazas antes de modificar una ficha. Actualizar `verifiedOn` cuando se vuelva a revisar el catálogo.

## Alcance y privacidad
El catálogo contiene 15 fichas seleccionadas de Madrid capital (cinco de cultura, cinco de deporte y cinco de música); no es un directorio exhaustivo ni garantiza plazas. FINDIA PUENTES no establece límite de edad ni de nacionalidad, aunque cada entidad puede tener requisitos propios para sus actividades. La lista de interés permanece en `sessionStorage` durante la sesión de esa pestaña y se puede revisar en `mi-lista.html`. El buscador permite elegir entre los 21 distritos y prioriza los distritos próximos.

La web no solicita dirección exacta, no usa GPS, no incorpora analítica ni almacena la lista de actividades en un servidor. El equipo debe revisar y aprobar el protocolo de privacidad, el consentimiento, el tratamiento de datos por Google Apps Script y las responsabilidades antes de iniciar un piloto con participantes. FINDIA PUENTES se presenta como una iniciativa universitaria en desarrollo y no afirma colaboraciones que todavía no estén confirmadas.
