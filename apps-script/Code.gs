/**
 * FINDIA PUENTES — endpoint de correo mediante Google Apps Script.
 *
 * Publicar como Web App:
 *   Ejecutar como: Yo
 *   Quién tiene acceso: Cualquier persona
 *
 * Ejecuta authorizeServices() una vez desde el editor y concede el permiso
 * para enviar correo. Después crea una implementación de tipo Aplicación web.
 */

const CONFIG = Object.freeze({
  defaultRecipient: "contacto@findialab.me",
  buildId: "FINDIA-EMAIL-20261124-NATIVEFORM-FALLBACK",
  siteUrl: "https://findialab.me",
  formUrl: "https://findialab.me/mi-lista.html#formulario",
  cooldownSeconds: 60,
  globalCooldownSeconds: 8,
  maxDailySubmissions: 30,
  maxMessageLength: 12000,
  maxRequestBytes: 18000
});

/**
 * Comprueba que la implementación está publicada.
 * No envía ningún correo.
 */
function doGet() {
  return renderPage_(
    "Servicio de correo activo",
    "El endpoint de FINDIA PUENTES está publicado. Versión: " + CONFIG.buildId + ". Para enviar una solicitud, vuelve al formulario de la web.",
    true
  );
}

/**
 * Autoriza el permiso de envío de correo al ejecutar esta función
 * manualmente desde el editor de Apps Script.
 */
function authorizeServices() {
  const remaining = MailApp.getRemainingDailyQuota();
  Logger.log("Permiso de envío de correo comprobado. Cuota diaria disponible: " + remaining);
  return remaining;
}

/**
 * Devuelve la dirección de destino privada si existe; en caso contrario,
 * usa el alias oficial contacto@findialab.me.
 * Configurar MAIL_RECIPIENT como propiedad del script permite enviar
 * directamente al buzón real sin guardar esa dirección en GitHub.
 */
function getRecipient_() {
  const properties = PropertiesService.getScriptProperties();
  const configured = properties.getProperty("MAIL_RECIPIENT") || CONFIG.defaultRecipient;
  const recipient = cleanEmail_(configured);
  if (!recipient) throw new Error("MAIL_RECIPIENT no contiene una dirección válida.");
  return recipient;
}

/**
 * Prueba manual de entrega. Ejecutar SOLO desde el editor de Apps Script.
 * Envía un mensaje único al destinatario configurado, no es un endpoint público.
 */
function testMailDelivery() {
  const recipient = getRecipient_();
  const quota = MailApp.getRemainingDailyQuota();
  if (quota < 1) throw new Error("No queda cuota diaria de envío en MailApp.");

  const now = Utilities.formatDate(new Date(), "Europe/Madrid", "yyyy-MM-dd HH:mm:ss");
  MailApp.sendEmail({
    to: recipient,
    subject: "Prueba técnica de correo — FINDIA PUENTES",
    body: [
      "Este es un correo de prueba enviado manualmente desde Google Apps Script.",
      "",
      "Si lo recibes, MailApp y la dirección de destino funcionan.",
      "Fecha y hora: " + now,
      "Proyecto: FINDIA PUENTES"
    ].join("\n"),
    name: "FINDIA PUENTES"
  });

  console.log("TEST_MAIL_SENT remainingQuota=" + (quota - 1));
  return "MailApp ha aceptado el correo de prueba para " + recipient +
    ". Comprueba la bandeja de entrada y Spam.";
}

/**
 * Recibe el formulario y envía el correo desde la cuenta Google propietaria
 * de esta aplicación web. El destinatario es fijo y no lo controla el visitante.
 */
function doPost(e) {
  let stage = "inicio";
  try {
    // doPost(e) solo debe ejecutarse mediante una petición HTTP POST real.
    // Si se pulsa Ejecutar en el editor, Google no pasa el evento e.
    if (!e || !e.postData) {
      console.error("doPost invoked without HTTP POST event. Do not run doPost manually from the editor.");
      return renderPage_(
        "Prueba no válida",
        "No ejecutes doPost desde el botón Ejecutar del editor. Para comprobar el correo usa testMailDelivery; para comprobar el formulario, envía una solicitud desde findialab.me.",
        false
      );
    }

    console.log("doPost: HTTP POST received");

    stage = "comprobación de tamaño";
    const requestLength = e && e.postData ? Number(e.postData.length || 0) : 0;
    if (requestLength > CONFIG.maxRequestBytes) {
      return renderPage_("Solicitud demasiado grande", "El formulario supera el tamaño permitido. Reduce el texto e inténtalo de nuevo.", false);
    }

    stage = "lectura de campos";
    const p = getPostParameters_(e);
    if (Object.keys(p).length === 0) {
      console.error("HTTP POST received but no form fields were parsed. postType=" +
        String(e.postData.type || "unknown") + "; postLength=" + String(e.postData.length || 0));
      return renderPage_(
        "Formulario sin datos",
        "El servidor ha recibido una petición POST, pero no ha podido leer los campos. Recarga Mi lista e inténtalo de nuevo.",
        false
      );
    }
    const parameterNames = Object.keys(p);
    const postType = e && e.postData ? String(e.postData.type || "") : "sin postData";
    console.log("doPost received fields=" + parameterNames.join(",") +
      "; postType=" + postType);

    // Campo trampa para bots. Se responde como recibido, pero no se envía nada.
    if (String(p.website || "").trim()) {
      return renderPage_(
        "Solicitud recibida",
        "Gracias. Puedes volver a FINDIA PUENTES.",
        true
      );
    }

    // El formulario usa POST nativo y no depende de servicios externos.
    // El campo honeypot y los límites de envío se validan en el servidor.
    stage = "validación de datos";
    const name = cleanText_(p.name, 80);
    const email = cleanEmail_(p.email);
    const message = cleanMessage_(p.message, CONFIG.maxMessageLength) ||
      buildMessageFromParameters_(p);
    const consent = String(p.consent || "").toLowerCase();

    if (name.length < 2 || !email || message.length < 20 || consent !== "on") {
      return renderPage_(
        "No se ha podido enviar",
        "Faltan datos obligatorios o el consentimiento no está marcado. Vuelve al formulario, comprueba los campos y envíalo de nuevo.",
        false
      );
    }

    stage = "control de frecuencia";
    if (isRateLimited_(email)) {
      return renderPage_(
        "Espera un momento",
        "Ya se ha recibido una solicitud reciente desde este correo. Espera unos segundos antes de volver a enviarla.",
        false
      );
    }

    stage = "comprobación de cuota";
    const quota = MailApp.getRemainingDailyQuota();
    if (quota < 1) {
      return renderPage_(
        "Servicio temporalmente no disponible",
        "La cuenta de correo ha alcanzado su límite diario de envíos. Inténtalo más tarde o contacta directamente con FINDIA PUENTES.",
        false
      );
    }

    stage = "preparación del correo";
    const body = [
      message,
      "",
      "------------------------------",
      "DATOS DE CONTACTO",
      "Nombre: " + name,
      "Correo de respuesta: " + email,
      "",
      "Solicitud recibida desde https://findialab.me"
    ].join("\n");

    stage = "envío con MailApp";
    const recipient = getRecipient_();
    MailApp.sendEmail({
      to: recipient,
      subject: "Nueva solicitud de orientación — FINDIA PUENTES",
      body: body,
      name: "FINDIA PUENTES",
      replyTo: email
    });

    console.log("doPost: MailApp accepted the request email.");
    stage = "respuesta de confirmación";

    return renderPage_(
      "¡Solicitud enviada!",
      "Tu solicitud se ha enviado correctamente al equipo de FINDIA PUENTES. Puedes volver a la web.",
      true
    );
  } catch (error) {
    console.error("Fallo en doPost. Etapa=" + stage + "; error=" + (error && error.stack ? error.stack : error));
    return renderPage_(
      "No se ha podido enviar",
      "El envío ha fallado durante esta etapa: " + stage + ". No se ha confirmado ningún envío. Consulta Apps Script → Ejecuciones para ver el detalle técnico.",
      false
    );
  }
}


/**
 * Convierte los parámetros del evento de Apps Script en un objeto plano.
 * Admite los campos ya analizados por Apps Script y, como respaldo,
 * el cuerpo application/x-www-form-urlencoded o JSON.
 */
function getPostParameters_(event) {
  const result = {};
  if (!event) return result;

  if (event.parameter && typeof event.parameter === "object") {
    Object.keys(event.parameter).forEach(function (key) {
      result[key] = event.parameter[key];
    });
  }

  if (Object.keys(result).length === 0 && event.parameters && typeof event.parameters === "object") {
    Object.keys(event.parameters).forEach(function (key) {
      const value = event.parameters[key];
      result[key] = Array.isArray(value) ? (value[0] || "") : value;
    });
  }

  if (Object.keys(result).length === 0 && event.postData && event.postData.contents) {
    const raw = String(event.postData.contents);
    const type = String(event.postData.type || "").toLowerCase();

    if (type.indexOf("application/json") !== -1) {
      try {
        const parsed = JSON.parse(raw);
        Object.keys(parsed).forEach(function (key) { result[key] = parsed[key]; });
      } catch (error) {
        console.error("POST body JSON could not be parsed.");
      }
    } else {
      raw.split("&").forEach(function (pair) {
        if (!pair) return;
        const separator = pair.indexOf("=");
        const rawKey = separator >= 0 ? pair.slice(0, separator) : pair;
        const rawValue = separator >= 0 ? pair.slice(separator + 1) : "";
        try {
          const key = decodeURIComponent(rawKey.replace(/\+/g, " "));
          const value = decodeURIComponent(rawValue.replace(/\+/g, " "));
          if (key) result[key] = value;
        } catch (error) {
          console.error("POST form field could not be decoded.");
        }
      });
    }
  }

  return result;
}

function cleanText_(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail_(value) {
  const email = cleanText_(value, 120).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function cleanMessage_(value, maxLength) {
  return String(value || "")
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, maxLength);
}

/**
 * Mensaje alternativo para que el formulario funcione incluso si el
 * JavaScript del navegador no llega a ejecutarse.
 */
function buildMessageFromParameters_(p) {
  const read = function (key, limit) {
    return cleanText_(p[key], limit || 500);
  };
  const name = read("name", 80);
  const district = read("district", 80);
  const budget = read("budget", 120);
  const otherActivity = read("otherActivity", 140);
  const knownCost = read("knownCost", 180);
  const costsToCheck = read("costsToCheck", 240);
  const extraMessage = cleanMessage_(p.extraMessage, 1000);

  return [
    "Nueva solicitud de acompañamiento desde FINDIA PUENTES.",
    "Nombre: " + (name || "No indicado"),
    "Zona o distrito: " + (district || "No indicado"),
    "Presupuesto: " + (budget || "No indicado"),
    otherActivity ? "Actividad que busca: " + otherActivity : "",
    knownCost ? "Precio indicado: " + knownCost : "",
    costsToCheck ? "Gastos que desea comprobar: " + costsToCheck : "",
    extraMessage ? "Información adicional: " + extraMessage : "",
    "La persona ha enviado el formulario y aceptado el aviso de privacidad."
  ].filter(Boolean).join("\n\n").slice(0, CONFIG.maxMessageLength);
}

/**
 * Límites de abuso:
 * - máximo 30 correos al día a través del formulario;
 * - un envío global cada 8 segundos;
 * - un envío por dirección cada 60 segundos.
 * Se usan propiedades y caché del servidor; no se confía en los valores del navegador.
 */
function isRateLimited_(email) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const cache = CacheService.getScriptCache();
    const properties = PropertiesService.getScriptProperties();
    const today = Utilities.formatDate(new Date(), "Europe/Madrid", "yyyyMMdd");
    const dailyKey = "sent_count_" + today;
    const sentToday = Number(properties.getProperty(dailyKey) || "0");

    if (sentToday >= CONFIG.maxDailySubmissions) return true;
    if (cache.get("global_submission_cooldown")) return true;

    const bytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      email.toLowerCase(),
      Utilities.Charset.UTF_8
    );
    const emailKey = "request_" + bytes.map(function (byte) {
      return ("0" + ((byte + 256) % 256).toString(16)).slice(-2);
    }).join("");

    if (cache.get(emailKey)) return true;

    properties.setProperty(dailyKey, String(sentToday + 1));
    cache.put("global_submission_cooldown", "1", CONFIG.globalCooldownSeconds);
    cache.put(emailKey, "1", CONFIG.cooldownSeconds);
    return false;
  } finally {
    lock.releaseLock();
  }
}

function renderPage_(title, message, success) {
  const color = success ? "#24634e" : "#a34335";
  const html = [
    "<!doctype html>",
    '<html lang="es"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + escapeHtml_(title) + " | FINDIA PUENTES</title>",
    "<style>",
    "body{margin:0;background:#f4f6f1;color:#24352f;font:16px/1.6 Arial,sans-serif}",
    ".wrap{max-width:620px;margin:8vh auto;padding:24px}",
    ".card{background:#fff;border:1px solid #dfe7df;border-radius:20px;padding:34px;box-shadow:0 12px 35px rgba(25,55,45,.08)}",
    ".brand{font-size:13px;font-weight:700;letter-spacing:.12em;color:#557265}",
    ".mark{font-size:42px;color:" + color + ";margin:20px 0 8px}",
    "h1{font-size:28px;line-height:1.2;margin:0 0 14px}",
    "p{color:#5d6b63;margin:0 0 24px}",
    "a{display:inline-block;background:#173f39;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:700}",
    "</style></head><body><main class='wrap'><section class='card'>",
    "<div class='brand'>FINDIA PUENTES · MADRID</div>",
    "<div class='mark'>" + (success ? "✓" : "!") + "</div>",
    "<h1>" + escapeHtml_(title) + "</h1>",
    "<p>" + escapeHtml_(message) + "</p>",
    '<a href="' + CONFIG.siteUrl + '/mi-lista.html#formulario">Volver a FINDIA PUENTES</a>',
    "</section></main></body></html>"
  ].join("");

  return HtmlService.createHtmlOutput(html)
    .setTitle(title + " | FINDIA PUENTES");
}

function escapeHtml_(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character];
  });
}
