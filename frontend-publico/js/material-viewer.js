/** Visor de materiales dentro del portal; los archivos conservan su URL original. */
(() => {
  let dialog;
  let stage;
  let status;
  let previousOverflow = '';
  let version = 0;

  function resourceURL(value) {
    const url = new URL(value, location.href);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Este material no tiene una dirección válida.');
    return url;
  }

  function videoEmbed(url) {
    const host = url.hostname.replace(/^www\./, '');
    let id;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    }
    if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (['vimeo.com', 'player.vimeo.com'].includes(host)) {
      const vimeoId = url.pathname.match(/\/(\d+)\/?$/)?.[1];
      if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return null;
  }

  function createDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'material-viewer';
    dialog.setAttribute('aria-labelledby', 'material-viewer-title');
    dialog.innerHTML = `<header class="material-viewer__head"><div><span class="material-kind" id="material-viewer-kind"></span><h2 id="material-viewer-title"></h2></div><button type="button" class="material-viewer__close" aria-label="Cerrar vista previa">×</button></header>
      <div class="material-viewer__stage"></div><p class="material-viewer__status" role="status"></p>
      <footer class="material-viewer__foot"><span>Materiales de estudio · Portal Vial</span><a class="btn btn-primary" target="_blank" rel="noopener noreferrer">Abrir original ↗</a></footer>`;
    stage = dialog.querySelector('.material-viewer__stage');
    status = dialog.querySelector('.material-viewer__status');
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      version++;
      stage.replaceChildren();
      document.body.style.overflow = previousOverflow;
    });
    document.body.appendChild(dialog);
  }

  function open(item) {
    let url;
    try { url = resourceURL(item.ubicacion_recurso); }
    catch (error) { ImsjForms.notify(error.message); return; }
    if (!dialog) createDialog();
    if (dialog.open) return;
    const current = ++version;
    stage.replaceChildren();
    stage.dataset.tipo = item.tipo;
    dialog.querySelector('#material-viewer-title').textContent = item.nombre;
    const kind = dialog.querySelector('#material-viewer-kind');
    kind.textContent = {PDF: 'PDF', IMAGEN: 'Imagen', VIDEO: 'Video'}[item.tipo] || 'Material';
    kind.dataset.tipo = item.tipo;
    dialog.querySelector('a').href = url.href;
    status.hidden = false;
    status.textContent = 'Cargando vista previa...';
    const ready = () => { if (current === version) status.hidden = true; };
    const failed = () => {
      if (current !== version) return;
      status.hidden = false;
      status.textContent = 'No se pudo mostrar el recurso. Podés abrir el original con el botón de abajo.';
    };
    if (item.tipo === 'IMAGEN') {
      const image = document.createElement('img');
      image.alt = item.nombre;
      image.onload = ready;
      image.onerror = failed;
      image.src = url.href;
      stage.appendChild(image);
    } else if (item.tipo === 'PDF') {
      const frame = document.createElement('iframe');
      frame.title = `PDF: ${item.nombre}`;
      frame.onload = ready;
      frame.onerror = failed;
      frame.src = url.href;
      stage.appendChild(frame);
    } else if (item.tipo === 'VIDEO') {
      const embed = videoEmbed(url);
      if (embed) {
        const frame = document.createElement('iframe');
        frame.title = `Video: ${item.nombre}`;
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'no-referrer';
        frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
        frame.onload = ready;
        frame.onerror = failed;
        frame.src = embed;
        stage.appendChild(frame);
      } else if (/\.(mp4|webm|ogv|ogg)$/i.test(url.pathname)) {
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.onloadedmetadata = ready;
        video.onerror = failed;
        video.src = url.href;
        stage.appendChild(video);
      } else {
        const message = document.createElement('p');
        message.className = 'material-viewer__external';
        message.textContent = 'Este video se reproduce en el sitio de origen. Abrilo con el botón de abajo para verlo.';
        stage.appendChild(message);
        ready();
      }
    } else {
      failed();
    }
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }
  window.ImsjMaterialViewer = {open};
})();
