/** ABM de preguntas del simulador, incluidas sus opciones e imagen opcional. */

let preguntasPrueba = [];
let queryPrueba = '';

/** Aplica la búsqueda al enunciado y a las cuatro opciones de cada pregunta. */
function preguntasPruebaFiltradas() {
  if (!queryPrueba) return preguntasPrueba;
  return preguntasPrueba.filter((item) =>
    [item.pregunta, ...Object.values(item.opciones)].join(' ').toLowerCase().includes(queryPrueba),
  );
}

/** Genera la tabla del banco de preguntas y actualiza su contador. */
function renderPreguntasPrueba() {
  const data = preguntasPruebaFiltradas();
  $('#tbody-prueba').innerHTML = data
    .map(
      (item, index) => `
    <tr>
      <td class="col-num">${String(index + 1).padStart(2, '0')}</td>
      <td><div class="cell-question">${esc(item.pregunta)}</div></td>
      <td>${item.imagen ? `<img class="question-thumb" src="${esc(item.imagen)}" alt="Gráfico de la pregunta">` : '<span class="dim">Sin gráfico</span>'}</td>
      <td><span class="answer-key">${esc(item.respuesta_correcta)} · ${esc(item.opciones[item.respuesta_correcta])}</span></td>
      <td><div class="actions">
        ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: item.id } })}
        ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: item.id } })}
      </div></td>
    </tr>`,
    )
    .join('');
  $('#empty-prueba').hidden = data.length > 0;
  $('#contador-prueba').textContent = preguntasPrueba.length;
  hydrateIcons($('#tbody-prueba'));
}

/** Abre el formulario vacío o carga pregunta, opciones, respuesta e imagen actuales. */
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
  $('#pp-imagen').value = '';
  $('#pp-imagen-label').textContent = 'Seleccionar imagen...';
  $('#pp-quitar-imagen').checked = false;
  $('#pp-quitar-wrap').hidden = !item?.imagen;
  $('#pp-imagen-actual').hidden = !item?.imagen;
  if (item?.imagen) $('#pp-imagen-actual').src = item.imagen;
  Modal.open('modal-pregunta-prueba');
}

/** Solicita a la API el banco administrativo completo. */
async function cargarPreguntasPrueba() {
  try {
    const payload = await ImsjApi.request('/preguntas-prueba');
    preguntasPrueba = Array.isArray(payload.preguntas) ? payload.preguntas : [];
    renderPreguntasPrueba();
  } catch (error) {
    alert(error.message);
  }
}

/** Construye FormData y crea o edita la pregunta, incluida su imagen opcional. */
async function guardarPreguntaPrueba(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const id = $('#pp-id').value;
  const data = new FormData();
  data.append('pregunta', $('#pp-pregunta').value.trim());
  data.append('opcion_a', $('#pp-a').value.trim());
  data.append('opcion_b', $('#pp-b').value.trim());
  data.append('opcion_c', $('#pp-c').value.trim());
  data.append('opcion_d', $('#pp-d').value.trim());
  data.append('respuesta_correcta', $('#pp-correcta').value);
  if ($('#pp-imagen').files[0]) data.append('imagen', $('#pp-imagen').files[0]);
  if ($('#pp-quitar-imagen').checked) data.append('eliminar_imagen', '1');
  if (id) data.append('_method', 'PUT');
  try {
    await ImsjApi.request(id ? `/preguntas-prueba/${id}` : '/preguntas-prueba', {
      method: 'POST',
      body: data,
    });
    Modal.close('modal-pregunta-prueba');
    await cargarPreguntasPrueba();
  } catch (error) {
    alert(error.message);
  }
}

// Conecta buscador, selector de imagen, formulario y acciones de cada fila.
document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!ImsjApi.isStaff(usuario)) {
    window.location.assign(
      `/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`,
    );
    return;
  }

  $('#btn-nueva-pregunta-prueba').addEventListener('click', () => abrirPreguntaPrueba(null));
  $('#pp-imagen-boton').addEventListener('click', () => $('#pp-imagen').click());
  $('#pp-imagen').addEventListener('change', (event) => {
    $('#pp-imagen-label').textContent = event.target.files[0]?.name || 'Seleccionar imagen...';
    if (event.target.files[0]) $('#pp-quitar-imagen').checked = false;
  });
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
  initSearch((query) => {
    queryPrueba = query;
    renderPreguntasPrueba();
  });
  cargarPreguntasPrueba();
});
