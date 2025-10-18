// Contacts page: client-side validation and UX on submit
(function () {
    const form = document.getElementById("contactForm");
    const success = document.getElementById("formSuccess");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // HTML5 constraint validation
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        // Simulate submit success UX
        form.classList.remove("was-validated");
        form.reset();
        if (success) {
            success.classList.remove("d-none");
            setTimeout(() => success.classList.add("d-none"), 3000);
        }
    });
})();
