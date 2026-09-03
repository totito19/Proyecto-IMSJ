const ICONO_TIPO = { PDF: 'file-text', IMAGEN: 'image', VIDEO: 'video' };

let materiales = [];
let queryMateriales = '';

function asegurarPersonal() {
  const usuario = ImsjApi.currentUser();
  if (!usuario || usuario.rol !== 'PERSONAL_IMSJ') {
    window.location.assign(`/frontend-publico/Login.html?return=${encodeURIComponent(window.location.pathname)}`);
    return false;
  }
  return true;
}

function materialesFiltrados() {
  if (!queryMateriales) return materiales;
  return materiales.filter((material) =>
    [material.nombre, material.tipo, material.estado]
      .join(' ').toLowerCase().includes(queryMateriales));
}

function renderMateriales() {
  const data = materialesFiltrados();
  $('#lista-materiales').innerHTML = data.map((material) => `
    <article class="material">
      <div class="material__icon">${icon(ICONO_TIPO[material.tipo] || 'file-text', 14)}</div>
      <div class="material__body">
        <div class="material__name">${esc(material.nombre)}</div>
        <a class="material__link" href="${esc(material.ubicacion_recurso)}" target="_blank" rel="noopener noreferrer">Abrir recurso</a>
      </div>
      <div class="material__right">
        ${badge(material.estado === 'PUBLICADO' ? 'publicada' : 'borrador')}
        <div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: material.id } })}
          ${actionBtn(material.estado === 'PUBLICADO' ? 'eye-off' : 'eye',
                      material.estado === 'PUBLICADO' ? 'Despublicar' : 'Publicar',
                      { data: { accion: 'toggle', id: material.id } })}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: material.id } })}
        </div>
      </div>
    </article>`).join('');
  $('#empty-materiales').hidden = data.length > 0;
  $('#contador-materiales').textContent = materiales.length;
  hydrateIcons($('#lista-materiales'));
}

function alternarCampoOrigen() {
  const esVideo = $('#m-tipo').value === 'VIDEO';
  const esNuevo = !$('#m-id').value;
  $('#campo-archivo').hidden = esVideo;
  $('#campo-url').hidden = !esVideo;
  $('#m-url').required = esVideo && esNuevo;
  $('#m-archivo').required = !esVideo && esNuevo;
  $('#m-archivo').accept = $('#m-tipo').value === 'PDF' ? '.pdf' : '.jpg,.jpeg,.png,.webp';
}

function abrirFormularioMaterial(material) {
  $('#form-material').reset();
  $('#modal-material-title').textContent = material ? 'Editar material' : 'Nuevo material';
  $('#m-id').value = material ? material.id : '';
  $('#m-nombre').value = material ? material.nombre : '';
  $('#m-tipo').value = material ? material.tipo : 'PDF';
  $('#m-estado').value = material ? material.estado : 'NO_PUBLICADO';
  $('#m-url').value = material && material.tipo === 'VIDEO' ? material.ubicacion_recurso : '';
  $('[data-file-label]', $('#modal-material')).textContent = material ? 'Conservar archivo actual' : 'Seleccionar archivo...';
  alternarCampoOrigen();
  Modal.open('modal-material');
}

async function cargarMateriales() {
  try {
    const payload = await ImsjApi.request('/materiales');
    materiales = Array.isArray(payload.materiales) ? payload.materiales : [];
    renderMateriales();
  } catch (error) {
    alert(error.message);
  }
}

async function guardarMaterial(event) {
  event.preventDefault();
  const form = $('#form-material');
  if (!form.reportValidity()) return;

  const id = $('#m-id').value;
  const estadoDeseado = $('#m-estado').value;
  const actual = materiales.find((material) => String(material.id) === id);
  const data = new FormData();
  data.append('nombre', $('#m-nombre').value.trim());
  data.append('tipo', $('#m-tipo').value);
  if ($('#m-tipo').value === 'VIDEO') {
    if ($('#m-url').value.trim()) data.append('ubicacion_recurso', $('#m-url').value.trim());
  } else if ($('#m-archivo').files[0]) {
    data.append('archivo', $('#m-archivo').files[0]);
  }
  if (id) data.append('_method', 'PUT');

  try {
    const payload = await ImsjApi.request(id ? `/materiales/${id}` : '/materiales', {
      method: 'POST',
      body: data,
    });
    const guardado = payload.material;
    const estadoActual = actual ? actual.estado : guardado.estado;
    if (estadoDeseado !== estadoActual) {
      await ImsjApi.request(`/materiales/${guardado.id}/estado`, {
        method: 'PATCH',
        body: { estado: estadoDeseado },
      });
    }
    Modal.close('modal-material');
    await cargarMateriales();
  } catch (error) {
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!asegurarPersonal()) return;
  $('#btn-nuevo-material').addEventListener('click', () => abrirFormularioMaterial(null));
  $('#form-material').addEventListener('submit', guardarMaterial);
  $('#m-tipo').addEventListener('change', alternarCampoOrigen);
  $('[data-file]', $('#modal-material')).addEventListener('click', function () {
    const input = document.getElementById(this.dataset.file);
    input.click();
    input.onchange = () => {
      $('[data-file-label]', this).textContent = input.files[0] ? input.files[0].name : 'Seleccionar archivo...';
    };
  });
  $('#lista-materiales').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion]');
    if (!button) return;
    const material = materiales.find((item) => item.id === Number(button.dataset.id));
    if (!material) return;
    if (button.dataset.accion === 'editar') abrirFormularioMaterial(material);
    if (button.dataset.accion === 'toggle') {
      await ImsjApi.request(`/materiales/${material.id}/estado`, {
        method: 'PATCH',
        body: { estado: material.estado === 'PUBLICADO' ? 'NO_PUBLICADO' : 'PUBLICADO' },
      });
      await cargarMateriales();
    }
    if (button.dataset.accion === 'eliminar' && confirm(`¿Eliminar "${material.nombre}"?`)) {
      await ImsjApi.request(`/materiales/${material.id}`, { method: 'DELETE' });
      await cargarMateriales();
    }
  });
  initSearch((query) => { queryMateriales = query; renderMateriales(); });
  cargarMateriales();
});
