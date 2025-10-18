// Diary page logic: render entries, handle add form, persist to localStorage
(function () {
    const STORAGE_KEY = "diaryEntries";

    const defaultEntries = [
        {
            date: "2025-12-15",
            title: "Верстка макета сайта",
            desc: "Сверстал макет по Figma, адаптивная сетка.",
            status: "done",
        },
        {
            date: "2025-12-10",
            title: "JavaScript основы",
            desc: "Типы, функции, DOM-манипуляции.",
            status: "done",
        },
        {
            date: "2025-12-05",
            title: "Работа с формами",
            desc: "Валидация, события, отправка.",
            status: "progress",
        },
        {
            date: "2025-12-01",
            title: "Адаптивный дизайн",
            desc: "Media queries, responsive images.",
            status: "progress",
        },
    ];

    function loadEntries() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : defaultEntries;
        } catch (e) {
            return defaultEntries;
        }
    }

    function saveEntries(entries) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (e) {}
    }

    function statusIcon(status) {
        return status === "done" ? "✓" : "⏳";
    }

    function formatDate(iso) {
        // Expect YYYY-MM-DD -> DD.MM
        if (!iso) return "";
        const [y, m, d] = iso.split("-");
        return `${d}.${m}`;
    }

    function renderEntries(entries) {
        const list = document.getElementById("diaryList");
        if (!list) return;
        // Sort by date desc
        const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
        list.innerHTML = "";
        sorted.forEach((e) => {
            const li = document.createElement("li");
            li.className =
                "list-group-item d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2";
            li.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <span class="badge ${
              e.status === "done" ? "text-bg-success" : "text-bg-warning"
          }">${statusIcon(e.status)}</span>
          <strong>${formatDate(e.date)}</strong> — ${e.title}
        </div>
        <div class="text-body-secondary">${e.desc}</div>
      `;
            list.appendChild(li);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const entries = loadEntries();
        renderEntries(entries);

        const form = document.getElementById("entryForm");
        if (form) {
            form.addEventListener("submit", (ev) => {
                ev.preventDefault();
                const date = document.getElementById("date").value;
                const title = document.getElementById("title").value.trim();
                const desc = document.getElementById("desc").value.trim();
                const status = document.getElementById("status").value;
                if (!date || !title || !desc) return;

                const updated = loadEntries();
                updated.push({ date, title, desc, status });
                saveEntries(updated);
                renderEntries(updated);
                form.reset();
            });
        }
    });
})();
