// Filtering logic for projects page
(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const filterButtons = document.querySelectorAll("[data-filter]");
        const items = document.querySelectorAll(".project-item");

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.getAttribute("data-filter");
                items.forEach((item) => {
                    const techs = (
                        item.getAttribute("data-tech") || ""
                    ).toLowerCase();
                    if (filter === "all" || techs.includes(filter)) {
                        item.classList.remove("d-none");
                    } else {
                        item.classList.add("d-none");
                    }
                });
            });
        });
    });

    // Modal population using Bootstrap events
    const projectModalEl = document.getElementById("projectModal");
    if (projectModalEl) {
        projectModalEl.addEventListener("show.bs.modal", (event) => {
            const button = event.relatedTarget;
            if (!button) return;

            const title = button.getAttribute("data-title") || "Детали проекта";
            const desc = button.getAttribute("data-desc") || "";
            const tech = button.getAttribute("data-tech") || "";
            const live = button.getAttribute("data-live") || "";
            const code = button.getAttribute("data-code") || "";

            const titleEl = projectModalEl.querySelector("#projectModalLabel");
            const descEl = projectModalEl.querySelector("#projectModalDesc");
            const techEl = projectModalEl.querySelector("#projectModalTech");
            const liveEl = projectModalEl.querySelector("#projectLiveLink");
            const codeEl = projectModalEl.querySelector("#projectCodeLink");

            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = desc;

            if (techEl) {
                techEl.innerHTML = "";
                tech.split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .forEach((t) => {
                        const span = document.createElement("span");
                        span.className = "badge text-bg-secondary";
                        span.textContent = t;
                        techEl.appendChild(span);
                    });
            }

            // Links visibility
            if (liveEl) {
                if (live && live !== "#") {
                    liveEl.classList.remove("d-none");
                    liveEl.href = live;
                } else {
                    liveEl.classList.add("d-none");
                    liveEl.removeAttribute("href");
                }
            }
            if (codeEl) {
                if (code && code !== "#") {
                    codeEl.classList.remove("d-none");
                    codeEl.href = code;
                } else {
                    codeEl.classList.add("d-none");
                    codeEl.removeAttribute("href");
                }
            }
        });
    }
})();
