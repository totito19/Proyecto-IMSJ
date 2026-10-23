/** Navegación, accesibilidad y pequeños comportamientos comunes del portal público. */
document.addEventListener('DOMContentLoaded', () => {
  // Reemplaza los marcadores de iconos únicamente cuando la biblioteca está disponible.
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const navList = document.querySelector('.main-nav ul');
  // Agrega el acceso al simulador a plantillas antiguas que todavía no lo incluyen.
  if (navList && !navList.querySelector('[href="prueba.html"]')) {
    const item = document.createElement('li');
    item.innerHTML = '<a href="prueba.html">Simulador</a>';
    const agendaItem = navList.querySelector('[href="agenda.html"]')?.closest('li');
    navList.insertBefore(item, agendaItem || null);
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  // Mantiene sincronizados el menú móvil visible y el atributo aria-expanded.
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Resalta el enlace cuya ruta coincide con el documento actualmente abierto.
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  const logout = document.querySelector('.btn-logout');
  // Solo conecta la salida si existe una sesión administrada por ImsjApi.
  if (logout && window.ImsjApi && ImsjApi.currentUser()) {
    logout.addEventListener('click', (event) => {
      event.preventDefault();
      ImsjApi.logout();
      window.location.assign(logout.href);
    });
  }

  const footerContainer = document.querySelector('.site-footer .container');
  // Inserta una sola vez el formulario común de consultas en el pie de página.
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
                <label>Nombre<input name="nombre" maxlength="120" autocomplete="name" data-validate="name" required></label>
                <label>Correo electrónico<input name="email" type="email" maxlength="254" autocomplete="email" required></label>
                <label class="footer-contact__message">Consulta<textarea name="mensaje" maxlength="150" rows="4" aria-describedby="consulta-limite" required></textarea><small class="footer-contact__hint" id="consulta-limite">0/150 caracteres</small></label>
                <div class="footer-contact__submit"><p id="consulta-status" role="status"></p><button class="btn btn-accent" type="submit">Enviar consulta</button></div>
            </form>`;
    const bottom = footerContainer.querySelector('.footer-bottom');
    footerContainer.insertBefore(contact, bottom || footerContainer.firstChild);

    const message = contact.querySelector('textarea[name="mensaje"]');
    const messageLimit = contact.querySelector('#consulta-limite');
    const updateMessageLimit = () => {
      messageLimit.textContent = `${message.value.length}/150 caracteres`;
    };
    message.addEventListener('input', updateMessageLimit);

    // Convierte el formulario en JSON y deja que el cliente común gestione errores HTTP.
    contact.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!ImsjForms.validate(form)) return;
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
        updateMessageLimit();
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
