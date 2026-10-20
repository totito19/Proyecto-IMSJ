/** Registro e inicio de sesión de ciudadanos contra la API del proyecto. */

/** Inicializa pestañas, formularios y redirecciones de la pantalla de acceso. */
function initLogin() {
  /** Anima la altura del contenedor cuando cambia el formulario visible. */
  function animateHeight(wrap, mutate) {
    if (!wrap) {
      mutate();
      return;
    }
    const startHeight = wrap.getBoundingClientRect().height;
    mutate();
    const endHeight = wrap.scrollHeight;
    wrap.style.height = `${startHeight}px`;
    wrap.getBoundingClientRect();
    requestAnimationFrame(() => {
      wrap.style.height = `${endHeight}px`;
    });
    wrap.addEventListener('transitionend', function onEnd(event) {
      if (event.propertyName !== 'height') return;
      wrap.style.height = 'auto';
      wrap.removeEventListener('transitionend', onEnd);
    });
  }

  const roleTabs = document.querySelectorAll('.role-tab');
  const rolePanels = document.querySelectorAll('.role-panel');
  const panelsWrap = document.getElementById('panels-wrap');

  /** Activa el panel ciudadano o administrativo solicitado. */
  function setRole(role) {
    roleTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.role === role));
    animateHeight(panelsWrap, () => {
      rolePanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.role === role));
    });
  }

  roleTabs.forEach((tab) => tab.addEventListener('click', () => setRole(tab.dataset.role)));
  if (window.location.hash === '#admin') setRole('admin');

  const modeButtons = document.querySelectorAll('.mode-btn');
  const modeForms = document.querySelectorAll('.mode-form');
  const formsWrap = document.getElementById('forms-wrap');
  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      modeButtons.forEach((item) => item.classList.toggle('active', item === button));
      animateHeight(formsWrap, () => {
        modeForms.forEach((form) =>
          form.classList.toggle('active', form.dataset.mode === button.dataset.mode),
        );
      });
    });
  });

  const requestedReturn = new URLSearchParams(window.location.search).get('return');
  /** Permite solo destinos internos con el prefijo esperado y bloquea URL externas. */
  function destination(prefix, fallback) {
    return requestedReturn &&
      requestedReturn.startsWith(prefix) &&
      !requestedReturn.startsWith('//')
      ? requestedReturn
      : fallback;
  }

  /** Ejecuta login o registro y centraliza el estado del botón y los errores. */
  async function submit(form, button, errorElement, action, redirectTo) {
    if (!form.reportValidity()) return;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Verificando...';
    errorElement.classList.remove('show');
    try {
      const user = await action();
      if (user) window.location.assign(redirectTo);
    } catch (error) {
      errorElement.textContent = error.message;
      errorElement.classList.add('show');
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  const citizenLoginForm = document.getElementById('form-ciudadano-login');
  // Inicio ciudadano: además de autenticar comprueba el rol devuelto por el backend.
  citizenLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submit(
      citizenLoginForm,
      document.getElementById('btn-ciudadano-login'),
      document.getElementById('citizen-login-error'),
      async () => {
        const user = await ImsjApi.login(
          document.getElementById('ciu-cedula').value,
          document.getElementById('ciu-password').value,
        );
        if (user.rol !== 'PUBLICO_GENERAL') {
          ImsjApi.clearSession();
          throw new Error('Esta cuenta no pertenece a un ciudadano.');
        }
        return user;
      },
      destination('/frontend-publico/', 'index.html'),
    );
  });

  const registerForm = document.getElementById('form-ciudadano-registro');
  // Registro ciudadano: envía contraseña y confirmación mediante el cliente compartido.
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submit(
      registerForm,
      document.getElementById('btn-ciudadano-registro'),
      document.getElementById('citizen-register-error'),
      () =>
        ImsjApi.register(
          document.getElementById('reg-cedula').value,
          document.getElementById('reg-password').value,
          document.getElementById('reg-password-confirm').value,
        ),
      destination('/frontend-publico/', 'index.html'),
    );
  });

  const adminForm = document.getElementById('form-admin-login');
  // Inicio administrativo: rechaza cuentas válidas que no pertenezcan al personal.
  adminForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submit(
      adminForm,
      document.getElementById('btn-admin-login'),
      document.getElementById('admin-login-error'),
      async () => {
        const user = await ImsjApi.login(
          document.getElementById('adm-cedula').value,
          document.getElementById('adm-password').value,
        );
        if (!ImsjApi.isStaff(user)) {
          ImsjApi.clearSession();
          throw new Error('Esta cuenta no pertenece al personal IMSJ.');
        }
        return user;
      },
      destination('/frontend-imsj/', '../frontend-imsj/noticias.html'),
    );
  });
}

// Ejecuta inmediatamente si el DOM ya existe o espera DOMContentLoaded en caso contrario.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogin);
} else {
  initLogin();
}
