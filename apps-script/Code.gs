/**
 * FINDIA PUENTES — endpoint de correo mediante Google Apps Script.
 *
 * Publicar como Web App:
 *   Ejecutar como: Yo
 *   Quién tiene acceso: Cualquier persona
 *
 * Ejecuta authorizeMail() una vez desde el editor y concede el permiso
 * para enviar correo. Después crea una implementación de tipo Aplicación web.
 */

const CONFIG = Object.freeze({
  recipient: "contacto@findialab.me",
  siteUrl: "https://findialab.me",
  formUrl: "https://findialab.me/mi-lista.html#formulario",
  cooldownSeconds: 60,
  globalCooldownSeconds: 8,
  maxDailySubmissions: 30,
  maxMessageLength: 12000
});

/**
 * Comprueba que la implementación está publicada.
 * No envía ningún correo.
 */
function doGet() {
  return renderPage_(
    "Servicio de correo disponible",
    "El punto de recepción de FINDIA PUENTES está publicado. Para enviar una solicitud, vuelve al formulario de la web.",
    true
  );
}

/**
 * Autoriza el permiso de envío de correo al ejecutar esta función
 * manualmente desde el editor de Apps Script.
 */
function authorizeMail() {
  const remaining = MailApp.getRemainingDailyQuota();
  Logger.log("Autorización de correo comprobada. Destinatarios disponibles hoy: " + remaining);
  return remaining;
}

/**
 * Recibe el formulario y envía el correo desde la cuenta Google propietaria
 * de esta aplicación web. El destinatario es fijo y no lo controla el visitante.
 */
function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Campo trampa para bots. Se responde como recibido, pero no se envía nada.
    if (String(p.website || "").trim()) {
      return renderPage_(
        "Solicitud recibida",
        "Gracias. Puedes volver a FINDIA PUENTES.",
        true
      );
    }

    const name = cleanText_(p.name, 80);
    const email = cleanEmail_(p.email);
    const message = cleanMessage_(p.message, CONFIG.maxMessageLength);
    const consent = String(p.consent || "").toLowerCase();

    if (name.length < 2 || !email || message.length < 20 || consent !== "on") {
      return renderPage_(
        "No se ha podido enviar",
        "Faltan datos obligatorios o el consentimiento no está marcado. Vuelve al formulario, comprueba los campos y envíalo de nuevo.",
        false
      );
    }

    if (isRateLimited_(email)) {
      return renderPage_(
        "Espera un momento",
        "Ya se ha recibido una solicitud reciente desde este correo. Espera unos segundos antes de volver a enviarla.",
        false
      );
    }

    const quota = MailApp.getRemainingDailyQuota();
    if (quota < 1) {
      return renderPage_(
        "Servicio temporalmente no disponible",
        "La cuenta de correo ha alcanzado su límite diario de envíos. Inténtalo más tarde o contacta directamente con FINDIA PUENTES.",
        false
      );
    }

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

    MailApp.sendEmail({
      to: CONFIG.recipient,
      subject: "Nueva solicitud de orientación — FINDIA PUENTES",
      body: body,
      name: "FINDIA PUENTES",
      replyTo: email
    });

    return renderPage_(
      "¡Solicitud enviada!",
      "Tu solicitud se ha enviado correctamente al equipo de FINDIA PUENTES. Puedes volver a la web.",
      true
    );
  } catch (error) {
    console.error("Fallo al enviar solicitud de FINDIA PUENTES: " + error);
    return renderPage_(
      "No se ha podido enviar",
      "El servicio de correo no ha podido aceptar la solicitud. No se ha confirmado ningún envío. Vuelve al formulario e inténtalo más tarde.",
      false
    );
  }
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
