import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'http://127.0.0.1:4173';
const out = path.resolve('.codex-build/portal-vial-deck/assets');
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1.25,
  locale: 'es-UY',
});

await context.addInitScript(() => {
  sessionStorage.setItem('imsj:token', 'demo-token');
  sessionStorage.setItem('imsj:usuario', JSON.stringify({
    id: 2,
    nombre: 'María Vázquez',
    rol: 'PERSONAL_IMSJ',
  }));
});

await context.route('**/api/**', async (route) => {
  const url = new URL(route.request().url());
  const pathname = url.pathname;
  let body = {};
  if (pathname === '/api/portal/materiales') {
    body = { materiales: [
      { id: 1, nombre: 'Manual para aspirantes', tipo: 'PDF', ubicacion_recurso: '#' },
      { id: 2, nombre: 'Señales de tránsito', tipo: 'PDF', ubicacion_recurso: '#' },
      { id: 3, nombre: 'Conducción defensiva', tipo: 'VIDEO', ubicacion_recurso: '#' },
    ] };
  } else if (pathname === '/api/portal/preguntas') {
    body = { preguntas: [
      { id: 1, categoria: 'Prueba teórica', pregunta: '¿Qué documentación debo presentar?', respuesta: 'Cédula de identidad vigente y la documentación indicada para el trámite.' },
      { id: 2, categoria: 'Agenda', pregunta: '¿Cómo reservo una fecha para la prueba?', respuesta: 'Ingresá a Agenda, elegí una franja disponible y confirmá la reserva.' },
      { id: 3, categoria: 'Renovación', pregunta: '¿Puedo solicitar una renovación urgente?', respuesta: 'Sí. El portal muestra las franjas disponibles para renovación normal y urgente.' },
    ] };
  } else if (pathname === '/api/noticias') {
    body = { noticias: [
      { id: 1, titulo: 'Semana de la Seguridad Vial', texto: 'Actividades de concientización dirigidas a estudiantes del departamento.', estado: 'PUBLICADO', fecha_inicio_vigencia: '2026-10-20', fecha_fin_vigencia: '2026-11-12' },
      { id: 2, titulo: 'Nuevo material para aspirantes', texto: 'Manual actualizado con señalización y situaciones frecuentes de circulación.', estado: 'APROBADO', fecha_inicio_vigencia: '2026-10-25', fecha_fin_vigencia: '2026-12-20' },
      { id: 3, titulo: 'Cambios temporales en la agenda', texto: 'Información operativa para las próximas jornadas de pruebas.', estado: 'PENDIENTE', fecha_inicio_vigencia: '2026-10-27', fecha_fin_vigencia: '2026-11-05' },
    ] };
  } else if (pathname === '/api/agenda') {
    body = { reservas: [
      { id: 1042, fecha: '2026-10-29', hora_inicio: '09:00', hora_fin: '09:30', cedula: '4.512.890-3', tipo: 'PRUEBA_MANEJO' },
      { id: 1043, fecha: '2026-10-29', hora_inicio: '10:00', hora_fin: '10:30', cedula: '5.021.774-8', tipo: 'RENOVACION_NORMAL' },
      { id: 1044, fecha: '2026-10-30', hora_inicio: '08:30', hora_fin: '09:00', cedula: '3.948.102-6', tipo: 'RENOVACION_URGENTE' },
      { id: 1045, fecha: '2026-10-30', hora_inicio: '11:00', hora_fin: '11:30', cedula: '4.887.201-1', tipo: 'PRUEBA_MANEJO' },
    ] };
  } else if (pathname === '/api/consultas') {
    body = { consultas: [
      { id: 21, nombre: 'Lucía Rodríguez', email: 'lucia@example.com', mensaje: '¿Qué documentación necesito para presentarme a la prueba teórica?', leida: false, created_at: '2026-10-27T13:20:00Z' },
      { id: 20, nombre: 'Martín Pérez', email: 'martin@example.com', mensaje: 'Quisiera saber cómo cancelar una reserva y elegir una nueva fecha.', leida: true, created_at: '2026-10-26T18:10:00Z' },
      { id: 19, nombre: 'Sofía Silva', email: 'sofia@example.com', mensaje: '¿Dónde puedo descargar el manual actualizado para aspirantes?', leida: true, created_at: '2026-10-25T15:42:00Z' },
    ] };
  } else {
    body = { ok: true };
  }
  await route.fulfill({
    status: 200,
    contentType: 'application/json; charset=utf-8',
    body: JSON.stringify(body),
  });
});

async function shot(name, url, options = {}) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  if (options.waitFor) await page.waitForSelector(options.waitFor, { state: 'visible' });
  if (options.prepare) await options.prepare(page);
  await page.screenshot({ path: path.join(out, name), fullPage: false });
  await page.close();
}

await shot('portal-inicio.png', `${base}/frontend-publico/index.html`);
await shot('portal-materiales.png', `${base}/frontend-publico/estudio.html`, { waitFor: '.card-grid .card' });
await shot('portal-faq.png', `${base}/frontend-publico/preguntas.html`, { waitFor: '.card-grid .card' });
await shot('panel-noticias.png', `${base}/frontend-imsj/noticias.html`, { waitFor: '#tbody-noticias tr' });
await shot('panel-agenda.png', `${base}/frontend-imsj/agenda.html`, { waitFor: '#tbody-reservas tr' });
await shot('panel-consultas.png', `${base}/frontend-imsj/consultas.html`, { waitFor: '#lista-consultas details' });

await browser.close();
