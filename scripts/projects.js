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
            const live = button.getAttribute("data-live") || "";
            const code = button.getAttribute("data-code") || "";
            const link = button.getAttribute("data-link") || ""; // optional alias for GitHub/source link
            const imagesAttr = button.getAttribute("data-images") || "";

            const titleEl = projectModalEl.querySelector("#projectModalLabel");
            const descEl = projectModalEl.querySelector("#projectModalDesc");
            const liveEl = projectModalEl.querySelector("#projectLiveLink");
            const codeEl = projectModalEl.querySelector("#projectCodeLink");
            const galleryWrapper = projectModalEl.querySelector(
                "#projectCarouselWrapper"
            );

            if (titleEl) titleEl.textContent = title;
            if (descEl) {
                const withNewlines = desc.replace(/\\n/g, "\n");
                descEl.textContent = withNewlines;
                descEl.style.whiteSpace = "pre-line";
            }

            // Build gallery/carousel if images are provided
            if (galleryWrapper) {
                galleryWrapper.innerHTML = "";
                const images = imagesAttr
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);

                if (images.length === 1) {
                    const img = document.createElement("img");
                    img.src = images[0];
                    img.alt = title;
                    img.className = "img-fluid rounded";
                    img.loading = "lazy";
                    img.decoding = "async";
                    galleryWrapper.appendChild(img);
                } else if (images.length > 1) {
                    const carouselId = "projectCarousel";
                    const carousel = document.createElement("div");
                    carousel.id = carouselId;
                    carousel.className = "carousel slide";
                    carousel.setAttribute("data-bs-ride", "carousel");

                    const indicators = document.createElement("div");
                    indicators.className = "carousel-indicators";

                    const inner = document.createElement("div");
                    inner.className = "carousel-inner rounded overflow-hidden";

                    images.forEach((src, idx) => {
                        const buttonInd = document.createElement("button");
                        buttonInd.type = "button";
                        buttonInd.setAttribute(
                            "data-bs-target",
                            `#${carouselId}`
                        );
                        buttonInd.setAttribute("data-bs-slide-to", String(idx));
                        if (idx === 0) buttonInd.className = "active";
                        buttonInd.setAttribute(
                            "aria-current",
                            idx === 0 ? "true" : "false"
                        );
                        buttonInd.setAttribute(
                            "aria-label",
                            `Slide ${idx + 1}`
                        );
                        indicators.appendChild(buttonInd);

                        const item = document.createElement("div");
                        item.className = `carousel-item${
                            idx === 0 ? " active" : ""
                        }`;
                        const img = document.createElement("img");
                        img.src = src;
                        img.className = "d-block w-100";
                        img.alt = `${title} — ${idx + 1}`;
                        img.loading = "lazy";
                        img.decoding = "async";
                        item.appendChild(img);
                        inner.appendChild(item);
                    });

                    const prev = document.createElement("button");
                    prev.className = "carousel-control-prev";
                    prev.type = "button";
                    prev.setAttribute("data-bs-target", `#${carouselId}`);
                    prev.setAttribute("data-bs-slide", "prev");
                    prev.innerHTML =
                        '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';

                    const next = document.createElement("button");
                    next.className = "carousel-control-next";
                    next.type = "button";
                    next.setAttribute("data-bs-target", `#${carouselId}`);
                    next.setAttribute("data-bs-slide", "next");
                    next.innerHTML =
                        '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';

                    carousel.appendChild(indicators);
                    carousel.appendChild(inner);
                    carousel.appendChild(prev);
                    carousel.appendChild(next);
                    galleryWrapper.appendChild(carousel);
                }
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
                // Prefer data-code when it's a valid URL; otherwise fallback to data-link (e.g., GitHub)
                let codeUrl = "";
                if (code && code !== "#") {
                    codeUrl = code;
                } else if (link && link !== "#") {
                    codeUrl = link;
                }

                if (codeUrl) {
                    codeEl.classList.remove("d-none");
                    codeEl.href = codeUrl;
                    // Adjust label and styling if GitHub link
                    const isGithub =
                        /(^https?:\/\/)?(www\.)?github\.com\//i.test(codeUrl);
                    codeEl.textContent = isGithub ? "GitHub" : "Исходный код";
                    // Toggle button style for GitHub for visual cue
                    if (isGithub) {
                        codeEl.classList.remove("btn-outline-secondary");
                        codeEl.classList.add("btn-dark");
                    } else {
                        codeEl.classList.remove("btn-dark");
                        codeEl.classList.add("btn-outline-secondary");
                    }
                } else {
                    codeEl.classList.add("d-none");
                    codeEl.removeAttribute("href");
                    codeEl.textContent = "Исходный код";
                    codeEl.classList.remove("btn-dark");
                    codeEl.classList.add("btn-outline-secondary");
                }
            }
        });
    }
})();
