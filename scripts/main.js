// Функция для отправки формы
function submitForm() {
    const form = document.getElementById("feedbackForm");
    const formData = new FormData(form);

    // Простая валидация
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    // Собираем данные формы
    const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        category: formData.get("category"),
        message: formData.get("message"),
    };
    // В реальном приложении здесь был бы AJAX-запрос
    console.log("Данные формы:", data);

    // Показываем уведомление об успешной отправке
    alert(
        "Спасибо! Ваше обращение отправлено. Мы свяжемся с вами в ближайшее время."
    );

    // Закрываем модальное окно
    const contactModal = document.getElementById("contactModal");
    if (contactModal) contactModal.close();

    // Очищаем форму
    form.reset();
}

// Fixed: getElementsByClassName returns a collection, need to access first element
const btnSecondary = document.getElementsByClassName("btn-secondary")[0];
if (btnSecondary) {
    btnSecondary.addEventListener("click", () => {
        const contactModal = document.getElementById("contactModal");
        if (contactModal) contactModal.close();
    });
}

// Закрытие модального окна по клику на фон
const contactModalElement = document.getElementById("contactModal");
if (contactModalElement) {
    contactModalElement.addEventListener("click", function (event) {
        if (event.target === this) {
            this.close();
        }
    });
}

// Обработка отправки формы через Enter (предотвращаем стандартное поведение)
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
    feedbackForm.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && event.target.type !== "textarea") {
            event.preventDefault();
        }
    });
}

// Helper: swap profile image according to theme
function updateProfileImageForTheme(theme) {
    const img = document.querySelector(".profile__photo");
    if (!img) return;
    const lightSrc = img.getAttribute("data-src-light");
    const darkSrc = img.getAttribute("data-src-dark");
    if (!lightSrc || !darkSrc) return;
    img.src = theme === "dark" ? darkSrc : lightSrc;
}

// ===== THEME TOGGLE SLIDER =====
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");

    if (themeSwitch) {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem("theme") || "light";
        themeSwitch.checked = savedTheme === "dark";

        // Apply saved theme on page load
        if (savedTheme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        // Also swap profile image on load
        updateProfileImageForTheme(savedTheme);

        // Listen for toggle changes
        themeSwitch.addEventListener("change", () => {
            const newTheme = themeSwitch.checked ? "dark" : "light";

            // Apply theme to document
            if (newTheme === "dark") {
                document.documentElement.setAttribute("data-theme", "dark");
            } else {
                document.documentElement.removeAttribute("data-theme");
            }

            localStorage.setItem("theme", newTheme);
            // Swap profile image when toggling
            updateProfileImageForTheme(newTheme);
        });
    }
});
