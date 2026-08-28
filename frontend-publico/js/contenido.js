/* Materiales y preguntas públicas: sólo contenido publicado por el panel. */
(function () {
  'use strict';
  const root = document.querySelector('[data-contenido]');
  if (!root || !window.ImsjApi) return;
  const kind = root.dataset.contenido;
  const status = document.getElementById('contenido-status');

  function setStatus(message = '', error = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('is-error', error);
  }

  function materialCard(item) {
    const article = document.createElement('article');
    article.className = 'card card-plain';
    const body = document.createElement('div');
    body.className = 'card-body';
    const title = document.createElement('h3');
    title.textContent = item.nombre;
    const type = document.createElement('p');
    type.textContent = `Recurso ${String(item.tipo || '').toLowerCase()}`;
    const link = document.createElement('a');
    link.className = 'card-link';
    link.href = item.ubicacion_recurso;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir material →';
    body.append(title, type, link);
    article.append(body);
    return article;
  }

  function questionCard(item) {
    const article = document.createElement('article');
    article.className = 'card card-plain';
    const body = document.createElement('div');
    body.className = 'card-body';
    const category = document.createElement('span');
    category.className = 'content-category';
    category.textContent = item.categoria || 'General';
    const title = document.createElement('h3');
    title.textContent = item.pregunta;
    const answer = document.createElement('p');
    answer.textContent = item.respuesta;
    body.append(category, title, answer);
    article.append(body);
    return article;
  }

  async function load() {
    setStatus(kind === 'materiales' ? 'Cargando materiales...' : 'Cargando preguntas...');
    try {
      const payload = await ImsjApi.request(`/portal/${kind}`);
      const items = Array.isArray(payload[kind]) ? payload[kind] : [];
      root.replaceChildren(...items.map(kind === 'materiales' ? materialCard : questionCard));
      setStatus(items.length ? '' : (kind === 'materiales' ? 'No hay materiales publicados.' : 'No hay preguntas frecuentes publicadas.'));
    } catch (error) {
      root.replaceChildren();
      setStatus(error.message, true);
    }
  }
  load();
}());
