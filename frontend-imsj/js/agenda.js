/* ═══════════════════════════════════════════════════════════════════════════
   agenda.js — pantalla "Agenda de trámites".
   KPIs, tabs de vista (día / semana / mes), navegación de fecha,
   filtros por tipo y estado, buscador y acciones por fila.
   ═══════════════════════════════════════════════════════════════════════════ */

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/* Fecha de referencia del prototipo. */
let cursor = new Date(2025, 5, 16);
let vista  = 'dia';
let query  = '';

/* ── Helpers de fecha ────────────────────────────────────────────────────── */

const pad = (n) => String(n).padStart(2, '0');
const toUY = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

/** Convierte "16/06/2025" en Date. */
function parseUY(str) {
  const [d, m, y] = str.split('/').map(Number);
  return new Date(y, m - 1, d);
}

/** Lunes de la semana que contiene a `d`. */
function startOfWeek(d) {
  const out = new Date(d);
  const day = (out.getDay() + 6) % 7; // 0 = lunes
  out.setDate(out.getDate() - day);
  return out;
}

function rangoActual() {
  if (vista === 'dia') {
    return { desde: new Date(cursor), hasta: new Date(cursor) };
  }
  if (vista === 'semana') {
    const desde = startOfWeek(cursor);
    const hasta = new Date(desde);
    hasta.setDate(hasta.getDate() + 6);
    return { desde, hasta };
  }
  return {
    desde: new Date(cursor.getFullYear(), cursor.getMonth(), 1),
    hasta: new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0),
  };
}

function etiquetaPeriodo() {
  const { desde, hasta } = rangoActual();
  if (vista === 'dia')  return `${desde.getDate()} ${MESES[desde.getMonth()]} ${desde.getFullYear()}`;
  if (vista === 'mes')  return `${MESES[desde.getMonth()]} ${desde.getFullYear()}`;

  const mismoMes = desde.getMonth() === hasta.getMonth();
  return mismoMes
    ? `${desde.getDate()} – ${hasta.getDate()} ${MESES[desde.getMonth()]} ${desde.getFullYear()}`
    : `${desde.getDate()} ${MESES[desde.getMonth()]} – ${hasta.getDate()} ${MESES[hasta.getMonth()]} ${hasta.getFullYear()}`;
}

function moverPeriodo(delta) {
  if (vista === 'dia')    cursor.setDate(cursor.getDate() + delta);
  else if (vista === 'semana') cursor.setDate(cursor.getDate() + delta * 7);
  else                    cursor.setMonth(cursor.getMonth() + delta);
}

/* ── Filtrado ────────────────────────────────────────────────────────────── */

function filtrar() {
  const reservas    = Store.get('reservas');
  const tipo        = $('#filtro-tipo').value;
  const estado      = $('#filtro-estado').value;
  const { desde, hasta } = rangoActual();

  return reservas.filter((r) => {
    const f = parseUY(r.fecha);
    const enRango = f >= desde && f <= hasta;

    const okEstado = estado === 'todos' || r.estado === estado;
    const okTipo =
      tipo === 'todos' ||
      (tipo === 'prueba'  && r.tipo.toLowerCase().includes('prueba')) ||
      (tipo === 'normal'  && r.tipo.toLowerCase().includes('normal')) ||
      (tipo === 'urgente' && r.tipo.toLowerCase().includes('urgente'));

    const okQuery = !query ||
      [r.ciudadano, r.documento, r.tipo, r.fecha, r.hora]
        .join(' ').toLowerCase().includes(query);

    return enRango && okEstado && okTipo && okQuery;
  });
}

/* ── Render ──────────────────────────────────────────────────────────────── */

function renderKPIs() {
  const reservas = Store.get('reservas');
  const count = (e) => reservas.filter((r) => r.estado === e).length;
  $('#kpi-total').textContent       = reservas.length;
  $('#kpi-pendientes').textContent  = count('pendiente');
  $('#kpi-confirmadas').textContent = count('confirmada');
  $('#kpi-urgentes').textContent    = count('urgente');
}

function renderTabla() {
  const filas  = filtrar();
  const total  = Store.get('reservas').length;
  const tbody  = $('#tbody-reservas');

  tbody.innerHTML = filas.map((r) => `
    <tr>
      <td class="strong">${esc(r.fecha)}</td>
      <td class="code">${esc(r.hora)}</td>
      <td>${esc(r.ciudadano)}</td>
      <td class="code code--dim">${esc(r.documento)}</td>
      <td class="muted">${esc(r.tipo)}</td>
      <td>${badge(r.estado)}</td>
      <td>
        <div class="actions">
          ${actionBtn('eye',   'Ver detalle', { data: { accion: 'ver',       id: r.id } })}
          ${actionBtn('check', 'Confirmar',   { data: { accion: 'confirmar', id: r.id } })}
          ${actionBtn('x',     'Cancelar',    { danger: true, data: { accion: 'cancelar', id: r.id } })}
        </div>
      </td>
    </tr>`).join('');

  $('#empty-reservas').hidden = filas.length > 0;
  $('#fecha-label').textContent = etiquetaPeriodo();
  $('#contador-reservas').textContent = `Mostrando ${filas.length} de ${total} reservas`;
}

function render() {
  renderKPIs();
  renderTabla();
}

/* ── Acciones de fila ────────────────────────────────────────────────────── */

function verDetalle(reserva) {
  $('#modal-reserva-body').innerHTML = `
    <div class="form-body">
      <div class="form-grid">
        <div class="field"><label>Ciudadano</label><input class="input" value="${esc(reserva.ciudadano)}" readonly></div>
        <div class="field"><label>Documento</label><input class="input" value="${esc(reserva.documento)}" readonly></div>
        <div class="field"><label>Fecha</label><input class="input" value="${esc(reserva.fecha)}" readonly></div>
        <div class="field"><label>Hora</label><input class="input" value="${esc(reserva.hora)}" readonly></div>
      </div>
      <div class="field"><label>Tipo de trámite</label><input class="input" value="${esc(reserva.tipo)}" readonly></div>
      <div class="field"><label>Estado</label><div>${badge(reserva.estado)}</div></div>
      <div class="form-foot">
        <button type="button" class="btn btn--ghost" data-modal-close>Cerrar</button>
      </div>
    </div>`;
  hydrateIcons($('#modal-reserva'));
  $$('[data-modal-close]', $('#modal-reserva')).forEach((b) =>
    b.addEventListener('click', () => Modal.close('modal-reserva')));
  Modal.open('modal-reserva');
}

function cambiarEstado(id, estado) {
  const reservas = Store.get('reservas').map((r) => (r.id === id ? { ...r, estado } : r));
  Store.set('reservas', reservas);
  render();
}

/* ── Eventos ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  $('#viewtabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-vista]');
    if (!btn) return;
    vista = btn.dataset.vista;
    $$('#viewtabs button').forEach((b) => b.classList.toggle('is-active', b === btn));
    renderTabla();
  });

  $('#fecha-prev').addEventListener('click', () => { moverPeriodo(-1); renderTabla(); });
  $('#fecha-next').addEventListener('click', () => { moverPeriodo(1);  renderTabla(); });

  $('#filtro-tipo').addEventListener('change', renderTabla);
  $('#filtro-estado').addEventListener('change', renderTabla);

  $('#tbody-reservas').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const reserva = Store.get('reservas').find((r) => r.id === id);
    if (!reserva) return;

    if (btn.dataset.accion === 'ver')       verDetalle(reserva);
    if (btn.dataset.accion === 'confirmar') cambiarEstado(id, 'confirmada');
    if (btn.dataset.accion === 'cancelar')  cambiarEstado(id, 'cancelada');
  });

  initSearch((q) => { query = q; renderTabla(); });

  render();
});
