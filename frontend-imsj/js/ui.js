/* ═══════════════════════════════════════════════════════════════════════════
   ui.js — helpers compartidos por todas las pantallas del panel.
   Equivale a los componentes Badge / ActionBtn / Modal / Sidebar de App.tsx.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Utilidades ──────────────────────────────────────────────────────────── */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escapa texto antes de inyectarlo como HTML. */
function esc(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  );
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
  confirmada: { label: 'Confirmada', cls: 'badge--emerald' },
  pendiente: { label: 'Pendiente', cls: 'badge--amber' },
  aprobado: { label: 'Aprobado', cls: 'badge--blue' },
  cancelada: { label: 'Cancelada', cls: 'badge--red' },
  urgente: { label: 'Urgente', cls: 'badge--urgent' },
  publicada: { label: 'Publicada', cls: 'badge--emerald' },
  borrador: { label: 'Borrador', cls: 'badge--slate' },
  activo: { label: 'Activo', cls: 'badge--emerald' },
  inactivo: { label: 'Inactivo', cls: 'badge--slate' },
  visible: { label: 'Visible', cls: 'badge--emerald' },
  oculta: { label: 'Oculta', cls: 'badge--slate' },
  prueba: { label: 'Prueba de manejo', cls: 'badge--violet' },
  'renovacion-normal': { label: 'Renovación Normal', cls: 'badge--blue' },
  'renovacion-urgente': { label: 'Renovación Urgente', cls: 'badge--red' },
};

/** Genera la etiqueta visual correspondiente a un estado conocido. */
function badge(estado) {
  const item = BADGES[estado] || { label: estado, cls: 'badge--slate' };
  return `<span class="badge ${item.cls}">${esc(item.label)}</span>`;
}

/* ── Botón de acción de fila ─────────────────────────────────────────────── */

/** Construye un botón reutilizable con icono, título, clase y atributos data. */
function actionBtn(iconName, title, opts = {}) {
  const danger = opts.danger ? ' action-btn--danger' : '';
  const labeled = opts.labeled ? ' action-btn--labeled' : '';
  const attrs = Object.entries(opts.data || {})
    .map(([k, v]) => ` data-${k}="${esc(v)}"`)
    .join('');
  return (
    `<button type="button" class="action-btn${danger}${labeled}" title="${esc(title)}" ` +
    `aria-label="${esc(title)}"${attrs}>${icon(iconName, 14)}${opts.labeled ? `<span>${esc(title)}</span>` : ''}</button>`
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */

/** API mínima para abrir, cerrar e inicializar todos los diálogos del panel. */
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

/** Contrae en escritorio y abre un menú accesible en tablet y teléfono. */
function initSidebar() {
  const sidebar = $('.sidebar');
  const burger = $('.topbar__burger');
  const backdrop = $('.sidebar__backdrop');
  if (!sidebar || !burger) return;
  const app = $('.app');
  const content = $('.content');
  const mobile = window.matchMedia('(max-width: 1100px)');
  const storageKey = 'imsj:sidebar-collapsed';
  let collapsed = false;
  let open = false;
  try { collapsed = localStorage.getItem(storageKey) === 'true'; } catch { /* Preferencia opcional. */ }

  // Los enlaces conservan su nombre accesible al mostrar solamente iconos.
  $$('.sidebar__link', sidebar).forEach((link) => {
    const label = link.textContent.trim();
    link.setAttribute('aria-label', label);
    link.title = label;
    Array.from(link.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => {
      if (!node.textContent.trim()) return;
      const span = document.createElement('span');
      span.className = 'sidebar__label';
      span.textContent = node.textContent.trim();
      node.replaceWith(span);
    });
  });
  const title = $('.sidebar__title', sidebar);
  const subtitle = $('.sidebar__subtitle', sidebar);
  if (title) title.textContent = 'Portal Vial';
  if (subtitle) subtitle.textContent = 'Personal IMSJ';
  sidebar.setAttribute('aria-label', 'Navegación del panel IMSJ');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'sidebar__close';
  closeButton.setAttribute('aria-label', 'Cerrar menú');
  closeButton.innerHTML = icon('x', 20);
  $('.sidebar__brand', sidebar).append(closeButton);

  function render() {
    app.classList.toggle('is-sidebar-collapsed', !mobile.matches && collapsed);
    sidebar.classList.toggle('is-open', mobile.matches && open);
    if (backdrop) backdrop.classList.toggle('is-open', mobile.matches && open);
    document.body.classList.toggle('has-sidebar-open', mobile.matches && open);
    sidebar.inert = mobile.matches && !open;
    content.inert = mobile.matches && open;
    if (mobile.matches && open) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
    }
    burger.setAttribute('aria-expanded', String(mobile.matches ? open : !collapsed));
    const label = mobile.matches ? 'Abrir menú' : collapsed ? 'Expandir menú' : 'Contraer menú';
    burger.setAttribute('aria-label', label);
    burger.title = label;
    burger.innerHTML = icon(mobile.matches ? 'menu' : collapsed ? 'chevron-right' : 'chevron-left', 20);
  }
  function close(restoreFocus = true) {
    open = false;
    render();
    if (restoreFocus) burger.focus();
  }
  burger.addEventListener('click', () => {
    if (mobile.matches) {
      open = !open;
      render();
      if (open) closeButton.focus();
    } else {
      collapsed = !collapsed;
      try { localStorage.setItem(storageKey, String(collapsed)); } catch { /* Preferencia opcional. */ }
      render();
    }
  });
  closeButton.addEventListener('click', () => close());
  if (backdrop) backdrop.addEventListener('click', () => close());
  sidebar.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a')) close(false);
  });
  document.addEventListener('keydown', (event) => {
    if (!mobile.matches || !open) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const controls = $$('a[href], button:not([disabled])', sidebar);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  mobile.addEventListener('change', () => close(sidebar.contains(document.activeElement)));
  render();
}

/** Etiqueta celdas nuevas sin cambiar los datos ni los eventos de cada módulo. */
function initResponsiveTables() {
  $$('table.data').forEach((table) => {
    const labels = $$('thead th', table).map((cell) => cell.textContent.trim());
    $$('thead th', table).forEach((cell, index) => {
      cell.classList.toggle('cell-numeric', /^(Cédula|Cupos|Disponibles|Reserva|ID|Desde|Fecha|Vigencia|Horario)/i.test(labels[index] || ''));
    });
    const body = $('tbody', table);
    if (!body) return;
    table.classList.add('data--responsive');
    const labelCells = () => {
      $$('tr', body).forEach((row) => {
        Array.from(row.cells).forEach((cell, index) => {
          cell.dataset.label = labels[index] || '';
          cell.classList.toggle('cell-wide', cell.colSpan > 1);
          cell.classList.toggle('cell-numeric', /^(Cédula|Cupos|Disponibles|Reserva|ID|Desde|Fecha|Vigencia|Horario)/i.test(labels[index] || ''));
        });
      });
    };
    labelCells();
    new MutationObserver(labelCells).observe(body, { childList: true, subtree: true });
  });
}

/* ── Cerrar sesión ───────────────────────────────────────────────────────── */

/** Revoca la sesión y abre directamente el ingreso del personal, sin página puente. */
function initLogout() {
  const link = $('[data-logout]');
  if (!link) return;

  link.addEventListener('click', (event) => {
    if (!window.ImsjApi) return;

    event.preventDefault();
    ImsjApi.logout();
    window.location.replace('/frontend-publico/login.html#admin');
  });
}

/* ── Buscador de la barra superior ───────────────────────────────────────── */
/* Filtra en vivo las filas de la tabla o las tarjetas visibles en la página. */

/** Normaliza el buscador y comunica cada texto nuevo al módulo de la pantalla. */
function initSearch(onSearch) {
  const input = $('#topbar-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (typeof onSearch === 'function') onSearch(q);
  });
}

/* ── Navegación, identidad e historial ─────────────────────────────────── */

/** Marca el enlace de la página actual y evita recargas sobre la misma vista. */
function initAdminNavigation() {
  const nav = $('.sidebar__nav');
  if (!nav) return;

  [
    { href: 'consultas.html', icon: 'mail', label: 'Consultas' },
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

/** Muestra nombre, rol e iniciales del usuario autenticado en la barra lateral. */
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
  const role = $('.user__role');
  if (name) name.textContent = displayName;
  if (avatar) avatar.textContent = initials || 'IM';
  if (role) role.textContent = usuario.rol === 'DIRECTORA' ? 'Directora' : 'Personal IMSJ';
}

/** Convierte el nombre técnico de una entidad en una etiqueta comprensible. */
function historyElementLabel(type) {
  return (
    {
      FranjaDisponibilidad: 'franja',
      MaterialEstudio: 'material',
      Noticia: 'noticia',
      PreguntaFrecuente: 'pregunta frecuente',
      PreguntaPrueba: 'pregunta de prueba',
      Consulta: 'consulta',
      User: 'integrante del personal',
    }[type] || type
  );
}

/** Traduce las acciones de auditoría a expresiones destinadas al usuario. */
function historyActionLabel(action) {
  return (
    {
      ACTUALIZAR: 'actualizó',
      APROBAR: 'aprobó',
      CREAR: 'creó',
      DESACTIVAR: 'quitó',
      DESPUBLICAR: 'ocultó',
      ELIMINAR: 'eliminó',
      ENVIAR_REVISION: 'envió a revisión',
      LEER: 'leyó',
      PUBLICAR: 'publicó',
      REACTIVAR: 'volvió a habilitar',
      VOLVER_BORRADOR: 'volvió a borrador',
    }[action] || action.toLowerCase()
  );
}

/** Convierte el historial recibido en elementos seguros de la lista lateral. */
function renderHistory(acciones) {
  if (!acciones.length) return '<p class="history__empty">Todavía no hay acciones registradas.</p>';

  return acciones
    .map((item) => {
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
    })
    .join('');
}

/** Carga el historial al abrir el panel y administra estados de carga o error. */
function initHistory() {
  const bell = $('.bell');
  const topbarRight = $('.topbar__right');
  if (!bell || !topbarRight || !window.ImsjApi) return;

  bell.setAttribute('aria-label', 'Abrir historial de acciones');
  bell.setAttribute('aria-expanded', 'false');
  bell.setAttribute('aria-controls', 'history-popover');
  const dot = $('.bell__dot', bell);
  if (dot) dot.hidden = true;

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

  /** Abre el panel, consulta las veinte acciones recientes y actualiza la campana. */
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
      $('.history__body', popover).innerHTML =
        `<p class="history__empty history__empty--error">${esc(error.message)}</p>`;
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

/** Inicializa una vez todos los componentes compartidos del panel. */
function initShell() {
  hydrateIcons();
  initAdminNavigation();
  initUserProfile();
  initSidebar();
  initResponsiveTables();
  initLogout();
  initHistory();
  Modal.bind();
}

document.addEventListener('DOMContentLoaded', initShell);
