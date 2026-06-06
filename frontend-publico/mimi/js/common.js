// Utilidades comunes — frontend público
function fmtFecha(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return d.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtFechaHora(fecha, hora) {
  if (!fecha) return '';
  return `${fmtFecha(fecha)} · ${hora ? hora.slice(0,5) : ''}`;
}

function fmtMoneda(n) {
  if (n == null) return '';
  return Number(n).toLocaleString('es-UY', { style: 'currency', currency: 'UYU', minimumFractionDigits: 0 });
}

function showAlert(msg, type = 'info', containerId = 'alert-container') {
  const c = document.getElementById(containerId);
  if (!c) { alert(msg); return; }
  const colors = {
    info: 'bg-blue-50 text-blue-800 border-blue-300',
    success: 'bg-green-50 text-green-800 border-green-300',
    error: 'bg-red-50 text-red-800 border-red-300',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  };
  c.innerHTML = `<div class="border ${colors[type] || colors.info} px-4 py-3 rounded">${msg}</div>`;
  c.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearAlert(id = 'alert-container') {
  const c = document.getElementById(id);
  if (c) c.innerHTML = '';
}

function renderNavbar(active = '') {
  const items = [
    { id: 'noticias', href: 'index.html', label: 'Noticias' },
    { id: 'prueba', href: 'agenda-prueba.html', label: 'Prueba de manejo' },
    { id: 'renovacion', href: 'agenda-renovacion.html', label: 'Renovación' },
    { id: 'materiales', href: 'materiales.html', label: 'Materiales' },
    { id: 'faq', href: 'faq.html', label: 'Preguntas frecuentes' },
    { id: 'consulta', href: 'consultar-reserva.html', label: 'Consultar reserva' },
  ];
  const u = Store.currentUser();
  const sesionImsj = u && u.es_imsj;
  return `
    <nav class="bg-blue-900 text-white sticky top-0 z-30 shadow">
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap">
        <a href="index.html" class="py-3 font-bold text-lg">IMSJ · Tránsito</a>
        <button id="menu-btn" class="md:hidden p-2" aria-label="Menú">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <ul id="menu" class="hidden md:flex flex-col md:flex-row md:items-center gap-1 w-full md:w-auto pb-2 md:pb-0">
          ${items.map(i => `
            <li>
              <a href="${i.href}"
                 class="block px-3 py-2 rounded hover:bg-blue-700 ${active === i.id ? 'bg-blue-700' : ''}">
                ${i.label}
              </a>
            </li>
          `).join('')}
          <li class="md:ml-2 md:border-l md:border-blue-700 md:pl-2 mt-1 md:mt-0">
            ${sesionImsj
              ? `<a href="../frontend-imsj/dashboard.html"
                    class="block px-3 py-2 rounded bg-amber-500 hover:bg-amber-600 text-blue-950 font-semibold">
                   Ir al dashboard IMSJ →
                 </a>`
              : `<button id="login-btn"
                    class="px-3 py-2 rounded bg-white text-blue-900 font-semibold hover:bg-blue-100 w-full md:w-auto">
                   Iniciar sesión
                 </button>`}
          </li>
        </ul>
      </div>
    </nav>`;
}

function renderFooter() {
  const c = window.APP_CONFIG;
  return `
    <footer class="bg-slate-100 border-t mt-12">
      <div class="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 flex flex-wrap gap-4 justify-between">
        <div>
          <p class="font-semibold">${c.APP_NAME}</p>
          <p>Intendencia Municipal de San José · Sección Tránsito</p>
        </div>
        <div>
          <p>Tel: ${c.CONTACT_PHONE}</p>
          <p>Email: ${c.CONTACT_EMAIL}</p>
        </div>
      </div>
    </footer>`;
}

function renderLoginModal() {
  return `
    <div id="login-modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-bold">Iniciar sesión</h2>
          <button id="login-cerrar" class="text-2xl leading-none text-slate-500 hover:text-slate-900">&times;</button>
        </div>
        <div class="p-5">
          <p class="text-sm text-slate-600 mb-4">
            El acceso administrativo es solo para personal IMSJ
            (emails <strong>@imsj.gub.uy</strong>). Los ciudadanos pueden navegar y agendar
            trámites sin iniciar sesión.
          </p>
          <div id="login-alert" class="mb-3"></div>
          <form id="login-form" class="space-y-3">
            <label class="block">
              <span class="text-sm font-semibold">Email</span>
              <input name="email" type="email" required autocomplete="email"
                     class="mt-1 w-full border border-slate-300 rounded px-3 py-2"
                     placeholder="usuario@imsj.gub.uy">
            </label>
            <label class="block">
              <span class="text-sm font-semibold">Contraseña</span>
              <input name="password" type="password" required autocomplete="current-password"
                     class="mt-1 w-full border border-slate-300 rounded px-3 py-2">
            </label>
            <button class="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold">
              Ingresar
            </button>
          </form>
          <p class="text-xs text-slate-400 mt-4">
            Prototipo: cualquier contraseña funciona. Probá con
            <code>admin@imsj.gub.uy</code> para entrar al dashboard, o cualquier otro email
            para quedarte como ciudadano.
          </p>
        </div>
      </div>
    </div>`;
}

function showLoginAlert(msg, type = 'error') {
  const c = document.getElementById('login-alert');
  if (!c) return;
  const colors = {
    error: 'bg-red-50 text-red-800 border-red-300',
    success: 'bg-green-50 text-green-800 border-green-300',
    info: 'bg-blue-50 text-blue-800 border-blue-300',
  };
  c.innerHTML = `<div class="border ${colors[type]||colors.info} px-3 py-2 rounded text-sm">${msg}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Navbar
  const slot = document.getElementById('navbar');
  if (slot) slot.outerHTML = renderNavbar(slot.dataset.active || '');

  // Footer
  const fslot = document.getElementById('footer');
  if (fslot) fslot.outerHTML = renderFooter();

  // Modal de login (inyectado al final del body)
  document.body.insertAdjacentHTML('beforeend', renderLoginModal());

  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));

  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const loginCerrar = document.getElementById('login-cerrar');
  const loginForm = document.getElementById('login-form');

  if (loginBtn) loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
  if (loginCerrar) loginCerrar.addEventListener('click', () => loginModal.classList.add('hidden'));
  if (loginModal) loginModal.addEventListener('click', (e) => {
    if (e.target.id === 'login-modal') loginModal.classList.add('hidden');
  });

  if (loginForm) loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const email = String(fd.get('email')||'').trim().toLowerCase();
    const usuario = Store.login(email, fd.get('password'));
    if (usuario.es_imsj) {
      showLoginAlert(`Bienvenido, ${usuario.nombre}. Redirigiendo al dashboard…`, 'success');
      setTimeout(() => { location.href = '../frontend-imsj/dashboard.html'; }, 600);
    } else {
      showLoginAlert(
        `El email <strong>${email}</strong> no pertenece al personal IMSJ. ` +
        `Podés seguir navegando como ciudadano (agendar trámites, leer noticias, etc.).`,
        'info'
      );
      // Refrescar navbar para actualizar estado
      setTimeout(() => location.reload(), 1500);
    }
  });
});
