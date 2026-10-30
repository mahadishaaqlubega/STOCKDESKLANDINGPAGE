(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function store(key, value) { try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; } }

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("sd-theme", next);
    });
  }

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  var sticky = document.getElementById("stickyCta");
  var hero = document.getElementById("top");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
    if (sticky && hero) {
      var past = window.scrollY > hero.offsetHeight * 0.6;
      var nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 700;
      var show = past && !nearEnd;
      sticky.classList.toggle("show", show);
      document.body.classList.toggle("sticky-on", show);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-scrolled", open || window.scrollY > 10);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---------- hero frame flattens on load ---------- */
  var heroFrame = document.getElementById("heroFrame");
  if (heroFrame) {
    if (reduced) heroFrame.classList.add("is-flat");
    else requestAnimationFrame(function () { setTimeout(function () { heroFrame.classList.add("is-flat"); }, 250); });
  }

  /* ---------- product tour tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tour-tab"));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.toggle("is-in", on);
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });

  /* ---------- video ---------- */
  var modal = document.getElementById("videoModal");
  var video = document.getElementById("saleVideo");
  if (modal && video && typeof modal.showModal === "function") {
    document.querySelectorAll("[data-video]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        modal.showModal();
        video.currentTime = 0;
        var play = video.play();
        if (play && play.catch) play.catch(function () {});
      });
    });
    function closeVideo() { video.pause(); modal.close(); }
    document.getElementById("videoClose").addEventListener("click", closeVideo);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeVideo(); });
    modal.addEventListener("close", function () { video.pause(); });
  } else {
    document.querySelectorAll("[data-video]").forEach(function (btn) {
      btn.addEventListener("click", function () { window.location.href = "assets/video/sale.webm"; });
    });
  }

  /* ---------- language (English / Luganda) ---------- */
  var LG = {
    "nav.product": "App", "nav.try": "Gezaako", "nav.features": "By'ekola", "nav.pricing": "Ebbeeyi", "nav.faq": "Ebibuuzo",
    "nav.login": "Yingira", "cta.short": "Tandika bwereere", "cta.main": "Tandika omwezi gwo ogw'obwereere",
    "hero.pill": "Buli dduuka eppya lifuna omwezi ogusooka ogw'obwereere",
    "hero.h1": "Kasanduuko k'ensimbi, ekitabo kya sitooki n'alipoota y'amagoba g'edduuka lyo.",
    "hero.sub": "Wandiika buli kitundiddwa, manya sitooki gy'olina, era olabe amagoba g'ofunye leero. StockDesk ekola ku ssimu oba kompyuta gy'olina, ne bwe wataba yintaneti.",
    "hero.watch": "Laba bw'etunda mu sikonda 40", "hero.n1": "Tewetaaga kaadi", "hero.n2": "Otandika mu ssaawa ntono", "hero.n3": "Sasula oluvannyuma ne MTN MoMo oba Airtel Money",
    "facts.1": "Etunda ne bwe wataba yintaneti", "facts.2": "Ssente enkalu, Mobile Money, kaadi, ebbanja oba okugabanya",
    "facts.3": "Lisiiti ku 58mm, 80mm, A4 oba WhatsApp", "facts.4": "Leeta olukalala lw'ebintu byo okuva mu Excel", "facts.5": "Ekola ku ssimu gy'olina",
    "tour.h2": "App emu ey'edduuka lyonna.",
    "tour.p": "Ebitundiddwa, sitooki, ssente bakasitoma ze bakubanja n'amagoba, byonna mu kifo kimu era bikyuka buli lw'otunda.",
    "try.h2": "Tunda wano wennyini.",
    "try.p": "Nyiga ku bintu, londa engeri kasitoma gy'asasulamu, olabe sitooki n'amagoba bwe bikyuka. Tewetaaga kwewandiisa.",
    "till.sales": "Ebitundiddwa leero", "till.profit": "Amagoba", "till.orders": "Abaguze", "till.low": "Sitooki entono",
    "till.current": "Okutunda kuno", "till.clear": "Sangula", "till.empty": "Nyiga ku kintu okukyongeramu.", "till.total": "Awamu",
    "till.charge": "Sasuza", "till.note": "Kino kya kulaga bulazi, n'ebintu eby'okulabirako.", "till.real": "Ggulawo edduuka lyo erya nnamaddala bwereere okumala omwezi",
    "feat.h2": "Yakolebwa okusinziira ku ngeri amaduuka wano gye gakolamu.",
    "feat.p": "Etunda ne bwe wataba yintaneti, ekuuma ebbanja lya bakasitoma, era ekulaga buli mukozi kye yakoze.",
    "shops.h2": "Ekola ku kika ky'edduuka lyo.", "shops.p": "Bw'oba otunda ku kawunta, StockDesk ekugwanira.",
    "local.h2": "Yakolebwa mu Uganda.",
    "local.p": "StockDesk ekozesa silingi, Mobile Money ne WhatsApp okuva ku lunaku olusooka.",
    "steps.h2": "Tunda olwaleero.", "steps.p": "Emitendera esatu gyokka. Tewetaaga mukugu wadde okusomesebwa.",
    "steps.t1": "Eddakiika 2", "steps.h1": "Kola edduuka lyo", "steps.p1": "Wewandiise ne email yo n'erinnya ly'edduuka. Omwezi gwo ogw'obwereere gutandikirawo.",
    "steps.t2": "Okuva ku ddakiika 10", "steps.h2b": "Teekamu ebintu byo", "steps.p2": "Biwandiike, oba bireete okuva mu Excel nga birimu ebbeeyi, bye wabigulira n'omuwendo.",
    "steps.t3": "Olwo lwennyini", "steps.h3": "Teekamu abakozi otunde", "steps.p3": "Buli mukozi muwe akawunti ye, gatta printa bw'oba nayo, otandike okutunda.",
    "price.h2": "Gezaako byonna bwereere okumala omwezi.",
    "price.p": "Oluvannyuma londa enteekateeka egwanira edduuka lyo. Osasula buli mwezi mu silingi, tewali ssente za kutandika, osobola okuyimiriza ekiseera kyonna.",
    "trial.h3": "Buli kye tulina, ku buli dduuka eppya", "trial.p": "Tewetaaga kaadi wadde Mobile Money okutandika. Tukujjukiza ng'omwezi tegunnaggwaako.",
    "faq.h2": "Ebibuuzo ebitera okubuuzibwa", "faq.p": "Tolabye ky'onoonya? Tuwandiikire ku WhatsApp, omuntu wa ddala ajja kukuddamu.",
    "custom.h2": "Wetaaga sisitemu ekoleddwa ku lwa bizinensi yo?",
    "custom.p": "Ttiimu eri emabega wa StockDesk ekola ne pulogulaamu ez'enjawulo. Tubuulire bizinensi yo bw'ekola, tujja kukukolera sisitemu egigwanira.",
    "custom.cta": "Tuwandiikire ku WhatsApp",
    "final.h2": "Gezaako StockDesk bwereere okumala omwezi.", "final.p": "Kola edduuka lyo mu ddakiika bbiri, tewetaaga kaadi.",
    "final.help": "Funa obuyambi okutandika", "sticky.b": "Omwezi ogusooka bwereere", "sticky.s": "Tewetaaga kaadi", "sticky.cta": "Tandika"
  };
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  var EN = {};
  nodes.forEach(function (el) { EN[el.getAttribute("data-i18n")] = el.innerHTML; });
  function setLang(lang) {
    var dict = lang === "lg" ? LG : EN;
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var text = dict[key] != null ? dict[key] : EN[key];
      if (el.hasAttribute("data-i18n-html") || lang !== "lg") el.innerHTML = text;
      else el.textContent = text;
    });
    root.setAttribute("lang", lang === "lg" ? "lg" : "en");
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    store("sd-lang", lang);
    renderTill();
  }
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  /* ---------- try-the-till demo ---------- */
  var PRODUCTS = [
    { id: 1, name: "Rice (Super) 5kg", cat: "Groceries", price: 32000, cost: 26000, stock: 14, min: 5 },
    { id: 2, name: "Sunrise Cooking Oil 1L", cat: "Groceries", price: 12000, cost: 9500, stock: 6, min: 5 },
    { id: 3, name: "Sugar 2kg", cat: "Groceries", price: 14000, cost: 11000, stock: 22, min: 8 },
    { id: 4, name: "Coca-Cola 500ml", cat: "Drinks", price: 2000, cost: 1500, stock: 48, min: 12 },
    { id: 5, name: "Bread 600g", cat: "Bakery", price: 6000, cost: 4500, stock: 3, min: 4 },
    { id: 6, name: "Omo Detergent 1kg", cat: "Household", price: 9500, cost: 7500, stock: 18, min: 6 }
  ];
  var till = { cart: {}, pay: "Cash", sales: 186500, profit: 41200, orders: 6 };
  var el = function (id) { return document.getElementById(id); };
  var ugx = function (n) { return "UGX " + n.toLocaleString("en-US"); };
  var t = function (key) { return (root.getAttribute("lang") === "lg" ? LG[key] : null) || EN[key] || key; };

  function lowCount() { return PRODUCTS.filter(function (p) { return p.stock <= p.min; }).length; }

  function renderTill() {
    if (!el("tProducts")) return;
    var left = root.getAttribute("lang") === "lg" ? " bisigadde" : " left";
    el("tProducts").innerHTML = PRODUCTS.map(function (p) {
      var q = till.cart[p.id] || 0;
      var remaining = p.stock - q;
      var cls = "tp" + (q ? " in-cart" : "") + (remaining <= p.min ? " low" : "") + (remaining <= 0 ? " out" : "");
      return '<button type="button" role="listitem" class="' + cls + '" data-id="' + p.id + '">' +
        (q ? '<span class="qty">' + q + "</span>" : "") +
        "<b>" + p.name + '</b><span class="cat">' + p.cat + "</span>" +
        '<span class="row"><span class="price num">' + ugx(p.price) + '</span><span class="left num">' + remaining + left + "</span></span></button>";
    }).join("");

    var ids = Object.keys(till.cart);
    var total = 0;
    el("tLines").innerHTML = ids.length ? ids.map(function (id) {
      var p = PRODUCTS.filter(function (x) { return x.id === +id; })[0];
      var line = p.price * till.cart[id];
      total += line;
      return '<div class="tl"><span><span class="q num">' + till.cart[id] + "x</span>" + p.name + '</span><span class="num">' + line.toLocaleString("en-US") + "</span></div>";
    }).join("") : '<p class="till-empty">' + t("till.empty") + "</p>";
    el("tTotal").textContent = ugx(total);
    el("tChargeAmt").textContent = total ? ugx(total) : "";
    el("tCharge").disabled = !total;
    el("tSales").textContent = ugx(till.sales);
    el("tProfit").textContent = ugx(till.profit);
    el("tOrders").textContent = till.orders;
    el("tLow").textContent = lowCount();
    el("tLow").classList.toggle("warn", lowCount() > 1);
  }

  function bump(id) {
    var node = el(id);
    node.classList.remove("bump");
    void node.offsetWidth;
    node.classList.add("bump");
    setTimeout(function () { node.classList.remove("bump"); }, 1200);
  }

  var toastTimer;
  function toast(html) {
    var node = el("tToast");
    node.innerHTML = '<svg><use href="#i-check"/></svg><span>' + html + "</span>";
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove("show"); }, 3800);
  }

  if (el("till")) {
    el("tProducts").addEventListener("click", function (e) {
      var b = e.target.closest(".tp");
      if (!b) return;
      var id = +b.getAttribute("data-id");
      var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      if ((till.cart[id] || 0) >= p.stock) return;
      till.cart[id] = (till.cart[id] || 0) + 1;
      renderTill();
    });
    el("tClear").addEventListener("click", function () { till.cart = {}; renderTill(); });
    document.querySelectorAll(".till-pay button").forEach(function (b) {
      b.addEventListener("click", function () {
        till.pay = b.getAttribute("data-pay");
        document.querySelectorAll(".till-pay button").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
      });
    });
    el("tCharge").addEventListener("click", function () {
      var total = 0, profit = 0, lowNow = [];
      Object.keys(till.cart).forEach(function (id) {
        var p = PRODUCTS.filter(function (x) { return x.id === +id; })[0];
        var q = till.cart[id];
        var wasOk = p.stock > p.min;
        p.stock -= q;
        total += p.price * q;
        profit += (p.price - p.cost) * q;
        if (wasOk && p.stock <= p.min) lowNow.push(p.name);
      });
      till.sales += total;
      till.profit += profit;
      till.orders += 1;
      till.cart = {};
      renderTill();
      ["tSales", "tProfit", "tOrders"].forEach(bump);
      var lg = root.getAttribute("lang") === "lg";
      var msg = lg
        ? "Ofunye " + ugx(total) + " (" + till.pay + "). Sitooki ekyusiddwa."
        : ugx(total) + " paid by " + till.pay + ". Stock updated, receipt ready.";
      if (lowNow.length) msg += lg ? " " + lowNow.join(", ") + " zikendedde." : " " + lowNow.join(", ") + " is now low on stock.";
      if (PRODUCTS.every(function (p) { return p.stock <= 0; })) PRODUCTS.forEach(function (p) { p.stock = 20; });
      toast(msg);
    });
    renderTill();
  }

  var savedLang = store("sd-lang");
  if (savedLang === "lg") setLang("lg");

  /* ---------- reveal on scroll ---------- */
  var items = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach(function (node) { node.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (node) {
      var siblings = node.parentElement.querySelectorAll(":scope > .reveal");
      var idx = Array.prototype.indexOf.call(siblings, node);
      if (idx > 0) node.style.transitionDelay = Math.min(idx * 70, 280) + "ms";
      io.observe(node);
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
