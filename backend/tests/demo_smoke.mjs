const base = process.env.IMSJ_TEST_URL || 'http://127.0.0.1:18080';
let checks = 0;

function check(condition, message) {
  if (!condition) throw new Error(message);
  checks += 1;
}

async function request(method, path, { token, body, expected = 200 } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload = body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const response = await fetch(`${base}${path}`, { method, headers, body: payload });
  const text = await response.text();
  const data = text && response.headers.get('content-type')?.includes('json') ? JSON.parse(text) : text;
  check(response.status === expected, `${method} ${path}: ${response.status} ${text}`);
  return data;
}

const health = await request('GET', '/api/health');
check(health.status === 'ok', 'Health inválido');

const staff = (await request('POST', '/api/login', { body: { cedula: '22222222', password: 'prueba123' } })).token;
await request('POST', '/api/usuarios-admin', {
  token: staff,
  expected: 201,
  body: { nombre: 'Directora Demo', cedula: '22222223', rol: 'DIRECTORA' },
});
const directorLogin = await request('POST', '/api/login', { body: { cedula: '22222223', password: 'imsj1234' } });
check(directorLogin.usuario.rol === 'DIRECTORA', 'El rol Directora no se conservó');
const directora = directorLogin.token;
await request('GET', '/api/noticias', { token: directora });

const sent = await request('POST', '/api/portal/consultas', {
  expected: 201,
  body: { nombre: 'Ciudadana Demo', email: 'demo@example.org', mensaje: 'Consulta de demostración.' },
});
const inbox = await request('GET', '/api/consultas', { token: staff });
check(inbox.consultas.some((item) => item.id === sent.consulta.id && !item.leida), 'La consulta no llegó como no leída');
const read = await request('PATCH', `/api/consultas/${sent.consulta.id}/leida`, { token: staff });
check(read.consulta.leida === true, 'La consulta no quedó leída');

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64');
const questionForm = new FormData();
questionForm.set('pregunta', '¿Qué indica la señal?');
questionForm.set('opcion_a', 'Detenerse');
questionForm.set('opcion_b', 'Acelerar');
questionForm.set('opcion_c', 'Girar');
questionForm.set('opcion_d', 'Estacionar');
questionForm.set('respuesta_correcta', 'A');
questionForm.set('imagen', new Blob([png], { type: 'image/png' }), 'senal.png');
const question = await request('POST', '/api/preguntas-prueba', { token: staff, expected: 201, body: questionForm });
check(Boolean(question.pregunta.imagen), 'La pregunta no devolvió su gráfico');
const image = await fetch(question.pregunta.imagen);
check(image.ok && Buffer.compare(Buffer.from(await image.arrayBuffer()), png) === 0, 'El gráfico no se pudo recuperar');
const quiz = await request('GET', '/api/portal/prueba');
check(quiz.preguntas.some((item) => item.id === question.pregunta.id && item.imagen && !('respuesta_correcta' in item)), 'El simulacro público no presenta correctamente el gráfico');

const news = await request('POST', '/api/noticias', {
  token: staff,
  expected: 201,
  body: { titulo: 'Noticia Demo', texto: 'Contenido listo para validación.', fecha_inicio_vigencia: '2020-01-01', fecha_fin_vigencia: '2099-12-31' },
});
const newsId = news.noticia.id;
await request('PATCH', `/api/noticias/${newsId}/estado`, { token: staff, body: { estado: 'PENDIENTE' } });
await request('PATCH', `/api/noticias/${newsId}/estado`, { token: staff, body: { estado: 'APROBADO' }, expected: 403 });
const approved = await request('PATCH', `/api/noticias/${newsId}/estado`, { token: directora, body: { estado: 'APROBADO' } });
check(approved.noticia.estado === 'APROBADO', 'La Directora no pudo aprobar');
await request('PATCH', `/api/noticias/${newsId}/estado`, { token: staff, body: { estado: 'PUBLICADO' } });
const publicNews = await request('GET', '/api/portal/noticias');
check(publicNews.noticias.some((item) => item.id === newsId), 'La noticia aprobada y publicada no aparece en el portal');

const faq = await request('POST', '/api/preguntas', {
  token: staff,
  expected: 201,
  body: { pregunta: '¿Dónde consulto?', respuesta: 'En la Sección Tránsito.' },
});
const faqId = faq.pregunta.id;
await request('PATCH', `/api/preguntas/${faqId}/estado`, { token: staff, body: { estado: 'PENDIENTE' } });
await request('PATCH', `/api/preguntas/${faqId}/estado`, { token: staff, body: { estado: 'APROBADO' }, expected: 403 });
const approvedFaq = await request('PATCH', `/api/preguntas/${faqId}/estado`, { token: directora, body: { estado: 'APROBADO' } });
check(approvedFaq.pregunta.estado === 'APROBADO', 'La Directora no pudo aprobar la pregunta frecuente');
await request('PATCH', `/api/preguntas/${faqId}/estado`, { token: staff, body: { estado: 'PUBLICADO' } });
const publicFaqs = await request('GET', '/api/portal/preguntas');
check(publicFaqs.preguntas.some((item) => item.id === faqId), 'La pregunta aprobada no aparece en el portal');

const material = await request('POST', '/api/materiales', {
  token: staff,
  expected: 201,
  body: { nombre: 'Video de educación vial', tipo: 'VIDEO', ubicacion_recurso: 'https://example.org/video' },
});
const materialId = material.material.id;
await request('PATCH', `/api/materiales/${materialId}/estado`, { token: staff, body: { estado: 'PENDIENTE' } });
await request('PATCH', `/api/materiales/${materialId}/estado`, { token: staff, body: { estado: 'APROBADO' }, expected: 403 });
const approvedMaterial = await request('PATCH', `/api/materiales/${materialId}/estado`, { token: directora, body: { estado: 'APROBADO' } });
check(approvedMaterial.material.estado === 'APROBADO', 'La Directora no pudo aprobar el material');
await request('PATCH', `/api/materiales/${materialId}/estado`, { token: staff, body: { estado: 'PUBLICADO' } });
const publicMaterials = await request('GET', '/api/portal/materiales');
check(publicMaterials.materiales.some((item) => item.id === materialId), 'El material aprobado no aparece en el portal');

console.log(JSON.stringify({ resultado: 'OK', checks }, null, 2));
