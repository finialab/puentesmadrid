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
  const T = window.PUENTES_T || function (value) { return value; };
  const isEnglish = function () { return window.PUENTES_LANG === "en"; };

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
    catch (error) { showStatus(T("No hemos podido actualizar la lista en esta pestaña. Prueba a recargar la página."), "error"); }
  }
  function showStatus(message, type) {
    status.textContent = message;
    status.className = "list-request-status" + (type ? " is-" + type : "");
  }
  function render() {
    const items = data.filter(function (item) { return selected.has(item.id); });
    const label = items.length + (isEnglish() ? (items.length === 1 ? " activity saved" : " activities saved") : (items.length === 1 ? " actividad guardada" : " actividades guardadas"));
    count.textContent = label;
    savedCount.textContent = String(items.length);
    emptyState.hidden = items.length > 0;
    savedContainer.hidden = items.length === 0;
    savedContainer.innerHTML = items.map(function (item) {
      const category = T(item.category === "cultura" ? "Cultura" : item.category === "deporte" ? "Deporte" : "Música");
      return '<article class="saved-activity-card">' +
        '<p class="saved-activity-meta">' + escapeHtml(category) + " · " + escapeHtml(item.area ? item.area + " · " : "") + escapeHtml(isEnglish() ? "District " : "Distrito ") + escapeHtml(item.zone) + '</p>' +
        '<h3>' + escapeHtml(T(item.title)) + '</h3>' +
        '<p class="saved-activity-price">' + escapeHtml(T(item.price || "Precio por confirmar con la entidad")) + '</p>' +
        (item.priceDetail ? '<p class="saved-activity-detail">' + escapeHtml(T(item.priceDetail)) + '</p>' : '') +
        (item.extraCosts ? '<p class="saved-activity-detail"><strong>' + escapeHtml(T("Otros gastos que conviene comprobar:")) + '</strong> ' + escapeHtml(T(item.extraCosts)) + '</p>' : '') +
        '<div class="saved-activity-actions">' +
          '<a href="' + escapeHtml(item.officialUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(T("Fuente oficial ↗")) + '</a>' +
          '<button type="button" data-remove="' + escapeHtml(item.id) + '">' + escapeHtml(T("Quitar de mi lista")) + '</button>' +
        '</div></article>';
    }).join("");
  }
  function buildEmailBody() {
    const items = data.filter(function (item) { return selected.has(item.id); });
    const field = function (id) {
      const element = document.getElementById(id);
      return element ? String(element.value || "").trim() : "";
    };
    const district = field("requestDistrict");
    const budget = field("requestBudget");
    const otherActivity = field("requestOtherActivity");
    const knownCost = field("requestKnownCost");
    const costsToCheck = field("requestCostsToCheck");
    const extraMessage = field("requestMessage");

    const categoryNames = {
      cultura: T("Cultura"),
      deporte: T("Deporte"),
      musica: T("Música")
    };

    const selectedActivities = items.length
      ? items.map(function (item, index) {
          const location = (item.area ? item.area + " · " : "") +
            (isEnglish() ? "District " : "Distrito ") + item.zone;
          const lines = [
            (index + 1) + ". " + T(item.title),
            (isEnglish() ? "   Category: " : "   Categoría: ") + (categoryNames[item.category] || item.category || (isEnglish() ? "Not specified" : "No indicada")),
            (isEnglish() ? "   Location: " : "   Ubicación: ") + location,
            (isEnglish() ? "   Published cost: " : "   Coste publicado: ") + T(item.price || "Pendiente de confirmar con la entidad"),
            item.priceDetail ? (isEnglish() ? "   Cost information: " : "   Información sobre el coste: ") + T(item.priceDetail) : "",
            item.extraCosts ? (isEnglish() ? "   Other costs to check: " : "   Otros gastos que conviene comprobar: ") + T(item.extraCosts) : "",
            item.priceSourceUrl ? (isEnglish() ? "   Tariff source: " : "   Fuente de tarifas: ") + item.priceSourceUrl : "",
            (isEnglish() ? "   Official source: " : "   Fuente oficial: ") + item.officialUrl
          ];
          return lines.filter(Boolean).join("\n");
        }).join("\n\n")
      : (isEnglish()
          ? "The person has not saved a specific activity and is asking for help finding suitable options."
          : "La persona no ha guardado una actividad concreta y solicita ayuda para encontrar opciones adecuadas.");

    const preferences = [
      (isEnglish() ? "Area of interest: " : "Zona de referencia: ") + (district || (isEnglish() ? "Not specified; options across Madrid city can be considered" : "No indicada; puede valorar opciones de Madrid capital")),
      (isEnglish() ? "Budget: " : "Presupuesto: ") + T(budget || "Pendiente de concretar"),
      otherActivity ? (isEnglish() ? "Activity not listed in the catalogue: " : "Actividad que busca fuera del catálogo: ") + otherActivity : "",
      knownCost ? (isEnglish() ? "Price quoted: " : "Precio que le han comunicado: ") + knownCost : "",
      costsToCheck ? (isEnglish() ? "Costs to check: " : "Gastos que desea comprobar: ") + costsToCheck : ""
    ].filter(Boolean).join("\n");

    return isEnglish() ? [
      "REQUEST SUMMARY",
      "",
      "PREFERENCES AND NEEDS",
      preferences,
      "",
      "SELECTED ACTIVITIES",
      selectedActivities,
      "",
      "ADDITIONAL NOTES",
      extraMessage || "No additional notes."
    ].join("\n") : [
      "RESUMEN DE LA SOLICITUD",
      "",
      "PREFERENCIAS Y NECESIDADES",
      preferences,
      "",
      "ACTIVIDADES SELECCIONADAS",
      selectedActivities,
      "",
      "OBSERVACIONES DE LA PERSONA",
      extraMessage || "No ha añadido observaciones."
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

  form.addEventListener("submit", function (event) {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    const turnstileResponse = form.querySelector('input[name="cf-turnstile-response"]');
    if (!turnstileResponse || !turnstileResponse.value.trim()) {
      event.preventDefault();
      showStatus("Completa la verificación de seguridad antes de enviar la solicitud.", "error");
      return;
    }

    const endpoint = String(config.submissionEndpoint || "").trim();
    const validEndpoint = /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/.test(endpoint);
    if (!validEndpoint) {
      event.preventDefault();
      showStatus("El servicio de envío no está configurado correctamente. No se ha enviado nada. Contacta con el equipo técnico.", "error");
      return;
    }

    const senderEmail = document.getElementById("requestEmail").value.trim();
    form.action = endpoint;
    form.method = "POST";
    document.getElementById("formReplyTo").value = senderEmail;
    document.getElementById("generatedMessage").value = buildEmailBody();
    document.getElementById("formLanguage").value = window.PUENTES_LANG || "es";

    sendButton.disabled = true;
    sendButton.textContent = "Enviando…";
    showStatus("Tu solicitud se está enviando al equipo de FINDIA PUENTES…");

    // No cancelamos el evento: el navegador envía el formulario HTML original
    // directamente a Google Apps Script, sin AJAX ni dependencias de terceros.
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
  document.addEventListener("puentes:languagechange", function () { render(); });

})();