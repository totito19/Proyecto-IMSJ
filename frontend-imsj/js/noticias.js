/* Noticias administrativas conectadas a la API PHP/PDO. */

let noticias = [];
let queryNoticias = '';
let noticiaEnEdicion = null;

/** Traduce el estado del backend a la clase visual que utiliza la interfaz. */
function estadoVista(estado) {
  return (
    { BORRADOR: 'borrador', PENDIENTE: 'pendiente', APROBADO: 'aprobado', PUBLICADO: 'publicada' }[
      estado
    ] || 'borrador'
  );
}

/** Recorta textos extensos para mantener uniforme la lista de noticias. */
function resumen(texto) {
  return texto.length > 110 ? `${texto.slice(0, 110)}…` : texto;
}

/** Presenta mensajes de operación y aplica el estilo de error cuando corresponde. */
function mostrarEstado(message = '', isError = false) {
  const status = $('#noticias-status');
  status.textContent = message;
  status.hidden = !message;
  status.style.color = isError ? '#b91c1c' : '';
}

/** Muestra los errores de guardado dentro del modal, donde permanecen visibles. */
function mostrarErrorFormulario(message = '') {
  const error = $('#n-form-error');
  error.textContent = message;
  error.hidden = !message;
}

/** Devuelve la fecha civil local sin el desplazamiento que produce toISOString(). */
function fechaLocalHoy() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Pide confirmación antes de ejecutar una transición editorial. */
function confirmarCambioEstado(noticia, estado) {
  const messages = {
    PENDIENTE: `¿Enviar la noticia "${noticia.titulo}" a revisión?`,
    APROBADO: `¿Aprobar la noticia "${noticia.titulo}"?`,
    PUBLICADO: `¿Publicar la noticia "${noticia.titulo}" en el portal?`,
    BORRADOR: `¿Retirar la noticia "${noticia.titulo}" del portal?`,
  };
  return ImsjForms.confirm(messages[estado] || '¿Confirmar esta acción?');
}

/** Aplica la búsqueda sobre título, texto y estado sin volver a consultar la API. */
function noticiasFiltradas() {
  if (!queryNoticias) return noticias;
  return noticias.filter((noticia) =>
    [noticia.titulo, noticia.texto, noticia.estado].join(' ').toLowerCase().includes(queryNoticias),
  );
}

/** Calcula la siguiente acción editorial permitida para una noticia. */
function accionFlujo(noticia) {
  const directora = ImsjApi.currentUser()?.rol === 'DIRECTORA';
  if (noticia.estado === 'BORRADOR') {
    return actionBtn('send', 'Enviar a revisión', {
      labeled: true,
      data: { accion: 'estado', estado: 'PENDIENTE', id: noticia.id },
    });
  }
  if (noticia.estado === 'PENDIENTE' && directora) {
    return actionBtn('check-circle', 'Aprobar', {
      labeled: true,
      data: { accion: 'estado', estado: 'APROBADO', id: noticia.id },
    });
  }
  if (noticia.estado === 'PENDIENTE')
    return '<span class="self-label">Pendiente de Directora</span>';
  if (noticia.estado === 'APROBADO') {
    return actionBtn('eye', 'Publicar', {
      labeled: true,
      data: { accion: 'estado', estado: 'PUBLICADO', id: noticia.id },
    });
  }
  if (noticia.estado === 'PUBLICADO') {
    return actionBtn('eye-off', 'Retirar', {
      labeled: true,
      data: { accion: 'estado', estado: 'BORRADOR', id: noticia.id },
    });
  }
  return '';
}

/** Dibuja la lista administrativa con datos escapados y acciones según el estado. */
function renderNoticias() {
  const data = noticiasFiltradas();
  $('#tbody-noticias').innerHTML = data
    .map(
      (noticia) => `
    <tr>
      <td><div class="cell-title">${esc(noticia.titulo)}</div><div class="cell-sub">${esc(resumen(noticia.texto))}</div></td>
      <td>${badge(estadoVista(noticia.estado))}</td>
      <td class="muted">${esc(formatDate(noticia.fecha_fin_vigencia))}</td>
      <td class="dim">${esc(formatDate(noticia.fecha_inicio_vigencia))}</td>
      <td><div class="actions">
        ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: noticia.id } })}
        ${accionFlujo(noticia)}
        ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: noticia.id } })}
      </div></td>
    </tr>`,
    )
    .join('');
  $('#empty-noticias').hidden = data.length > 0;
  $('#contador-noticias').textContent = noticias.length;
  hydrateIcons($('#tbody-noticias'));
}

/** Recupera todas las noticias administrativas y actualiza la pantalla. */
async function cargarNoticias() {
  mostrarEstado('Cargando noticias...');
  try {
    const payload = await ImsjApi.request('/noticias');
    noticias = payload.noticias || [];
    mostrarEstado();
    renderNoticias();
  } catch (error) {
    if (error.status === 401) {
      window.location.href = '../frontend-publico/login.html#admin';
      return;
    }
    mostrarEstado(error.message, true);
  }
}

/** Reinicia el formulario o lo completa con la noticia que se desea editar. */
function abrirFormulario(noticia = null) {
  noticiaEnEdicion = noticia;
  const today = fechaLocalHoy();
  $('#modal-noticia-title').textContent = noticia ? 'Editar noticia' : 'Nueva noticia';
  $('#btn-guardar-noticia').textContent = noticia ? 'Guardar cambios' : 'Guardar borrador';
  $('#n-titulo').value = noticia?.titulo || '';
  $('#n-cuerpo').value = noticia?.texto || '';
  $('#n-vigencia').value = noticia?.fecha_fin_vigencia || '';
  $('#n-vigencia').min = today;
  $('#n-vigencia').setCustomValidity('');
  $('#n-portada').value = '';
  mostrarErrorFormulario();
  $('#n-flujo-nota').textContent =
    noticia && noticia.estado !== 'BORRADOR'
      ? 'Al editar, la noticia vuelve a Borrador y debe aprobarse otra vez.'
      : 'La noticia se guarda como Borrador. Luego se envía a revisión.';
  $('[data-file-label]', $('#modal-noticia')).textContent = 'Seleccionar imagen...';
  Modal.open('modal-noticia');
}

/** Envía texto, fechas, enlaces e imágenes mediante FormData. */
async function guardarNoticia(event) {
  event.preventDefault();
  const form = $('#form-noticia');
  const vigencia = $('#n-vigencia');
  vigencia.setCustomValidity('');
  if (vigencia.value && vigencia.value < fechaLocalHoy()) {
    const message = 'La vigencia no puede ser anterior a la fecha actual.';
    vigencia.setCustomValidity(message);
    mostrarErrorFormulario(message);
  }
  if (!ImsjForms.validate(form)) return;
  const button = $('#btn-guardar-noticia');
  const buttonLabel = button.textContent;
  const data = new FormData();
  const cover = $('#n-portada').files[0];
  data.append('titulo', $('#n-titulo').value.trim());
  data.append('texto', $('#n-cuerpo').value.trim());
  data.append(
    'fecha_inicio_vigencia',
    noticiaEnEdicion?.fecha_inicio_vigencia || fechaLocalHoy(),
  );
  data.append('fecha_fin_vigencia', vigencia.value);
  if (cover) data.append('imagen_portada', cover);
  button.disabled = true;
  button.textContent = 'Guardando...';
  mostrarErrorFormulario();
  try {
    if (noticiaEnEdicion) {
      data.append('_method', 'PUT');
      await ImsjApi.request(`/noticias/${noticiaEnEdicion.id}`, { method: 'POST', body: data });
    } else {
      await ImsjApi.request('/noticias', { method: 'POST', body: data });
    }
    Modal.close('modal-noticia');
    form.reset();
    noticiaEnEdicion = null;
    await cargarNoticias();
  } catch (error) {
    mostrarErrorFormulario(error.message);
  } finally {
    button.disabled = false;
    button.textContent = buttonLabel;
  }
}

/** Resuelve desde un único listener las acciones de editar, cambiar estado o eliminar. */
async function manejarAccion(event) {
  const button = event.target.closest('[data-accion]');
  if (!button) return;
  const noticia = noticias.find((item) => item.id === Number(button.dataset.id));
  if (!noticia) return;
  if (button.dataset.accion === 'editar') {
    abrirFormulario(noticia);
    return;
  }
  try {
    if (button.dataset.accion === 'estado') {
      if (!await confirmarCambioEstado(noticia, button.dataset.estado)) return;
      await ImsjApi.request(`/noticias/${noticia.id}/estado`, {
        method: 'PATCH',
        body: { estado: button.dataset.estado },
      });
    }
    if (button.dataset.accion === 'eliminar') {
      if (!await ImsjForms.confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) return;
      await ImsjApi.request(`/noticias/${noticia.id}`, { method: 'DELETE' });
    }
    await cargarNoticias();
  } catch (error) {
    mostrarEstado(error.message, true);
  }
}

// Comprueba la sesión, conecta eventos y realiza la primera carga de noticias.
document.addEventListener('DOMContentLoaded', async () => {
  if (!ImsjApi.isStaff()) {
    window.location.href = '../frontend-publico/login.html#admin';
    return;
  }
  $('#btn-nueva-noticia').addEventListener('click', () => abrirFormulario());
  $('#form-noticia').addEventListener('submit', guardarNoticia);
  $('#n-vigencia').addEventListener('input', (event) => {
    event.currentTarget.setCustomValidity('');
    mostrarErrorFormulario();
  });
  $('#tbody-noticias').addEventListener('click', manejarAccion);
  $('[data-file]', $('#modal-noticia')).addEventListener('click', function () {
    const input = document.getElementById(this.dataset.file);
    input.click();
    input.onchange = () => {
      $('[data-file-label]', this).textContent = input.files[0]
        ? input.files[0].name
        : 'Seleccionar imagen...';
    };
  });
  initSearch((query) => {
    queryNoticias = query;
    renderNoticias();
  });
  await cargarNoticias();
});
