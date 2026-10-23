/** Preguntas frecuentes y recorrido Borrador -> Pendiente -> Aprobado -> Publicado. */

let preguntas = [];
let queryPreguntas = '';

/** Devuelve las preguntas frecuentes que coinciden con el texto buscado. */
function preguntasFiltradas() {
  if (!queryPreguntas) return preguntas;
  return preguntas.filter((item) =>
    [item.pregunta, item.respuesta, item.categoria, item.estado]
      .join(' ')
      .toLowerCase()
      .includes(queryPreguntas),
  );
}

/** Actualiza las sugerencias con las categorías que ya existen en el sistema. */
function renderCategoriasPregunta() {
  const categories = [...new Set(preguntas.map((item) => item.categoria).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, 'es'),
  );
  $('#p-categorias').replaceChildren(
    ...categories.map((category) => {
      const option = document.createElement('option');
      option.value = category;
      return option;
    }),
  );
}

/** Convierte el estado de negocio a la variante visual del badge. */
function estadoPreguntaVista(estado) {
  return (
    { BORRADOR: 'borrador', PENDIENTE: 'pendiente', APROBADO: 'aprobado', PUBLICADO: 'publicada' }[
      estado
    ] || 'borrador'
  );
}

/** Confirma las transiciones editoriales antes de modificar la publicación. */
function confirmarCambioEstadoPregunta(item, estado) {
  const messages = {
    PENDIENTE: '¿Enviar esta pregunta frecuente a revisión?',
    APROBADO: '¿Aprobar esta pregunta frecuente?',
    PUBLICADO: '¿Publicar esta pregunta frecuente en el portal?',
    BORRADOR: '¿Retirar esta pregunta frecuente del portal?',
  };
  return ImsjForms.confirm(messages[estado] || '¿Confirmar esta acción?');
}

/** Determina la próxima transición editorial disponible para la pregunta. */
function accionFlujoPregunta(item) {
  const directora = ImsjApi.currentUser()?.rol === 'DIRECTORA';
  if (item.estado === 'BORRADOR') {
    return actionBtn('send', 'Enviar a revisión', {
      labeled: true,
      data: { accion: 'estado', estado: 'PENDIENTE', id: item.id },
    });
  }
  if (item.estado === 'PENDIENTE' && directora) {
    return actionBtn('check-circle', 'Aprobar', {
      labeled: true,
      data: { accion: 'estado', estado: 'APROBADO', id: item.id },
    });
  }
  if (item.estado === 'PENDIENTE') return '<span class="self-label">Pendiente de Directora</span>';
  if (item.estado === 'APROBADO') {
    return actionBtn('eye', 'Publicar', {
      labeled: true,
      data: { accion: 'estado', estado: 'PUBLICADO', id: item.id },
    });
  }
  if (item.estado === 'PUBLICADO') {
    return actionBtn('eye-off', 'Retirar', {
      labeled: true,
      data: { accion: 'estado', estado: 'BORRADOR', id: item.id },
    });
  }
  return '';
}

/** Construye la tabla con contenido escapado y acciones autorizadas. */
function renderPreguntas() {
  const data = preguntasFiltradas();
  $('#tbody-preguntas').innerHTML = data
    .map(
      (item, index) => `
    <tr>
      <td class="col-num">${String(index + 1).padStart(2, '0')}</td>
      <td><div class="cell-question">${esc(item.pregunta)}</div></td>
      <td><span class="category-label">${esc(item.categoria || 'General')}</span></td>
      <td><div class="cell-answer">${esc(item.respuesta)}</div></td>
      <td>${badge(estadoPreguntaVista(item.estado))}</td>
      <td><div class="actions">
        ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: item.id } })}
        ${accionFlujoPregunta(item)}
        ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: item.id } })}
      </div></td>
    </tr>`,
    )
    .join('');
  $('#empty-preguntas').hidden = data.length > 0;
  $('#contador-preguntas').textContent = preguntas.length;
  renderCategoriasPregunta();
  hydrateIcons($('#tbody-preguntas'));
}

/** Prepara el modal para una pregunta nueva o para editar una existente. */
function abrirFormularioPregunta(item) {
  $('#form-pregunta').reset();
  $('#modal-pregunta-title').textContent = item
    ? 'Editar pregunta frecuente'
    : 'Nueva pregunta frecuente';
  $('#p-id').value = item ? item.id : '';
  $('#p-pregunta').value = item ? item.pregunta : '';
  $('#p-respuesta').value = item ? item.respuesta : '';
  $('#p-categoria').value = item?.categoria || 'General';
  Modal.open('modal-pregunta');
}

/** Carga desde la API todas las preguntas frecuentes del panel. */
async function cargarPreguntas() {
  try {
    const payload = await ImsjApi.request('/preguntas');
    preguntas = Array.isArray(payload.preguntas) ? payload.preguntas : [];
    renderPreguntas();
  } catch (error) {
    ImsjForms.notify(error.message);
  }
}

/** Envía un alta o una edición según exista un id en el formulario. */
async function guardarPregunta(event) {
  event.preventDefault();
  if (!ImsjForms.validate(event.currentTarget)) return;
  const id = $('#p-id').value;
  try {
    await ImsjApi.request(id ? `/preguntas/${id}` : '/preguntas', {
      method: id ? 'PUT' : 'POST',
      body: {
        pregunta: $('#p-pregunta').value.trim(),
        respuesta: $('#p-respuesta').value.trim(),
        categoria: $('#p-categoria').value.trim(),
      },
    });
    Modal.close('modal-pregunta');
    await cargarPreguntas();
  } catch (error) {
    ImsjForms.notify(error.message);
  }
}

// Inicializa formulario, búsqueda y acciones delegadas de la tabla.
document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!ImsjApi.isStaff(usuario)) {
    window.location.assign(
      `/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`,
    );
    return;
  }
  $('#btn-nueva-pregunta').addEventListener('click', () => abrirFormularioPregunta(null));
  $('#form-pregunta').addEventListener('submit', guardarPregunta);
  $('#tbody-preguntas').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion]');
    if (!button) return;
    const item = preguntas.find((pregunta) => pregunta.id === Number(button.dataset.id));
    if (!item) return;
    if (button.dataset.accion === 'editar') {
      abrirFormularioPregunta(item);
      return;
    }
    try {
      if (button.dataset.accion === 'estado') {
        if (!await confirmarCambioEstadoPregunta(item, button.dataset.estado)) return;
        await ImsjApi.request(`/preguntas/${item.id}/estado`, {
          method: 'PATCH',
          body: { estado: button.dataset.estado },
        });
      }
      if (button.dataset.accion === 'eliminar') {
        if (!await ImsjForms.confirm('¿Eliminar esta pregunta frecuente?')) return;
        await ImsjApi.request(`/preguntas/${item.id}`, { method: 'DELETE' });
      }
      await cargarPreguntas();
    } catch (error) {
      ImsjForms.notify(error.message);
    }
  });
  initSearch((query) => {
    queryPreguntas = query;
    renderPreguntas();
  });
  cargarPreguntas();
});
