/* Consulta persistente de las reservas del ciudadano autenticado. */
(function () {
  'use strict';
  const root = document.getElementById('mis-reservas');
  const status = document.getElementById('reservas-status');
  if (!root || !window.ImsjApi) return;

  function setStatus(message = '', error = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('is-error', error);
  }

  function formatDate(value) {
    const [year, month, day] = String(value || '').slice(0, 10).split('-');
    return day && month && year ? `${day}/${month}/${year}` : value;
  }

  async function load() {
    const user = ImsjApi.currentUser();
    if (!user || user.rol !== 'PUBLICO_GENERAL') {
      setStatus('Iniciá sesión como ciudadano para consultar tus reservas.');
      const link = document.createElement('a');
      link.className = 'btn btn-primary';
      link.href = `/frontend-publico/Login.html?return=${encodeURIComponent(window.location.pathname)}`;
      link.textContent = 'Iniciar sesión';
      root.replaceChildren(link);
      return;
    }
    setStatus('Cargando tus reservas...');
    try {
      const payload = await ImsjApi.request('/reservas/mias');
      const items = Array.isArray(payload.reservas) ? payload.reservas : [];
      root.replaceChildren(...items.map((item) => {
        const article = document.createElement('article');
        article.className = 'card card-plain';
        const body = document.createElement('div');
        body.className = 'card-body';
        const title = document.createElement('h3');
        title.textContent = `${formatDate(item.fecha)} · ${String(item.hora_inicio).slice(0, 5)}`;
        const detail = document.createElement('p');
        detail.textContent = `${String(item.tipo_tramite).replaceAll('_', ' ')} · Reserva #${item.reserva_id}`;
        body.append(title, detail);
        article.append(body);
        return article;
      }));
      setStatus(items.length ? '' : 'No tenés reservas registradas.');
    } catch (error) {
      root.replaceChildren();
      setStatus(error.message, true);
    }
  }
  load();
}());
