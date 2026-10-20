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

  /** Presenta mensajes de carga, confirmación o error de la agenda. */
  function setStatus(message = '', isError = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('is-error', isError);
  }

  /** Obtiene el trámite marcado o utiliza el definido por la página actual. */
  function currentType() {
    const selected = typeInputs.find((input) => input.checked);
    return selected ? selected.value : root.dataset.turnos;
  }

  /** Convierte AAAA-MM-DD a DD/MM/AAAA sin crear un Date ni desplazar la zona horaria. */
  function formatDate(value) {
    const [year, month, day] = String(value || '')
      .slice(0, 10)
      .split('-');
    return day && month && year ? `${day}/${month}/${year}` : value;
  }

  /** Agrupa franjas por fecha y crea una tarjeta de reserva por cada horario. */
  function render(items) {
    root.replaceChildren();
    if (!items.length) {
      setStatus('No hay franjas disponibles para este trámite.');
      return;
    }
    setStatus();
    // reduce transforma la lista plana en un objeto cuyas claves son fechas.
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
        // Los cupos libres se calculan con la capacidad y reservas informadas por la API.
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

  /** Solicita a la API las franjas con cupo del trámite seleccionado. */
  async function load() {
    setStatus('Cargando franjas disponibles...');
    root.replaceChildren();
    try {
      const payload = await ImsjApi.request(
        `/franjas/disponibles?tipo=${encodeURIComponent(currentType())}`,
      );
      render(Array.isArray(payload.franjas) ? payload.franjas : []);
    } catch (error) {
      setStatus(error.message, true);
    }
  }

  /** Exige una sesión ciudadana y envía el identificador de la franja elegida. */
  async function reserve(button) {
    const user = ImsjApi.currentUser();
    if (!user || user.rol !== 'PUBLICO_GENERAL') {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.assign(`/frontend-publico/login.html?return=${encodeURIComponent(returnTo)}`);
      return;
    }
    button.disabled = true;
    button.textContent = 'Reservando...';
    try {
      // El backend vuelve a comprobar existencia, duplicados y cupos dentro de una transacción.
      const payload = await ImsjApi.request('/reservas', {
        method: 'POST',
        body: { franja_disponibilidad_id: Number(button.dataset.slotId) },
      });
      const confirmation = payload.reserva;
      await load();
      setStatus(
        `Reserva confirmada para el ${formatDate(confirmation.fecha)} a las ${String(confirmation.hora_inicio).slice(0, 5)}.`,
      );
    } catch (error) {
      setStatus(error.message, true);
      button.disabled = false;
      button.textContent = 'Reservar';
    }
  }

  // Delegación de eventos: un único listener atiende todos los botones creados al renderizar.
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-slot-id]');
    if (button) reserve(button);
  });
  typeInputs.forEach((input) => input.addEventListener('change', load));
  load();
})();
