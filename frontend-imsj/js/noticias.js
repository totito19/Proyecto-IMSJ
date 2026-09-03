/* Noticias administrativas conectadas a la API Laravel. */

let noticias = [];
let queryNoticias = '';
let noticiaEnEdicion = null;

function estadoVista(estado) {
  return estado === 'PUBLICADO' ? 'publicada' : 'borrador';
}

function resumen(texto) {
  return texto.length > 110 ? `${texto.slice(0, 110)}…` : texto;
}

function mostrarEstado(message = '', isError = false) {
  const status = $('#noticias-status');
  status.textContent = message;
  status.hidden = !message;
  status.style.color = isError ? '#b91c1c' : '';
}

function noticiasFiltradas() {
  if (!queryNoticias) return noticias;
  return noticias.filter((noticia) =>
    [noticia.titulo, noticia.texto, noticia.estado]
      .join(' ').toLowerCase().includes(queryNoticias));
}

function renderNoticias() {
  const tbody = $('#tbody-noticias');
  const data = noticiasFiltradas();

  tbody.innerHTML = data.map((noticia) => {
    const estado = estadoVista(noticia.estado);
    return `
      <tr>
        <td>
          <div class="cell-title">${esc(noticia.titulo)}</div>
          <div class="cell-sub">${esc(resumen(noticia.texto))}</div>
        </td>
        <td>${badge(estado)}</td>
        <td class="muted">${esc(formatDate(noticia.fecha_fin_vigencia))}</td>
        <td class="dim">${esc(formatDate(noticia.fecha_inicio_vigencia))}</td>
        <td>
          <div class="actions">
            ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: noticia.id } })}
            ${actionBtn(estado === 'publicada' ? 'eye-off' : 'eye',
                        estado === 'publicada' ? 'Despublicar' : 'Publicar',
                        { data: { accion: 'toggle', id: noticia.id } })}
            ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: noticia.id } })}
          </div>
        </td>
      </tr>`;
  }).join('');

  $('#empty-noticias').hidden = data.length > 0;
  $('#contador-noticias').textContent = noticias.length;
}

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

function abrirFormulario(noticia = null) {
  noticiaEnEdicion = noticia;
  $('#modal-noticia-title').textContent = noticia ? 'Editar noticia' : 'Nueva noticia';
  $('#btn-guardar-noticia').textContent = noticia ? 'Guardar cambios' : 'Guardar noticia';
  $('#n-titulo').value = noticia ? noticia.titulo : '';
  $('#n-cuerpo').value = noticia ? noticia.texto : '';
  $('#n-estado').value = noticia ? estadoVista(noticia.estado) : 'borrador';
  $('#n-vigencia').value = noticia ? noticia.fecha_fin_vigencia : '';
  $('#n-portada').value = '';
  $('[data-file-label]', $('#modal-noticia')).textContent = 'Seleccionar imagen...';
  Modal.open('modal-noticia');
}

async function guardarNoticia(event) {
  event.preventDefault();
  const form = $('#form-noticia');
  if (!form.reportValidity()) return;

  const button = $('#btn-guardar-noticia');
  const data = new FormData();
  const cover = $('#n-portada').files[0];

  data.append('titulo', $('#n-titulo').value.trim());
  data.append('texto', $('#n-cuerpo').value.trim());
  data.append('fecha_inicio_vigencia', noticiaEnEdicion?.fecha_inicio_vigencia || new Date().toISOString().slice(0, 10));
  data.append('fecha_fin_vigencia', $('#n-vigencia').value);
  if (cover) data.append('imagen_portada', cover);

  button.disabled = true;
  mostrarEstado('Guardando noticia...');

  try {
    let payload;
    if (noticiaEnEdicion) {
      data.append('_method', 'PUT');
      payload = await ImsjApi.request(`/noticias/${noticiaEnEdicion.id}`, {
        method: 'POST',
        body: data,
      });
    } else {
      payload = await ImsjApi.request('/noticias', { method: 'POST', body: data });
    }

    const estadoDeseado = $('#n-estado').value === 'publicada' ? 'PUBLICADO' : 'NO_PUBLICADO';
    if (payload.noticia.estado !== estadoDeseado) {
      await ImsjApi.request(`/noticias/${payload.noticia.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: estadoDeseado }),
      });
    }

    Modal.close('modal-noticia');
    form.reset();
    noticiaEnEdicion = null;
    await cargarNoticias();
  } catch (error) {
    mostrarEstado(error.message, true);
  } finally {
    button.disabled = false;
  }
}

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
    if (button.dataset.accion === 'toggle') {
      const estado = noticia.estado === 'PUBLICADO' ? 'NO_PUBLICADO' : 'PUBLICADO';
      await ImsjApi.request(`/noticias/${noticia.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
    }

    if (button.dataset.accion === 'eliminar') {
      if (!confirm(`¿Eliminar la noticia "${noticia.titulo}"?`)) return;
      await ImsjApi.request(`/noticias/${noticia.id}`, { method: 'DELETE' });
    }

    await cargarNoticias();
  } catch (error) {
    mostrarEstado(error.message, true);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (ImsjApi.currentUser()?.rol !== 'PERSONAL_IMSJ') {
    window.location.href = '../frontend-publico/login.html#admin';
    return;
  }

  $('#btn-nueva-noticia').addEventListener('click', () => abrirFormulario());
  $('#form-noticia').addEventListener('submit', guardarNoticia);
  $('#tbody-noticias').addEventListener('click', manejarAccion);

  $('[data-file]', $('#modal-noticia')).addEventListener('click', function () {
    const input = document.getElementById(this.dataset.file);
    input.click();
    input.onchange = () => {
      $('[data-file-label]', this).textContent = input.files[0]
        ? input.files[0].name : 'Seleccionar imagen...';
    };
  });

  initSearch((query) => {
    queryNoticias = query;
    renderNoticias();
  });

  await cargarNoticias();
});
