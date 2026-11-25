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
  const selectionCount = document.getElementById("selectionCount");
  const toast = document.getElementById("toast");
  let category = "all";
  let sortMode = "cost";
  let hasSearched = false;
  const STORAGE_KEY = "findiaPuentesSavedActivities.v1";
  function loadSavedIds() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(stored) ? stored.filter(function (id) { return data.some(function (item) { return item.id === id; }); }) : [];
    } catch (error) {
      return [];
    }
  }
  const selected = new Set(loadSavedIds());
  function persistSavedIds() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(selected))); }
    catch (error) { showToast(T("No se ha podido guardar la lista en esta pestaña.")); }
  }
  let toastTimer = null;
  const T = window.PUENTES_T || function (value) { return value; };
  const isEnglish = function () { return window.PUENTES_LANG === "en"; };
  const categoryNames = { cultura: T("Cultura"), deporte: T("Deporte"), musica: T("Música") };

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
      ? T("Selecciona primero un distrito")
      : (isEnglish() ? "e.g. Embajadores, Justicia, Pacífico..." : "Ej. Embajadores, Justicia, Pacífico...");
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
    if (zoneSelect.value === "__all") return T("Madrid capital");
    const score = scoreLocation(item);
    if (score === 0) return T("En tu barrio");
    if (score === 1) return T("En tu distrito");
    if (score === 2) return T("Distrito próximo");
    return T("Otro distrito de Madrid");
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
      if (sortMode === "cost") {
        const rank = function (item) {
          return Number.isFinite(Number(item.priceRank)) ? Number(item.priceRank) : 9;
        };
        const diff = rank(a) - rank(b);
        if (diff !== 0) return diff;
      }
      return scoreLocation(a) - scoreLocation(b) || a.title.localeCompare(b.title, "es");
    });
    return list;
  }
  function priceBadge(item) {
    const labels = { free: "Gratis", freeOrVaries: "Hay opciones gratuitas", low: "Coste bajo publicado", medium: "Coste medio publicado", high: "Coste alto", varies: "Precio por confirmar", unknown: "Precio no publicado" };
    return T(labels[item.priceType] || "Precio por confirmar");
  }
  function renderCard(item) {
    const saved = selected.has(item.id);
    const locality = getLocationLabel(item);
    const isOther = locality === T("Otro distrito de Madrid");
    const priceClass = item.priceType === "free" || item.priceType === "freeOrVaries" ? " free" : "";
    const map = mapUrl(item);
    return [
      '<article class="resource-card">',
        '<div class="card-topline"><span class="card-category">', escapeHtml(categoryNames[item.category] || item.category), '</span>',
          '<span class="location-tag', isOther ? ' is-other' : '', '">', escapeHtml(locality), '</span></div>',
        '<h3>', escapeHtml(T(item.title)), '</h3>',
        '<p class="card-place">', escapeHtml(item.area ? item.area + " · " : ""), escapeHtml(isEnglish() ? "District " : "Distrito "), escapeHtml(item.zone), '</p>',
        '<p class="card-summary">', escapeHtml(T(item.summary)), '</p>',
        '<div class="card-activity"><strong>', escapeHtml(T("Qué puedes encontrar")), '</strong>', escapeHtml(T(item.offer)), '</div>',
        '<dl class="card-facts">',
          '<div class="card-fact"><dt>', escapeHtml(T("Dirección")), '</dt><dd>', escapeHtml(T(item.address)), '</dd></div>',
          '<div class="card-fact"><dt>', escapeHtml(T("Acceso")), '</dt><dd>', escapeHtml(T(item.access)), '</dd></div>',
          '<div class="card-fact"><dt>', escapeHtml(T("Edad")), '</dt><dd>', escapeHtml(T(item.age)), '</dd></div>',
        '</dl>',
        '<div class="cost-panel">',
          '<div class="cost-panel-head"><strong>', escapeHtml(T("Coste orientativo")), '</strong><span class="price-pill', priceClass, '">', escapeHtml(priceBadge(item)), '</span></div>',
          '<p class="cost-main">', escapeHtml(T(item.price || "Consultar con la entidad.")), '</p>',
          item.priceDetail ? '<p class="cost-detail">' + escapeHtml(T(item.priceDetail)) + '</p>' : '',
          item.extraCosts ? '<p class="cost-extras"><strong>' + escapeHtml(T("Comprueba también:")) + '</strong> ' + escapeHtml(T(item.extraCosts)) + '</p>' : '',
          item.priceSourceUrl ? '<a class="cost-source" href="' + escapeHtml(item.priceSourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(T("Consultar tarifas oficiales ↗")) + '</a>' : '',
        '</div>',
        '<div class="card-actions">',
          '<a class="card-action" href="', escapeHtml(item.officialUrl), '" target="_blank" rel="noopener noreferrer">', escapeHtml(T("Fuente oficial ↗")), '</a>',
          map ? '<a class="card-action" href="' + escapeHtml(map) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(T("Ver mapa ↗")) + '</a>' : '',
          '<button class="card-action card-action-save', saved ? ' is-saved' : '', '" type="button" data-save="', escapeHtml(item.id), '" aria-pressed="', saved ? 'true' : 'false', '">', saved ? T('✓ En mi lista') : T('+ Añadir a mi lista'), '</button>',
        '</div>',
        '<p class="card-source">', escapeHtml(T("Fuente:")), ' ', escapeHtml(T(item.sourceName)), ' · ', escapeHtml(T("Revisión:")), ' ', escapeHtml(config.verifiedOn || "24/11/2026"), '</p>',
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
    resultsTitle.textContent = category === "all" ? T("Opciones para explorar en Madrid") : categoryNames[category] + (isEnglish() ? " in Madrid" : " en Madrid");
    if (isAll) {
      resultsDescription.textContent = T("Todas las fichas de Madrid capital, agrupadas por categoría y ordenadas por distrito.");
    } else {
      const nearbyCount = list.filter(function (item) { return scoreLocation(item) <= 2; }).length;
      resultsDescription.textContent = (neighbourhood ? T("Referencia:") + " " + neighbourhood + " · " : "") +
        (nearbyCount > 0
          ? (isEnglish() ? "First your district (" + district + "), then nearby districts and finally other areas of Madrid city." : "Primero tu distrito (" + district + "), después los distritos próximos y, por último, otras zonas de Madrid capital.")
          : (isEnglish() ? "We do not yet have listings in " + district + " or nearby districts for this selection. We are showing other options across Madrid city." : "Aún no tenemos fichas en " + district + " ni en sus distritos próximos para esta selección. Mostramos otras opciones del municipio de Madrid.")) +
        (isEnglish() ? " We do not calculate exact distances." : " No calculamos distancias exactas.");
    }
    resultCount.textContent = list.length + (isEnglish() ? (list.length === 1 ? " option" : " options") : (list.length === 1 ? " opción" : " opciones"));
    resourceGrid.innerHTML = "";
    emptyState.hidden = list.length > 0;
    resourceGrid.hidden = list.length === 0;
    if (list.length) resourceGrid.innerHTML = list.map(renderCard).join("");
    renderSelection();
  }
  function renderSelection() {
    const items = data.filter(function (item) { return selected.has(item.id); });
    const countLabel = items.length + (isEnglish() ? (items.length === 1 ? " activity saved" : " activities saved") : (items.length === 1 ? " actividad guardada" : " actividades guardadas"));
    const counter = document.getElementById("selectionCount");
    if (counter) counter.textContent = countLabel;
    const savedCount = document.getElementById("savedCount");
    if (savedCount) savedCount.textContent = String(items.length);
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
      showToast(T("Selecciona primero un distrito de Madrid."));
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
    sortMode = "cost";
    document.getElementById("sortSelect").value = "cost";
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
      showToast(T("Has quitado la actividad de tu lista."));
    } else {
      selected.add(id);
      showToast(T("Actividad guardada en tu lista."));
    }
    persistSavedIds();
    renderResults();
  });
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", function () {
    const open = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? T("Cerrar menú") : T("Abrir menú"));
  });
  mainNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", T("Abrir menú"));
    }
  });

  updateTownOptions();
  renderSelection();
  document.addEventListener("puentes:languagechange", function () {
    categoryNames.cultura = T("Cultura");
    categoryNames.deporte = T("Deporte");
    categoryNames.musica = T("Música");
    updateTownOptions();
    if (hasSearched) renderResults();
    renderSelection();
  });
})();