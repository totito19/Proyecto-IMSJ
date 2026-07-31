/* ═══════════════════════════════════════════════════════════════════════════
   franjas.js — franjas de disponibilidad (normal, urgente y prueba de manejo).
   ═══════════════════════════════════════════════════════════════════════════ */

let queryFranjas = '';

function franjasFiltradas() {
  const tipo = $('#filtro-tipo').value;
  return Store.get('franjas').filter((f) => {
    const okTipo = tipo === 'todos' || f.tipo === tipo;
    const okQuery = !queryFranjas ||
      [f.fecha, f.horaInicio, f.horaFin, f.tipo]
        .join(' ').toLowerCase().includes(queryFranjas);
    return okTipo && okQuery;
  });
}

function renderFranjas() {
  const data  = franjasFiltradas();
  const tbody = $('#tbody-franjas');

  tbody.innerHTML = data.map((f) => {
    const disponibles = f.cupos - f.reservas;
    const cls = disponibles === 0 ? 'avail--none' : disponibles <= 1 ? 'avail--low' : 'avail--ok';
    return `
    <tr>
      <td class="strong">${esc(f.fecha)}</td>
      <td class="code">${esc(f.horaInicio)} – ${esc(f.horaFin)}</td>
      <td>${badge(f.tipo)}</td>
      <td class="muted">${f.cupos}</td>
      <td class="muted">${f.reservas}</td>
      <td><span class="avail ${cls}">${disponibles}</span></td>
      <td>
        <div class="actions">
          ${actionBtn('pencil', 'Editar', { data: { accion: 'editar', id: f.id } })}
          ${actionBtn('trash-2', 'Eliminar', { danger: true, data: { accion: 'eliminar', id: f.id } })}
        </div>
      </td>
    </tr>`;
  }).join('');

  $('#empty-franjas').hidden = data.length > 0;
  $('#contador-franjas').textContent = data.length;
}

/* ── Formulario ──────────────────────────────────────────────────────────── */

/** dd/mm/aaaa → aaaa-mm-dd (para el <input type="date">). */
function toISO(uy) {
  const [d, m, y] = String(uy).split('/');
  return d && m && y ? `${y}-${m}-${d}` : '';
}

function abrirFormularioFranja(franja) {
  $('#modal-franja-title').textContent = franja ? 'Editar franja' : 'Nueva franja';
  $('#f-id').value     = franja ? franja.id : '';
  $('#f-fecha').value  = franja ? toISO(franja.fecha) : '';
  $('#f-inicio').value = franja ? franja.horaInicio : '';
  $('#f-fin').value    = franja ? franja.horaFin : '';
  $('#f-tipo').value   = franja ? franja.tipo : 'renovacion-normal';
  $('#f-cupos').value  = franja ? franja.cupos : 6;
  Modal.open('modal-franja');
}

function guardarFranja(e) {
  e.preventDefault();
  const form = $('#form-franja');
  if (!form.reportValidity()) return;

  if ($('#f-fin').value <= $('#f-inicio').value) {
    alert('La hora de fin debe ser posterior a la hora de inicio.');
    return;
  }

  const id = $('#f-id').value ? Number($('#f-id').value) : null;
  const campos = {
    fecha:      formatDate($('#f-fecha').value),
    horaInicio: $('#f-inicio').value,
    horaFin:    $('#f-fin').value,
    tipo:       $('#f-tipo').value,
    cupos:      Number($('#f-cupos').value) || 1,
  };

  let data = Store.get('franjas');
  data = id
    ? data.map((f) => (f.id === id ? { ...f, ...campos } : f))
    : [...data, { id: Date.now(), ...campos, reservas: 0 }];

  Store.set('franjas', data);
  Modal.close('modal-franja');
  form.reset();
  renderFranjas();
}

/* ── Eventos ─────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  $('#btn-nueva-franja').addEventListener('click', () => abrirFormularioFranja(null));
  $('#form-franja').addEventListener('submit', guardarFranja);
  $('#filtro-tipo').addEventListener('change', renderFranjas);

  $('#tbody-franjas').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const data = Store.get('franjas');

    if (btn.dataset.accion === 'editar') {
      abrirFormularioFranja(data.find((f) => f.id === id));
    }

    if (btn.dataset.accion === 'eliminar') {
      const f = data.find((x) => x.id === id);
      if (f.reservas > 0 && !confirm(`Esta franja tiene ${f.reservas} reserva(s). ¿Eliminar igual?`)) return;
      if (f.reservas === 0 && !confirm('¿Eliminar esta franja?')) return;
      Store.set('franjas', data.filter((x) => x.id !== id));
      renderFranjas();
    }
  });

  initSearch((q) => { queryFranjas = q; renderFranjas(); });

  renderFranjas();
});
