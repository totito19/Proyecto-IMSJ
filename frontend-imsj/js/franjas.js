const TIPO_BADGE = {
  PRUEBA_MANEJO: 'prueba',
  RENOVACION_NORMAL: 'renovacion-normal',
  RENOVACION_URGENTE: 'renovacion-urgente',
};

let franjas = [];
let queryFranjas = '';

function franjasFiltradas() {
  const tipo = $('#filtro-tipo').value;
  return franjas.filter((franja) => {
    const coincideTipo = tipo === 'todos' || franja.tipo === tipo;
    const coincideTexto = !queryFranjas ||
      [franja.fecha, franja.hora_inicio, franja.hora_fin, franja.tipo]
        .join(' ').toLowerCase().includes(queryFranjas);
    return coincideTipo && coincideTexto;
  });
}

function renderFranjas() {
  const data = franjasFiltradas();
  $('#tbody-franjas').innerHTML = data.map((franja) => {
    const disponibles = Number(franja.cupos_disponibles);
    const clase = disponibles === 0 ? 'avail--none' : disponibles <= 1 ? 'avail--low' : 'avail--ok';
    return `
      <tr>
        <td class="strong">${formatDate(franja.fecha)}</td>
        <td class="code">${esc(franja.hora_inicio)} – ${esc(franja.hora_fin)}</td>
        <td>${badge(TIPO_BADGE[franja.tipo])}</td>
        <td class="muted">${franja.cupos_totales}</td>
        <td class="muted">${franja.reservas_count}</td>
        <td><span class="avail ${clase}">${disponibles}</span></td>
        <td><div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: franja.id } })}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: franja.id } })}
        </div></td>
      </tr>`;
  }).join('');
  $('#empty-franjas').hidden = data.length > 0;
  $('#contador-franjas').textContent = franjas.length;
  hydrateIcons($('#tbody-franjas'));
}

function abrirFormularioFranja(franja) {
  $('#form-franja').reset();
  $('#modal-franja-title').textContent = franja ? 'Editar franja' : 'Nueva franja';
  $('#f-id').value = franja ? franja.id : '';
  $('#f-fecha').value = franja ? franja.fecha : '';
  $('#f-inicio').value = franja ? franja.hora_inicio : '';
  $('#f-fin').value = franja ? franja.hora_fin : '';
  $('#f-tipo').value = franja ? franja.tipo : 'RENOVACION_NORMAL';
  $('#f-cupos').value = franja ? franja.cupos_totales : 6;
  Modal.open('modal-franja');
}

async function cargarFranjas() {
  try {
    const payload = await ImsjApi.request('/franjas');
    franjas = Array.isArray(payload.franjas) ? payload.franjas : [];
    renderFranjas();
  } catch (error) {
    alert(error.message);
  }
}

async function guardarFranja(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  if ($('#f-fin').value <= $('#f-inicio').value) {
    alert('La hora de fin debe ser posterior a la hora de inicio.');
    return;
  }
  const id = $('#f-id').value;
  try {
    await ImsjApi.request(id ? `/franjas/${id}` : '/franjas', {
      method: id ? 'PUT' : 'POST',
      body: {
        fecha: $('#f-fecha').value,
        hora_inicio: $('#f-inicio').value,
        hora_fin: $('#f-fin').value,
        tipo: $('#f-tipo').value,
        cupos_totales: Number($('#f-cupos').value),
      },
    });
    Modal.close('modal-franja');
    await cargarFranjas();
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
  $('#f-fecha').min = new Date().toISOString().slice(0, 10);
  $('#btn-nueva-franja').addEventListener('click', () => abrirFormularioFranja(null));
  $('#form-franja').addEventListener('submit', guardarFranja);
  $('#filtro-tipo').addEventListener('change', renderFranjas);
  $('#tbody-franjas').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion]');
    if (!button) return;
    const franja = franjas.find((item) => item.id === Number(button.dataset.id));
    if (!franja) return;
    if (button.dataset.accion === 'editar') abrirFormularioFranja(franja);
    if (button.dataset.accion === 'eliminar' && confirm('¿Eliminar esta franja?')) {
      try {
        await ImsjApi.request(`/franjas/${franja.id}`, { method: 'DELETE' });
        await cargarFranjas();
      } catch (error) {
        alert(error.message);
      }
    }
  });
  initSearch((query) => { queryFranjas = query; renderFranjas(); });
  cargarFranjas();
});
