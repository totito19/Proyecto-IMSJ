/** Historial completo de cambios: filtros en servidor y navegación por páginas. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-historial');
  if (!form || !ImsjApi.isStaff()) return;
  const body = $('#tbody-historial');
  const status = $('#historial-status');
  const empty = $('#empty-historial');
  const previous = $('#historial-anterior');
  const next = $('#historial-siguiente');
  let page = 1;
  let pagination = null;
  let filters = new URLSearchParams();
  let busy = false;
  let requestId = 0;

  const actions = {
    CREAR: 'Creación', ACTUALIZAR: 'Actualización', ELIMINAR: 'Eliminación',
    APROBAR: 'Aprobación', PUBLICAR: 'Publicación', DESPUBLICAR: 'Retiro de publicación',
    ENVIAR_REVISION: 'Envío a revisión', LEER: 'Lectura', REACTIVAR: 'Reactivación',
    DESACTIVAR: 'Retiro de acceso', VOLVER_BORRADOR: 'Vuelta a borrador',
  };
  const modules = {
    FranjaDisponibilidad: 'Franjas', MaterialEstudio: 'Materiales', Noticia: 'Noticias',
    PreguntaFrecuente: 'Preguntas frecuentes', PreguntaPrueba: 'Simulador',
    Consulta: 'Consultas', User: 'Personal IMSJ',
  };
  const actionLabel = (value) => actions[value] || historyActionLabel(value);
  const moduleLabel = (value) => modules[value] || historyElementLabel(value);

  function updateControls() {
    $('#historial-resultados').setAttribute('aria-busy', String(busy));
    ['historial-aplicar', 'historial-limpiar', 'historial-actualizar'].forEach((id) => {
      document.getElementById(id).disabled = busy;
    });
    previous.disabled = busy || !pagination || page <= 1;
    next.disabled = busy || !pagination || page >= pagination.paginas;
  }

  function setOptions(select, items, valueOf, labelOf) {
    const selected = select.value;
    const initial = select.options[0].cloneNode(true);
    select.replaceChildren(initial);
    items.forEach((item) => select.add(new Option(labelOf(item), String(valueOf(item)))));
    select.value = selected;
  }

  function render(payload) {
    pagination = payload.paginacion;
    page = pagination.pagina;
    body.innerHTML = payload.acciones.map((item) => {
      const date = new Date(item.fecha_hora);
      const when = Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('es-UY', {
        dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Montevideo',
      });
      return `<tr>
        <td><div class="cell-title">${esc(item.usuario?.nombre || item.usuario?.cedula || 'Cuenta sin nombre')}</div><div class="cell-sub">${esc(item.usuario?.cedula || '—')}</div></td>
        <td>${esc(actionLabel(item.accion))}</td>
        <td>${esc(moduleLabel(item.tipo_elemento))}</td>
        <td class="code">#${esc(item.elemento_id)}</td>
        <td>${esc(when)}</td>
        <td class="code">#${esc(item.id)}</td>
      </tr>`;
    }).join('');
    empty.hidden = payload.acciones.length > 0;
    const start = payload.acciones.length ? (page - 1) * pagination.por_pagina + 1 : 0;
    const end = payload.acciones.length ? start + payload.acciones.length - 1 : 0;
    $('#historial-rango').textContent = `${start}–${end} de ${pagination.total} registros`;
    $('#historial-pagina').textContent = pagination.total ? `Página ${page} de ${pagination.paginas}` : 'Sin páginas';
    const options = payload.filtros;
    setOptions($('#historial-persona'), options.usuarios, (item) => item.id,
      (item) => item.nombre ? `${item.nombre} · ${item.cedula}` : item.cedula);
    setOptions($('#historial-accion'), options.acciones, (item) => item, actionLabel);
    setOptions($('#historial-tipo'), options.tipos, (item) => item, moduleLabel);
  }

  async function load(requestedPage = page) {
    page = requestedPage;
    const currentRequest = ++requestId;
    const query = new URLSearchParams(filters);
    query.set('pagina', String(requestedPage));
    if (!query.has('limite')) query.set('limite', '20');
    busy = true;
    status.hidden = false;
    status.textContent = 'Cargando registros...';
    status.classList.remove('audit-status--error');
    updateControls();
    try {
      const payload = await ImsjApi.request(`/historial?${query}`);
      if (currentRequest !== requestId) return;
      if (!payload.paginacion || !payload.filtros || !Array.isArray(payload.acciones)) {
        throw new Error('No se pudo cargar el historial completo. Volvé a intentarlo.');
      }
      render(payload);
      status.hidden = true;
    } catch (error) {
      if (currentRequest !== requestId) return;
      pagination = null;
      body.replaceChildren();
      empty.hidden = true;
      $('#historial-rango').textContent = 'No se cargaron registros.';
      $('#historial-pagina').textContent = '—';
      status.textContent = error.message;
      status.classList.add('audit-status--error');
    } finally {
      if (currentRequest === requestId) {
        busy = false;
        updateControls();
      }
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const from = $('#historial-desde');
    const until = $('#historial-hasta');
    until.setCustomValidity(from.value && until.value && from.value > until.value
      ? 'La fecha final no puede ser anterior a la inicial.' : '');
    if (!form.reportValidity()) return;
    filters = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      if (value.trim()) filters.set(key, value.trim());
    }
    load(1);
  });
  ['historial-desde', 'historial-hasta'].forEach((id) => {
    document.getElementById(id).addEventListener('input', () => $('#historial-hasta').setCustomValidity(''));
  });
  $('#historial-limpiar').addEventListener('click', () => {
    form.reset();
    $('#historial-hasta').setCustomValidity('');
    filters = new URLSearchParams();
    load(1);
  });
  $('#historial-actualizar').addEventListener('click', () => load());
  previous.addEventListener('click', () => load(page - 1));
  next.addEventListener('click', () => load(page + 1));
  document.addEventListener('imsj:personal-actualizado', () => load(1));
  load();
});
