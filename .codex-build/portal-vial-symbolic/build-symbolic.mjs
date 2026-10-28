import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const workspaceDir = 'C:\\Users\\ASUS\\Desktop\\Proyecto1\\Proyecto-IMSJ';
const buildDir = path.join(workspaceDir, '.codex-build', 'portal-vial-symbolic');
const previewDir = path.join(buildDir, 'previews');
const outputDir = path.join(workspaceDir, 'output', 'presentaciones');
const finalPath = path.join(outputDir, 'Portal_Vial_Defensa_SIMBOLICA.pptx');
const skillDir = 'C:\\Users\\ASUS\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.1025.11240\\skills\\presentations';
const pythonExecutable = 'C:\\Users\\ASUS\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';

await fs.mkdir(previewDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const C = {
  navy: '#12204F', blue: '#1A56A8', orange: '#FF7A30', ink: '#1B1F2E',
  fog: '#F3F5FB', white: '#FFFFFF', muted: '#65708A', line: '#DCE3F2',
  green: '#21945C', greenBg: '#E6F5EE', amber: '#C9820D', amberBg: '#FFF3D8',
};
const FONT = 'Segoe UI';
const W = 1280;
const H = 720;
const TOTAL = 53;
const presentation = Presentation.create({ slideSize: { width: W, height: H } });

async function bytes(file) {
  const b = await fs.readFile(file);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

const oldAssets = path.join(workspaceDir, '.codex-build', 'portal-vial-deck', 'assets');
const newAssets = path.join(buildDir, 'assets');
const assets = {
  crest: await bytes(path.join(workspaceDir, 'frontend-imsj', 'img', 'escudo-san-jose.png')),
  rc5: await bytes(path.join(workspaceDir, 'docs', 'general', 'identidad', 'rc5.png')),
  home: await bytes(path.join(oldAssets, 'portal-inicio.png')),
  materials: await bytes(path.join(oldAssets, 'portal-materiales.png')),
  faq: await bytes(path.join(oldAssets, 'portal-faq.png')),
  publicNews: await bytes(path.join(oldAssets, 'portal-noticias.png')),
  simulator: await bytes(path.join(oldAssets, 'portal-simulador.png')),
  publicAgenda: await bytes(path.join(oldAssets, 'portal-agenda.png')),
  publicQuery: await bytes(path.join(oldAssets, 'portal-consulta.png')),
  adminNews: await bytes(path.join(oldAssets, 'panel-noticias.png')),
  adminAgenda: await bytes(path.join(oldAssets, 'panel-agenda.png')),
  adminQueries: await bytes(path.join(oldAssets, 'panel-consultas.png')),
  young: await bytes(path.join(newAssets, '01-joven-informacion.png')),
  direction: await bytes(path.join(newAssets, '02-direccion-barrera.png')),
  portal: await bytes(path.join(newAssets, '03-portal-puente.png')),
  process: await bytes(path.join(newAssets, '04-proceso.png')),
  architecture: await bytes(path.join(newAssets, '05-arquitectura.png')),
  security: await bytes(path.join(newAssets, '06-seguridad.png')),
  concurrency: await bytes(path.join(newAssets, '07-concurrencia.png')),
  infrastructure: await bytes(path.join(newAssets, '08-infraestructura.png')),
};

function box(slide, x, y, w, h, fill, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry || 'rect',
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: opts.line || { style: 'solid', fill: 'none', width: 0 },
    borderRadius: opts.radius,
    shadow: opts.shadow,
  });
}

function text(slide, value, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: 'textbox',
    position: { left: x, top: y, width: w, height: h },
    fill: 'none',
    line: { style: 'solid', fill: 'none', width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    typeface: FONT,
    fontSize: opts.size || 34,
    bold: opts.bold ?? true,
    color: opts.color || C.white,
    alignment: opts.align || 'left',
    verticalAlignment: opts.valign || 'middle',
    autoFit: 'shrinkText',
    wrap: 'square',
    insets: 0,
    lineSpacing: opts.lineSpacing,
  };
  return shape;
}

function image(slide, blob, x = 0, y = 0, w = W, h = H, opts = {}) {
  return slide.images.add({
    blob,
    contentType: 'image/png',
    alt: opts.alt || '',
    fit: opts.fit || 'cover',
    position: { left: x, top: y, width: w, height: h },
    geometry: opts.geometry || 'rect',
    borderRadius: opts.radius,
    shadow: opts.shadow,
  });
}

function notes(slide, lines, sources = []) {
  slide.speakerNotes.text = [...lines, '', ...sources.map((s) => `Fuente: ${s}`)].join('\n');
}

function page(slide, n, color = C.white) {
  text(slide, `${String(n).padStart(2, '0')} / ${TOTAL}`, 1130, 676, 92, 18, { size: 11, bold: true, color, align: 'right' });
}

function wordSlide(word, n, opts = {}) {
  const s = presentation.slides.add();
  s.background.fill = opts.bg || C.navy;
  box(s, 0, 0, 14, H, opts.accent || C.orange);
  if (opts.kicker) text(s, opts.kicker.toUpperCase(), 80, 105, 500, 28, { size: 14, color: opts.accent || C.orange });
  text(s, word, 80, 190, 1080, 220, { size: opts.size || 76, color: opts.color || C.white, bold: true });
  if (opts.sub) text(s, opts.sub, 80, 430, 970, 74, { size: 24, bold: false, color: opts.subColor || '#DCE5F7' });
  if (opts.footer) text(s, opts.footer, 80, 598, 900, 28, { size: 14, color: '#8FA0CC' });
  page(s, n, '#8FA0CC');
  notes(s, opts.notes || [word]);
  return s;
}

function visualSlide(blob, headline, n, opts = {}) {
  const s = presentation.slides.add();
  image(s, blob, 0, 0, W, H, { alt: opts.alt || headline });
  if (opts.panel === 'left') box(s, 0, 0, opts.panelWidth || 500, H, C.navy);
  if (opts.panel === 'top') box(s, 0, 0, W, opts.panelHeight || 145, C.navy);
  if (opts.eyebrow) text(s, opts.eyebrow.toUpperCase(), opts.x || 70, opts.ey || 54, 480, 24, { size: 13, color: C.orange });
  text(s, headline, opts.x || 70, opts.y || 104, opts.w || 700, opts.h || 130, {
    size: opts.size || 54,
    color: opts.color || C.white,
    align: opts.align || 'left',
  });
  if (opts.sub) text(s, opts.sub, opts.x || 70, opts.subY || 250, opts.subW || 560, opts.subH || 74, { size: 22, bold: false, color: opts.subColor || '#DCE5F7', align: opts.align || 'left' });
  page(s, n, opts.pageColor || '#A9B8DA');
  notes(s, opts.notes || [headline], opts.sources || []);
  return s;
}

function screenSlide(blob, label, n, opts = {}) {
  const s = presentation.slides.add();
  s.background.fill = C.fog;
  image(s, blob, 0, 0, W, H, { alt: label, fit: opts.fit || 'cover' });
  box(s, 0, 0, W, 70, C.navy);
  text(s, label.toUpperCase(), 58, 18, 720, 34, { size: 18, color: C.white });
  if (opts.right) text(s, opts.right.toUpperCase(), 840, 18, 370, 34, { size: 13, color: C.orange, align: 'right' });
  notes(s, opts.notes || [`Mostrar la pantalla: ${label}.`], opts.sources || []);
  return s;
}

function dateSlide(date, label, n, opts = {}) {
  const s = presentation.slides.add();
  s.background.fill = opts.bg || C.fog;
  text(s, date, 70, 140, 1140, 190, { size: 104, color: opts.dateColor || C.orange, align: 'center' });
  text(s, label, 70, 350, 1140, 94, { size: 44, color: opts.labelColor || C.navy, align: 'center' });
  if (opts.sub) text(s, opts.sub, 180, 486, 920, 58, { size: 21, bold: false, color: C.muted, align: 'center' });
  page(s, n, C.blue);
  notes(s, opts.notes || [`${date}: ${label}.`], opts.sources || []);
  return s;
}

function metricSlide(value, label, n, opts = {}) {
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  box(s, 0, 0, 14, H, opts.accent || C.orange);
  text(s, value, 70, 142, 1140, 240, { size: opts.size || 128, color: opts.accent || C.orange, align: 'center' });
  text(s, label, 160, 410, 960, 82, { size: 32, color: C.white, align: 'center' });
  if (opts.sub) text(s, opts.sub, 220, 540, 840, 54, { size: 18, bold: false, color: '#C7D5F0', align: 'center' });
  page(s, n, '#8FA0CC');
  notes(s, opts.notes || [`Resultado: ${value}, ${label}.`], opts.sources || []);
  return s;
}

// 01 — Cover
{
  const s = presentation.slides.add();
  image(s, assets.portal, 0, 0, W, H, { alt: 'Portal naranja que conecta a la ciudadanía con la institución' });
  text(s, 'PORTAL VIAL', 64, 54, 650, 70, { size: 48, color: C.white });
  text(s, 'Dos necesidades. Una conexión.', 64, 132, 650, 48, { size: 22, bold: false, color: '#DCE5F7' });
  image(s, assets.rc5, 1020, 42, 82, 40, { alt: 'RC5', fit: 'contain' });
  image(s, assets.crest, 1130, 34, 58, 58, { alt: 'Intendencia de San José', fit: 'contain' });
  page(s, 1, '#A9B8DA');
  notes(s, ['Abrir con una pausa.', 'Portal Vial nace para conectar dos necesidades que hasta ese momento estaban separadas.']);
}

visualSlide(assets.young, 'Quiero sacar la libreta', 2, { x: 62, y: 74, w: 500, size: 48, alt: 'Joven frente a información dispersa', notes: ['Presentar al joven como protagonista del primer problema.', 'Quiere prepararse para obtener la libreta de conducir.'] });
visualSlide(assets.young, '¿Dónde estudio?', 3, { x: 62, y: 74, w: 520, size: 58, notes: ['La primera pregunta parece sencilla, pero la respuesta está distribuida entre distintos canales.'] });
visualSlide(assets.young, '¿Qué necesito?', 4, { x: 62, y: 74, w: 520, size: 58, notes: ['La duda no termina en el contenido teórico. También necesita requisitos, fechas y respuestas confiables.'] });
wordSlide('La información existe', 5, { kicker: 'El problema', sub: 'Encontrarla y reconocer la versión correcta lleva tiempo.', notes: ['No afirmar que la información no existe.', 'El problema real es la dispersión y la dificultad de ubicar la versión vigente.'] });
wordSlide('Pero está dispersa', 6, { kicker: 'El problema', accent: C.orange, notes: ['Cerrar la perspectiva ciudadana con una frase breve.'] });
visualSlide(assets.direction, 'Necesitamos llegar', 7, { x: 440, y: 88, w: 400, h: 100, size: 52, color: C.navy, align: 'center', pageColor: C.blue, alt: 'Institución intenta comunicar con jóvenes', notes: ['Cambiar de perspectiva.', 'La Dirección tiene conocimiento y materiales, pero necesita un canal para acercarlos a los jóvenes.'] });

// 08 — Split actors
{
  const s = presentation.slides.add();
  image(s, assets.young, 0, 0, 640, H, { alt: 'Necesidad ciudadana' });
  image(s, assets.direction, 640, 0, 640, H, { alt: 'Necesidad institucional' });
  box(s, 0, 0, W, 106, C.navy);
  text(s, 'Dos necesidades', 70, 18, 1140, 70, { size: 46, align: 'center' });
  text(s, 'ENCONTRAR', 70, 604, 500, 54, { size: 24, align: 'center', color: C.white });
  text(s, 'LLEGAR', 710, 604, 500, 54, { size: 24, align: 'center', color: C.navy });
  page(s, 8, C.blue);
  notes(s, ['Mostrar las dos perspectivas en la misma pantalla.', 'Una necesita encontrar. La otra necesita llegar.']);
}

wordSlide('Una misma brecha', 9, { kicker: 'Punto de encuentro', sub: 'Acceso y comunicación.', notes: ['Nombrar el problema compartido.', 'Ambas necesidades se encuentran en una brecha de acceso y comunicación.'] });
visualSlide(assets.portal, 'Portal Vial', 10, { x: 62, y: 60, w: 520, size: 64, sub: 'Un único punto de encuentro', subY: 134, notes: ['Presentar la solución con una sola frase.', 'Portal Vial conecta ciudadanía y Dirección de Tránsito.'] });

wordSlide('Estudiar', 11, { kicker: 'Portal ciudadano', notes: ['Plantear la primera situación de uso: necesito prepararme para el teórico.'] });
screenSlide(assets.materials, 'Materiales de estudio', 12, { right: 'Contenido centralizado', notes: ['Mostrar los materiales como respuesta directa a la necesidad de estudiar.'] });
wordSlide('Informarse', 13, { kicker: 'Portal ciudadano', notes: ['Segunda situación: necesito conocer novedades y contenido vigente.'] });
screenSlide(assets.publicNews, 'Noticias vigentes', 14, { right: 'Información actualizada', notes: ['Mostrar noticias públicas y vigencia.'] });
wordSlide('Resolver', 15, { kicker: 'Portal ciudadano', notes: ['Tercera situación: tengo una duda frecuente sobre un trámite.'] });
screenSlide(assets.faq, 'Preguntas frecuentes', 16, { right: 'Por categoría', notes: ['Mostrar preguntas frecuentes organizadas por categoría.'] });
wordSlide('Preguntar', 17, { kicker: 'Portal ciudadano', sub: 'Cuando la respuesta todavía no está publicada.', notes: ['La solución no termina en el contenido ya publicado.', 'Si la duda no está respondida, la persona puede enviarla.'] });
screenSlide(assets.publicQuery, 'Consulta ciudadana', 18, { right: 'Canal directo', notes: ['Mostrar el formulario público de consultas.'] });
wordSlide('Practicar', 19, { kicker: 'Portal ciudadano', notes: ['Introducir el simulador teórico como práctica, no como certificación.'] });
screenSlide(assets.simulator, 'Simulador teórico', 20, { right: 'Corrección inmediata', notes: ['Mostrar preguntas de múltiple opción y corrección.', 'Aclarar que el simulador sirve para practicar.'] });
wordSlide('Reservar', 21, { kicker: 'Portal ciudadano', notes: ['Introducir la agenda como una acción concreta que necesita cupos reales.'] });
screenSlide(assets.publicAgenda, 'Agenda y cupos', 22, { right: 'Franjas disponibles', notes: ['Mostrar fechas, horarios y cupos disponibles.'] });
wordSlide('Gestionar', 23, { kicker: 'Panel IMSJ', sub: 'El contenido y la operación quedan en manos de la Dirección.', notes: ['Cambiar al segundo producto: el panel interno.'] });
screenSlide(assets.adminNews, 'Gestión de contenidos', 24, { right: 'Panel IMSJ', notes: ['Mostrar que el personal puede mantener noticias y contenido.'] });

// 25 — Admin split
{
  const s = presentation.slides.add();
  s.background.fill = C.fog;
  image(s, assets.adminAgenda, 32, 88, 780, 560, { alt: 'Agenda administrativa', fit: 'cover', geometry: 'roundRect', radius: 16, shadow: 'shadow-md' });
  image(s, assets.adminQueries, 842, 88, 406, 270, { alt: 'Bandeja de consultas', fit: 'cover', geometry: 'roundRect', radius: 16, shadow: 'shadow-md' });
  box(s, 842, 386, 406, 262, C.navy, { geometry: 'roundRect', radius: 16 });
  text(s, 'Agenda\nConsultas\nContenido', 878, 408, 330, 190, { size: 34, color: C.white, align: 'center' });
  text(s, 'OPERACIÓN DIARIA', 48, 28, 500, 36, { size: 17, color: C.orange });
  page(s, 25, C.blue);
  notes(s, ['El panel reúne agenda, consultas y contenidos.', 'Todavía no explicar el flujo de aprobación. Su origen aparece después de la primera demo.']);
}

visualSlide(assets.portal, 'Un solo sistema', 26, { x: 62, y: 60, w: 600, size: 58, sub: 'Dos experiencias conectadas', subY: 134, notes: ['Cerrar el acto de la solución.', 'Portal y panel responden a recorridos distintos, pero comparten el mismo sistema.'] });
wordSlide('Nada sale de la nada', 27, { kicker: 'Proceso', sub: 'Cada pantalla tiene un origen, una decisión y una validación.', notes: ['Transición hacia gestión de proyectos.', 'Todo lo mostrado surgió mediante un proceso registrado.'] });
visualSlide(assets.process, 'Paso a paso', 28, { x: 64, y: 50, w: 500, size: 54, alt: 'Proceso del proyecto por etapas', notes: ['Recorrer el proceso como una historia.', 'Cada etapa produjo la entrada de la siguiente.'] });
dateSlide('09 JUL', 'Entrevista', 29, { sub: 'La idea general se confrontó con la necesidad real.', notes: ['La entrevista permitió aclarar alcance, actores y prioridades.'], sources: [path.join(workspaceDir, 'docs', 'ingenieria_software', 'informe entrevista.md')] });
wordSlide('Requisitos', 30, { kicker: 'Puesta en limpio', sub: 'Lo conversado se convirtió en alcance verificable.', notes: ['Después de la entrevista se revisaron y ordenaron los requisitos.'] });
wordSlide('Historias', 31, { kicker: '22–28 JUL', sub: 'Cada necesidad obtuvo un recorrido y un criterio de aceptación.', notes: ['Los requisitos se transformaron en historias de usuario y backlog.'] });
wordSlide('Sprints 1–4', 32, { kicker: 'Construcción', sub: 'Primera versión funcional.', notes: ['El equipo construyó una primera versión mediante cuatro sprints.'] });
dateSlide('03 SEP', 'Primera demo', 33, { sub: 'El producto se mostró antes de considerarlo terminado.', notes: ['La primera demo abrió una instancia real de validación con el cliente.'], sources: [path.join(workspaceDir, 'docs', 'ingenieria_software', 'actas_sprint_review.md')] });
wordSlide('Cambios', 34, { kicker: 'Feedback registrado', sub: 'Consultas ciudadanas. Aprobación separada. Imágenes en el simulador.', notes: ['La demo produjo tres ampliaciones concretas.', 'Los cambios se registraron antes de implementarse.'] });
wordSlide('Aprobar ≠ publicar', 35, { kicker: 'CC-03', accent: C.orange, sub: 'La devolución del cliente separó dos responsabilidades.', notes: ['Aquí aparece por primera vez la aprobación editorial.', 'La Directora aprueba y el personal publica.'] });
wordSlide('Sprint 5', 36, { kicker: 'Cambios implementados', sub: 'El feedback volvió al desarrollo y a las pruebas.', notes: ['El equipo implementó las ampliaciones solicitadas.'] });
dateSlide('13 OCT', 'Segunda demo', 37, { sub: 'Cambios demostrados y producto aprobado.', dateColor: C.green, notes: ['La segunda demo cerró el ciclo de cambio con una nueva validación.'], sources: [path.join(workspaceDir, 'docs', 'ingenieria_software', 'actas_sprint_review.md')] });

// 38 — Traceability minimal
{
  const s = presentation.slides.add();
  s.background.fill = C.fog;
  const labels = ['NECESIDAD', 'REQUISITO', 'HISTORIA', 'CÓDIGO', 'PRUEBA', 'EVIDENCIA'];
  const shapes = labels.map((label, i) => {
    const x = 44 + i * 204;
    const shape = box(s, x, 286, 168, 92, i === 5 ? C.greenBg : C.white, { geometry: 'roundRect', radius: 20, line: { style: 'solid', fill: i === 5 ? C.green : C.blue, width: 2 } });
    text(s, label, x + 12, 300, 144, 64, { size: 17, color: i === 5 ? C.green : C.navy, align: 'center' });
    return shape;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: C.orange, width: 3 }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  }
  text(s, 'Trazabilidad', 64, 84, 900, 80, { size: 58, color: C.navy });
  text(s, 'Del origen a la evidencia', 64, 164, 600, 40, { size: 22, bold: false, color: C.muted });
  page(s, 38, C.blue);
  notes(s, ['Cada elemento puede rastrearse desde la necesidad hasta una comprobación concreta.']);
}

wordSlide('¿Cómo lo hicimos?', 39, { kicker: 'Ingeniería', sub: 'Capas, datos, despliegue y seguridad.', notes: ['Abrir la sección técnica conectándola con el alcance.'] });
visualSlide(assets.architecture, 'Capas', 40, { x: 64, y: 50, w: 420, size: 60, alt: 'Arquitectura por capas', notes: ['Una petición atraviesa responsabilidades separadas.', 'Navegador, router, controlador, servicio, repositorio y base de datos.'] });
wordSlide('Frontend', 41, { kicker: 'Interfaz', sub: 'HTML · CSS · JavaScript · Fetch', notes: ['El navegador presenta las dos experiencias y consume la API mediante Fetch.'] });
wordSlide('Backend', 42, { kicker: 'Reglas', sub: 'PHP 8.5 nativo', notes: ['PHP nativo hizo explícitas las rutas, permisos y reglas.', 'Sustituyó Laravel para facilitar comprensión y defensa, no porque Laravel fuera incorrecto.'] });
wordSlide('Datos', 43, { kicker: 'Persistencia', sub: 'PDO · MySQL 8.4 · InnoDB', notes: ['PDO usa parámetros y MySQL mantiene relaciones, restricciones y transacciones.'] });
visualSlide(assets.infrastructure, 'Despliegue', 44, { panel: 'left', panelWidth: 430, x: 64, y: 132, w: 340, size: 54, sub: 'Ubuntu · Docker · 2 servicios', subY: 232, subW: 320, alt: 'Infraestructura con aplicación y base separadas', notes: ['Docker Compose separa aplicación y base de datos.', 'Los volúmenes conservan adjuntos, caché y datos.'], sources: [path.join(workspaceDir, 'docs', 'administracion_ssoo', 'justificacion-tecnologica.md')] });

// 45 — Reservation path
{
  const s = presentation.slides.add();
  s.background.fill = C.fog;
  text(s, 'POST /api/reservas', 64, 58, 600, 60, { size: 40, color: C.navy });
  const labels = ['turnos.js', 'index.php', 'Controller', 'Service', 'Repository', '201'];
  const shapes = labels.map((label, i) => {
    const x = 46 + i * 205;
    const fill = i === 3 ? '#FFF0E7' : i === 5 ? C.greenBg : C.white;
    const line = i === 3 ? C.orange : i === 5 ? C.green : C.blue;
    const sh = box(s, x, 286, 166, 92, fill, { geometry: 'roundRect', radius: 18, line: { style: 'solid', fill: line, width: 2 } });
    text(s, label, x + 10, 300, 146, 64, { size: 18, color: i === 5 ? C.green : C.navy, align: 'center' });
    return sh;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: C.orange, width: 3 }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  }
  text(s, 'Una reserva recorre archivos reales', 64, 446, 1150, 60, { size: 30, color: C.navy, align: 'center' });
  page(s, 45, C.blue);
  notes(s, ['Explicar el recorrido concreto de una reserva.', 'El servicio valida reglas y el repositorio persiste dentro de una transacción.'], [path.join(workspaceDir, 'docs', 'programacion_full_stack', 'guia_codigo_y_defensa.md')]);
}

visualSlide(assets.concurrency, 'Un último cupo', 46, { x: 62, y: 62, w: 520, size: 56, sub: 'Solo una reserva puede ganar', subY: 136, alt: 'Dos solicitudes compiten por un único cupo', notes: ['Dos solicitudes compiten por el último cupo.', 'La transacción y el bloqueo permiten una sola reserva. La otra recibe una respuesta controlada.'] });

// 47 — Editorial state flow
{
  const s = presentation.slides.add();
  s.background.fill = C.fog;
  text(s, 'Aprobación editorial', 64, 64, 900, 64, { size: 48, color: C.navy });
  const states = [
    ['BORRADOR', C.white, C.muted], ['PENDIENTE', C.amberBg, C.amber],
    ['APROBADO', '#EAF1FB', C.blue], ['PUBLICADO', C.greenBg, C.green],
  ];
  const shapes = states.map((state, i) => {
    const x = 74 + i * 300;
    const sh = box(s, x, 278, 222, 106, state[1], { geometry: 'roundRect', radius: 22, line: { style: 'solid', fill: state[2], width: 2 } });
    text(s, state[0], x + 16, 298, 190, 66, { size: 22, color: state[2], align: 'center' });
    return sh;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: C.orange, width: 4 }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  }
  text(s, 'Editar reinicia el ciclo', 290, 488, 700, 52, { size: 27, color: C.orange, align: 'center' });
  page(s, 47, C.blue);
  notes(s, ['El cambio CC-03 se convirtió en un flujo de estados.', 'Si alguien edita el contenido, vuelve a borrador y necesita una aprobación nueva.']);
}

visualSlide(assets.security, 'Seguridad por capas', 48, { x: 62, y: 94, w: 500, size: 52, sub: 'SAST · DAST · Nmap · API', subY: 176, subW: 430, alt: 'Sistema protegido por capas', notes: ['Combinar controles dentro del sistema con pruebas desde fuera.', 'Ninguna herramienta garantiza seguridad por sí sola. Los hallazgos se corrigen y vuelven a probar.'], sources: [path.join(workspaceDir, 'docs', 'electiva_ciberseguridad', 'checklist_ciberseguridad_entrega_final.md')] });
metricSlide('192', 'comprobaciones de integración', 49, { notes: ['Aclarar que son comprobaciones de integración, no cobertura de líneas.'], sources: [path.join(workspaceDir, 'docs', 'ingenieria_software', 'plan_informe_pruebas.md')] });
metricSlide('46', 'rutas del sistema', 50, { notes: ['Las rutas cubren los módulos públicos y administrativos.'] });
metricSlide('43', 'comprobaciones de seguridad aprobadas', 51, { accent: '#65D39C', notes: ['La auditoría de seguridad de la API verificó 43 escenarios.'] });
metricSlide('201 / 422', 'dos solicitudes, un último cupo', 52, { size: 102, sub: '90 sesiones simultáneas: prueba de carga pendiente.', notes: ['La prueba concurrente produjo una creación y un rechazo controlado.', 'No afirmar que la carga de 90 sesiones ya fue validada.'] });
visualSlide(assets.portal, 'Dos necesidades. Una solución.', 53, { x: 64, y: 52, w: 760, size: 52, sub: 'Portal Vial', subY: 130, notes: ['Cerrar retomando a los dos actores del inicio.', 'La ciudadanía encuentra. La Dirección llega y gestiona.', 'Dejar esta pantalla durante las preguntas.'] });

for (const [index, slide] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(previewDir, `slide-${String(index + 1).padStart(2, '0')}.png`), new Uint8Array(await png.arrayBuffer()));
}

const montage = await presentation.export({ format: 'webp', montage: true });
await fs.writeFile(path.join(buildDir, 'montage.webp'), new Uint8Array(await montage.arrayBuffer()));

const stagingDir = path.join(buildDir, 'finalizer');
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, 'candidate.pptx');
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, 'container_tools', 'artifact_tool_utils.mjs')).href);
const result = await finalizePresentation({
  explicitTotalSlideCount: TOTAL,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable,
  integrityValidatorPath: path.join(skillDir, 'container_tools', 'inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skillDir, 'container_tools', 'inspect_presentation_layout_geometry.py'),
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-heading-fit'],
  fontPolicy: { basis: 'design', families: [FONT] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, 'Portal_Vial_Defensa_SIMBOLICA.validation.json'),
});

console.log(JSON.stringify({ finalPath, slides: presentation.slides.items.length, result }, null, 2));
