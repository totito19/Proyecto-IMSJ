/* Agenda ciudadana real: consulta cupos y crea reservas persistentes. */
(function () {
  'use strict';
  const root = document.querySelector('[data-turnos]');
  if (!root || !window.ImsjApi) return;
  const status = document.getElementById('turnos-status');
  const typeInputs = Array.from(document.querySelectorAll('[name="modalidad"]'));
  const labels = {
    PRUEBA_MANEJO: 'Prueba de manejo',
    RENOVACION_NORMAL: 'Renovación normal',
    RENOVACION_URGENTE: 'Renovación urgente',
  };

  function setStatus(message = '', isError = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('is-error', isError);
  }

  function currentType() {
    const selected = typeInputs.find((input) => input.checked);
    return selected ? selected.value : root.dataset.turnos;
  }

  function formatDate(value) {
    const [year, month, day] = String(value || '').slice(0, 10).split('-');
    return day && month && year ? `${day}/${month}/${year}` : value;
  }

  function render(items) {
    root.replaceChildren();
    if (!items.length) {
      setStatus('No hay franjas disponibles para este trámite.');
      return;
    }
    setStatus();
    const groups = items.reduce((result, item) => {
      const date = String(item.fecha || '').slice(0, 10);
      (result[date] ||= []).push(item);
      return result;
    }, {});

    Object.entries(groups).forEach(([date, slots]) => {
      const block = document.createElement('section');
      block.className = 'day-block';
      const title = document.createElement('h3');
      title.textContent = formatDate(date);
      const grid = document.createElement('div');
      grid.className = 'slots';
      slots.forEach((slot) => {
        const used = Number(slot.reservas_count || 0);
        const total = Number(slot.cupos_totales || 0);
        const available = Math.max(0, total - used);
        const card = document.createElement('article');
        card.className = 'slot';
        const heading = document.createElement('h4');
        heading.textContent = `${String(slot.hora_inicio).slice(0, 5)} – ${String(slot.hora_fin).slice(0, 5)}`;
        const detail = document.createElement('p');
        detail.textContent = `${labels[slot.tipo] || slot.tipo} · ${available} ${available === 1 ? 'cupo' : 'cupos'}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-primary btn-block';
        button.textContent = 'Reservar';
        button.dataset.slotId = slot.id;
        card.append(heading, detail, button);
        grid.append(card);
      });
      block.append(title, grid);
      root.append(block);
    });
  }

  async function load() {
    setStatus('Cargando franjas disponibles...');
    root.replaceChildren();
    try {
      const payload = await ImsjApi.request(`/franjas/disponibles?tipo=${encodeURIComponent(currentType())}`);
      render(Array.isArray(payload.franjas) ? payload.franjas : []);
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  async function reserve(button) {
    const user = ImsjApi.currentUser();
    if (!user || user.rol !== 'PUBLICO_GENERAL') {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/frontend-publico/Login.html?return=${encodeURIComponent(returnTo)}`);
      return;
    }
    button.disabled = true;
    button.textContent = 'Reservando...';
    try {
      const payload = await ImsjApi.request('/reservas', {
        method: 'POST',
        body: { franja_disponibilidad_id: Number(button.dataset.slotId) },
      });
      const confirmation = payload.reserva;
      await load();
      setStatus(`Reserva confirmada para el ${formatDate(confirmation.fecha)} a las ${String(confirmation.hora_inicio).slice(0, 5)}.`);
    } catch (error) {
      setStatus(error.message, true);
      button.disabled = false;
      button.textContent = 'Reservar';
    }
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-slot-id]');
    if (button) reserve(button);
  });
  typeInputs.forEach((input) => input.addEventListener('change', load));
  load();
}());
