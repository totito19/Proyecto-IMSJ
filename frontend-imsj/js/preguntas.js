let preguntas = [];
let queryPreguntas = '';

function preguntasFiltradas() {
  if (!queryPreguntas) return preguntas;
  return preguntas.filter((item) =>
    [item.pregunta, item.respuesta].join(' ').toLowerCase().includes(queryPreguntas));
}

function renderPreguntas() {
  const data = preguntasFiltradas();
  $('#tbody-preguntas').innerHTML = data.map((item, index) => `
    <tr>
      <td class="col-num">${String(index + 1).padStart(2, '0')}</td>
      <td><div class="cell-question">${esc(item.pregunta)}</div></td>
      <td><div class="cell-answer">${esc(item.respuesta)}</div></td>
      <td>${badge(item.estado === 'PUBLICADO' ? 'visible' : 'oculta')}</td>
      <td><div class="actions">
        ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: item.id } })}
        ${actionBtn(item.estado === 'PUBLICADO' ? 'eye-off' : 'eye',
                    item.estado === 'PUBLICADO' ? 'Ocultar' : 'Mostrar',
                    { data: { accion: 'toggle', id: item.id } })}
        ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: item.id } })}
      </div></td>
    </tr>`).join('');
  $('#empty-preguntas').hidden = data.length > 0;
  $('#contador-preguntas').textContent = preguntas.length;
  hydrateIcons($('#tbody-preguntas'));
}

function abrirFormularioPregunta(item) {
  $('#form-pregunta').reset();
  $('#modal-pregunta-title').textContent = item ? 'Editar pregunta frecuente' : 'Nueva pregunta frecuente';
  $('#p-id').value = item ? item.id : '';
  $('#p-pregunta').value = item ? item.pregunta : '';
  $('#p-respuesta').value = item ? item.respuesta : '';
  Modal.open('modal-pregunta');
}

async function cargarPreguntas() {
  try {
    const payload = await ImsjApi.request('/preguntas');
    preguntas = Array.isArray(payload.preguntas) ? payload.preguntas : [];
    renderPreguntas();
  } catch (error) {
    alert(error.message);
  }
}

async function guardarPregunta(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const id = $('#p-id').value;
  try {
    await ImsjApi.request(id ? `/preguntas/${id}` : '/preguntas', {
      method: id ? 'PUT' : 'POST',
      body: {
        pregunta: $('#p-pregunta').value.trim(),
        respuesta: $('#p-respuesta').value.trim(),
      },
    });
    Modal.close('modal-pregunta');
    await cargarPreguntas();
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!usuario || usuario.rol !== 'PERSONAL_IMSJ') {
    window.location.assign(`/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`);
    return;
  }
  $('#btn-nueva-pregunta').addEventListener('click', () => abrirFormularioPregunta(null));
  $('#form-pregunta').addEventListener('submit', guardarPregunta);
  $('#tbody-preguntas').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion]');
    if (!button) return;
    const item = preguntas.find((pregunta) => pregunta.id === Number(button.dataset.id));
    if (!item) return;
    if (button.dataset.accion === 'editar') abrirFormularioPregunta(item);
    if (button.dataset.accion === 'toggle') {
      await ImsjApi.request(`/preguntas/${item.id}/estado`, {
        method: 'PATCH',
        body: { estado: item.estado === 'PUBLICADO' ? 'NO_PUBLICADO' : 'PUBLICADO' },
      });
      await cargarPreguntas();
    }
    if (button.dataset.accion === 'eliminar' && confirm('¿Eliminar esta pregunta frecuente?')) {
      await ImsjApi.request(`/preguntas/${item.id}`, { method: 'DELETE' });
      await cargarPreguntas();
    }
  });
  initSearch((query) => { queryPreguntas = query; renderPreguntas(); });
  cargarPreguntas();
});
