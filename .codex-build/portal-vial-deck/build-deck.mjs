import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const workspaceDir = 'C:\\Users\\ASUS\\Desktop\\Proyecto1\\Proyecto-IMSJ';
const buildDir = path.join(workspaceDir, '.codex-build', 'portal-vial-deck');
const previewDir = path.join(buildDir, 'previews-diseno');
const outputDir = path.join(workspaceDir, 'output', 'presentaciones');
const finalPath = path.join(outputDir, 'Portal_Vial_Defensa_DISENO.pptx');
const skillDir = 'C:\\Users\\ASUS\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.1025.11240\\skills\\presentations';
const pythonExecutable = 'C:\\Users\\ASUS\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';

await fs.mkdir(previewDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const C = {
  navy: '#12204F',
  blue: '#1A56A8',
  blue2: '#2F4FC7',
  orange: '#FF7A30',
  ink: '#1B1F2E',
  fog: '#F3F5FB',
  white: '#FFFFFF',
  muted: '#5A6075',
  line: '#DDE3F0',
  green: '#1C8A5A',
  greenBg: '#E6F5EE',
  amber: '#B9790A',
  amberBg: '#FFF3D8',
  red: '#B91C1C',
  paleBlue: '#EAF1FB',
};
const FONT = 'Segoe UI';
const W = 1280;
const H = 720;

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

async function bytes(file) {
  const b = await fs.readFile(file);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

const assets = {
  crest: await bytes(path.join(workspaceDir, 'frontend-imsj', 'img', 'escudo-san-jose.png')),
  rc5: await bytes(path.join(workspaceDir, 'docs', 'general', 'identidad', 'rc5.png')),
  facade: await bytes(path.join(workspaceDir, 'frontend-publico', 'img', 'Imagen_fachada.png')),
  home: await bytes(path.join(buildDir, 'assets', 'portal-inicio.png')),
  materials: await bytes(path.join(buildDir, 'assets', 'portal-materiales.png')),
  faq: await bytes(path.join(buildDir, 'assets', 'portal-faq.png')),
  admin: await bytes(path.join(buildDir, 'assets', 'panel-noticias.png')),
  agenda: await bytes(path.join(buildDir, 'assets', 'panel-agenda.png')),
  consultations: await bytes(path.join(buildDir, 'assets', 'panel-consultas.png')),
};

function box(slide, x, y, w, h, fill, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry || 'rect',
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: opts.line || { style: 'solid', fill: 'none', width: 0 },
    borderRadius: opts.radius,
    shadow: opts.shadow,
    name: opts.name,
  });
}

function textBox(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({
    geometry: 'textbox',
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill || 'none',
    line: opts.line || { style: 'solid', fill: 'none', width: 0 },
    borderRadius: opts.radius,
    name: opts.name,
  });
  shape.text = text;
  shape.text.style = {
    typeface: FONT,
    fontSize: opts.size || 24,
    bold: opts.bold || false,
    color: opts.color || C.ink,
    alignment: opts.align || 'left',
    verticalAlignment: opts.valign || 'top',
    autoFit: opts.autoFit || 'shrinkText',
    wrap: 'square',
    insets: opts.insets ?? 0,
    lineSpacing: opts.lineSpacing,
  };
  return shape;
}

function imageBox(slide, blob, x, y, w, h, opts = {}) {
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

function lightFrame(slide, number, section) {
  slide.background.fill = C.white;
  box(slide, 0, 0, W, 7, C.blue);
  textBox(slide, 'PORTAL VIAL | DEFENSA', 64, 24, 260, 20, { size: 13, bold: true, color: C.blue, valign: 'middle' });
  textBox(slide, section.toUpperCase(), 900, 24, 300, 20, { size: 13, bold: true, color: C.muted, align: 'right', valign: 'middle' });
  box(slide, 64, 686, 1152, 1, C.line);
  textBox(slide, String(number).padStart(2, '0'), 1160, 692, 55, 16, { size: 12, bold: true, color: C.blue, align: 'right' });
}

function title(slide, value, subtitle) {
  textBox(slide, value, 64, 66, 1120, 64, { size: 36, bold: true, color: C.navy, valign: 'middle' });
  if (subtitle) textBox(slide, subtitle, 64, 128, 1080, 48, { size: 19, color: C.muted });
}

function note(slide, lines, sources = []) {
  slide.speakerNotes.text = [
    ...lines,
    '',
    ...sources.map((source) => `Fuente: ${source}`),
  ];
}

function pill(slide, value, x, y, w, fill = C.paleBlue, color = C.blue) {
  const p = box(slide, x, y, w, 34, fill, { geometry: 'roundRect', radius: 17 });
  textBox(slide, value, x, y, w, 34, { size: 14, bold: true, color, align: 'center', valign: 'middle' });
  return p;
}

function node(slide, value, x, y, w, h, opts = {}) {
  const shape = box(slide, x, y, w, h, opts.fill || C.white, {
    geometry: 'roundRect', radius: opts.radius || 16,
    line: { style: 'solid', fill: opts.line || C.line, width: opts.lineWidth || 1.5 },
    shadow: opts.shadow,
  });
  textBox(slide, value, x + 12, y + 8, w - 24, h - 16, {
    size: opts.size || 18, bold: opts.bold ?? true, color: opts.color || C.navy,
    align: opts.align || 'center', valign: 'middle',
  });
  return shape;
}

// 01 — Cover
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  box(s, 0, 0, 14, H, C.orange);
  textBox(s, 'DIRECCIÓN DE TRÁNSITO · SAN JOSÉ', 66, 52, 440, 22, { size: 13, bold: true, color: '#C7D5F0' });
  imageBox(s, assets.rc5, 1010, 46, 90, 42, { alt: 'Logo RC5', fit: 'contain' });
  box(s, 1120, 48, 1, 38, '#5D6D9E');
  imageBox(s, assets.crest, 1144, 42, 58, 58, { alt: 'Escudo de San José', fit: 'contain' });
  box(s, 66, 176, 110, 3, C.orange);
  textBox(s, 'Portal Vial', 66, 226, 900, 112, { size: 74, bold: true, color: C.white, valign: 'middle' });
  textBox(s, 'Información, educación y gestión vial\nen un solo lugar', 66, 360, 900, 104, { size: 31, bold: true, color: '#E8EEFA', lineSpacing: 1.12 });
  textBox(s, 'DEFENSA DEL PROYECTO', 66, 578, 270, 24, { size: 14, bold: true, color: '#C7D5F0' });
  box(s, 352, 590, 180, 1, '#5D6D9E');
  textBox(s, '2026', 550, 578, 80, 24, { size: 14, bold: true, color: '#C7D5F0' });
  textBox(s, '01 / 21', 1110, 646, 92, 22, { size: 13, bold: true, color: '#8FA0CC', align: 'right' });
  note(s, [
    'Abrir con una pausa breve. No presentar tecnologías todavía.',
    'Frase sugerida: Portal Vial nace al conectar una necesidad ciudadana con una necesidad institucional.',
  ], [path.join(workspaceDir, 'output', 'pdf', 'guia_identidad_grafica_documentacion_imsj.pdf')]);
}

// 02 — Problem
{
  const s = presentation.slides.add();
  lightFrame(s, 2, 'El problema');
  title(s, 'Dos perspectivas, una misma brecha', 'El acceso a la información y la capacidad de comunicar estaban desconectados.');
  textBox(s, '01', 72, 220, 90, 78, { size: 56, bold: true, color: C.orange, valign: 'middle' });
  textBox(s, 'Un joven que quiere prepararse', 170, 218, 430, 42, { size: 27, bold: true, color: C.navy });
  textBox(s, 'Necesita saber qué estudiar, dónde practicar y cómo resolver una duda sin recorrer canales dispersos.', 170, 274, 420, 112, { size: 21, color: C.muted, lineSpacing: 1.15 });
  box(s, 630, 208, 2, 308, C.line);
  textBox(s, '02', 680, 220, 90, 78, { size: 56, bold: true, color: C.blue, valign: 'middle' });
  textBox(s, 'Una Dirección que necesita llegar', 778, 218, 420, 42, { size: 27, bold: true, color: C.navy });
  textBox(s, 'Necesita comunicar, concientizar y mantener información vigente sin depender del equipo desarrollador.', 778, 274, 410, 112, { size: 21, color: C.muted, lineSpacing: 1.15 });
  box(s, 170, 438, 420, 72, '#FFF4ED', { geometry: 'roundRect', radius: 14 });
  textBox(s, 'Información difícil de localizar', 190, 454, 380, 40, { size: 20, bold: true, color: '#C85218', valign: 'middle' });
  box(s, 778, 438, 410, 72, C.paleBlue, { geometry: 'roundRect', radius: 14 });
  textBox(s, 'Una barrera para acercarse a los jóvenes', 798, 448, 370, 52, { size: 20, bold: true, color: C.blue, valign: 'middle' });
  note(s, [
    'Contar la situación como una escena, no como una lista de requisitos.',
    'Evitar afirmar que no existe información en ningún lado. Hablar de información distribuida y dificultad para encontrar la versión adecuada.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'informe entrevista.md')]);
}

// 03 — Solution
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  textBox(s, 'LA SOLUCIÓN', 64, 56, 220, 24, { size: 14, bold: true, color: C.orange });
  textBox(s, 'Portal Vial conecta ambas necesidades', 64, 104, 1136, 78, { size: 42, bold: true, color: C.white, align: 'center', valign: 'middle' });
  const citizen = node(s, 'CIUDADANÍA', 90, 302, 250, 82, { fill: C.white, line: C.white, color: C.navy, size: 22 });
  const portal = node(s, 'PORTAL VIAL', 500, 276, 280, 134, { fill: C.orange, line: C.orange, color: C.white, size: 30, radius: 24, shadow: 'shadow-lg' });
  const direction = node(s, 'DIRECCIÓN DE TRÁNSITO', 940, 302, 250, 82, { fill: C.white, line: C.white, color: C.navy, size: 20 });
  s.shapes.connect(citizen, portal, { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: '#8FA9D7', width: 4 }, head: { type: 'triangle', width: 'sm', length: 'sm' }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  s.shapes.connect(direction, portal, { kind: 'straight', fromSide: 'left', toSide: 'right', line: { style: 'solid', fill: '#8FA9D7', width: 4 }, head: { type: 'triangle', width: 'sm', length: 'sm' }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  textBox(s, 'Consulta, estudia y realiza gestiones', 80, 414, 270, 68, { size: 18, color: '#DCE5F7', align: 'center' });
  textBox(s, 'Publica, revisa y mantiene contenidos', 920, 414, 290, 68, { size: 18, color: '#DCE5F7', align: 'center' });
  textBox(s, 'Un canal ciudadano y una herramienta de gestión en el mismo sistema', 210, 566, 860, 52, { size: 25, bold: true, color: C.white, align: 'center', valign: 'middle' });
  note(s, [
    'Definir el producto con una sola frase.',
    'Después pasar de inmediato a situaciones reales y a las pantallas.',
  ]);
}

// 04 — Needs to functions
{
  const s = presentation.slides.add();
  lightFrame(s, 4, 'La solución');
  title(s, 'Cada necesidad activa una respuesta', 'Las funciones aparecen cuando la historia las necesita.');
  const rows = [
    ['Prepararse para el teórico', 'Materiales y simulacro'],
    ['Conocer novedades vigentes', 'Noticias'],
    ['Resolver una duda frecuente', 'Preguntas por categoría'],
    ['Consultar algo no publicado', 'Formulario y bandeja interna'],
  ];
  rows.forEach((r, i) => {
    const y = 218 + i * 92;
    textBox(s, String(i + 1).padStart(2, '0'), 72, y, 48, 46, { size: 24, bold: true, color: C.orange, valign: 'middle' });
    textBox(s, r[0], 132, y, 330, 46, { size: 22, bold: true, color: C.navy, valign: 'middle' });
    box(s, 484, y + 21, 72, 3, C.orange);
    textBox(s, r[1], 578, y, 300, 46, { size: 21, color: C.blue, valign: 'middle' });
  });
  imageBox(s, assets.materials, 900, 210, 310, 188, { alt: 'Pantalla de materiales de estudio', fit: 'cover', geometry: 'roundRect', radius: 14, shadow: 'shadow-md' });
  imageBox(s, assets.faq, 900, 426, 310, 188, { alt: 'Pantalla de preguntas frecuentes', fit: 'cover', geometry: 'roundRect', radius: 14, shadow: 'shadow-md' });
  note(s, [
    'Usar las preguntas como guía de la demostración: ¿necesitás estudiar?, ¿noticias?, ¿una duda?, ¿no está respondida?',
    'Las capturas funcionan como respaldo si la demo en vivo no está disponible.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'Requerimientos.md')]);
}

// 05 — Public demo
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  imageBox(s, assets.home, 0, 0, W, H, { alt: 'Inicio del Portal Vial', fit: 'cover' });
  box(s, 0, 0, W, 70, C.navy);
  textBox(s, 'DEMO 1  |  PORTAL CIUDADANO', 58, 18, 480, 34, { size: 18, bold: true, color: C.white, valign: 'middle' });
  pill(s, 'Noticias · estudio · FAQ · simulador · agenda', 770, 18, 440, '#FFF0E7', '#D94D12');
  note(s, [
    'Cambiar al sistema en vivo desde esta diapositiva.',
    'Recorrer el portal como una persona usuaria. No explicar todavía la arquitectura.',
    'Si la demo falla, mantener esta pantalla y continuar con el recorrido narrado.',
  ]);
}

// 06 — Final scope
{
  const s = presentation.slides.add();
  lightFrame(s, 6, 'Alcance del producto');
  title(s, 'El alcance final combina información, práctica y gestión', 'Dos interfaces consumen la misma API y responden a recorridos diferentes.');
  textBox(s, 'PORTAL CIUDADANO', 76, 202, 440, 32, { size: 17, bold: true, color: C.orange });
  const publicItems = [
    'Noticias y vigencia',
    'Materiales de estudio',
    'FAQ por categorías',
    'Simulacro con corrección',
    'Consultas ciudadanas',
    'Agenda, renovación y cancelación',
  ];
  publicItems.forEach((item, i) => {
    box(s, 76, 250 + i * 56, 10, 34, C.orange, { geometry: 'roundRect', radius: 5 });
    textBox(s, item, 106, 244 + i * 56, 430, 46, { size: 20, bold: true, color: C.navy, valign: 'middle' });
  });
  box(s, 620, 196, 2, 394, C.line);
  textBox(s, 'PANEL IMSJ', 690, 202, 420, 32, { size: 17, bold: true, color: C.blue });
  const adminItems = [
    'Noticias, materiales y FAQ',
    'Banco de preguntas',
    'Franjas y agenda',
    'Bandeja de consultas',
    'Usuarios y permisos',
    'Historial de acciones',
  ];
  adminItems.forEach((item, i) => {
    box(s, 690, 250 + i * 56, 10, 34, C.blue, { geometry: 'roundRect', radius: 5 });
    textBox(s, item, 720, 244 + i * 56, 430, 46, { size: 20, bold: true, color: C.navy, valign: 'middle' });
  });
  box(s, 236, 610, 808, 54, '#FFF0E7', { geometry: 'roundRect', radius: 14 });
  textBox(s, 'El sistema reserva franjas. La emisión o renovación legal de la libreta queda fuera del alcance.', 260, 618, 760, 38, { size: 17, bold: true, color: '#C85218', align: 'center', valign: 'middle' });
  note(s, [
    'Presentar el alcance completo antes de entrar al panel o a la ingeniería.',
    'Aclarar el límite: Portal Vial gestiona información y reservas, pero no emite ni renueva legalmente licencias.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'project_charter.md')]);
}

// 07 — Admin demo
{
  const s = presentation.slides.add();
  lightFrame(s, 7, 'La solución');
  title(s, 'La Dirección administra la operación diaria', 'Agenda y consultas muestran que el panel va más allá de mantener contenido.');
  imageBox(s, assets.agenda, 64, 190, 720, 430, { alt: 'Agenda administrativa de trámites', fit: 'cover', geometry: 'roundRect', radius: 14, shadow: 'shadow-lg' });
  imageBox(s, assets.consultations, 816, 190, 400, 264, { alt: 'Bandeja de consultas ciudadanas', fit: 'cover', geometry: 'roundRect', radius: 14, shadow: 'shadow-md' });
  box(s, 816, 478, 400, 142, C.navy, { geometry: 'roundRect', radius: 16 });
  textBox(s, 'Una misma herramienta permite consultar agenda, leer mensajes y mantener el contenido que ve la ciudadanía.', 848, 502, 336, 94, { size: 20, bold: true, color: C.white, align: 'center', valign: 'middle' });
  note(s, [
    'Mostrar el panel como respuesta a la necesidad institucional, todavía sin entrar en el flujo de aprobación.',
    'Recorrer agenda, consultas y administración de contenidos para demostrar el alcance operativo.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'project_charter.md')]);
}

// 08 — Transition
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  box(s, 0, 0, 14, H, C.orange);
  textBox(s, 'ACTO 3', 80, 126, 180, 28, { size: 15, bold: true, color: C.orange });
  textBox(s, 'Nada sale de la nada', 80, 196, 980, 88, { size: 52, bold: true, color: C.white, valign: 'middle' });
  textBox(s, 'La solución creció a través de decisiones registradas, demostraciones y cambios validados.', 80, 314, 920, 100, { size: 27, color: '#DCE5F7', lineSpacing: 1.15 });
  box(s, 80, 510, 880, 4, C.orange);
  textBox(s, 'NECESIDAD  ·  REQUISITO  ·  IMPLEMENTACIÓN  ·  EVIDENCIA', 80, 540, 920, 34, { size: 18, bold: true, color: C.white });
  note(s, [
    'Esta es la transición entre la venta del producto y la ingeniería.',
    'Frase sugerida: lo que acabamos de ver no apareció de una vez; cada función tiene un origen y una decisión.',
  ]);
}

// 09 — Timeline
{
  const s = presentation.slides.add();
  lightFrame(s, 9, 'Gestión del proyecto');
  title(s, 'Cada etapa produjo la entrada de la siguiente', 'El proceso real alternó análisis, construcción, demostración y ajuste.');
  const discovery = [
    ['PLANTEO', 'Necesidad general'],
    ['PRIMERA\nPUESTA EN LIMPIO', 'Borrador de requisitos'],
    ['09 JUL', 'Entrevista'],
    ['REQUISITOS', 'Versión refinada'],
    ['22–28 JUL', 'Historias y backlog'],
  ];
  const delivery = [
    ['JUL–SEP', 'Sprints 1–4'],
    ['03 SEP', 'Demo al cliente'],
    ['CAMBIOS', 'Registro y análisis'],
    ['SEP–OCT', 'Sprint 5'],
    ['13 OCT', 'Demo y aprobación'],
  ];
  textBox(s, 'DESCUBRIR Y DEFINIR', 72, 184, 260, 24, { size: 14, bold: true, color: C.orange });
  box(s, 112, 270, 1030, 4, C.line);
  discovery.forEach((ev, i) => {
    const x = 68 + i * 236;
    box(s, x + 74, 252, 38, 38, C.blue, { geometry: 'ellipse' });
    textBox(s, ev[0], x, 208, 186, 42, { size: 14, bold: true, color: C.orange, align: 'center', valign: 'middle' });
    textBox(s, ev[1], x, 302, 186, 42, { size: 17, bold: true, color: C.navy, align: 'center' });
  });
  textBox(s, 'CONSTRUIR, MOSTRAR Y AJUSTAR', 72, 394, 340, 24, { size: 14, bold: true, color: C.blue });
  box(s, 112, 480, 1030, 4, C.line);
  delivery.forEach((ev, i) => {
    const x = 68 + i * 236;
    const last = i === delivery.length - 1;
    box(s, x + 74, 462, 38, 38, last ? C.green : C.blue, { geometry: 'ellipse' });
    textBox(s, ev[0], x, 418, 186, 42, { size: 14, bold: true, color: last ? C.green : C.orange, align: 'center', valign: 'middle' });
    textBox(s, ev[1], x, 512, 186, 46, { size: 17, bold: true, color: C.navy, align: 'center' });
  });
  box(s, 162, 598, 956, 54, C.fog, { geometry: 'roundRect', radius: 14 });
  textBox(s, 'Ningún cambio quedó solo en una conversación: se registró, se implementó y volvió a demostrarse.', 188, 606, 904, 38, { size: 18, color: C.ink, align: 'center', valign: 'middle' });
  note(s, [
    'Recorrer la secuencia completa: planteo, primera puesta en limpio, entrevista, requisitos refinados, historias, desarrollo, demo, cambios, implementación y segunda demo.',
    'La aprobación pertenece al final del ciclo, después de implementar los cambios solicitados.',
  ], [
    path.join(workspaceDir, 'docs', 'ingenieria_software', 'actas_reuniones.md'),
    path.join(workspaceDir, 'docs', 'ingenieria_software', 'actas_sprint_review.md'),
  ]);
}

// 10 — Change control
{
  const s = presentation.slides.add();
  lightFrame(s, 10, 'Control de cambios');
  title(s, 'La primera demo cambió el producto', 'El 3 de septiembre el cliente pidió tres ampliaciones que alteraron alcance, datos y permisos.');
  textBox(s, '03/09', 76, 220, 250, 120, { size: 62, bold: true, color: C.orange, valign: 'middle' });
  textBox(s, 'DEMO CON CLIENTE', 80, 340, 240, 30, { size: 16, bold: true, color: C.muted });
  box(s, 350, 208, 2, 374, C.line);
  const changes = [
    ['01', 'Consultas ciudadanas', 'Formulario público y bandeja de lectura en el panel.'],
    ['02', 'Aprobación separada', 'La Directora revisa antes de que el personal publique.'],
    ['03', 'Imágenes en el simulacro', 'Las preguntas pueden representar situaciones reales de tránsito.'],
  ];
  changes.forEach((c, i) => {
    const y = 214 + i * 122;
    textBox(s, c[0], 394, y, 50, 48, { size: 25, bold: true, color: C.blue, valign: 'middle' });
    textBox(s, c[1], 462, y, 310, 38, { size: 24, bold: true, color: C.navy, valign: 'middle' });
    textBox(s, c[2], 790, y, 390, 70, { size: 19, color: C.muted, valign: 'middle' });
    if (i < 2) box(s, 394, y + 94, 786, 1, C.line);
  });
  pill(s, 'CAMBIO REGISTRADO → IMPLEMENTADO → VALIDADO', 394, 590, 510, '#FFF0E7', '#C85218');
  note(s, [
    'Explicar impacto: consultas agregó un nuevo flujo; aprobación exigió roles y estados; imágenes afectó archivos y validación.',
    'Cerrar con la segunda demo y la aprobación del 13/10.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'control_cambios.md')]);
}

// 11 — Traceability
{
  const s = presentation.slides.add();
  lightFrame(s, 11, 'Gestión del proyecto');
  title(s, 'La trazabilidad conecta la necesidad con la evidencia', 'Cada decisión puede seguirse desde su origen hasta una comprobación concreta.');
  const labels = [
    ['NECESIDAD', 'Entrevista o feedback'],
    ['REQUISITO', 'RF / RNF'],
    ['HISTORIA', 'US y criterio'],
    ['DESARROLLO', 'Pantalla, API y datos'],
    ['PRUEBA', 'Escenario esperado'],
    ['EVIDENCIA', 'Resultado registrado'],
  ];
  const shapes = labels.map((l, i) => {
    const x = 46 + i * 205;
    const sh = node(s, l[0], x, 244, 164, 78, {
      fill: i === 5 ? C.greenBg : C.white,
      line: i === 5 ? C.green : C.blue,
      color: i === 5 ? C.green : C.navy,
      size: 17,
      radius: 14,
    });
    textBox(s, l[1], x, 342, 164, 52, { size: 16, color: C.muted, align: 'center' });
    return sh;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], {
      kind: 'straight', fromSide: 'right', toSide: 'left',
      line: { style: 'solid', fill: C.orange, width: 3 },
      tail: { type: 'triangle', width: 'sm', length: 'sm' },
    });
  }
  box(s, 150, 476, 980, 100, '#FFF0E7', { geometry: 'roundRect', radius: 18 });
  textBox(s, 'Si la demostración descubre una necesidad nueva, el cambio vuelve al análisis y actualiza requisitos, historias, implementación y pruebas.', 184, 498, 912, 58, { size: 20, bold: true, color: '#C85218', align: 'center', valign: 'middle' });
  note(s, [
    'Usar CC-02 como ejemplo: necesidad de consulta, RF23, US32, formulario y bandeja, prueba PT-07 y evidencia de integración.',
    'Esta relación demuestra gestión del cambio y evita presentar funciones aisladas.',
  ], [
    path.join(workspaceDir, 'docs', 'ingenieria_software', 'backlog.md'),
    path.join(workspaceDir, 'docs', 'ingenieria_software', 'plan_informe_pruebas.md'),
  ]);
}

// 12 — Programming transition
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  box(s, 0, 0, 14, H, C.orange);
  textBox(s, 'CONSTRUCCIÓN TÉCNICA', 80, 126, 280, 28, { size: 15, bold: true, color: C.orange });
  textBox(s, '¿Cómo construimos el programa?', 80, 196, 1040, 88, { size: 50, bold: true, color: C.white, valign: 'middle' });
  textBox(s, 'Tecnologías, capas, datos y reglas elegidas para responder al alcance que acabamos de recorrer.', 80, 314, 930, 100, { size: 27, color: '#DCE5F7', lineSpacing: 1.15 });
  box(s, 80, 510, 960, 4, C.orange);
  textBox(s, 'FRONTEND  ·  API  ·  REGLAS  ·  DATOS  ·  DESPLIEGUE', 80, 540, 960, 34, { size: 18, bold: true, color: C.white });
  note(s, [
    'Abrir la parte técnica conectándola con el alcance, no con una lista de tecnologías.',
    'Cada elección se explica mediante la necesidad que resuelve y el compromiso que introduce.',
  ]);
}

// 13 — Technology stack
{
  const s = presentation.slides.add();
  lightFrame(s, 13, 'Programación');
  title(s, 'Una pila explícita y proporcional para ocho módulos', 'El equipo priorizó un recorrido comprensible, pocas dependencias y despliegue repetible.');
  const rows = [
    ['INTERFACES', 'HTML + CSS + JavaScript', 'Dos públicos distintos y ejecución directa en el navegador.'],
    ['COMUNICACIÓN', 'Fetch + JSON / multipart', 'Un cliente HTTP compartido concentra token, errores y archivos.'],
    ['BACKEND', 'PHP 8.5 nativo', 'Rutas y reglas visibles. Sustituyó Laravel para facilitar comprensión y defensa.'],
    ['PERSISTENCIA', 'PDO + MySQL 8.4 / InnoDB', 'Relaciones, restricciones, transacciones y bloqueo de filas.'],
    ['ENTORNO', 'Apache + Docker Compose', 'Mismo origen para portal y API; dos servicios reconstruibles.'],
  ];
  rows.forEach((r, i) => {
    const y = 196 + i * 88;
    textBox(s, r[0], 72, y, 170, 36, { size: 14, bold: true, color: i === 2 ? C.orange : C.blue, valign: 'middle' });
    textBox(s, r[1], 252, y - 2, 330, 40, { size: 22, bold: true, color: C.navy, valign: 'middle' });
    textBox(s, r[2], 612, y - 4, 570, 52, { size: 18, color: C.muted, valign: 'middle' });
    if (i < rows.length - 1) box(s, 72, y + 66, 1110, 1, C.line);
  });
  note(s, [
    'Explicar la decisión del 30/09: Laravel no era incorrecto; se eligió PHP nativo para hacer explícito el recorrido y reducir dependencias.',
    'Aclarar el compromiso: al retirar el framework, el equipo asume rutas, validación y seguridad de forma explícita.',
  ], [
    path.join(workspaceDir, 'docs_auxiliares', 'justificacion_decisiones_tecnicas.md'),
    path.join(workspaceDir, 'docs', 'ingenieria_software', 'control_cambios.md'),
  ]);
}

// 14 — Architecture
{
  const s = presentation.slides.add();
  lightFrame(s, 14, 'Programación');
  title(s, 'Una petición atraviesa responsabilidades claras', 'La interfaz no consulta la base directamente y cada capa resuelve una parte del caso de uso.');
  const labels = [
    ['NAVEGADOR', 'Portal o panel'],
    ['ROUTER', 'Método y URL'],
    ['CONTROLLER', 'Entrada y permisos'],
    ['SERVICE', 'Reglas de negocio'],
    ['REPOSITORY', 'Consultas PDO'],
    ['MYSQL', 'Persistencia'],
  ];
  const shapes = labels.map((l, i) => {
    const x = 58 + i * 204;
    const sh = node(s, l[0], x, 256, 170, 90, {
      fill: i === 5 ? C.navy : C.white,
      line: i === 5 ? C.navy : C.blue,
      color: i === 5 ? C.white : C.navy,
      size: 18,
      shadow: 'shadow-sm',
    });
    textBox(s, l[1], x, 360, 170, 50, { size: 16, color: C.muted, align: 'center' });
    return sh;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], {
      kind: 'straight', fromSide: 'right', toSide: 'left',
      line: { style: 'solid', fill: C.orange, width: 3 },
      tail: { type: 'triangle', width: 'sm', length: 'sm' },
    });
  }
  box(s, 104, 500, 1072, 90, C.fog, { geometry: 'roundRect', radius: 16 });
  textBox(s, 'Ejemplo: reservar una franja exige autenticación, valida reglas, bloquea el último cupo y persiste todo dentro de una transacción.', 136, 520, 1008, 52, { size: 20, color: C.ink, align: 'center', valign: 'middle' });
  note(s, [
    'Explicar un solo caso de punta a punta: POST /api/reservas.',
    'Destacar que el bloqueo y la transacción evitan dos reservas sobre el último cupo.',
    'Relacionar cada capa con una responsabilidad, no leer nombres de carpetas.',
  ], [path.join(workspaceDir, 'docs', 'programacion_full_stack', 'guia_codigo_y_defensa.md')]);
}

// 15 — A concrete request
{
  const s = presentation.slides.add();
  lightFrame(s, 15, 'Programación');
  title(s, 'Un caso de uso recorre archivos concretos', 'La reserva permite explicar interfaz, ruta, permisos, reglas, SQL, transacción y respuesta.');
  pill(s, 'POST /api/reservas', 72, 190, 210, C.navy, C.white);
  const steps = [
    ['turnos.js', 'Envía la franja elegida'],
    ['public/index.php', 'Reconoce método y URL'],
    ['ReservaController', 'Exige usuario y valida'],
    ['ReservaService', 'Aplica las reglas'],
    ['Reserva\nRepository', 'Bloquea y persiste'],
    ['Response JSON', 'Devuelve HTTP 201'],
  ];
  const shapes = steps.map((st, i) => {
    const x = 46 + i * 205;
    const sh = node(s, st[0], x, 280, 164, 82, {
      fill: i === 3 ? '#FFF0E7' : i === 5 ? C.greenBg : C.white,
      line: i === 3 ? C.orange : i === 5 ? C.green : C.blue,
      color: i === 3 ? '#C85218' : i === 5 ? C.green : C.navy,
      size: 16,
      radius: 14,
    });
    textBox(s, st[1], x, 384, 164, 62, { size: 16, color: C.muted, align: 'center' });
    return sh;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], {
      kind: 'straight', fromSide: 'right', toSide: 'left',
      line: { style: 'solid', fill: C.orange, width: 3 },
      tail: { type: 'triangle', width: 'sm', length: 'sm' },
    });
  }
  box(s, 174, 520, 932, 82, C.fog, { geometry: 'roundRect', radius: 16 });
  textBox(s, 'Dentro de la transacción se comprueba la franja, la fecha, la duplicación y el cupo. Ante un fallo se ejecuta rollback.', 202, 538, 876, 48, { size: 19, bold: true, color: C.ink, align: 'center', valign: 'middle' });
  note(s, [
    'Explicar el recorrido con nombres reales del proyecto.',
    'La API devuelve 201 cuando crea la reserva. Si el último cupo ya fue tomado, devuelve 422 y no persiste una segunda fila.',
  ], [path.join(workspaceDir, 'docs', 'programacion_full_stack', 'guia_codigo_y_defensa.md')]);
}

// 16 — Data model
{
  const s = presentation.slides.add();
  lightFrame(s, 16, 'Base de datos');
  title(s, 'El modelo de datos sostiene reglas del dominio', 'Las relaciones y restricciones complementan las validaciones de la aplicación.');
  textBox(s, 'RESERVAS Y CAPACIDAD', 70, 194, 410, 28, { size: 15, bold: true, color: C.orange });
  const user = node(s, 'USUARIOS', 70, 260, 190, 72, { fill: C.white, line: C.blue, color: C.navy, size: 18 });
  const booking = node(s, 'RESERVAS', 310, 260, 190, 72, { fill: '#FFF0E7', line: C.orange, color: '#C85218', size: 18 });
  const slot = node(s, 'FRANJAS', 550, 260, 190, 72, { fill: C.white, line: C.blue, color: C.navy, size: 18 });
  s.shapes.connect(user, booking, { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: C.orange, width: 3 }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  s.shapes.connect(booking, slot, { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: C.orange, width: 3 }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  textBox(s, 'FK + índice único usuario/franja', 228, 352, 354, 36, { size: 16, bold: true, color: C.muted, align: 'center' });
  box(s, 790, 188, 2, 370, C.line);
  textBox(s, 'CONTENIDOS Y TRAZABILIDAD', 846, 194, 360, 28, { size: 15, bold: true, color: C.blue });
  node(s, 'NOTICIAS · MATERIALES · FAQ', 846, 250, 360, 72, { fill: C.paleBlue, line: C.blue, color: C.navy, size: 18 });
  node(s, 'ESTADO Y VIGENCIA', 846, 350, 360, 66, { fill: C.white, line: C.blue, color: C.blue, size: 18 });
  node(s, 'HISTORIAL DE ACCIONES', 846, 444, 360, 66, { fill: C.greenBg, line: C.green, color: C.green, size: 18 });
  box(s, 92, 476, 648, 104, C.fog, { geometry: 'roundRect', radius: 16 });
  textBox(s, 'MySQL InnoDB aporta claves foráneas, transacciones y bloqueo de filas. PDO mantiene el SQL visible y usa valores parametrizados.', 124, 498, 584, 62, { size: 18, color: C.ink, align: 'center', valign: 'middle' });
  note(s, [
    'No recorrer todas las tablas. Elegir dos reglas: integridad de reservas y trazabilidad de contenidos.',
    'Explicar que las validaciones del frontend mejoran la experiencia, pero las restricciones y permisos se aplican en servidor y base.',
  ], [
    path.join(workspaceDir, 'backend', 'database.sql'),
    path.join(workspaceDir, 'docs_auxiliares', 'justificacion_decisiones_tecnicas.md'),
  ]);
}

// 17 — Editorial flow
{
  const s = presentation.slides.add();
  lightFrame(s, 17, 'Reglas de negocio');
  title(s, 'Publicar requiere una secuencia controlada', 'Los estados implementan la aprobación solicitada durante la demostración.');
  const specs = [
    ['BORRADOR', C.fog, C.muted, 'Personal crea o edita'],
    ['PENDIENTE', C.amberBg, C.amber, 'Personal envía'],
    ['APROBADO', C.paleBlue, C.blue, 'Directora aprueba'],
    ['PUBLICADO', C.greenBg, C.green, 'Personal publica'],
  ];
  const shapes = specs.map((sp, i) => {
    const x = 82 + i * 300;
    const sh = node(s, sp[0], x, 260, 222, 92, { fill: sp[1], line: sp[2], color: sp[2], size: 22, radius: 18 });
    textBox(s, sp[3], x, 378, 222, 50, { size: 18, color: C.muted, align: 'center' });
    return sh;
  });
  for (let i = 0; i < shapes.length - 1; i++) {
    s.shapes.connect(shapes[i], shapes[i + 1], {
      kind: 'straight', fromSide: 'right', toSide: 'left',
      line: { style: 'solid', fill: C.orange, width: 4 },
      tail: { type: 'triangle', width: 'sm', length: 'sm' },
    });
  }
  box(s, 278, 500, 724, 88, '#FFF0E7', { geometry: 'roundRect', radius: 16 });
  textBox(s, 'Si alguien edita el contenido, vuelve a borrador y necesita una aprobación nueva.', 308, 520, 664, 48, { size: 21, bold: true, color: '#C85218', align: 'center', valign: 'middle' });
  note(s, [
    'Este flujo no existía de esta forma al comienzo. Nació del cambio CC-03 solicitado en la demostración del 03/09.',
    'Conectar esta regla con los permisos del backend y el historial de acciones.',
    'Ocultar botones en el frontend ayuda a la interfaz, pero la autorización real ocurre en la API.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'Requerimientos.md')]);
}

// 18 — Infrastructure
{
  const s = presentation.slides.add();
  lightFrame(s, 18, 'Infraestructura');
  title(s, 'Un entorno reconstruible y separable', 'Docker Compose describe aplicación, base, persistencia y controles de salud.');
  box(s, 66, 196, 1148, 408, C.fog, { geometry: 'roundRect', radius: 20, line: { style: 'solid', fill: C.line, width: 1.5 } });
  pill(s, 'UBUNTU SERVER 26.04 LTS', 92, 218, 250, C.navy, C.white);
  const app = node(s, 'APP\nApache + PHP + API + frontends', 146, 300, 370, 128, { fill: C.white, line: C.blue, color: C.navy, size: 22, shadow: 'shadow-md' });
  const db = node(s, 'DB\nMySQL 8.4', 746, 300, 370, 128, { fill: C.white, line: C.blue, color: C.navy, size: 22, shadow: 'shadow-md' });
  const appDb = s.shapes.connect(app, db, { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: C.orange, width: 4 }, head: { type: 'triangle', width: 'sm', length: 'sm' }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  appDb.bringToFront();
  textBox(s, 'red interna', 548, 268, 164, 30, { size: 17, bold: true, color: C.orange, align: 'center' });
  node(s, 'Adjuntos', 170, 484, 150, 62, { fill: C.paleBlue, line: C.line, color: C.blue, size: 17 });
  node(s, 'Caché', 342, 484, 150, 62, { fill: C.paleBlue, line: C.line, color: C.blue, size: 17 });
  node(s, 'Datos MySQL', 804, 484, 220, 62, { fill: C.paleBlue, line: C.line, color: C.blue, size: 17 });
  textBox(s, 'VOLÚMENES PERSISTENTES', 146, 558, 970, 26, { size: 14, bold: true, color: C.muted, align: 'center' });
  pill(s, '2 vCPU · 4 GB RAM · 30 GB SSD/NVMe', 842, 218, 330, '#FFF0E7', '#C85218');
  textBox(s, 'Punto inicial. La capacidad de 90 sesiones todavía requiere una prueba de carga.', 726, 614, 478, 42, { size: 15, color: C.muted, align: 'right' });
  note(s, [
    'Explicar por qué hay dos contenedores: actualizar la aplicación sin reemplazar los datos.',
    'Aclarar que MySQL no publica su puerto hacia la red.',
    'No presentar 90 usuarios como capacidad comprobada. Es un objetivo de dimensionamiento pendiente de validación.',
  ], [path.join(workspaceDir, 'docs', 'administracion_ssoo', 'justificacion-tecnologica.md')]);
}

// 19 — Security
{
  const s = presentation.slides.add();
  lightFrame(s, 19, 'Ciberseguridad');
  title(s, 'Controles y pruebas de seguridad', 'Primero se redujo la superficie de riesgo. Después se buscaron fallos desde distintas perspectivas.');
  textBox(s, 'DENTRO DEL SISTEMA', 82, 214, 420, 30, { size: 16, bold: true, color: C.blue });
  const internal = ['Hash de contraseñas', 'Permisos en backend', 'PDO con parámetros', 'Validación y transacciones'];
  internal.forEach((v, i) => {
    box(s, 82, 262 + i * 76, 12, 44, C.orange, { geometry: 'roundRect', radius: 6 });
    textBox(s, v, 112, 258 + i * 76, 390, 52, { size: 21, bold: true, color: C.navy, valign: 'middle' });
  });
  box(s, 606, 212, 2, 366, C.line);
  textBox(s, 'CONTRA EL SISTEMA', 680, 214, 420, 30, { size: 16, bold: true, color: C.orange });
  const tests = [
    ['SAST', 'Análisis del código'],
    ['DAST', 'OWASP ZAP en ejecución'],
    ['NMAP', 'Puertos expuestos'],
    ['API', 'Auditoría Bash por perfiles'],
  ];
  tests.forEach((v, i) => {
    const y = 260 + i * 78;
    pill(s, v[0], 680, y, 108, i % 2 ? '#FFF0E7' : C.paleBlue, i % 2 ? '#C85218' : C.blue);
    textBox(s, v[1], 812, y - 4, 350, 42, { size: 20, color: C.navy, valign: 'middle' });
  });
  box(s, 680, 584, 482, 54, C.greenBg, { geometry: 'roundRect', radius: 14 });
  textBox(s, 'Los hallazgos se registran, corrigen y vuelven a probar.', 700, 592, 442, 38, { size: 18, bold: true, color: C.green, align: 'center', valign: 'middle' });
  note(s, [
    'Distinguir controles preventivos de técnicas de verificación.',
    'No decir que una herramienta garantiza seguridad. Explicar alcance y revalidación de hallazgos.',
  ], [path.join(workspaceDir, 'docs', 'electiva_ciberseguridad', 'checklist_ciberseguridad_entrega_final.md')]);
}

// 20 — Evidence
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  textBox(s, 'EVIDENCIA DE LA VERSIÓN VERIFICADA', 64, 54, 520, 26, { size: 15, bold: true, color: C.orange });
  textBox(s, 'Resultados que se pueden defender', 64, 96, 900, 60, { size: 40, bold: true, color: C.white });
  const stats = [
    ['192', 'comprobaciones de integración'],
    ['46', 'endpoints cubiertos'],
    ['43', 'pruebas de seguridad aprobadas'],
    ['201 / 422', 'dos solicitudes, un último cupo'],
  ];
  stats.forEach((st, i) => {
    const x = 64 + (i % 2) * 590;
    const y = 202 + Math.floor(i / 2) * 190;
    box(s, x, y, 540, 154, i === 3 ? '#22346E' : '#1B2D67', { geometry: 'roundRect', radius: 20, line: { style: 'solid', fill: '#314982', width: 1.5 } });
    textBox(s, st[0], x + 28, y + 20, 210, 76, { size: i === 3 ? 42 : 56, bold: true, color: i === 2 ? '#6ED0A6' : C.orange, valign: 'middle' });
    textBox(s, st[1], x + 242, y + 26, 270, 84, { size: 20, bold: true, color: C.white, valign: 'middle' });
  });
  textBox(s, 'La prueba concurrente no sustituye una prueba de carga. El objetivo de 90 sesiones continúa pendiente de medición.', 86, 610, 1108, 52, { size: 17, color: '#C7D5F0', align: 'center', valign: 'middle' });
  note(s, [
    'Dar los números con su significado. Las 192 comprobaciones no equivalen a cobertura de líneas.',
    'Explicar el caso 201/422: exactamente una reserva persistió cuando dos procesos compitieron por el último cupo.',
    'Mantener visible la limitación sobre la prueba de carga.',
  ], [path.join(workspaceDir, 'docs', 'ingenieria_software', 'plan_informe_pruebas.md')]);
}

// 21 — Closing
{
  const s = presentation.slides.add();
  s.background.fill = C.navy;
  box(s, 0, 0, 14, H, C.orange);
  imageBox(s, assets.crest, 82, 58, 62, 62, { alt: 'Escudo de San José', fit: 'contain' });
  textBox(s, 'PORTAL VIAL', 164, 68, 260, 32, { size: 19, bold: true, color: C.white });
  textBox(s, 'La historia vuelve al punto de partida', 80, 178, 1120, 60, { size: 40, bold: true, color: C.white, align: 'center' });
  const c1 = node(s, 'CIUDADANÍA\nInformación clara', 112, 344, 290, 112, { fill: C.white, line: C.white, color: C.navy, size: 23, radius: 22 });
  const cp = node(s, 'PORTAL VIAL', 492, 318, 296, 164, { fill: C.orange, line: C.orange, color: C.white, size: 30, radius: 28, shadow: 'shadow-xl' });
  const c2 = node(s, 'DIRECCIÓN\nGestión controlada', 878, 344, 290, 112, { fill: C.white, line: C.white, color: C.navy, size: 23, radius: 22 });
  s.shapes.connect(c1, cp, { kind: 'straight', fromSide: 'right', toSide: 'left', line: { style: 'solid', fill: '#8FA9D7', width: 4 }, head: { type: 'triangle', width: 'sm', length: 'sm' }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  s.shapes.connect(c2, cp, { kind: 'straight', fromSide: 'left', toSide: 'right', line: { style: 'solid', fill: '#8FA9D7', width: 4 }, head: { type: 'triangle', width: 'sm', length: 'sm' }, tail: { type: 'triangle', width: 'sm', length: 'sm' } });
  textBox(s, 'Una solución construida mediante relevamiento, decisiones, validación y evidencia.', 184, 570, 912, 58, { size: 24, color: '#DCE5F7', align: 'center', valign: 'middle' });
  imageBox(s, assets.rc5, 1100, 640, 100, 46, { alt: 'Logo RC5', fit: 'contain' });
  note(s, [
    'Cerrar retomando a los dos actores del comienzo.',
    'Frase sugerida: Portal Vial convierte dos necesidades en un sistema gestionable, comprobable y preparado para evolucionar.',
    'Dejar la diapositiva visible durante las preguntas.',
  ]);
}

// Render all slides for visual review.
for (const [index, slide] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(previewDir, `slide-${String(index + 1).padStart(2, '0')}.png`), new Uint8Array(await png.arrayBuffer()));
}
const montage = await presentation.export({ format: 'webp', montage: true });
await fs.writeFile(path.join(buildDir, 'montage-diseno.webp'), new Uint8Array(await montage.arrayBuffer()));

const stagingDir = path.join(buildDir, 'finalizer');
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, 'candidate.pptx');
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const { finalizePresentation } = await import(pathToFileURL(path.join(skillDir, 'container_tools', 'artifact_tool_utils.mjs')).href);
const result = await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable,
  integrityValidatorPath: path.join(skillDir, 'container_tools', 'inspect_presentation_package_integrity.py'),
  layoutValidatorPath: path.join(skillDir, 'container_tools', 'inspect_presentation_layout_geometry.py'),
  layoutArgs: ['--expected-slide-size-emu', '12192000,6858000', '--validate-heading-fit'],
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  fontPolicy: { basis: 'design', families: ['Segoe UI'] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, 'Portal_Vial_Defensa_DISENO.validation.json'),
});

console.log(JSON.stringify({ finalPath, slides: presentation.slides.items.length, result }, null, 2));
