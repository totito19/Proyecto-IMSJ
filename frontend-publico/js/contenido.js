/* Materiales y preguntas públicas: sólo contenido publicado por el panel. */
(function () {
  'use strict';
  const root = document.querySelector('[data-contenido]');
  if (!root || !window.ImsjApi) return;
  const kind = root.dataset.contenido;
  const status = document.getElementById('contenido-status');
  const categoryFilter = document.getElementById('preguntas-categoria');
  const categoryFilterWrap = document.getElementById('preguntas-filtro');
  const materialFilters = document.getElementById('materiales-filtros');
  const typeLabels = {PDF: 'PDF', IMAGEN: 'Imágenes', VIDEO: 'Videos'};
  let selectedType = '';

  /** Muestra un mensaje de carga o error y oculta el área cuando queda vacío. */
  function setStatus(message = '', error = false) {
    status.textContent = message;
    status.hidden = !message;
    status.classList.toggle('is-error', error);
  }

  /** Crea una tarjeta de material usando nodos DOM para evitar HTML sin escapar. */
  function materialCard(item) {
    const article = document.createElement('article');
    article.className = 'card card-plain material-card';
    const body = document.createElement('div');
    body.className = 'card-body';
    const title = document.createElement('h3');
    title.textContent = item.nombre;
    const type = document.createElement('span');
    type.className = 'material-kind';
    type.dataset.tipo = item.tipo;
    type.textContent = typeLabels[item.tipo] || 'Material';
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'card-link';
    link.textContent = 'Ver material →';
    link.setAttribute('aria-label', `Ver ${item.nombre}`);
    link.addEventListener('click', () => ImsjMaterialViewer.open(item));
    body.append(type, title, link);
    article.append(body);
    return article;
  }

  /** Crea el bloque desplegable de una pregunta frecuente publicada. */
  function questionCard(item) {
    const article = document.createElement('article');
    article.className = 'card card-plain faq-card';
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

  /** Presenta las FAQ de la categoría elegida y mantiene el estado vacío visible. */
  function renderQuestions(items) {
    const category = categoryFilter?.value || '';
    const visible = category ? items.filter((item) => (item.categoria || 'General') === category) : items;
    root.replaceChildren(...visible.map(questionCard));
    setStatus(visible.length ? '' : 'No hay preguntas frecuentes en esta categoría.');
  }

  function renderMaterials(items) {
    const visible = selectedType ? items.filter((item) => item.tipo === selectedType) : items;
    root.replaceChildren(...visible.map(materialCard));
    setStatus(visible.length ? '' : 'No hay materiales publicados de este formato.');
    materialFilters?.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.tipo === selectedType));
    });
  }

  function prepareMaterialFilters(items) {
    if (!materialFilters) return;
    materialFilters.replaceChildren();
    for (const [type, label] of [['', 'Todos'], ...Object.entries(typeLabels)]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'material-filter';
      button.dataset.tipo = type;
      const count = type ? items.filter((item) => item.tipo === type).length : items.length;
      button.textContent = `${label} (${count})`;
      button.setAttribute('aria-pressed', String(type === selectedType));
      button.addEventListener('click', () => { selectedType = type; renderMaterials(items); });
      materialFilters.appendChild(button);
    }
    materialFilters.hidden = !items.length;
  }

  /** Genera las opciones de filtro a partir de las categorías publicadas. */
  function prepareCategoryFilter(items) {
    if (!categoryFilter || !categoryFilterWrap) return;
    const categories = [...new Set(items.map((item) => item.categoria || 'General'))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    );
    categoryFilter.replaceChildren(new Option('Todas las categorías', ''));
    categories.forEach((category) => categoryFilter.add(new Option(category, category)));
    categoryFilterWrap.hidden = items.length === 0;
    categoryFilter.addEventListener('change', () => renderQuestions(items), { once: false });
  }

  /** Decide el endpoint según la página y presenta el contenido publicado. */
  async function load() {
    setStatus(kind === 'materiales' ? 'Cargando materiales...' : 'Cargando preguntas...');
    try {
      const payload = await ImsjApi.request(`/portal/${kind}`);
      const items = Array.isArray(payload[kind]) ? payload[kind] : [];
      if (kind === 'preguntas') {
        prepareCategoryFilter(items);
        renderQuestions(items);
        if (!items.length) setStatus('No hay preguntas frecuentes publicadas.');
      } else {
        prepareMaterialFilters(items);
        renderMaterials(items);
        setStatus(items.length ? '' : 'No hay materiales publicados.');
      }
    } catch (error) {
      root.replaceChildren();
      setStatus(error.message, true);
    }
  }
  load();
})();
