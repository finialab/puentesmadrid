(function () {
  "use strict";

  const STORAGE_KEY = "findiaPuentesSavedActivities.v1";
  const data = Array.isArray(window.PUENTES_ACTIVITIES) ? window.PUENTES_ACTIVITIES : [];
  const config = window.PUENTES_CONFIG || { contactEmail: "" };
  const savedContainer = document.getElementById("savedActivities");
  const emptyState = document.getElementById("listEmpty");
  const count = document.getElementById("listCount");
  const savedCount = document.getElementById("savedCount");
  const status = document.getElementById("requestStatus");
  const form = document.getElementById("requestForm");
  const sendButton = document.getElementById("sendRequest");

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }
  function readIds() {
    try {
      const raw = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter(function (id) { return data.some(function (item) { return item.id === id; }); }) : [];
    } catch (error) {
      return [];
    }
  }
  let selected = new Set(readIds());
  function persist() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selected))); }
    catch (error) { showStatus("No hemos podido actualizar la lista en esta pestaña. Prueba a recargar la página.", "error"); }
  }
  function showStatus(message, type) {
    status.textContent = message;
    status.className = "list-request-status" + (type ? " is-" + type : "");
  }
  function render() {
    const items = data.filter(function (item) { return selected.has(item.id); });
    const label = items.length + (items.length === 1 ? " actividad guardada" : " actividades guardadas");
    count.textContent = label;
    savedCount.textContent = String(items.length);
    emptyState.hidden = items.length > 0;
    savedContainer.hidden = items.length === 0;
    savedContainer.innerHTML = items.map(function (item) {
      return '<article class="saved-activity-card">' +
        '<p class="saved-activity-meta">' + escapeHtml(item.category === "cultura" ? "Cultura" : item.category === "deporte" ? "Deporte" : "Música") + " · " + escapeHtml(item.area ? item.area + " · " : "") + "Distrito " + escapeHtml(item.zone) + '</p>' +
        '<h3>' + escapeHtml(item.title) + '</h3>' +
        '<p class="saved-activity-price">' + escapeHtml(item.price || "Precio por confirmar con la entidad") + '</p>' +
        (item.priceDetail ? '<p class="saved-activity-detail">' + escapeHtml(item.priceDetail) + '</p>' : '') +
        (item.extraCosts ? '<p class="saved-activity-detail"><strong>Otros gastos que conviene comprobar:</strong> ' + escapeHtml(item.extraCosts) + '</p>' : '') +
        '<div class="saved-activity-actions">' +
          '<a href="' + escapeHtml(item.officialUrl) + '" target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a>' +
          '<button type="button" data-remove="' + escapeHtml(item.id) + '">Quitar de mi lista</button>' +
        '</div></article>';
    }).join("");
  }
  function buildEmailBody() {
    const items = data.filter(function (item) { return selected.has(item.id); });
    const field = function (id) {
      const element = document.getElementById(id);
      return element ? String(element.value || "").trim() : "";
    };
    const activityLines = items.length ? items.map(function (item, index) {
      return [
        (index + 1) + ". " + item.title + " — " + (item.area ? item.area + ", " : "") + "Distrito " + item.zone,
        "   Coste orientativo publicado: " + (item.price || "No publicado; preguntar a la entidad."),
        item.priceDetail ? "   Condiciones: " + item.priceDetail : "",
        item.extraCosts ? "   Gastos adicionales a comprobar: " + item.extraCosts : "",
        "   Información oficial: " + item.officialUrl,
        item.priceSourceUrl ? "   Tarifas oficiales: " + item.priceSourceUrl : ""
      ].filter(Boolean).join("\n");
    }).join("\n\n") : "No se han guardado actividades concretas; solicita orientación para encontrar opciones.";
    return [
      "SOLICITUD DE ORIENTACIÓN — FINDIA PUENTES",
      "",
      "DATOS DE CONTACTO",
      "Nombre: " + field("requestName"),
      "Correo de respuesta: " + field("requestEmail"),
      "Zona de referencia: " + (field("requestDistrict") || "No indicada"),
      "",
      "PRESUPUESTO Y PREFERENCIAS",
      "Presupuesto: " + field("requestBudget"),
      "Actividad adicional que busca: " + (field("requestOtherActivity") || "No indicada"),
      "Precio que le han comunicado: " + (field("requestKnownCost") || "No indicado"),
      "Gastos que desea comprobar: " + (field("requestCostsToCheck") || "Cuota inicial/matrícula, periodicidad, equipación/material, licencia/seguro y transporte, si corresponde"),
      "",
      "ACTIVIDADES GUARDADAS",
      activityLines,
      "",
      "MENSAJE",
      field("requestMessage") || "Solicita orientación sobre los siguientes pasos y el coste total antes de inscribirse.",
      "",
      "La persona ha solicitado que FINDIA PUENTES le contacte para recibir orientación. Responde directamente a este correo para contestarle."
    ].join("\n");
  }

  savedContainer.addEventListener("click", function (event) {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    selected.delete(button.getAttribute("data-remove"));
    persist();
    render();
  });

  document.getElementById("clearList").addEventListener("click", function () {
    if (!selected.size) return;
    selected.clear();
    persist();
    render();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const recipient = String(config.contactEmail || "").trim();
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      showStatus("El correo de recepción del equipo no está configurado correctamente. Contacta con FINDIA PUENTES por otro canal.", "error");
      return;
    }

    const emailBody = buildEmailBody();
    const payload = {
      name: document.getElementById("requestName").value.trim(),
      email: document.getElementById("requestEmail").value.trim(),
      _replyto: document.getElementById("requestEmail").value.trim(),
      _subject: "Nueva solicitud de orientación — FINDIA PUENTES",
      _template: "table",
      district: document.getElementById("requestDistrict").value.trim() || "No indicado",
      budget: document.getElementById("requestBudget").value,
      other_activity: document.getElementById("requestOtherActivity").value.trim() || "No indicada",
      known_cost: document.getElementById("requestKnownCost").value.trim() || "No indicado",
      costs_to_check: document.getElementById("requestCostsToCheck").value.trim() || "Cuota inicial, mensualidad, equipación, licencia/seguro y transporte si corresponde",
      saved_activity_count: String(selected.size),
      message: emailBody,
      consent: "La persona ha marcado la casilla de información y consentimiento del formulario.",
      _honey: document.getElementById("website").value,
      _url: "https://findialab.me/mi-lista.html"
    };

    const originalButtonText = 'Enviar solicitud <span aria-hidden="true">↗</span>';
    const controller = new AbortController();
    let timeoutId = null;
    sendButton.disabled = true;
    sendButton.textContent = "Enviando solicitud…";
    showStatus("Conectando con el servicio de correo. Esto no debería tardar más de 15 segundos.");

    try {
      timeoutId = window.setTimeout(function () {
        controller.abort();
      }, 15000);

      const response = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(recipient), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: "no-store"
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("El servicio de correo ha devuelto una respuesta que no podemos interpretar. Inténtalo de nuevo más tarde.");
      }

      if (!response.ok || String(result.success).toLowerCase() !== "true") {
        const detail = result.message || result.error || ("Respuesta HTTP " + response.status);
        throw new Error(String(detail));
      }

      showStatus("Solicitud aceptada por el servicio de correo. Si es el primer envío a contacto@findialab.me, revisa el buzón y confirma el mensaje de activación de FormSubmit. A partir de la activación, las solicitudes se reenviarán a los miembros del equipo configurados en Namecheap.", "success");
      form.reset();
    } catch (error) {
      if (error && error.name === "AbortError") {
        showStatus("El servicio de correo no ha respondido en 15 segundos. La solicitud no se ha podido confirmar. Revisa la conexión e inténtalo una sola vez más. Si persiste, comprueba la activación de contacto@findialab.me en el correo del equipo.", "error");
      } else if (error instanceof TypeError) {
        showStatus("No se ha podido conectar con FormSubmit. Puede ser un bloqueo de red o un problema temporal del servicio. Comprueba tu conexión e inténtalo de nuevo.", "error");
      } else {
        showStatus("No se ha podido confirmar el envío: " + (error && error.message ? error.message : "error desconocido") + ". Comprueba que contacto@findialab.me está activado en FormSubmit y vuelve a intentarlo.", "error");
      }
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      sendButton.disabled = false;
      sendButton.innerHTML = originalButtonText;
    }
  });

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", function () {
    const open = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  mainNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  });

  render();
})();