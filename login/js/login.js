/* ═══════════════════════════════════════════════════════════════════════════
   login.js — login unificado (ciudadano / personal IMSJ).
   Sin backend: valida los formularios, simula "Verificando..." y redirige
   al frontend correspondiente. Mismo patrón que usaba el login original
   de frontend-imsj (900 ms de espera simulada).
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Animación de alto (técnica FLIP) ----------
    // Anima el alto de `wrap` entre el estado antes y después de `mutate()`,
    // en vez de que el panel salte de tamaño de golpe al cambiar de pestaña.
    function animateHeight(wrap, mutate) {
        if (!wrap) { mutate(); return; }

        const startHeight = wrap.getBoundingClientRect().height;
        mutate();
        const endHeight = wrap.scrollHeight;

        wrap.style.height = startHeight + 'px';
        wrap.getBoundingClientRect(); // fuerza reflow antes de animar

        requestAnimationFrame(() => {
            wrap.style.height = endHeight + 'px';
        });

        wrap.addEventListener('transitionend', function onEnd(e) {
            if (e.propertyName !== 'height') return;
            wrap.style.height = 'auto';
            wrap.removeEventListener('transitionend', onEnd);
        });
    }

    // ---------- Tabs de rol: Ciudadano / Personal IMSJ ----------
    const roleTabs = document.querySelectorAll('.role-tab');
    const rolePanels = document.querySelectorAll('.role-panel');
    const panelsWrap = document.getElementById('panels-wrap');

    function setRole(role) {
        roleTabs.forEach((t) => t.classList.toggle('active', t.dataset.role === role));
        animateHeight(panelsWrap, () => {
            rolePanels.forEach((p) => p.classList.toggle('active', p.dataset.role === role));
        });
    }

    roleTabs.forEach((tab) => {
        tab.addEventListener('click', () => setRole(tab.dataset.role));
    });

    // Permite abrir directamente en la pestaña admin con login.html#admin
    if (window.location.hash === '#admin') setRole('admin');

    // ---------- Sub-tabs ciudadano: Ingresar / Registrarme ----------
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modeForms = document.querySelectorAll('.mode-form');
    const formsWrap = document.getElementById('forms-wrap');

    modeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            modeButtons.forEach((b) => b.classList.toggle('active', b === btn));
            animateHeight(formsWrap, () => {
                modeForms.forEach((f) => f.classList.toggle('active', f.dataset.mode === btn.dataset.mode));
            });
        });
    });

    // ---------- Envío con simulación de verificación ----------
    function handleSubmit(form, button, label, redirectTo, before) {
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            if (typeof before === 'function' && before(form) === false) return;

            button.disabled = true;
            const original = button.textContent;
            button.textContent = label;

            setTimeout(() => {
                window.location.href = redirectTo;
            }, 900);

            // por si el usuario vuelve atrás con el botón del navegador
            setTimeout(() => { button.disabled = false; button.textContent = original; }, 4000);
        });
    }

    // Ciudadano — iniciar sesión (cédula + contraseña)
    handleSubmit(
        document.getElementById('form-ciudadano-login'),
        document.getElementById('btn-ciudadano-login'),
        'Verificando...',
        '../frontend-publico-v2/index.html'
    );

    // Ciudadano — registro (valida que las contraseñas coincidan)
    handleSubmit(
        document.getElementById('form-ciudadano-registro'),
        document.getElementById('btn-ciudadano-registro'),
        'Creando cuenta...',
        '../frontend-publico-v2/index.html',
        (form) => {
            const pass = form.querySelector('#reg-password').value;
            const confirm = form.querySelector('#reg-password-confirm').value;
            const errorEl = form.querySelector('.field-error');
            if (pass !== confirm) {
                errorEl.classList.add('show');
                return false;
            }
            errorEl.classList.remove('show');
            return true;
        }
    );

    // Personal IMSJ — iniciar sesión (correo + contraseña).
    // Reutiliza Store.reset() de frontend-imsj/js/data.js si está disponible,
    // igual que hacía el login original del panel administrativo.
    handleSubmit(
        document.getElementById('form-admin-login'),
        document.getElementById('btn-admin-login'),
        'Verificando...',
        '../frontend-imsj/agenda.html',
        () => {
            if (typeof Store !== 'undefined') Store.reset();
        }
    );
});
