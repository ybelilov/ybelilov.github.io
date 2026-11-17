(() => {
  "use strict";

  /* ================= i18n ================= */
  const I18N = {
    uk: {
      title: "В'єтнам 2027",
      subtitle: "Карта найкращих місць",
      search: "Пошук: фо, руфтоп, пагода…",
      rating: "Рейтинг", price: "Ціна", sort: "Сортування",
      any: "Будь-який", free: "Безкоштовно",
      sortRating: "За рейтингом", sortName: "За назвою", sortDistance: "Найближчі",
      reset: "Скинути фільтри",
      nearMe: "Поруч зі мною",
      count: (n, t) => `Показано <b>${n}</b> з ${t} місць`,
      emptyT: "Нічого не знайдено", emptyD: "Спробуйте змінити або скинути фільтри.",
      emptyStarT: "Обране порожнє", emptyStarD: "Натисніть ☆ біля місця, щоб додати його сюди.",
      showMap: (n) => `Карта · ${n}`, showList: "Список",
      openGmaps: "Відкрити в Google Maps", directions: "Маршрут", onMap: "Показати на карті",
      star: "В обране", starred: "В обраному", website: "Сайт", share: "Поділитися",
      tip: "Порада", hype: "Чому хайп", hours: "Години", address: "Адреса",
      driver: "Покажіть водієві / Grab", copied: "Скопійовано", linkCopied: "Посилання скопійовано",
      photos: "Фото в Google", photoBy: "фото",
      must: "🔥 Must-see", gem: "💎 Прихована перлина", viral: "📸 Хайп у соцмережах",
      google: "Google", km: "км", locErr: "Не вдалося визначити місцезнаходження",
      starAdded: "Додано в обране", starRemoved: "Прибрано з обраного",
      price0: "Безкоштовно",
    },
    en: {
      title: "Vietnam 2027",
      subtitle: "Map of the best places",
      search: "Search: pho, rooftop, pagoda…",
      rating: "Rating", price: "Price", sort: "Sort",
      any: "Any", free: "Free",
      sortRating: "Top rated", sortName: "Name", sortDistance: "Nearest",
      reset: "Reset filters",
      nearMe: "Near me",
      count: (n, t) => `Showing <b>${n}</b> of ${t} places`,
      emptyT: "Nothing found", emptyD: "Try changing or resetting the filters.",
      emptyStarT: "No favourites yet", emptyStarD: "Tap ☆ next to a place to add it here.",
      showMap: (n) => `Map · ${n}`, showList: "List",
      openGmaps: "Open in Google Maps", directions: "Directions", onMap: "Show on map",
      star: "Add to favourites", starred: "In favourites", website: "Website", share: "Share",
      tip: "Tip", hype: "Why it's hyped", hours: "Hours", address: "Address",
      driver: "Show the driver / Grab", copied: "Copied", linkCopied: "Link copied",
      photos: "Photos on Google", photoBy: "photo",
      must: "🔥 Must-see", gem: "💎 Hidden gem", viral: "📸 Social-media hype",
      google: "Google", km: "km", locErr: "Couldn't get your location",
      starAdded: "Added to favourites", starRemoved: "Removed from favourites",
      price0: "Free",
    },
  };

  const REGIONS = [
    { id: "all", uk: ["Усі", "весь В'єтнам"], en: ["All", "Vietnam"] },
    { id: "hcmc", uk: ["Хошимін", "і околиці"], en: ["Saigon", "& around"] },
    { id: "central", uk: ["Дананг", "Хойан · Хюе"], en: ["Da Nang", "Hoi An · Hue"] },
    { id: "hanoi", uk: ["Ханой", "Халонг · Ніньбінь"], en: ["Hanoi", "Ha Long · Ninh Binh"] },
  ];

  const CATS = {
    sights:      { e: "🏛️", c: "#e4572e", uk: "Пам'ятки", en: "Sights" },
    temples:     { e: "🛕", c: "#c99700", uk: "Храми й пагоди", en: "Temples & pagodas" },
    museums:     { e: "🏺", c: "#8e44ad", uk: "Музеї та історія", en: "Museums & history" },
    nature:      { e: "🌿", c: "#2e8b57", uk: "Природа й поїздки", en: "Nature & day trips" },
    beaches:     { e: "🏖️", c: "#0096c7", uk: "Пляжі", en: "Beaches" },
    streetfood:  { e: "🍜", c: "#f07c00", uk: "Вулична їжа", en: "Street food" },
    restaurants: { e: "🍽️", c: "#c0392b", uk: "Ресторани", en: "Restaurants" },
    cafes:       { e: "☕", c: "#8b5a2b", uk: "Кав'ярні", en: "Cafés" },
    bars:        { e: "🍸", c: "#5e35b1", uk: "Бари й руфтопи", en: "Bars & rooftops" },
    markets:     { e: "🛍️", c: "#d81b60", uk: "Ринки й шопінг", en: "Markets & shopping" },
    experiences: { e: "✨", c: "#00838f", uk: "Унікальний досвід", en: "Unique experiences" },
  };

  const SPECIALS = [
    { id: "starred", c: "#e0a800", uk: "⭐ Обране", en: "⭐ Favourites", test: (p) => stars.has(p.id) },
    { id: "must", c: "#da251d", uk: "🔥 Must-see", en: "🔥 Must-see", test: (p) => p.mustSee },
    { id: "gem", c: "#1565c0", uk: "💎 Приховані перлини", en: "💎 Hidden gems", test: (p) => p.hiddenGem },
    { id: "viral", c: "#8e24aa", uk: "📸 Хайп у соцмережах", en: "📸 Social-media hype", test: (p) => p.viral },
  ];

  /* ================= Storage (safe) ================= */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  /* ================= State ================= */
  const PLACES = (window.PLACES || []).filter((p) => CATS[p.category] && isFinite(p.lat) && isFinite(p.lng));
  const byId = new Map(PLACES.map((p) => [p.id, p]));
  const stars = new Set(store.get("vn27.stars", []).filter((id) => byId.has(id)));

  const state = {
    lang: store.get("vn27.lang", "uk") === "en" ? "en" : "uk",
    region: "all",
    cats: new Set(),
    specials: new Set(),
    minRating: 0,
    maxPrice: 4,
    sort: "rating",
    q: "",
    selected: null,
    me: null,
  };

  const $ = (s) => document.querySelector(s);
  const t = (k, ...a) => { const v = I18N[state.lang][k]; return typeof v === "function" ? v(...a) : v; };
  const L10 = (o) => (o && (o[state.lang] || o.en || o.uk)) || "";
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
  const isMobile = () => window.matchMedia("(max-width: 820px)").matches;

  const ICON = {
    star: '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    route: '<svg viewBox="0 0 24 24"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/></svg>',
    target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  };

  /* ================= Helpers ================= */
  function distKm(a, b) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const fmtKm = (d) => (d < 1 ? `${Math.round(d * 1000)} m` : `${d < 10 ? d.toFixed(1) : Math.round(d)} ${t("km")}`);
  function priceHtml(p) {
    if (p == null) return "";
    if (p === 0) return `<span>${esc(t("price0"))}</span>`;
    return `<span title="price">${"₫".repeat(p)}<span style="opacity:.25">${"₫".repeat(4 - p)}</span></span>`;
  }
  const gmapsUrl = (p) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${p.address || p.area || ""}`)}`;
  const dirUrl = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  const photosUrl = (p) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${p.name} ${p.area || ""} Vietnam`)}`;
  function creditFor(url) {
    try {
      const u = new URL(url);
      const m = u.pathname.match(/\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/);
      if (u.hostname === "upload.wikimedia.org" && m) return { label: "Wikimedia Commons", href: `https://commons.wikimedia.org/wiki/File:${m[1]}` };
      return { label: u.hostname.replace(/^www\./, ""), href: url };
    } catch { return null; }
  }

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast(t("copied")); }
    catch { window.prompt("", text); }
  }

  /* ================= Map ================= */
  const map = L.map("map", { zoomControl: false, worldCopyJump: false, minZoom: 5 }).setView([16.2, 106.5], 6);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, className: "osm-tiles",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const cluster = L.markerClusterGroup({
    maxClusterRadius: 42, showCoverageOnHover: false, spiderfyOnMaxZoom: true, disableClusteringAtZoom: 16,
    iconCreateFunction: (c) => L.divIcon({ html: `<div><span>${c.getChildCount()}</span></div>`, className: "marker-cluster", iconSize: [40, 40] }),
  });
  map.addLayer(cluster);

  const markers = new Map();
  function pinIcon(p) {
    const cat = CATS[p.category];
    const cls = ["pin", p.mustSee ? "must" : "", stars.has(p.id) ? "starred" : "", state.selected === p.id ? "active" : ""].join(" ");
    const s = p.mustSee ? 34 : 30;
    return L.divIcon({
      className: "pin-icon",
      html: `<div class="${cls}" style="--c:${cat.c}"><span>${cat.e}</span></div>`,
      iconSize: [s, s], iconAnchor: [s * 0.15, s * 1.05], tooltipAnchor: [s * 0.4, -s * 0.6],
    });
  }
  PLACES.forEach((p) => {
    const m = L.marker([p.lat, p.lng], { icon: pinIcon(p), riseOnHover: true, title: p.name });
    m.bindTooltip(() => esc(p.name), { className: "pin-tip", direction: "top" });
    m.on("click", () => select(p.id, { fromMap: true }));
    markers.set(p.id, m);
  });
  const refreshIcon = (id) => { const p = byId.get(id), m = markers.get(id); if (p && m) m.setIcon(pinIcon(p)); };

  let meMarker = null;

  /* ================= Filtering ================= */
  function matches(p, { skipCats = false, skipRegion = false } = {}) {
    if (!skipRegion && state.region !== "all" && p.region !== state.region) return false;
    if (!skipCats && state.cats.size && !state.cats.has(p.category)) return false;
    for (const id of state.specials) { if (!SPECIALS.find((s) => s.id === id).test(p)) return false; }
    if ((p.rating || 0) < state.minRating) return false;
    if (state.maxPrice < 4 && (p.price ?? 0) > state.maxPrice) return false;
    if (state.q) {
      const hay = norm([p.name, p.nameVi, p.area, p.address, p.hype, L10(p.desc), CATS[p.category][state.lang], ...(p.tags || [])].join(" "));
      if (!state.q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }
  function filtered() {
    const list = PLACES.filter((p) => matches(p));
    const by = state.sort === "distance" && state.me ? "distance" : state.sort;
    list.sort((a, b) => {
      if (by === "name") return a.name.localeCompare(b.name);
      if (by === "distance") return distKm(state.me, a) - distKm(state.me, b);
      return (b.rating || 0) - (a.rating || 0) || (b.mustSee - a.mustSee) || a.name.localeCompare(b.name);
    });
    return list;
  }

  /* ================= Rendering ================= */
  function renderStatic() {
    document.documentElement.lang = state.lang;
    document.title = state.lang === "uk" ? "В'єтнам 2027 — карта місць" : "Vietnam 2027 — places map";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); el.setAttribute("aria-label", el.title); });
    document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === state.lang));
  }

  function renderFilters() {
    $("#regions").innerHTML = REGIONS.map((r) => {
      const n = PLACES.filter((p) => matches(p, { skipRegion: true }) && (r.id === "all" || p.region === r.id)).length;
      const [a, b] = r[state.lang];
      return `<button type="button" role="tab" data-region="${r.id}" class="${state.region === r.id ? "active" : ""}" aria-selected="${state.region === r.id}">${esc(a)} <small>${esc(b)} · ${n}</small></button>`;
    }).join("");

    $("#categories").innerHTML = Object.entries(CATS).map(([id, c]) => {
      const n = PLACES.filter((p) => p.category === id && matches(p, { skipCats: true })).length;
      if (!n && !state.cats.has(id)) return "";
      return `<button type="button" class="chip ${state.cats.has(id) ? "active" : ""}" data-cat="${id}" style="--c:${c.c}"><span class="dot"></span>${c.e} ${esc(c[state.lang])} <span class="n">${n}</span></button>`;
    }).join("");

    $("#specials").innerHTML = SPECIALS.map((s) => {
      const n = s.id === "starred" ? stars.size : PLACES.filter((p) => s.test(p)).length;
      return `<button type="button" class="chip ${state.specials.has(s.id) ? "active" : ""}" data-special="${s.id}" style="--c:${s.c}">${esc(s[state.lang])} <span class="n">${n}</span></button>`;
    }).join("");

    $("#minRating").value = String(state.minRating);
    $("#maxPrice").value = String(state.maxPrice);
    $("#sort").value = state.sort;
    const dirty = state.region !== "all" || state.cats.size || state.specials.size || state.minRating || state.maxPrice < 4 || state.q;
    $("#reset").hidden = !dirty;
  }

  function itemHtml(p) {
    const c = CATS[p.category];
    const img = p.images && p.images[0];
    const d = state.me ? `<span>📍 ${fmtKm(distKm(state.me, p))}</span>` : "";
    const badges = `${p.mustSee ? "🔥" : ""}${p.hiddenGem ? "💎" : ""}${p.viral ? "📸" : ""}`;
    return `<li class="item ${state.selected === p.id ? "selected" : ""}" data-id="${p.id}" style="--c:${c.c}">
      <div class="thumb">${c.e}${img ? `<img src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}</div>
      <div class="item-main">
        <div class="item-name">${esc(p.name)}</div>
        <div class="item-meta"><span class="cat">${esc(c[state.lang])}</span><span>${esc(p.area || "")}</span>${priceHtml(p.price)}${d}</div>
      </div>
      <div class="item-side">
        <span class="score">${(p.rating || 0).toFixed(1)}</span>
        ${badges ? `<span class="badges">${badges}</span>` : ""}
        <button type="button" class="star-btn ${stars.has(p.id) ? "on" : ""}" data-star="${p.id}" aria-label="${esc(t("star"))}">${ICON.star}</button>
      </div>
    </li>`;
  }

  let current = [];
  function render({ fit = false } = {}) {
    current = filtered();
    renderFilters();
    $("#count").innerHTML = t("count", current.length, PLACES.length);

    const listEl = $("#list");
    if (!current.length) {
      const starOnly = state.specials.has("starred") && !stars.size;
      listEl.innerHTML = `<li class="empty"><b>${esc(t(starOnly ? "emptyStarT" : "emptyT"))}</b>${esc(t(starOnly ? "emptyStarD" : "emptyD"))}</li>`;
    } else {
      listEl.innerHTML = current.map(itemHtml).join("");
    }

    cluster.clearLayers();
    cluster.addLayers(current.map((p) => markers.get(p.id)));
    if (fit && current.length) fitTo(current);
    updateToggle();
  }

  function fitTo(list) {
    const b = L.latLngBounds(list.map((p) => [p.lat, p.lng]));
    map.fitBounds(b, { padding: [40, 40], maxZoom: 15, animate: true });
  }

  function updateToggle() {
    const showMap = document.body.classList.contains("show-map");
    $("#viewToggle").innerHTML = showMap ? `${ICON.list} ${esc(t("showList"))}` : `${ICON.map} ${esc(t("showMap", current.length))}`;
  }

  /* ================= Detail ================= */
  function detailHtml(p) {
    const c = CATS[p.category];
    const imgs = (p.images || []).filter(Boolean);
    const pills = [p.mustSee && `<span class="pill must">${t("must")}</span>`, p.hiddenGem && `<span class="pill gem">${t("gem")}</span>`, p.viral && `<span class="pill viral">${t("viral")}</span>`].filter(Boolean).join("");
    const starOn = stars.has(p.id);
    const dist = state.me ? `<span>📍 ${fmtKm(distKm(state.me, p))}</span>` : "";
    const gr = p.googleRating ? `<span>${esc(t("google"))} ${Number(p.googleRating).toFixed(1)}</span>` : "";
    return `
      <div class="gallery" style="--c:${c.c}" data-idx="0">
        ${imgs.map((u, i) => `<img src="${esc(u)}" alt="${esc(p.name)}" ${i ? 'loading="lazy"' : ""} referrerpolicy="no-referrer" class="${i === 0 ? "show" : ""}">`).join("")}
        <div class="ph" ${imgs.length ? "hidden" : ""}>${c.e}<a href="${photosUrl(p)}" target="_blank" rel="noopener">${esc(t("photos"))} ↗</a></div>
        ${imgs.length > 1 ? `<button type="button" class="g-nav g-prev" aria-label="prev">${ICON.left}</button><button type="button" class="g-nav g-next" aria-label="next">${ICON.right}</button><div class="g-dots">${imgs.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}
        <a class="g-credit" target="_blank" rel="noopener" hidden></a>
      </div>
      <div class="d-content" style="--c:${c.c}">
        <div class="d-cat"><span class="tag">${c.e} ${esc(c[state.lang])}</span><span class="pill">${esc(p.area || "")}</span>${pills}</div>
        <div>
          <h2 class="d-title">${esc(p.name)}</h2>
          ${p.nameVi && p.nameVi !== p.name ? `<div class="d-vi">${esc(p.nameVi)}</div>` : ""}
        </div>
        <div class="d-stats"><span class="score">${(p.rating || 0).toFixed(1)}</span>${gr}${priceHtml(p.price)}${dist}</div>
        <p class="d-desc">${esc(L10(p.desc))}</p>
        ${p.hype ? `<div class="d-hype"><b>${esc(t("hype"))}:</b> ${esc(p.hype)}</div>` : ""}
        ${L10(p.tip) ? `<div class="d-tip"><b>💡 ${esc(t("tip"))}</b>${esc(L10(p.tip))}</div>` : ""}
        <div class="actions">
          <a class="btn primary" href="${gmapsUrl(p)}" target="_blank" rel="noopener">${ICON.pin} ${esc(t("openGmaps"))}</a>
          <a class="btn" href="${dirUrl(p)}" target="_blank" rel="noopener">${ICON.route} ${esc(t("directions"))}</a>
          <button type="button" class="btn" data-act="onmap">${ICON.target} ${esc(t("onMap"))}</button>
          <button type="button" class="btn ${starOn ? "starred" : ""}" data-act="star">${ICON.star} ${esc(t(starOn ? "starred" : "star"))}</button>
          <button type="button" class="btn" data-act="share">${ICON.share} ${esc(t("share"))}</button>
          ${p.website ? `<a class="btn" style="grid-column:1/-1" href="${esc(p.website)}" target="_blank" rel="noopener">${ICON.globe} ${esc(t("website"))} ↗</a>` : ""}
        </div>
        <div class="d-info">
          ${p.hours ? `<div>${ICON.clock}<span><b>${esc(t("hours"))}:</b> ${esc(p.hours)}</span></div>` : ""}
          ${p.address ? `<div>${ICON.pin}<span><b>${esc(t("address"))}:</b> ${esc(p.address)}</span></div>` : ""}
        </div>
        ${p.nameVi ? `<button type="button" class="driver" data-act="copyvi"><small>🚕 ${esc(t("driver"))}</small><span class="big">${esc(p.nameVi)}</span>${p.address ? `<span class="addr">${esc(p.address)}</span>` : ""}</button>` : ""}
      </div>`;
  }

  function setupGallery(root) {
    const g = root.querySelector(".gallery");
    if (!g) return;
    const credit = g.querySelector(".g-credit");
    const ph = g.querySelector(".ph");
    const dotsEl = g.querySelector(".g-dots");
    const imgs = () => [...g.querySelectorAll("img")];
    let idx = 0;
    const show = (i) => {
      const list = imgs();
      if (!list.length) { ph.hidden = false; credit.hidden = true; g.querySelectorAll(".g-nav,.g-dots").forEach((e) => e.remove()); return; }
      idx = (i + list.length) % list.length;
      list.forEach((im, k) => im.classList.toggle("show", k === idx));
      if (dotsEl) [...dotsEl.children].forEach((d, k) => d.classList.toggle("on", k === idx));
      const cr = creditFor(list[idx].src);
      if (cr) { credit.hidden = false; credit.textContent = `${t("photoBy")}: ${cr.label}`; credit.href = cr.href; }
    };
    imgs().forEach((im) => im.addEventListener("error", () => {
      im.remove();
      if (dotsEl && dotsEl.lastElementChild) dotsEl.lastElementChild.remove();
      if (imgs().length < 2) g.querySelectorAll(".g-nav,.g-dots").forEach((e) => e.remove());
      show(idx);
    }));
    g.querySelector(".g-prev")?.addEventListener("click", () => show(idx - 1));
    g.querySelector(".g-next")?.addEventListener("click", () => show(idx + 1));
    let x0 = null;
    g.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    g.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });
    show(0);
  }

  function renderDetail() {
    const p = byId.get(state.selected);
    if (!p) return;
    const body = $("#detailBody");
    body.innerHTML = detailHtml(p);
    setupGallery(body);
  }

  function focusOnMap(p) {
    const m = markers.get(p.id);
    const go = () => cluster.zoomToShowLayer(m, () => { m.openTooltip(); });
    if (!map.getBounds().contains(m.getLatLng()) || map.getZoom() < 13) {
      map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
      map.once("moveend", go);
    } else go();
  }

  function select(id, { fromMap = false, pan = true } = {}) {
    const p = byId.get(id);
    if (!p) return;
    const prev = state.selected;
    state.selected = id;
    if (prev && prev !== id) refreshIcon(prev);
    refreshIcon(id);
    document.querySelectorAll(".item.selected").forEach((e) => e.classList.remove("selected"));
    const li = document.querySelector(`.item[data-id="${CSS.escape(id)}"]`);
    if (li) { li.classList.add("selected"); if (!isMobile()) li.scrollIntoView({ block: "nearest" }); }
    renderDetail();
    const d = $("#detail");
    d.classList.add("open"); d.setAttribute("aria-hidden", "false"); d.scrollTop = 0;
    document.body.classList.add("detail-open");
    history.replaceState(null, "", `#p=${encodeURIComponent(id)}`);
    if (pan && !isMobile() && !fromMap) focusOnMap(p);
  }

  function closeDetail() {
    const prev = state.selected;
    state.selected = null;
    if (prev) refreshIcon(prev);
    document.querySelectorAll(".item.selected").forEach((e) => e.classList.remove("selected"));
    const d = $("#detail");
    d.classList.remove("open"); d.setAttribute("aria-hidden", "true");
    document.body.classList.remove("detail-open");
    history.replaceState(null, "", location.pathname + location.search);
  }

  function toggleStar(id) {
    if (stars.has(id)) { stars.delete(id); toast(t("starRemoved")); } else { stars.add(id); toast(t("starAdded")); }
    store.set("vn27.stars", [...stars]);
    refreshIcon(id);
    const keepScroll = $("#list").scrollTop;
    render();
    $("#list").scrollTop = keepScroll;
    if (state.selected === id) {
      const btn = document.querySelector('#detailBody [data-act="star"]');
      if (btn) { const on = stars.has(id); btn.classList.toggle("starred", on); btn.innerHTML = `${ICON.star} ${esc(t(on ? "starred" : "star"))}`; }
    }
  }

  /* ================= Events ================= */
  $("#regions").addEventListener("click", (e) => {
    const b = e.target.closest("[data-region]"); if (!b) return;
    state.region = b.dataset.region; render({ fit: true });
  });
  $("#categories").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    const id = b.dataset.cat;
    state.cats.has(id) ? state.cats.delete(id) : state.cats.add(id);
    render();
  });
  $("#specials").addEventListener("click", (e) => {
    const b = e.target.closest("[data-special]"); if (!b) return;
    const id = b.dataset.special;
    state.specials.has(id) ? state.specials.delete(id) : state.specials.add(id);
    render({ fit: id === "starred" && state.specials.has(id) });
  });
  $("#minRating").addEventListener("change", (e) => { state.minRating = +e.target.value; render(); });
  $("#maxPrice").addEventListener("change", (e) => { state.maxPrice = +e.target.value; render(); });
  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    if (state.sort === "distance" && !state.me) locate(); else render();
  });
  let qTimer;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { state.q = norm(e.target.value.trim()); render(); }, 150);
  });
  $("#reset").addEventListener("click", () => {
    Object.assign(state, { region: "all", minRating: 0, maxPrice: 4, q: "" });
    state.cats.clear(); state.specials.clear();
    $("#search").value = "";
    render({ fit: true });
  });

  $("#list").addEventListener("click", (e) => {
    const s = e.target.closest("[data-star]");
    if (s) { e.stopPropagation(); toggleStar(s.dataset.star); return; }
    const li = e.target.closest(".item"); if (li) select(li.dataset.id);
  });
  $("#list").addEventListener("mouseover", (e) => {
    const li = e.target.closest(".item"); if (!li) return;
    const m = markers.get(li.dataset.id); const el = m && m.getElement();
    document.querySelectorAll(".pin-icon.hover").forEach((x) => x.classList.remove("hover"));
    if (el) el.classList.add("hover");
  });
  $("#list").addEventListener("mouseleave", () => document.querySelectorAll(".pin-icon.hover").forEach((x) => x.classList.remove("hover")));

  $("#detailClose").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && state.selected) closeDetail(); });
  $("#detailBody").addEventListener("click", async (e) => {
    const a = e.target.closest("[data-act]"); if (!a) return;
    const p = byId.get(state.selected); if (!p) return;
    if (a.dataset.act === "star") toggleStar(p.id);
    if (a.dataset.act === "copyvi") copy(`${p.nameVi}${p.address ? `\n${p.address}` : ""}`);
    if (a.dataset.act === "onmap") {
      if (isMobile()) { closeDetail(); document.body.classList.add("show-map"); updateToggle(); map.invalidateSize(); state.selected = p.id; refreshIcon(p.id); }
      focusOnMap(p);
    }
    if (a.dataset.act === "share") {
      const url = `${location.origin}${location.pathname}#p=${encodeURIComponent(p.id)}`;
      if (navigator.share) { try { await navigator.share({ title: p.name, text: L10(p.desc), url }); return; } catch { /* cancelled */ return; } }
      try { await navigator.clipboard.writeText(url); toast(t("linkCopied")); } catch { window.prompt("", url); }
    }
  });

  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => {
    state.lang = b.dataset.lang; store.set("vn27.lang", state.lang);
    renderStatic(); render(); if (state.selected) renderDetail();
  }));

  $("#viewToggle").addEventListener("click", () => {
    document.body.classList.toggle("show-map");
    updateToggle();
    if (document.body.classList.contains("show-map")) setTimeout(() => map.invalidateSize(), 0);
  });

  function locate() {
    if (!navigator.geolocation) { toast(t("locErr")); return; }
    navigator.geolocation.getCurrentPosition((pos) => {
      state.me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      $("#locate").classList.add("on");
      if (meMarker) meMarker.setLatLng([state.me.lat, state.me.lng]);
      else meMarker = L.marker([state.me.lat, state.me.lng], { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [16, 16] }), zIndexOffset: 2000, interactive: false }).addTo(map);
      state.sort = "distance";
      map.flyTo([state.me.lat, state.me.lng], 14, { duration: 0.8 });
      render();
      if (state.selected) renderDetail();
    }, () => { toast(t("locErr")); if (state.sort === "distance") { state.sort = "rating"; render(); } }, { enableHighAccuracy: true, timeout: 10000 });
  }
  $("#locate").addEventListener("click", locate);

  window.addEventListener("hashchange", () => {
    const m = location.hash.match(/^#p=(.+)$/);
    if (m && byId.has(decodeURIComponent(m[1]))) select(decodeURIComponent(m[1]));
  });

  /* ================= Init ================= */
  renderStatic();
  render({ fit: true });
  const h = location.hash.match(/^#p=(.+)$/);
  if (h && byId.has(decodeURIComponent(h[1]))) {
    const id = decodeURIComponent(h[1]);
    setTimeout(() => { select(id, { pan: false }); focusOnMap(byId.get(id)); }, 300);
  }
})();
