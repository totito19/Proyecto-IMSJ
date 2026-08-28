/* Cartelera publica alimentada por las noticias publicadas de Laravel. */
document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const grid = document.getElementById('noticias-grid');
    const status = document.getElementById('noticias-status');
    const fallbackImage = 'mimi/img Referencia/notis.png';

    function formatDate(value) {
        if (!value) return '';
        const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
        return new Intl.DateTimeFormat('es-UY').format(date);
    }

    function imageUrl(value) {
        if (!value) return fallbackImage;
        try {
            const url = new URL(value, window.location.href);
            return ['http:', 'https:'].includes(url.protocol) ? url.href : fallbackImage;
        } catch (_) {
            return fallbackImage;
        }
    }

    function createNewsCard(news) {
        const article = document.createElement('article');
        article.className = 'card';

        const media = document.createElement('div');
        media.className = 'card-media';
        const image = document.createElement('img');
        image.src = imageUrl(news.imagen_portada);
        image.alt = news.imagen_portada ? `Portada de ${news.titulo}` : 'Imagen institucional de noticia';
        image.addEventListener('error', () => {
            image.src = fallbackImage;
        }, { once: true });
        media.appendChild(image);

        const body = document.createElement('div');
        body.className = 'card-body';

        const date = document.createElement('span');
        date.className = 'card-date';
        date.textContent = `Vigente hasta el ${formatDate(news.fecha_fin_vigencia)}`;

        const title = document.createElement('h3');
        title.textContent = news.titulo;

        const text = document.createElement('p');
        text.textContent = news.texto;

        body.append(date, title, text);
        article.append(media, body);
        return article;
    }

    try {
        const payload = await ImsjApi.request('/portal/noticias');
        const news = payload.noticias || [];
        grid.replaceChildren(...news.map(createNewsCard));
        status.hidden = news.length > 0;
        if (!news.length) status.textContent = 'No hay noticias vigentes en este momento.';
    } catch (error) {
        status.textContent = error.message;
        status.classList.add('is-error');
    }
});
