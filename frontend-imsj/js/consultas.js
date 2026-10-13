let consultas = [];
let queryConsultas = '';

function fechaConsulta(value) {
  return value ? new Date(value).toLocaleString('es-UY', { dateStyle: 'short', timeStyle: 'short' }) : '—';
}

function renderConsultas() {
  const visible = queryConsultas ? consultas.filter((item) =>
    [item.nombre, item.email, item.mensaje].join(' ').toLowerCase().includes(queryConsultas)) : consultas;
  $('#lista-consultas').innerHTML = visible.map((item) => `
    <details class="consultation${item.leida ? '' : ' consultation--unread'}" data-id="${item.id}">
      <summary>
        <span class="consultation__dot" aria-hidden="true"></span>
        <span class="consultation__sender"><strong>${esc(item.nombre)}</strong><small>${esc(item.email)}</small></span>
        <span class="consultation__preview">${esc(item.mensaje)}</span>
        <time datetime="${esc(item.created_at)}">${esc(fechaConsulta(item.created_at))}</time>
        <span data-icon="chevron-down" data-size="16"></span>
      </summary>
      <div class="consultation__body"><p>${esc(item.mensaje)}</p><a href="mailto:${esc(item.email)}">Escribir a ${esc(item.email)}</a></div>
    </details>`).join('');
  $('#empty-consultas').hidden = visible.length > 0;
  $('#contador-consultas').textContent = consultas.length;
  $('#contador-no-leidas').textContent = consultas.filter((item) => !item.leida).length;
  hydrateIcons($('#lista-consultas'));
}

async function cargarConsultas() {
  try {
    const payload = await ImsjApi.request('/consultas');
    consultas = Array.isArray(payload.consultas) ? payload.consultas : [];
    $('#consultas-status').hidden = true;
    renderConsultas();
  } catch (error) {
    $('#consultas-status').textContent = error.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!ImsjApi.isStaff()) {
    window.location.assign(`/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`);
    return;
  }
  $('#lista-consultas').addEventListener('toggle', async (event) => {
    const details = event.target.closest('details[data-id]');
    if (!details?.open) return;
    const item = consultas.find((consulta) => consulta.id === Number(details.dataset.id));
    if (!item || item.leida) return;
    try {
      await ImsjApi.request(`/consultas/${item.id}/leida`, { method: 'PATCH' });
      item.leida = true;
      details.classList.remove('consultation--unread');
      $('#contador-no-leidas').textContent = consultas.filter((consulta) => !consulta.leida).length;
    } catch (error) {
      alert(error.message);
    }
  }, true);
  initSearch((query) => { queryConsultas = query; renderConsultas(); });
  cargarConsultas();
});
