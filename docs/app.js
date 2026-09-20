(function () {
  const DATA_URL = "data/signals.json";

  function applyStoredTheme() {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) document.documentElement.setAttribute("data-theme", saved);
    } catch (e) {}
  }

  function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    btn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  function fmtNum(v, digits) {
    if (v === null || v === undefined || v === "") return "—";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString("en-US", { maximumFractionDigits: digits === undefined ? 6 : digits });
  }

  function fmtTime(iso) {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
    } catch (e) { return iso; }
  }

  function confidenceBadge(level) {
    const l = String(level || "").toLowerCase();
    let cls = "badge-low";
    if (l.includes("high") || l.includes("yuksek") || l.includes("yüksek")) cls = "badge-high";
    else if (l.includes("med") || l.includes("orta")) cls = "badge-med";
    return '<span class="badge ' + cls + '">' + (level || "—") + "</span>";
  }

  function dirLabel(dir) {
    const d = String(dir || "").toLowerCase();
    if (d === "long") return '<span class="dir-long">LONG</span>';
    if (d === "short") return '<span class="dir-short">SHORT</span>';
    return dir || "—";
  }

  function renderSignalsTable(rows) {
    if (!rows || rows.length === 0) {
      return '<div class="empty">Şu anda eşleşen sinyal yok.</div>';
    }
    const cols = [
      ["symbol", "Sembol"],
      ["direction", "Yön"],
      ["confidence", "Güven"],
      ["entry_price", "Giriş"],
      ["stop_price", "Stop"],
      ["position_size", "Pozisyon"],
    ];
    let html = "<table><thead><tr>";
    cols.forEach(function (c) { html += "<th>" + c[1] + "</th>"; });
    html += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      html += "<tr>";
      cols.forEach(function (c) {
        const key = c[0];
        let val = r[key];
        if (key === "direction") val = dirLabel(val);
        else if (key === "confidence") val = confidenceBadge(val);
        else if (key === "entry_price" || key === "stop_price") val = fmtNum(val);
        else if (val === undefined || val === null || val === "") val = "—";
        html += "<td>" + val + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    return html;
  }

  function renderWatchlistTable(rows) {
    if (!rows || rows.length === 0) {
      return '<div class="empty">İzleme listesi boş.</div>';
    }
    const cols = [
      ["symbol", "Sembol"],
      ["direction", "Yön"],
      ["combined_dist_pct", "Hedefe Uzaklık (%)"],
    ];
    let html = "<table><thead><tr>";
    cols.forEach(function (c) { html += "<th>" + c[1] + "</th>"; });
    html += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      html += "<tr>";
      cols.forEach(function (c) {
        const key = c[0];
        let val = r[key];
        if (key === "direction") val = dirLabel(val);
        else if (key === "combined_dist_pct") val = fmtNum(val, 2);
        else if (val === undefined || val === null || val === "") val = "—";
        html += "<td>" + val + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    return html;
  }

  function renderStats(summary) {
    const items = [
      ["Toplam Taranan", summary.total_scanned],
      ["Eşleşen Sinyal", summary.matched],
      ["İzleme Listesi", summary.watchlist],
      ["Elenen", summary.skipped_gate_rejected],
    ];
    return items.map(function (it) {
      return '<div class="stat"><div class="label">' + it[0] + '</div><div class="value">' + (it[1] === undefined ? "—" : it[1]) + "</div></div>";
    }).join("");
  }

  function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        const tab = btn.getAttribute("data-tab");
        document.getElementById("panel-signals").style.display = tab === "signals" ? "" : "none";
        document.getElementById("panel-watchlist").style.display = tab === "watchlist" ? "" : "none";
      });
    });
  }

  function load() {
    fetch(DATA_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("veri yüklenemedi");
        return res.json();
      })
      .then(function (data) {
        document.getElementById("updated").textContent = "Son güncelleme: " + fmtTime(data.generated_at);
        document.getElementById("stats").innerHTML = renderStats(data.summary || {});
        document.getElementById("panel-signals").innerHTML = renderSignalsTable(data.signals);
        document.getElementById("panel-watchlist").innerHTML = renderWatchlistTable(data.watchlist);
      })
      .catch(function () {
        document.getElementById("panel-signals").innerHTML = '<div class="empty">Henüz veri yok — ilk tarama tamamlandığında burada görünecek.</div>';
      });
  }

  applyStoredTheme();
  setupThemeToggle();
  setupTabs();
  load();
})();
