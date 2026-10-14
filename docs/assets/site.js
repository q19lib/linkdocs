// Menu toggle on narrow screens, and search over search.json (fetched on first use).
(() => {
  const menu = document.querySelector(".menu");
  const side = document.getElementById("side");
  menu?.addEventListener("click", () => {
    const open = side.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  const q = document.getElementById("q");
  const results = document.getElementById("results");
  let index = null;
  let selected = 0;

  async function load() {
    if (index) return index;
    try {
      index = await (await fetch("search.json")).json();
    } catch {
      index = [];
    }
    return index;
  }

  // Each term must appear somewhere; titles and aliases weigh most.
  function score(entry, terms) {
    let total = 0;
    for (const term of terms) {
      const s = (entry.t.toLowerCase().includes(term) ? 8 : 0) + (entry.a.toLowerCase().includes(term) ? 6 : 0)
        + (entry.d.toLowerCase().includes(term) ? 3 : 0) + (entry.x.toLowerCase().includes(term) ? 1 : 0);
      if (s === 0) return 0;
      total += s;
    }
    return total;
  }

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function show(hits) {
    selected = 0;
    results.hidden = hits.length === 0;
    results.innerHTML = hits.map((e, i) =>
      `<li><a href="${e.s}"${i === 0 ? ' class="sel"' : ""}><b>${esc(e.t)}</b><span>${esc(e.d)}</span></a></li>`).join("");
  }

  async function search() {
    const terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return show([]);
    const entries = await load();
    show(entries.map((e) => ({ e, s: score(e, terms) })).filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s).slice(0, 10).map((r) => r.e));
  }

  function move(step) {
    const links = results.querySelectorAll("a");
    if (links.length === 0) return;
    links[selected].classList.remove("sel");
    selected = (selected + step + links.length) % links.length;
    links[selected].classList.add("sel");
    links[selected].scrollIntoView({ block: "nearest" });
  }

  q?.addEventListener("focus", load);
  q?.addEventListener("input", search);
  q?.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); move(1); }
    if (ev.key === "ArrowUp") { ev.preventDefault(); move(-1); }
    if (ev.key === "Escape") { results.hidden = true; q.blur(); }
    if (ev.key === "Enter") results.querySelectorAll("a")[selected]?.click();
  });
  document.addEventListener("click", (ev) => {
    if (!ev.target.closest(".search")) results.hidden = true;
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "/" && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName ?? "")) { ev.preventDefault(); q.focus(); }
  });
})();
