/* ═══════════════════════════════════════════════════════════════════════════
   preguntas.js — mantenimiento de la sección "Preguntas frecuentes".
   ═══════════════════════════════════════════════════════════════════════════ */

let queryPreguntas = '';

function preguntasFiltradas() {
  const data = Store.get('preguntas');
  if (!queryPreguntas) return data;
  return data.filter((p) =>
    [p.pregunta, p.respuesta].join(' ').toLowerCase().includes(queryPreguntas));
}

function renderPreguntas() {
  const data  = preguntasFiltradas();
  const tbody = $('#tbody-preguntas');

  tbody.innerHTML = data.map((p, i) => `
    <tr>
      <td class="col-num">${String(i + 1).padStart(2, '0')}</td>
      <td><div class="cell-question">${esc(p.pregunta)}</div></td>
      <td><div class="cell-answer">${esc(p.respuesta)}</div></td>
      <td>${badge(p.visible ? 'visible' : 'oculta')}</td>
      <td>
        <div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: p.id } })}
          ${actionBtn(p.visible ? 'eye-off' : 'eye', p.visible ? 'Ocultar' : 'Mostrar',
                      { data: { accion: 'toggle', id: p.id } })}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: p.id } })}
        </div>
      </td>
    </tr>`).join('');

  $('#empty-preguntas').hidden = data.length > 0;
  $('#contador-preguntas').textContent = Store.get('preguntas').length;
}

/* ── Formulario ──────────────────────────────────────────────────────────── */

function abrirFormularioPregunta(pregunta) {
  $('#modal-pregunta-title').textContent = pregunta ? 'Editar pregunta frecuente' : 'Nueva pregunta frecuente';
  $('#p-id').value        = pregunta ? pregunta.id : '';
  $('#p-pregunta').value  = pregunta ? pregunta.pregunta : '';
  $('#p-respuesta').value = pregunta ? pregunta.respuesta : '';
  Modal.open('modal-pregunta');
}

function guardarPregunta(e) {
  e.preventDefault();
  const form = $('#form-pregunta');
  if (!form.reportValidity()) return;

  const id = $('#p-id').value ? Number($('#p-id').value) : null;
  const campos = {
    pregunta:  $('#p-pregunta').value.trim(),
    respuesta: $('#p-respuesta').value.trim(),
  };

  let data = Store.get('preguntas');
  data = id
    ? data.map((p) => (p.id === id ? { ...p, ...campos } : p))
    : [...data, { id: Date.now(), ...campos, visible: true }];

  Store.set('preguntas', data);
  Modal.close('modal-pregunta');
  form.reset();
  renderPreguntas();
}

/* ── Eventos ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  $('#btn-nueva-pregunta').addEventListener('click', () => abrirFormularioPregunta(null));
  $('#form-pregunta').addEventListener('submit', guardarPregunta);

  $('#tbody-preguntas').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const data = Store.get('preguntas');

    if (btn.dataset.accion === 'editar') {
      abrirFormularioPregunta(data.find((p) => p.id === id));
    }

    if (btn.dataset.accion === 'toggle') {
      Store.set('preguntas', data.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));
      renderPreguntas();
    }

    if (btn.dataset.accion === 'eliminar') {
      if (confirm('¿Eliminar esta pregunta frecuente?')) {
        Store.set('preguntas', data.filter((p) => p.id !== id));
        renderPreguntas();
      }
    }
  });

  initSearch((q) => { queryPreguntas = q; renderPreguntas(); });

  renderPreguntas();
});
