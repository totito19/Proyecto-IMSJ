// Menú móvil + resaltado del enlace activo — frontend público (rediseño)
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a").forEach((link) => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });

    // Selección visual de horario / modalidad (sólo interfaz, sin lógica de negocio)
    document.querySelectorAll(".time-grid button").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".time-grid button").forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });
});
