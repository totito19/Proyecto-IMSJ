/* ═══════════════════════════════════════════════════════════════════════════
   materiales.js — biblioteca de materiales de estudio.
   ═══════════════════════════════════════════════════════════════════════════ */

const ICONO_TIPO = { documento: 'file-text', video: 'video', enlace: 'link-2' };

let queryMateriales = '';

function materialesFiltrados() {
  const data = Store.get('materiales');
  if (!queryMateriales) return data;
  return data.filter((m) =>
    [m.nombre, m.enlace, m.tipo, m.estado].join(' ').toLowerCase().includes(queryMateriales));
}

function renderMateriales() {
  const data = materialesFiltrados();
  const lista = $('#lista-materiales');

  lista.innerHTML = data.map((m) => `
    <article class="material">
      <div class="material__icon material__icon--${esc(m.tipo)}">${icon(ICONO_TIPO[m.tipo] || 'file-text', 14)}</div>
      <div class="material__body">
        <div class="material__name">${esc(m.nombre)}</div>
        <div class="material__link">${esc(m.enlace)}</div>
      </div>
      <div class="material__right">
        ${badge(m.estado)}
        <div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: m.id } })}
          ${actionBtn(m.estado === 'activo' ? 'eye-off' : 'eye',
                      m.estado === 'activo' ? 'Desactivar' : 'Activar',
                      { data: { accion: 'toggle', id: m.id } })}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: m.id } })}
        </div>
      </div>
    </article>`).join('');

  $('#empty-materiales').hidden = data.length > 0;
  $('#contador-materiales').textContent = Store.get('materiales').length;
}

/* ── Formulario ──────────────────────────────────────────────────────────── */

/** Muestra "Archivo" o "URL" según el tipo elegido (igual que el prototipo). */
function alternarCampoOrigen() {
  const esDocumento = $('#m-tipo').value === 'documento';
  $('#campo-archivo').hidden = !esDocumento;
  $('#campo-url').hidden = esDocumento;
}

function abrirFormularioMaterial(material) {
  $('#modal-material-title').textContent = material ? 'Editar material' : 'Nuevo material';
  $('#m-id').value     = material ? material.id : '';
  $('#m-nombre').value = material ? material.nombre : '';
  $('#m-tipo').value   = material ? material.tipo : 'documento';
  $('#m-estado').value = material ? material.estado : 'activo';
  $('#m-url').value    = material && material.tipo !== 'documento' ? material.enlace : '';
  $('[data-file-label]', $('#modal-material')).textContent =
    material && material.tipo === 'documento' ? material.enlace : 'Seleccionar archivo PDF o Word...';
  alternarCampoOrigen();
  Modal.open('modal-material');
}

function guardarMaterial(e) {
  e.preventDefault();
  const form = $('#form-material');
  if (!form.reportValidity()) return;

  const tipo = $('#m-tipo').value;
  const archivo = $('#m-archivo').files[0];
  const enlace = tipo === 'documento'
    ? (archivo ? archivo.name : $('[data-file-label]', $('#modal-material')).textContent)
    : $('#m-url').value.trim();

  const id = $('#m-id').value ? Number($('#m-id').value) : null;
  const campos = {
    nombre: $('#m-nombre').value.trim(),
    tipo,
    estado: $('#m-estado').value,
    enlace: enlace.startsWith('Seleccionar') ? '' : enlace,
  };

  let data = Store.get('materiales');
  data = id
    ? data.map((m) => (m.id === id ? { ...m, ...campos } : m))
    : [...data, { id: Date.now(), ...campos }];

  Store.set('materiales', data);
  Modal.close('modal-material');
  form.reset();
  renderMateriales();
}

/* ── Eventos ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  $('#btn-nuevo-material').addEventListener('click', () => abrirFormularioMaterial(null));
  $('#form-material').addEventListener('submit', guardarMaterial);
  $('#m-tipo').addEventListener('change', alternarCampoOrigen);

  $('[data-file]', $('#modal-material')).addEventListener('click', function () {
    const input = document.getElementById(this.dataset.file);
    input.click();
    input.onchange = () => {
      $('[data-file-label]', this).textContent = input.files[0]
        ? input.files[0].name : 'Seleccionar archivo PDF o Word...';
    };
  });

  $('#lista-materiales').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const data = Store.get('materiales');

    if (btn.dataset.accion === 'editar') {
      abrirFormularioMaterial(data.find((m) => m.id === id));
    }

    if (btn.dataset.accion === 'toggle') {
      Store.set('materiales', data.map((m) =>
        m.id === id ? { ...m, estado: m.estado === 'activo' ? 'inactivo' : 'activo' } : m));
      renderMateriales();
    }

    if (btn.dataset.accion === 'eliminar') {
      const m = data.find((x) => x.id === id);
      if (confirm(`¿Eliminar "${m.nombre}"?`)) {
        Store.set('materiales', data.filter((x) => x.id !== id));
        renderMateriales();
      }
    }
  });

  initSearch((q) => { queryMateriales = q; renderMateriales(); });

  renderMateriales();
});
