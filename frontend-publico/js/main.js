// Menú móvil + resaltado del enlace activo — frontend público (rediseño)
document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const navList = document.querySelector('.main-nav ul');
    if (navList && !navList.querySelector('[href="prueba.html"]')) {
        const item = document.createElement('li');
        item.innerHTML = '<a href="prueba.html">Simulador</a>';
        const agendaItem = navList.querySelector('[href="agenda.html"]')?.closest('li');
        navList.insertBefore(item, agendaItem || null);
    }

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

    const logout = document.querySelector('.btn-logout');
    if (logout && window.ImsjApi && ImsjApi.currentUser()) {
        logout.addEventListener('click', (event) => {
            event.preventDefault();
            ImsjApi.logout();
            window.location.assign(logout.href);
        });
    }

});
