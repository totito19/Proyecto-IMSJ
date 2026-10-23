/** Catálogo administrativo de materiales de estudio y su flujo de publicación. */

const ICONO_TIPO = { PDF: 'file-text', IMAGEN: 'image', VIDEO: 'video' };

let materiales = [];
let queryMateriales = '';

/** Impide usar la pantalla sin una sesión de personal o Directora. */
function asegurarPersonal() {
  const usuario = ImsjApi.currentUser();
  if (!ImsjApi.isStaff(usuario)) {
    window.location.assign(
      `/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`,
    );
    return false;
  }
  return true;
}

/** Filtra materiales por nombre, tipo, estado y ubicación del recurso. */
function materialesFiltrados() {
  if (!queryMateriales) return materiales;
  return materiales.filter((material) =>
    [material.nombre, material.tipo, material.estado]
      .join(' ')
      .toLowerCase()
      .includes(queryMateriales),
  );
}

/** Traduce el estado de la API a la variante visual utilizada por badge(). */
function estadoMaterialVista(estado) {
  return (
    { BORRADOR: 'borrador', PENDIENTE: 'pendiente', APROBADO: 'aprobado', PUBLICADO: 'publicada' }[
      estado
    ] || 'borrador'
  );
}

/** Confirma las acciones editoriales que cambian la visibilidad del material. */
function confirmarCambioEstadoMaterial(material, estado) {
  const messages = {
    PENDIENTE: `¿Enviar "${material.nombre}" a revisión?`,
    APROBADO: `¿Aprobar el material "${material.nombre}"?`,
    PUBLICADO: `¿Publicar el material "${material.nombre}" en el portal?`,
    BORRADOR: `¿Retirar el material "${material.nombre}" del portal?`,
  };
  return ImsjForms.confirm(messages[estado] || '¿Confirmar esta acción?');
}

/** Decide qué transición editorial puede ofrecerse para el estado y rol actuales. */
function accionFlujoMaterial(material) {
  const directora = ImsjApi.currentUser()?.rol === 'DIRECTORA';
  if (material.estado === 'BORRADOR') {
    return actionBtn('send', 'Enviar a revisión', {
      labeled: true,
      data: { accion: 'estado', estado: 'PENDIENTE', id: material.id },
    });
  }
  if (material.estado === 'PENDIENTE' && directora) {
    return actionBtn('check-circle', 'Aprobar', {
      labeled: true,
      data: { accion: 'estado', estado: 'APROBADO', id: material.id },
    });
  }
  if (material.estado === 'PENDIENTE')
    return '<span class="self-label">Pendiente de Directora</span>';
  if (material.estado === 'APROBADO') {
    return actionBtn('eye', 'Publicar', {
      labeled: true,
      data: { accion: 'estado', estado: 'PUBLICADO', id: material.id },
    });
  }
  if (material.estado === 'PUBLICADO') {
    return actionBtn('eye-off', 'Retirar', {
      labeled: true,
      data: { accion: 'estado', estado: 'BORRADOR', id: material.id },
    });
  }
  return '';
}

/** Genera las filas del catálogo administrativo con sus acciones permitidas. */
function renderMateriales() {
  const data = materialesFiltrados();
  $('#lista-materiales').innerHTML = data
    .map(
      (material) => `
    <article class="material">
      <div class="material__icon">${icon(ICONO_TIPO[material.tipo] || 'file-text', 14)}</div>
      <div class="material__body">
        <div class="material__name">${esc(material.nombre)}</div>
        <a class="material__link" href="${esc(material.ubicacion_recurso)}" target="_blank" rel="noopener noreferrer">Abrir recurso</a>
      </div>
      <div class="material__right">
        ${badge(estadoMaterialVista(material.estado))}
        <div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: material.id } })}
          ${accionFlujoMaterial(material)}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: material.id } })}
        </div>
      </div>
    </article>`,
    )
    .join('');
  $('#empty-materiales').hidden = data.length > 0;
  $('#contador-materiales').textContent = materiales.length;
  hydrateIcons($('#lista-materiales'));
}

/** Muestra el campo de archivo o URL según el origen elegido en el formulario. */
function alternarCampoOrigen() {
  const esVideo = $('#m-tipo').value === 'VIDEO';
  const esNuevo = !$('#m-id').value;
  $('#campo-archivo').hidden = esVideo;
  $('#campo-url').hidden = !esVideo;
  $('#m-url').required = esVideo && esNuevo;
  $('#m-archivo').required = !esVideo && esNuevo;
  $('#m-archivo').accept = $('#m-tipo').value === 'PDF' ? '.pdf' : '.jpg,.jpeg,.png,.webp';
}

/** Abre el modal en modo creación o completa sus campos para editar. */
function abrirFormularioMaterial(material) {
  $('#form-material').reset();
  $('#modal-material-title').textContent = material ? 'Editar material' : 'Nuevo material';
  $('#m-id').value = material ? material.id : '';
  $('#m-nombre').value = material ? material.nombre : '';
  $('#m-tipo').value = material ? material.tipo : 'PDF';
  $('#m-url').value = material && material.tipo === 'VIDEO' ? material.ubicacion_recurso : '';
  $('[data-file-label]', $('#modal-material')).textContent = material
    ? 'Conservar archivo actual'
    : 'Seleccionar archivo...';
  alternarCampoOrigen();
  Modal.open('modal-material');
}

/** Obtiene desde la API el catálogo completo y lo presenta en la tabla. */
async function cargarMateriales() {
  try {
    const payload = await ImsjApi.request('/materiales');
    materiales = Array.isArray(payload.materiales) ? payload.materiales : [];
    renderMateriales();
  } catch (error) {
    ImsjForms.notify(error.message);
  }
}

/** Empaqueta texto y archivo en FormData y crea o actualiza el material. */
async function guardarMaterial(event) {
  event.preventDefault();
  const form = $('#form-material');
  if (!ImsjForms.validate(form)) return;

  const id = $('#m-id').value;
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
    await ImsjApi.request(id ? `/materiales/${id}` : '/materiales', {
      method: 'POST',
      body: data,
    });
    Modal.close('modal-material');
    await cargarMateriales();
  } catch (error) {
    ImsjForms.notify(error.message);
  }
}

// Valida acceso y conecta los eventos principales de la pantalla.
document.addEventListener('DOMContentLoaded', () => {
  if (!asegurarPersonal()) return;
  $('#btn-nuevo-material').addEventListener('click', () => abrirFormularioMaterial(null));
  $('#form-material').addEventListener('submit', guardarMaterial);
  $('#m-tipo').addEventListener('change', alternarCampoOrigen);
  $('[data-file]', $('#modal-material')).addEventListener('click', function () {
    const input = document.getElementById(this.dataset.file);
    input.click();
    input.onchange = () => {
      $('[data-file-label]', this).textContent = input.files[0]
        ? input.files[0].name
        : 'Seleccionar archivo...';
    };
  });
  $('#lista-materiales').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion]');
    if (!button) return;
    const material = materiales.find((item) => item.id === Number(button.dataset.id));
    if (!material) return;
    if (button.dataset.accion === 'editar') {
      abrirFormularioMaterial(material);
      return;
    }
    try {
      if (button.dataset.accion === 'estado') {
        if (!await confirmarCambioEstadoMaterial(material, button.dataset.estado)) return;
        await ImsjApi.request(`/materiales/${material.id}/estado`, {
          method: 'PATCH',
          body: { estado: button.dataset.estado },
        });
      }
      if (button.dataset.accion === 'eliminar') {
        if (!await ImsjForms.confirm(`¿Eliminar "${material.nombre}"?`)) return;
        await ImsjApi.request(`/materiales/${material.id}`, { method: 'DELETE' });
      }
      await cargarMateriales();
    } catch (error) {
      ImsjForms.notify(error.message);
    }
  });
  initSearch((query) => {
    queryMateriales = query;
    renderMateriales();
  });
  cargarMateriales();
});
