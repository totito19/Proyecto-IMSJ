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

/* ── Arranque común de cada página ───────────────────────────────────────── */

function initShell() {
  hydrateIcons();
  initSidebar();
  initLogout();
  Modal.bind();
}

document.addEventListener('DOMContentLoaded', initShell);
