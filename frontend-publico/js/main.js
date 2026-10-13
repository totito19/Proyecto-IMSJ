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

    const footerContainer = document.querySelector('.site-footer .container');
    if (footerContainer && window.ImsjApi && !footerContainer.querySelector('#form-consulta')) {
        const contact = document.createElement('section');
        contact.className = 'footer-contact';
        contact.innerHTML = `
            <div class="footer-contact__intro">
                <span>Contacto</span>
                <h2>¿Tenés una consulta?</h2>
                <p>Enviá tu mensaje a la Sección Tránsito. El personal podrá leerlo desde el panel IMSJ.</p>
            </div>
            <form id="form-consulta" class="footer-contact__form">
                <label>Nombre<input name="nombre" maxlength="120" autocomplete="name" required></label>
                <label>Correo electrónico<input name="email" type="email" maxlength="254" autocomplete="email" required></label>
                <label class="footer-contact__message">Consulta<textarea name="mensaje" maxlength="2000" rows="4" required></textarea></label>
                <div class="footer-contact__submit"><p id="consulta-status" role="status"></p><button class="btn btn-accent" type="submit">Enviar consulta</button></div>
            </form>`;
        const bottom = footerContainer.querySelector('.footer-bottom');
        footerContainer.insertBefore(contact, bottom || footerContainer.firstChild);

        contact.querySelector('form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!form.reportValidity()) return;
            const button = form.querySelector('button[type="submit"]');
            const status = form.querySelector('#consulta-status');
            button.disabled = true;
            status.className = '';
            status.textContent = 'Enviando...';
            try {
                await ImsjApi.request('/portal/consultas', {
                    method: 'POST',
                    body: Object.fromEntries(new FormData(form).entries()),
                });
                form.reset();
                status.className = 'is-success';
                status.textContent = 'Consulta enviada correctamente.';
            } catch (error) {
                status.className = 'is-error';
                status.textContent = error.message;
            } finally {
                button.disabled = false;
            }
        });
    }

});
