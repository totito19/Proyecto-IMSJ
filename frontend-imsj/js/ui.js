/* ═══════════════════════════════════════════════════════════════════════════
   ui.js — helpers compartidos por todas las pantallas del panel.
   Equivale a los componentes Badge / ActionBtn / Modal / Sidebar de App.tsx.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Utilidades ──────────────────────────────────────────────────────────── */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escapa texto antes de inyectarlo como HTML. */
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/** dd/mm/aaaa a partir de un <input type="date"> (aaaa-mm-dd). */
function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

/** Fecha de hoy en formato uruguayo. */
function today() {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('/');
}

/* ── Badge ───────────────────────────────────────────────────────────────── */

const BADGES = {
  confirmada:            { label: 'Confirmada',          cls: 'badge--emerald' },
  pendiente:             { label: 'Pendiente',           cls: 'badge--amber' },
  cancelada:             { label: 'Cancelada',           cls: 'badge--red' },
  urgente:               { label: 'Urgente',             cls: 'badge--urgent' },
  publicada:             { label: 'Publicada',           cls: 'badge--emerald' },
  borrador:              { label: 'Borrador',            cls: 'badge--slate' },
  activo:                { label: 'Activo',              cls: 'badge--emerald' },
  inactivo:              { label: 'Inactivo',            cls: 'badge--slate' },
  visible:               { label: 'Visible',             cls: 'badge--emerald' },
  oculta:                { label: 'Oculta',              cls: 'badge--slate' },
  prueba:                { label: 'Prueba de manejo',    cls: 'badge--violet' },
  'renovacion-normal':   { label: 'Renovación Normal',   cls: 'badge--blue' },
  'renovacion-urgente':  { label: 'Renovación Urgente',  cls: 'badge--red' },
};

function badge(estado) {
  const item = BADGES[estado] || { label: estado, cls: 'badge--slate' };
  return `<span class="badge ${item.cls}">${esc(item.label)}</span>`;
}

/* ── Botón de acción de fila ─────────────────────────────────────────────── */

function actionBtn(iconName, title, opts = {}) {
  const danger = opts.danger ? ' action-btn--danger' : '';
  const attrs = Object.entries(opts.data || {})
    .map(([k, v]) => ` data-${k}="${esc(v)}"`)
    .join('');
  return (
    `<button type="button" class="action-btn${danger}" title="${esc(title)}" ` +
    `aria-label="${esc(title)}"${attrs}>${icon(iconName, 14)}</button>`
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */

const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const first = el.querySelector('input, select, textarea, button');
    if (first) first.focus();
  },

  close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-open');
    document.body.style.overflow = '';
  },

  closeAll() {
    $$('.modal.is-open').forEach((m) => m.classList.remove('is-open'));
    document.body.style.overflow = '';
  },

  /** Cablea backdrop, botón X y cualquier [data-modal-close]. */
  bind() {
    $$('.modal').forEach((modal) => {
      $$('.modal__backdrop, [data-modal-close]', modal).forEach((el) => {
        el.addEventListener('click', () => Modal.close(modal.id));
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') Modal.closeAll();
    });
  },
};

/* ── Sidebar responsive ──────────────────────────────────────────────────── */

function initSidebar() {
  const sidebar  = $('.sidebar');
  const burger   = $('.topbar__burger');
  const backdrop = $('.sidebar__backdrop');
  if (!sidebar || !burger) return;

  const toggle = (open) => {
    sidebar.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => toggle(!sidebar.classList.contains('is-open')));
  if (backdrop) backdrop.addEventListener('click', () => toggle(false));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) toggle(false); });
}

/* ── Cerrar sesión ───────────────────────────────────────────────────────── */

function initLogout() {
  const link = $('[data-logout]');
  if (!link) return;

  link.addEventListener('click', (event) => {
    if (!window.ImsjApi) {
      if (typeof Store !== 'undefined') Store.reset();
      return;
    }

    event.preventDefault();
    ImsjApi.logout();
    window.location.assign(link.href);
  });
}

/* ── Buscador de la barra superior ───────────────────────────────────────── */
/* Filtra en vivo las filas de la tabla o las tarjetas visibles en la página. */

function initSearch(onSearch) {
  const input = $('#topbar-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (typeof onSearch === 'function') onSearch(q);
  });
}

/* ── Navegación, identidad e historial ─────────────────────────────────── */

function initAdminNavigation() {
  const nav = $('.sidebar__nav');
  if (!nav) return;

  [
    { href: 'preguntas-prueba.html', icon: 'clipboard-check', label: 'Banco de pruebas' },
    { href: 'usuarios.html', icon: 'users', label: 'Personal IMSJ' },
  ].forEach((item) => {
    if (nav.querySelector(`[href="${item.href}"]`)) return;
    const link = document.createElement('a');
    link.className = 'sidebar__link';
    link.href = item.href;
    link.innerHTML = `<span data-icon="${item.icon}"></span>${item.label}`;
    nav.appendChild(link);
  });

  const currentPage = window.location.pathname.split('/').pop();
  $$('.sidebar__link', nav).forEach((link) => {
    const isCurrent = link.getAttribute('href') === currentPage;
    link.classList.toggle('is-active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  hydrateIcons(nav);
}

function initUserProfile() {
  const usuario = window.ImsjApi?.currentUser();
  if (!usuario) return;

  const displayName = usuario.nombre || usuario.cedula;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const name = $('.user__name');
  const avatar = $('.user__avatar');
  if (name) name.textContent = displayName;
  if (avatar) avatar.textContent = initials || 'IM';
}

function historyElementLabel(type) {
  return ({
    FranjaDisponibilidad: 'franja',
    MaterialEstudio: 'material',
    Noticia: 'noticia',
    PreguntaFrecuente: 'pregunta frecuente',
    PreguntaPrueba: 'pregunta de prueba',
    User: 'integrante del personal',
  })[type] || type;
}

function historyActionLabel(action) {
  return ({
    ACTUALIZAR: 'actualizó',
    CREAR: 'creó',
    DESACTIVAR: 'quitó',
    DESPUBLICAR: 'ocultó',
    ELIMINAR: 'eliminó',
    PUBLICAR: 'publicó',
    REACTIVAR: 'volvió a habilitar',
  })[action] || action.toLowerCase();
}

function renderHistory(acciones) {
  if (!acciones.length) return '<p class="history__empty">Todavía no hay acciones registradas.</p>';

  return acciones.map((item) => {
    const actor = item.usuario?.nombre || item.usuario?.cedula || 'Usuario desconocido';
    const when = new Date(item.fecha_hora).toLocaleString('es-UY', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    return `<article class="history__item">
      <span class="history__marker"></span>
      <div>
        <p><strong>${esc(actor)}</strong> ${esc(historyActionLabel(item.accion))}
          ${esc(historyElementLabel(item.tipo_elemento))} #${esc(item.elemento_id)}</p>
        <time datetime="${esc(item.fecha_hora)}">${esc(when)}</time>
      </div>
    </article>`;
  }).join('');
}

function initHistory() {
  const bell = $('.bell');
  const topbarRight = $('.topbar__right');
  if (!bell || !topbarRight || !window.ImsjApi) return;

  bell.setAttribute('aria-label', 'Abrir historial de acciones');
  bell.setAttribute('aria-expanded', 'false');
  bell.setAttribute('aria-controls', 'history-popover');

  const popover = document.createElement('section');
  popover.id = 'history-popover';
  popover.className = 'history';
  popover.hidden = true;
  popover.innerHTML = `
    <div class="history__head">
      <div>
        <strong>Historial de acciones</strong>
        <span>Últimos movimientos del panel</span>
      </div>
      <button type="button" class="history__close" aria-label="Cerrar historial">${icon('x', 16)}</button>
    </div>
    <div class="history__body"><p class="history__empty">Cargando...</p></div>`;
  topbarRight.appendChild(popover);

  const close = () => {
    popover.hidden = true;
    bell.setAttribute('aria-expanded', 'false');
  };

  async function open() {
    popover.hidden = false;
    bell.setAttribute('aria-expanded', 'true');
    $('.history__body', popover).innerHTML = '<p class="history__empty">Cargando...</p>';
    try {
      const payload = await ImsjApi.request('/historial?limite=20');
      $('.history__body', popover).innerHTML = renderHistory(payload.acciones || []);
      const dot = $('.bell__dot', bell);
      if (dot) dot.hidden = true;
    } catch (error) {
      $('.history__body', popover).innerHTML = `<p class="history__empty history__empty--error">${esc(error.message)}</p>`;
    }
  }

  bell.addEventListener('click', (event) => {
    event.stopPropagation();
    if (popover.hidden) open();
    else close();
  });
  $('.history__close', popover).addEventListener('click', close);
  popover.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', close);
}

/* ── Arranque común de cada página ───────────────────────────────────────── */

function initShell() {
  hydrateIcons();
  initAdminNavigation();
  initUserProfile();
  initSidebar();
  initLogout();
  initHistory();
  Modal.bind();
}

document.addEventListener('DOMContentLoaded', initShell);
