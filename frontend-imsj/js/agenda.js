const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const NOMBRES_TIPO = {
  PRUEBA_MANEJO: 'Prueba de manejo',
  RENOVACION_NORMAL: 'Renovación normal',
  RENOVACION_URGENTE: 'Renovación urgente',
};

let cursorAgenda = new Date();
let vistaAgenda = 'dia';
let queryAgenda = '';
let reservasAgenda = [];

const padAgenda = (number) => String(number).padStart(2, '0');
const fechaIso = (date) => `${date.getFullYear()}-${padAgenda(date.getMonth() + 1)}-${padAgenda(date.getDate())}`;

function inicioSemana(date) {
  const result = new Date(date);
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
}

function rangoActual() {
  if (vistaAgenda === 'dia') return { desde: new Date(cursorAgenda), hasta: new Date(cursorAgenda) };
  if (vistaAgenda === 'semana') {
    const desde = inicioSemana(cursorAgenda);
    const hasta = new Date(desde);
    hasta.setDate(hasta.getDate() + 6);
    return { desde, hasta };
  }
  return {
    desde: new Date(cursorAgenda.getFullYear(), cursorAgenda.getMonth(), 1),
    hasta: new Date(cursorAgenda.getFullYear(), cursorAgenda.getMonth() + 1, 0),
  };
}

function etiquetaPeriodo() {
  const { desde, hasta } = rangoActual();
  if (vistaAgenda === 'dia') return `${desde.getDate()} ${MESES[desde.getMonth()]} ${desde.getFullYear()}`;
  if (vistaAgenda === 'mes') return `${MESES[desde.getMonth()]} ${desde.getFullYear()}`;
  return `${desde.getDate()} ${MESES[desde.getMonth()]} – ${hasta.getDate()} ${MESES[hasta.getMonth()]} ${hasta.getFullYear()}`;
}

function moverPeriodo(delta) {
  if (vistaAgenda === 'dia') cursorAgenda.setDate(cursorAgenda.getDate() + delta);
  else if (vistaAgenda === 'semana') cursorAgenda.setDate(cursorAgenda.getDate() + (delta * 7));
  else cursorAgenda.setMonth(cursorAgenda.getMonth() + delta);
}

function reservasFiltradas() {
  const tipo = $('#filtro-tipo').value;
  return reservasAgenda.filter((reserva) => {
    const coincideTipo = tipo === 'todos' || reserva.tipo === tipo;
    const coincideTexto = !queryAgenda ||
      [reserva.fecha, reserva.hora_inicio, reserva.cedula, reserva.tipo]
        .join(' ').toLowerCase().includes(queryAgenda);
    return coincideTipo && coincideTexto;
  });
}

function renderAgenda() {
  const filas = reservasFiltradas();
  $('#kpi-total').textContent = reservasAgenda.length;
  $('#kpi-pruebas').textContent = reservasAgenda.filter((item) => item.tipo === 'PRUEBA_MANEJO').length;
  $('#kpi-normales').textContent = reservasAgenda.filter((item) => item.tipo === 'RENOVACION_NORMAL').length;
  $('#kpi-urgentes').textContent = reservasAgenda.filter((item) => item.tipo === 'RENOVACION_URGENTE').length;
  $('#fecha-label').textContent = etiquetaPeriodo();
  $('#tbody-reservas').innerHTML = filas.map((reserva) => `
    <tr>
      <td class="strong">${formatDate(reserva.fecha)}</td>
      <td class="code">${esc(reserva.hora_inicio)} – ${esc(reserva.hora_fin)}</td>
      <td class="code">${esc(reserva.cedula)}</td>
      <td>${esc(NOMBRES_TIPO[reserva.tipo] || reserva.tipo)}</td>
      <td class="code">#${reserva.id}</td>
      <td>${actionBtn('eye', 'Ver detalle', { data: { accion: 'ver', id: reserva.id } })}</td>
    </tr>`).join('');
  $('#empty-reservas').hidden = filas.length > 0;
  $('#contador-reservas').textContent = `Mostrando ${filas.length} de ${reservasAgenda.length} reservas`;
  hydrateIcons($('#tbody-reservas'));
}

function verDetalle(reserva) {
  $('#modal-reserva-body').innerHTML = `
    <div class="form-body">
      <div class="form-grid">
        <div class="field"><label>Cédula</label><input class="input" value="${esc(reserva.cedula)}" readonly></div>
        <div class="field"><label>Reserva</label><input class="input" value="#${reserva.id}" readonly></div>
        <div class="field"><label>Fecha</label><input class="input" value="${formatDate(reserva.fecha)}" readonly></div>
        <div class="field"><label>Horario</label><input class="input" value="${esc(reserva.hora_inicio)} – ${esc(reserva.hora_fin)}" readonly></div>
      </div>
      <div class="field"><label>Tipo de trámite</label><input class="input" value="${esc(NOMBRES_TIPO[reserva.tipo] || reserva.tipo)}" readonly></div>
      <div class="form-foot"><button type="button" class="btn btn--ghost" data-modal-close>Cerrar</button></div>
    </div>`;
  $('[data-modal-close]', $('#modal-reserva-body')).addEventListener('click', () => Modal.close('modal-reserva'));
  Modal.open('modal-reserva');
}

async function cargarAgenda() {
  try {
    const payload = await ImsjApi.request(`/agenda?vista=${vistaAgenda}&fecha=${fechaIso(cursorAgenda)}`);
    reservasAgenda = Array.isArray(payload.reservas) ? payload.reservas : [];
    renderAgenda();
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!usuario || usuario.rol !== 'PERSONAL_IMSJ') {
    window.location.assign(`/login/index.html?return=${encodeURIComponent(window.location.pathname)}`);
    return;
  }
  $('#viewtabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-vista]');
    if (!button) return;
    vistaAgenda = button.dataset.vista;
    $$('#viewtabs button').forEach((item) => item.classList.toggle('is-active', item === button));
    cargarAgenda();
  });
  $('#fecha-prev').addEventListener('click', () => { moverPeriodo(-1); cargarAgenda(); });
  $('#fecha-next').addEventListener('click', () => { moverPeriodo(1); cargarAgenda(); });
  $('#filtro-tipo').addEventListener('change', renderAgenda);
  $('#tbody-reservas').addEventListener('click', (event) => {
    const button = event.target.closest('[data-accion="ver"]');
    const reserva = button && reservasAgenda.find((item) => item.id === Number(button.dataset.id));
    if (reserva) verDetalle(reserva);
  });
  initSearch((query) => { queryAgenda = query; renderAgenda(); });
  cargarAgenda();
});
