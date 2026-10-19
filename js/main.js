// Panduan Excel & Word — interaksi UI + pencarian
(function () {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const search = document.getElementById("searchInput");
  const count = document.getElementById("searchCount");

  // Navbar shadow saat scroll
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "✕" : "☰";
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    })
  );

  // ===== Pencarian (menyaring semua section) =====
  const sections = [
    { grid: "gridRumus", empty: "emptyRumus" },
    { grid: "gridFiturExcel", empty: "emptyFiturExcel" },
    { grid: "gridScExcel", empty: "emptyScExcel" },
    { grid: "gridScWord", empty: "emptyScWord" },
    { grid: "gridFiturWord", empty: "emptyFiturWord" },
  ]
    .map((s) => ({
      items: Array.from(document.querySelectorAll("#" + s.grid + " .item")),
      empty: document.getElementById(s.empty),
    }))
    .filter((s) => s.items.length);

  const normalize = (t) =>
    t.toLowerCase().replace(/\s+/g, "").replace(/\+/g, "+");

  function applyFilter() {
    const raw = search.value.trim();
    const q = normalize(raw);
    let total = 0;

    sections.forEach((sec) => {
      let visible = 0;
      sec.items.forEach((el) => {
        const hay =
          normalize(el.textContent) + " " + normalize(el.dataset.keywords || "");
        const show = !q || hay.includes(q);
        el.classList.toggle("hidden", !show);
        if (show) visible++;
      });
      sec.empty.hidden = visible > 0;
      total += visible;
    });

    count.textContent = q ? total + " hasil" : "";
  }

  search.addEventListener("input", applyFilter);

  // Shortcut: "/" fokus ke pencarian
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== search) {
      e.preventDefault();
      search.focus();
      search.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (e.key === "Escape" && document.activeElement === search) {
      search.value = "";
      applyFilter();
      search.blur();
    }
  });
})();
