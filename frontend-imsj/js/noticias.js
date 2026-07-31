/* ═══════════════════════════════════════════════════════════════════════════
   noticias.js — alta, publicación/despublicación y baja de noticias.
   ═══════════════════════════════════════════════════════════════════════════ */

let queryNoticias = '';

function noticiasFiltradas() {
  const data = Store.get('noticias');
  if (!queryNoticias) return data;
  return data.filter((n) =>
    [n.titulo, n.resumen, n.estado, n.vigencia, n.fecha]
      .join(' ').toLowerCase().includes(queryNoticias));
}

function renderNoticias() {
  const data  = noticiasFiltradas();
  const tbody = $('#tbody-noticias');

  tbody.innerHTML = data.map((n) => `
    <tr>
      <td>
        <div class="cell-title">${esc(n.titulo)}</div>
        <div class="cell-sub">${esc(n.resumen)}</div>
      </td>
      <td>${badge(n.estado)}</td>
      <td class="muted">${esc(n.vigencia)}</td>
      <td class="dim">${esc(n.fecha)}</td>
      <td>
        <div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: n.id } })}
          ${actionBtn(n.estado === 'publicada' ? 'eye-off' : 'eye',
                      n.estado === 'publicada' ? 'Despublicar' : 'Publicar',
                      { data: { accion: 'toggle', id: n.id } })}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: n.id } })}
        </div>
      </td>
    </tr>`).join('');

  $('#empty-noticias').hidden = data.length > 0;
  $('#contador-noticias').textContent = Store.get('noticias').length;
}

/* ── Formulario ──────────────────────────────────────────────────────────── */

let noticiaEnEdicion = null;

function abrirFormulario(noticia) {
  noticiaEnEdicion = noticia || null;
  $('#modal-noticia-title').textContent = noticia ? 'Editar noticia' : 'Nueva noticia';
  $('#btn-guardar-noticia').textContent = noticia ? 'Guardar cambios' : 'Guardar noticia';

  $('#n-titulo').value   = noticia ? noticia.titulo : '';
  $('#n-resumen').value  = noticia ? noticia.resumen : '';
  $('#n-cuerpo').value   = noticia ? (noticia.cuerpo || '') : '';
  $('#n-estado').value   = noticia ? noticia.estado : 'borrador';
  $('#n-vigencia').value = '';
  $('[data-file-label]', $('#modal-noticia')).textContent = 'Seleccionar imagen...';

  Modal.open('modal-noticia');
}

function guardarNoticia(e) {
  e.preventDefault();
  const form = $('#form-noticia');
  if (!form.reportValidity()) return;

  const vigenciaISO = $('#n-vigencia').value;
  const campos = {
    titulo:   $('#n-titulo').value.trim(),
    resumen:  $('#n-resumen').value.trim(),
    cuerpo:   $('#n-cuerpo').value.trim(),
    estado:   $('#n-estado').value,
    vigencia: vigenciaISO ? formatDate(vigenciaISO) : (noticiaEnEdicion ? noticiaEnEdicion.vigencia : '—'),
  };

  let data = Store.get('noticias');
  if (noticiaEnEdicion) {
    data = data.map((n) => (n.id === noticiaEnEdicion.id ? { ...n, ...campos } : n));
  } else {
    data = [{ id: Date.now(), ...campos, fecha: today() }, ...data];
  }

  Store.set('noticias', data);
  Modal.close('modal-noticia');
  form.reset();
  noticiaEnEdicion = null;
  renderNoticias();
}

/* ── Eventos ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  $('#btn-nueva-noticia').addEventListener('click', () => abrirFormulario(null));
  $('#form-noticia').addEventListener('submit', guardarNoticia);

  // Selector de archivo simulado (sin backend no se sube nada).
  $('[data-file]', $('#modal-noticia')).addEventListener('click', function () {
    const input = document.getElementById(this.dataset.file);
    input.click();
    input.onchange = () => {
      $('[data-file-label]', this).textContent = input.files[0]
        ? input.files[0].name : 'Seleccionar imagen...';
    };
  });

  $('#tbody-noticias').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const data = Store.get('noticias');

    if (btn.dataset.accion === 'editar') {
      abrirFormulario(data.find((n) => n.id === id));
    }

    if (btn.dataset.accion === 'toggle') {
      Store.set('noticias', data.map((n) =>
        n.id === id ? { ...n, estado: n.estado === 'publicada' ? 'borrador' : 'publicada' } : n));
      renderNoticias();
    }

    if (btn.dataset.accion === 'eliminar') {
      const n = data.find((x) => x.id === id);
      if (confirm(`¿Eliminar la noticia "${n.titulo}"?`)) {
        Store.set('noticias', data.filter((x) => x.id !== id));
        renderNoticias();
      }
    }
  });

  initSearch((q) => { queryNoticias = q; renderNoticias(); });

  renderNoticias();
});
