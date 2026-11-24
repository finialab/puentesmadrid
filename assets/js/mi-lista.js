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

    const name = field("requestName");
    const district = field("requestDistrict");
    const budget = field("requestBudget");
    const otherActivity = field("requestOtherActivity");
    const knownCost = field("requestKnownCost");
    const costsToCheck = field("requestCostsToCheck");
    const extraMessage = field("requestMessage");

    const activityText = items.length
      ? items.map(function (item) {
          let description = item.title + " (" + (item.area ? item.area + ", " : "") + "distrito de " + item.zone + ").";
          description += " El coste publicado es: " + (item.price || "está pendiente de confirmar") + ".";
          if (item.priceDetail) description += " " + item.priceDetail;
          if (item.extraCosts) description += " También me gustaría comprobar si hay gastos adicionales como " + item.extraCosts.toLowerCase() + ".";
          description += " La información oficial está disponible en " + item.officialUrl + ".";
          return description;
        }).join("\n\n")
      : "Todavía no he seleccionado una actividad concreta, por lo que agradecería ayuda para encontrar opciones que encajen con mis preferencias.";

    const paragraphs = [
      "Hola, equipo de FINDIA PUENTES:",
      "Me llamo " + name + " y me gustaría recibir vuestra ayuda para encontrar una actividad en Madrid en la que pueda participar y conocer gente.",
      "Mi zona de referencia es " + (district || "Madrid; todavía no tengo una zona concreta") + " y mi presupuesto es " + (budget || "flexible, por determinar") + ".",
      otherActivity ? "En particular, me interesa: " + otherActivity + "." : "",
      knownCost ? "Me han indicado este precio: " + knownCost + ". Me gustaría saber si es el coste completo o si hay algún pago adicional." : "",
      costsToCheck ? "Antes de decidirme, agradecería que me ayudaseis a comprobar estos posibles gastos: " + costsToCheck + "." : "",
      "He estado mirando vuestra selección y estas son las opciones que me han llamado la atención:",
      activityText,
      extraMessage ? "Quería añadir también lo siguiente: " + extraMessage : "",
      "He leído el aviso de privacidad y acepto que los datos de este formulario se utilicen para gestionar esta solicitud.",
      "Muchas gracias por vuestro tiempo y por la ayuda. Quedo pendiente de vuestra respuesta.",
      "Un saludo,",
      name
    ];

    return paragraphs.filter(Boolean).join("\n\n");
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
    event.preventDefault();
    if (!form.reportValidity()) return;

    const recipient = String(config.contactEmail || "").trim();
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
      showStatus("El correo de recepción del equipo no está configurado correctamente. Contacta con FINDIA PUENTES por otro canal.", "error");
      return;
    }

    const senderName = document.getElementById("requestName").value.trim();
    const senderEmail = document.getElementById("requestEmail").value.trim();
    const payload = {
      name: senderName,
      email: senderEmail,
      _replyto: senderEmail,
      _subject: "Solicitud de orientación de " + senderName + " — FINDIA PUENTES",
      _next: "https://findialab.me/gracias.html",
      _url: "https://findialab.me/mi-lista.html",
      message: buildEmailBody(),
      _honey: document.getElementById("website").value
    };

    const outgoingForm = document.createElement("form");
    outgoingForm.method = "POST";
    outgoingForm.action = "https://formsubmit.co/" + recipient;
    outgoingForm.acceptCharset = "UTF-8";
    outgoingForm.target = "_self";
    outgoingForm.style.display = "none";
    Object.keys(payload).forEach(function (key) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(payload[key] == null ? "" : payload[key]);
      outgoingForm.appendChild(input);
    });

    sendButton.disabled = true;
    sendButton.textContent = "Enviando…";
    showStatus("Enviando tu solicitud. Al terminar, volverás a FINDIA PUENTES con una confirmación.");
    document.body.appendChild(outgoingForm);
    outgoingForm.submit();
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