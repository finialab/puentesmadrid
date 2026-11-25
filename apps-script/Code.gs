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
  buildId: "FINDIA-EMAIL-20261124-TURNSTILE-SITEVERIFY",
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
  // Fuerza la autorización de UrlFetchApp necesaria para validar Turnstile
  // en el servidor. Esta llamada no envía correo ni utiliza claves privadas.
  const fetchCheck = UrlFetchApp.fetch("https://www.google.com/generate_204", {
    method: "get",
    muteHttpExceptions: true
  });
  Logger.log("Permiso de envío de correo comprobado. Cuota diaria disponible: " + remaining);
  Logger.log("Permiso de solicitudes externas comprobado. HTTP " + fetchCheck.getResponseCode());
  return remaining;
}

/**
 * Diagnóstico de conexión con Cloudflare Siteverify.
 * Ejecutar manualmente DESPUÉS de guardar TURNSTILE_SECRET_KEY.
 * Usa un token deliberadamente inválido: el resultado esperado es
 * invalid-input-response. Así se confirma que Cloudflare recibió la llamada
 * y aceptó la clave secreta, sin imprimir ni revelar esa clave.
 */
function testTurnstileConnection() {
  const secret = String(
    PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET_KEY") || ""
  ).trim();

  if (!secret) {
    throw new Error(
      "Falta la propiedad TURNSTILE_SECRET_KEY en las Propiedades de la secuencia de comandos de ESTE proyecto."
    );
  }

  const response = UrlFetchApp.fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "post",
      payload: {
        secret: secret,
        response: "diagnostic-invalid-token"
      },
      muteHttpExceptions: true
    }
  );

  if (response.getResponseCode() !== 200) {
    throw new Error("Cloudflare Siteverify respondió HTTP " + response.getResponseCode() + ".");
  }

  const result = JSON.parse(response.getContentText() || "{}");
  const codes = Array.isArray(result["error-codes"]) ? result["error-codes"] : [];

  if (codes.indexOf("invalid-input-secret") !== -1 ||
      codes.indexOf("missing-input-secret") !== -1) {
    throw new Error(
      "Cloudflare ha rechazado la clave secreta. Comprueba que has copiado la Secret Key del widget FINDIA PUENTES."
    );
  }

  if (codes.indexOf("invalid-input-response") !== -1) {
    Logger.log("OK: Apps Script ha llamado a Cloudflare Siteverify y la clave secreta ha sido aceptada. El token de diagnóstico era inválido de forma intencionada.");
    return "Conexión con Cloudflare correcta. La clave secreta está siendo aceptada y Siteverify ha recibido la llamada.";
  }

  Logger.log("Respuesta Siteverify: " + JSON.stringify({success: result.success, errorCodes: codes}));
  return "Cloudflare ha respondido. Revisa el registro de ejecución para ver los códigos devueltos.";
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

    // Verificación anti-bots obligatoria en servidor.
    // La clave secreta solo se lee de Script Properties; nunca del navegador.
    stage = "verificación Cloudflare Turnstile";
    const turnstileCheck = verifyTurnstile_(p["cf-turnstile-response"]);
    if (!turnstileCheck.success) {
      const message = turnstileCheck.reason === "not-configured"
        ? "La protección de seguridad todavía no está configurada en el servidor. No se ha enviado la solicitud; inténtalo más tarde."
        : "No se ha podido validar la verificación de seguridad. Recarga el formulario, completa de nuevo la comprobación e inténtalo otra vez.";
      return renderPage_("No se ha podido verificar la solicitud", message, false);
    }

    // El campo honeypot, la verificación de Cloudflare y los límites
    // de envío se validan en el servidor.
    stage = "validación de datos";
    const name = cleanText_(p.name, 80);
    const email = cleanEmail_(p.email);
    const message = cleanMessage_(p.message, CONFIG.maxMessageLength) ||
      buildMessageFromParameters_(p);
    const language = String(p.lang || "es").toLowerCase() === "en" ? "en" : "es";
    const consent = String(p.consent || "").toLowerCase();

    if (name.length < 2 || !email || message.length < 20 || consent !== "on") {
      return renderPage_(
        "No se ha podido enviar",
        "Faltan datos obligatorios o no has marcado la casilla de aceptación del aviso de privacidad y las condiciones de uso.",
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
    const receivedAt = Utilities.formatDate(
      new Date(),
      "Europe/Madrid",
      language === "en" ? "dd/MM/yyyy 'at' HH:mm" : "dd/MM/yyyy 'a las' HH:mm"
    );
    const body = language === "en" ? [
      "NEW GUIDANCE REQUEST — FINDIA PUENTES",
      "Received on " + receivedAt,
      "",
      "CONTACT DETAILS",
      "Name: " + name,
      "Email address: " + email,
      "",
      "REQUEST DETAILS",
      message,
      "",
      "CONSENT",
      "The person ticked the box confirming acceptance of the privacy notice and terms of use.",
      "",
      "This email was generated automatically from https://findialab.me."
    ].join("\n") : [
      "NUEVA SOLICITUD DE ORIENTACIÓN — FINDIA PUENTES",
      "Recibida el " + receivedAt,
      "",
      "DATOS DE CONTACTO",
      "Nombre: " + name,
      "Correo electrónico: " + email,
      "",
      "DETALLE DE LA SOLICITUD",
      message,
      "",
      "CONSENTIMIENTO",
      "La persona ha marcado la casilla de aceptación del aviso de privacidad y las condiciones de uso.",
      "",
      "Este correo se ha generado automáticamente desde https://findialab.me."
    ].join("\n");

    const htmlBody = formatEmailHtml_(body);

    stage = "envío con MailApp";
    const recipient = getRecipient_();
    MailApp.sendEmail({
      to: recipient,
      subject: (language === "en" ? "New FINDIA PUENTES request — " : "Nueva solicitud FINDIA PUENTES — ") + name,
      body: body,
      htmlBody: htmlBody,
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
/**
 * Valida el token de Turnstile contra el servicio oficial Siteverify.
 * TURNSTILE_SECRET_KEY debe configurarse en Apps Script → Project Settings
 * → Script Properties. Nunca guardar esta clave en el repositorio.
 */
function verifyTurnstile_(token) {
  const secret = String(
    PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET_KEY") || ""
  ).trim();

  if (!secret) {
    console.error("Turnstile is not configured: missing TURNSTILE_SECRET_KEY Script Property.");
    return { success: false, reason: "not-configured" };
  }

  const responseToken = String(token || "").trim();
  if (!responseToken || responseToken.length > 2048) {
    console.warn("Turnstile token is missing or has an invalid length.");
    return { success: false, reason: "invalid-token" };
  }

  try {
    const response = UrlFetchApp.fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "post",
        payload: {
          secret: secret,
          response: responseToken
        },
        muteHttpExceptions: true
      }
    );

    if (response.getResponseCode() !== 200) {
      console.error("Turnstile Siteverify returned HTTP " + response.getResponseCode());
      return { success: false, reason: "verification-unavailable" };
    }

    const result = JSON.parse(response.getContentText() || "{}");
    const allowedHostnames = ["findialab.me"];
    const valid = result.success === true &&
      allowedHostnames.indexOf(String(result.hostname || "").toLowerCase()) !== -1 &&
      String(result.action || "") === "submit_request";

    if (!valid) {
      const codes = Array.isArray(result["error-codes"])
        ? result["error-codes"].join(",")
        : "validation-failed";
      console.warn("Turnstile validation rejected. Codes=" + codes);
      return { success: false, reason: "invalid-token" };
    }

    return { success: true };
  } catch (error) {
    console.error("Turnstile Siteverify request failed: " + String(error));
    return { success: false, reason: "verification-unavailable" };
  }
}

/**
 * Versión HTML del correo de aviso. El contenido del formulario se escapa
 * antes de introducirlo en HTML para evitar que se interprete como marcado.
 */
function formatEmailHtml_(plainText) {
  const lines = String(plainText || "").split(/\r?\n/);
  const title = escapeHtml_(lines.shift() || "Nueva solicitud de FINDIA PUENTES");
  const headings = [
    "DATOS DE CONTACTO",
    "DETALLE DE LA SOLICITUD",
    "RESUMEN DE LA SOLICITUD",
    "PREFERENCIAS Y NECESIDADES",
    "ACTIVIDADES SELECCIONADAS",
    "OBSERVACIONES DE LA PERSONA",
    "CONSENTIMIENTO",
    "CONTACT DETAILS",
    "REQUEST DETAILS",
    "REQUEST SUMMARY",
    "PREFERENCES AND NEEDS",
    "SELECTED ACTIVITIES",
    "ADDITIONAL NOTES",
    "CONSENT"
  ];

  const content = lines.map(function (line) {
    const trimmed = line.trim();
    if (!trimmed) return '<div style="height:7px;"></div>';

    const safe = escapeHtml_(trimmed);
    if (headings.indexOf(trimmed) !== -1) {
      return '<h2 style="margin:20px 0 8px;padding-bottom:7px;border-bottom:1px solid #e5ebe5;font-size:13px;letter-spacing:.7px;color:#285e52;">' + safe + "</h2>";
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return '<h3 style="margin:13px 0 5px;font-size:14px;color:#173f39;">' + safe + "</h3>";
    }
    if (/^(Recibida el |Received on )/.test(trimmed)) {
      return '<p style="margin:0 0 14px;font-size:12px;color:#7a8980;">' + safe + "</p>";
    }
    if (/^   /.test(line)) {
      return '<p style="margin:3px 0 3px 14px;font-size:13px;line-height:1.6;color:#53665c;">' + safe + "</p>";
    }
    return '<p style="margin:5px 0;font-size:13px;line-height:1.65;color:#40544a;">' + safe + "</p>";
  }).join("");

  return [
    "<!doctype html>",
    '<html lang="es"><body style="margin:0;padding:28px;background:#f4f6f1;font-family:Arial,sans-serif;color:#263b32;">',
    '<div style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #dfe7df;border-radius:16px;overflow:hidden;">',
    '<div style="padding:20px 28px;background:#173f39;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:2px;">FINDIA PUENTES</div>',
    '<div style="padding:26px 28px;">',
    '<h1 style="margin:0 0 8px;font-size:21px;line-height:1.3;color:#173f39;">' + title + "</h1>",
    content,
    '<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5ebe5;font-size:12px;color:#718078;">Puedes responder directamente a este correo para contactar con la persona solicitante.</p>',
    "</div></div></body></html>"
  ].join("");
}

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
    "La persona marcó la casilla para confirmar que ha leído y acepta el aviso de privacidad y las condiciones de uso."
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
