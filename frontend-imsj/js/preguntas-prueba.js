let preguntasPrueba = [];
let queryPrueba = '';

function preguntasPruebaFiltradas() {
  if (!queryPrueba) return preguntasPrueba;
  return preguntasPrueba.filter((item) =>
    [item.pregunta, ...Object.values(item.opciones)].join(' ').toLowerCase().includes(queryPrueba));
}

function renderPreguntasPrueba() {
  const data = preguntasPruebaFiltradas();
  $('#tbody-prueba').innerHTML = data.map((item, index) => `
    <tr>
      <td class="col-num">${String(index + 1).padStart(2, '0')}</td>
      <td><div class="cell-question">${esc(item.pregunta)}</div></td>
      <td><span class="answer-key">${esc(item.respuesta_correcta)} · ${esc(item.opciones[item.respuesta_correcta])}</span></td>
      <td><div class="actions">
        ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: item.id } })}
        ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: item.id } })}
      </div></td>
    </tr>`).join('');
  $('#empty-prueba').hidden = data.length > 0;
  $('#contador-prueba').textContent = preguntasPrueba.length;
  hydrateIcons($('#tbody-prueba'));
}

function abrirPreguntaPrueba(item) {
  $('#form-pregunta-prueba').reset();
  $('#modal-pregunta-prueba-title').textContent = item ? 'Editar pregunta' : 'Nueva pregunta';
  $('#pp-id').value = item?.id || '';
  $('#pp-pregunta').value = item?.pregunta || '';
  $('#pp-a').value = item?.opciones.A || '';
  $('#pp-b').value = item?.opciones.B || '';
  $('#pp-c').value = item?.opciones.C || '';
  $('#pp-d').value = item?.opciones.D || '';
  $('#pp-correcta').value = item?.respuesta_correcta || 'A';
  Modal.open('modal-pregunta-prueba');
}

async function cargarPreguntasPrueba() {
  try {
    const payload = await ImsjApi.request('/preguntas-prueba');
    preguntasPrueba = Array.isArray(payload.preguntas) ? payload.preguntas : [];
    renderPreguntasPrueba();
  } catch (error) {
    alert(error.message);
  }
}

async function guardarPreguntaPrueba(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const id = $('#pp-id').value;
  try {
    await ImsjApi.request(id ? `/preguntas-prueba/${id}` : '/preguntas-prueba', {
      method: id ? 'PUT' : 'POST',
      body: {
        pregunta: $('#pp-pregunta').value.trim(),
        opcion_a: $('#pp-a').value.trim(),
        opcion_b: $('#pp-b').value.trim(),
        opcion_c: $('#pp-c').value.trim(),
        opcion_d: $('#pp-d').value.trim(),
        respuesta_correcta: $('#pp-correcta').value,
      },
    });
    Modal.close('modal-pregunta-prueba');
    await cargarPreguntasPrueba();
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!usuario || usuario.rol !== 'PERSONAL_IMSJ') {
    window.location.assign(`/frontend-publico/Login.html?return=${encodeURIComponent(window.location.pathname)}`);
    return;
  }

  $('#btn-nueva-pregunta-prueba').addEventListener('click', () => abrirPreguntaPrueba(null));
  $('#form-pregunta-prueba').addEventListener('submit', guardarPreguntaPrueba);
  $('#tbody-prueba').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion]');
    if (!button) return;
    const item = preguntasPrueba.find((pregunta) => pregunta.id === Number(button.dataset.id));
    if (!item) return;
    if (button.dataset.accion === 'editar') abrirPreguntaPrueba(item);
    if (button.dataset.accion === 'eliminar' && confirm('¿Eliminar esta pregunta del banco?')) {
      try {
        await ImsjApi.request(`/preguntas-prueba/${item.id}`, { method: 'DELETE' });
        await cargarPreguntasPrueba();
      } catch (error) {
        alert(error.message);
      }
    }
  });
  initSearch((query) => { queryPrueba = query; renderPreguntasPrueba(); });
  cargarPreguntasPrueba();
});
