(function () {
  "use strict";
  const data = Array.isArray(window.PUENTES_ACTIVITIES) ? window.PUENTES_ACTIVITIES : [];
  const config = window.PUENTES_CONFIG || { contactEmail: "", verifiedOn: "" };
  const adjacency = window.PUENTES_ADJACENCY || {};
  const zoneSelect = document.getElementById("zoneSelect");
  const townSelect = document.getElementById("townSelect");
  const searchForm = document.getElementById("searchForm");
  const resultsArea = document.getElementById("resultsArea");
  const firstSearchHint = document.getElementById("firstSearchHint");
  const resourceGrid = document.getElementById("resourceGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultsDescription = document.getElementById("resultsDescription");
  const resultCount = document.getElementById("resultCount");
  const selectionList = document.getElementById("selectionList");
  const selectionCount = document.getElementById("selectionCount");
  const contactStatus = document.getElementById("contactStatus");
  const toast = document.getElementById("toast");
  let category = "all";
  let sortMode = "local";
  let hasSearched = false;
  const selected = new Set();
  let toastTimer = null;
  const categoryNames = { cultura: "Cultura", deporte: "Deporte", musica: "Música" };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }
  function normalize(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 3300);
  }
  function updateTownOptions() {
    const district = zoneSelect.value;
    townSelect.disabled = !district || district === "__all";
    townSelect.value = "";
    townSelect.placeholder = townSelect.disabled
      ? "Selecciona primero un distrito"
      : "Ej. Embajadores, Justicia, Pacífico...";
  }
  function scoreLocation(item) {
    const district = zoneSelect.value;
    const neighbourhood = normalize(townSelect.value);
    if (!district || district === "__all") return 3;
    if (item.zone === district) {
      if (neighbourhood && item.area && normalize(item.area).includes(neighbourhood)) return 0;
      return 1;
    }
    if ((adjacency[district] || []).includes(item.zone)) return 2;
    return 3;
  }
  function getLocationLabel(item) {
    if (zoneSelect.value === "__all") return "Madrid capital";
    const score = scoreLocation(item);
    if (score === 0) return "En tu barrio";
    if (score === 1) return "En tu distrito";
    if (score === 2) return "Distrito próximo";
    return "Otro distrito de Madrid";
  }
  function mapUrl(item) {
    const query = item.mapsQuery || item.address;
    if (!query) return "";
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }
  function getEntries() {
    let list = data.slice();
    if (category !== "all") list = list.filter(function (item) { return item.category === category; });
    list.sort(function (a, b) {
      if (sortMode === "free") {
        const priceRank = function (item) {
          if (item.priceType === "free") return 0;
          if (item.priceType === "published") return 1;
          return 2;
        };
        const diff = priceRank(a) - priceRank(b);
        if (diff !== 0) return diff;
      }
      return scoreLocation(a) - scoreLocation(b) || a.title.localeCompare(b.title, "es");
    });
    return list;
  }
  function renderCard(item) {
    const saved = selected.has(item.id);
    const locality = getLocationLabel(item);
    const isOther = locality === "Otro distrito de Madrid";
    const priceClass = item.priceType === "free" ? " free" : "";
    const map = mapUrl(item);
    return [
      '<article class="resource-card">',
        '<div class="card-topline"><span class="card-category">', escapeHtml(categoryNames[item.category] || item.category), '</span>',
          '<span class="location-tag', isOther ? ' is-other' : '', '">', escapeHtml(locality), '</span></div>',
        '<h3>', escapeHtml(item.title), '</h3>',
        '<p class="card-place">', escapeHtml(item.area ? item.area + " · " : ""), 'Distrito ', escapeHtml(item.zone), '</p>',
        '<p class="card-summary">', escapeHtml(item.summary), '</p>',
        '<div class="card-activity"><strong>Qué puedes encontrar</strong>', escapeHtml(item.offer), '</div>',
        '<dl class="card-facts">',
          '<div class="card-fact"><dt>Dirección</dt><dd>', escapeHtml(item.address), '</dd></div>',
          '<div class="card-fact"><dt>Acceso</dt><dd>', escapeHtml(item.access), '</dd></div>',
          '<div class="card-fact"><dt>Edad</dt><dd>', escapeHtml(item.age), '</dd></div>',
        '</dl>',
        '<span class="price-pill', priceClass, '">', item.priceType === "free" ? '✓ ' : '', escapeHtml(item.price), '</span>',
        '<div class="card-actions">',
          '<a class="card-action" href="', escapeHtml(item.officialUrl), '" target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a>',
          map ? '<a class="card-action" href="' + escapeHtml(map) + '" target="_blank" rel="noopener noreferrer">Ver mapa ↗</a>' : '',
          '<button class="card-action card-action-save', saved ? ' is-saved' : '', '" type="button" data-save="', escapeHtml(item.id), '" aria-pressed="', saved ? 'true' : 'false', '">', saved ? '✓ Guardada' : '+ Me interesa', '</button>',
        '</div>',
        '<p class="card-source">Fuente: ', escapeHtml(item.sourceName), ' · Revisado ', escapeHtml(config.verifiedOn || "23/11/2026"), '</p>',
      '</article>'
    ].join("");
  }
  function renderResults() {
    if (!hasSearched) return;
    resultsArea.hidden = false;
    firstSearchHint.hidden = true;
    const district = zoneSelect.value;
    const neighbourhood = townSelect.value.trim();
    const list = getEntries();
    const isAll = district === "__all";
    resultsTitle.textContent = category === "all" ? "Opciones para explorar en Madrid" : categoryNames[category] + " en Madrid";
    if (isAll) {
      resultsDescription.textContent = "Todas las fichas de Madrid capital, agrupadas por categoría y ordenadas por distrito.";
    } else {
      const nearbyCount = list.filter(function (item) { return scoreLocation(item) <= 2; }).length;
      resultsDescription.textContent = (neighbourhood ? "Referencia: " + neighbourhood + " · " : "") +
        (nearbyCount > 0
          ? "Primero tu distrito (" + district + "), después los distritos próximos y, por último, otras zonas de Madrid capital."
          : "Aún no tenemos fichas en " + district + " ni en sus distritos próximos para esta selección. Mostramos otras opciones del municipio de Madrid.") +
        " No calculamos distancias exactas.";
    }
    resultCount.textContent = list.length + (list.length === 1 ? " opción" : " opciones");
    resourceGrid.innerHTML = "";
    emptyState.hidden = list.length > 0;
    resourceGrid.hidden = list.length === 0;
    if (list.length) resourceGrid.innerHTML = list.map(renderCard).join("");
    renderSelection();
  }
  function renderSelection() {
    const items = data.filter(function (item) { return selected.has(item.id); });
    selectionCount.textContent = items.length + (items.length === 1 ? " actividad guardada" : " actividades guardadas");
    if (!items.length) {
      selectionList.innerHTML = '<li class="selection-empty">Todavía no has guardado ninguna actividad.</li>';
      return;
    }
    selectionList.innerHTML = items.map(function (item) {
      return '<li>' + escapeHtml(item.title) + ' · ' + escapeHtml(item.area ? item.area + ", " : "") + escapeHtml(item.zone) + '</li>';
    }).join("");
  }
  function setCategory(nextCategory) {
    category = nextCategory;
    document.querySelectorAll("[data-category]").forEach(function (button) {
      const active = button.getAttribute("data-category") === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderResults();
  }
  function getRequestText() {
    const savedItems = data.filter(function (item) { return selected.has(item.id); });
    const name = document.getElementById("contactName").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    const lines = [
      "Consulta desde la web FINDIA PUENTES",
      name ? "Nombre: " + name : "",
      "Distrito seleccionado: " + (zoneSelect.value === "__all" ? "Toda Madrid capital" : (zoneSelect.value || "No seleccionado")),
      townSelect.value.trim() ? "Barrio de referencia: " + townSelect.value.trim() : "",
      "",
      "Actividades que me interesan:",
      savedItems.length ? savedItems.map(function (item) { return "- " + item.title + " (" + item.area + ", distrito " + item.zone + ") — " + item.officialUrl; }).join("\n") : "- Todavía no he guardado ninguna actividad.",
      "",
      "¿En qué me gustaría recibir ayuda?",
      message || "Me gustaría recibir información sobre cómo participar."
    ];
    return lines.filter(function (line, index) { return !(line === "" && lines[index - 1] === ""); }).join("\n");
  }
  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
    area.remove();
    return ok;
  }

  zoneSelect.addEventListener("change", function () {
    updateTownOptions();
    if (hasSearched && zoneSelect.value) renderResults();
  });
  townSelect.addEventListener("input", function () {
    if (hasSearched) renderResults();
  });
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!zoneSelect.value) {
      showToast("Selecciona primero un distrito de Madrid.");
      zoneSelect.focus();
      return;
    }
    hasSearched = true;
    setCategory("all");
    renderResults();
    resultsArea.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelectorAll("[data-category]").forEach(function (button) {
    button.addEventListener("click", function () { setCategory(button.getAttribute("data-category")); });
  });
  document.getElementById("sortSelect").addEventListener("change", function (event) {
    sortMode = event.target.value;
    renderResults();
  });
  document.getElementById("resetFilters").addEventListener("click", function () {
    sortMode = "local";
    document.getElementById("sortSelect").value = "local";
    setCategory("all");
  });
  document.getElementById("showAllResources").addEventListener("click", function () {
    zoneSelect.value = "__all";
    updateTownOptions();
    hasSearched = true;
    renderResults();
    resultsArea.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  resourceGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-save]");
    if (!button) return;
    const id = button.getAttribute("data-save");
    if (selected.has(id)) {
      selected.delete(id);
      showToast("Has quitado la actividad de tu lista.");
    } else {
      selected.add(id);
      showToast("Actividad guardada en tu lista.");
    }
    renderResults();
    renderSelection();
  });
  document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = String(config.contactEmail || "").trim();
    if (!email || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
      contactStatus.textContent = "El correo de PUENTES está pendiente de configurar. Puedes copiar tu consulta y el equipo añadirá aquí su dirección antes de publicar.";
      showToast("Correo de contacto pendiente de configurar.");
      return;
    }
    const subject = encodeURIComponent("Consulta sobre PUENTES");
    const body = encodeURIComponent(getRequestText());
    window.location.href = "mailto:" + encodeURIComponent(email) + "?subject=" + subject + "&body=" + body;
  });
  document.getElementById("copyRequest").addEventListener("click", async function () {
    const text = getRequestText();
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        copied = fallbackCopy(text);
      }
    } catch (error) {
      copied = fallbackCopy(text);
    }
    contactStatus.textContent = copied
      ? "Consulta copiada. Puedes pegarla en un correo cuando tengas la dirección de contacto."
      : "No se ha podido copiar automáticamente. Selecciona y copia el texto manualmente.";
    showToast(copied ? "Consulta copiada." : "No se pudo copiar la consulta.");
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

  updateTownOptions();
  renderSelection();
})();