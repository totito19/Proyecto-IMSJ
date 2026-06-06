/* Store local en localStorage — emula la API REST del backend.
   Compartido por frontend-publico y frontend-imsj (mismo keys). */

const Store = (() => {
  const KEYS = {
    tipos: 'imsj_tipos',
    noticias: 'imsj_noticias',
    franjas: 'imsj_franjas',
    agendas: 'imsj_agendas',
    materiales: 'imsj_materiales',
    faq: 'imsj_faq',
    user: 'imsj_user',
    seeded: 'imsj_seeded_v1',
  };

  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function nextId(items) { return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }
  function randomCode(n = 10) {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    return Array.from({length:n}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
  }
  function isoDay(offset = 0) {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+offset);
    return d.toISOString().slice(0,10);
  }

  function seed() {
    if (localStorage.getItem(KEYS.seeded)) return;

    save(KEYS.tipos, [
      { id:1, codigo:'prueba_manejo', nombre:'Prueba de manejo',
        descripcion:'Prueba de manejo para obtener la licencia de conducir.',
        requiere_costo_especial:false, costo_especial:null },
      { id:2, codigo:'renovacion_normal', nombre:'Renovación normal',
        descripcion:'Renovación de libreta con agenda normal.',
        requiere_costo_especial:false, costo_especial:null },
      { id:3, codigo:'renovacion_urgente', nombre:'Renovación urgente',
        descripcion:'Renovación urgente con costo especial.',
        requiere_costo_especial:true, costo_especial:2500 },
    ]);

    save(KEYS.noticias, [
      { id:1, titulo:'Nuevos horarios de atención de la sección Tránsito',
        cuerpo:'A partir del próximo lunes la sección Tránsito de la IMSJ amplía sus horarios de atención al público.\n\nSe podrán realizar trámites de renovación de libreta y prueba de manejo de lunes a viernes de 8:30 a 15:00.',
        imagen_portada:null,
        fecha_inicio_vigencia: isoDay(-2),
        fecha_fin_vigencia: isoDay(60),
        estado:'publicada', usuario:'Administrador IMSJ',
        multimedia:[], enlaces:[
          { id:1, titulo:'UNASEV - Seguridad vial', url:'https://www.gub.uy/unidad-nacional-seguridad-vial' }
        ]},
      { id:2, titulo:'Recordatorio: documentación para la prueba de manejo',
        cuerpo:'Para realizar la prueba de manejo se debe presentar: cédula de identidad vigente, certificado médico habilitante y comprobante de pago del trámite.',
        imagen_portada:null,
        fecha_inicio_vigencia: isoDay(-1),
        fecha_fin_vigencia: isoDay(30),
        estado:'publicada', usuario:'Administrador IMSJ',
        multimedia:[], enlaces:[]},
      { id:3, titulo:'Borrador interno — no publicada',
        cuerpo:'Esta noticia está en borrador.',
        imagen_portada:null,
        fecha_inicio_vigencia: isoDay(0), fecha_fin_vigencia:null,
        estado:'no_publicada', usuario:'Administrador IMSJ',
        multimedia:[], enlaces:[]},
    ]);

    // Franjas: 14 días hábiles
    const franjas = [];
    let fid = 1;
    for (let d = 1; d <= 14; d++) {
      const f = new Date(); f.setHours(0,0,0,0); f.setDate(f.getDate()+d);
      if (f.getDay() === 0 || f.getDay() === 6) continue;
      const fecha = f.toISOString().slice(0,10);
      [
        { tipo_tramite_id:1, modalidad:'prueba',  hora_inicio:'09:00', hora_fin:'10:00', cupos:4 },
        { tipo_tramite_id:1, modalidad:'prueba',  hora_inicio:'10:00', hora_fin:'11:00', cupos:4 },
        { tipo_tramite_id:2, modalidad:'normal',  hora_inicio:'08:30', hora_fin:'09:30', cupos:6 },
        { tipo_tramite_id:2, modalidad:'normal',  hora_inicio:'14:00', hora_fin:'15:00', cupos:6 },
        { tipo_tramite_id:3, modalidad:'urgente', hora_inicio:'11:00', hora_fin:'12:00', cupos:2 },
      ].forEach(f0 => franjas.push({
        id: fid++,
        ...f0,
        fecha,
        cupos_reservados: 0,
        activa: true,
      }));
    }
    save(KEYS.franjas, franjas);

    save(KEYS.agendas, []);

    save(KEYS.materiales, [
      { id:1, titulo:'Manual del conductor uruguayo',
        descripcion:'Manual oficial con normas, señalización y conducción defensiva.',
        archivo:null, archivo_url:null,
        enlace:'https://www.gub.uy/unidad-nacional-seguridad-vial',
        estado:'publicado', orden:0, enlaces:[]},
      { id:2, titulo:'Señales de tránsito principales',
        descripcion:'Repaso de señales reglamentarias, preventivas e informativas.',
        archivo:null, archivo_url:null,
        enlace:'https://www.gub.uy/unidad-nacional-seguridad-vial/comunicacion/publicaciones',
        estado:'publicado', orden:1, enlaces:[]},
      { id:3, titulo:'Conducción defensiva',
        descripcion:'Buenas prácticas para una conducción segura y responsable.',
        archivo:null, archivo_url:null, enlace:null,
        estado:'publicado', orden:2, enlaces:[]},
    ]);

    save(KEYS.faq, [
      { id:1, pregunta:'¿Qué documentos necesito para renovar la libreta de conducir?',
        respuesta:'Cédula de identidad vigente, libreta a renovar y comprobante de pago del trámite. Para mayores de 65 años se requiere también certificado médico habilitante.',
        estado:'visible', orden:0, enlaces:[]},
      { id:2, pregunta:'¿Cuál es la diferencia entre renovación normal y urgente?',
        respuesta:'La renovación urgente tiene un costo especial y se agenda con prioridad. La normal sigue el cronograma habitual.',
        estado:'visible', orden:1, enlaces:[]},
      { id:3, pregunta:'¿Puedo cancelar mi agenda?',
        respuesta:'Sí. Comunicate con la sección Tránsito de la IMSJ con tu código de reserva para liberar el cupo.',
        estado:'visible', orden:2, enlaces:[]},
      { id:4, pregunta:'¿Qué pasa si llego tarde a mi turno?',
        respuesta:'Si se supera el horario asignado el sistema libera el cupo. Será necesario solicitar una nueva agenda.',
        estado:'visible', orden:3, enlaces:[]},
    ]);

    localStorage.setItem(KEYS.seeded, '1');
  }

  function resetData() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    seed();
  }

  // ----------- API simulada -----------
  // mismo shape que la antigua API: get/post/patch/del con paths estilo REST.
  // Rechaza con un error similar al backend (status + data.errors).
  function fail(status, message, errors = null) {
    const e = new Error(message);
    e.status = status;
    e.data = errors ? { message, errors } : { message };
    throw e;
  }

  function fechaPasada(fecha) {
    const hoy = isoDay(0);
    return fecha < hoy;
  }

  // ---- Noticias ----
  function noticiasPublicadas() {
    const hoy = isoDay(0);
    return load(KEYS.noticias, []).filter(n =>
      n.estado === 'publicada' &&
      n.fecha_inicio_vigencia <= hoy &&
      (!n.fecha_fin_vigencia || n.fecha_fin_vigencia >= hoy)
    ).sort((a,b) => b.fecha_inicio_vigencia.localeCompare(a.fecha_inicio_vigencia));
  }

  function noticiaById(id) {
    const n = load(KEYS.noticias, []).find(x => x.id === parseInt(id, 10));
    if (!n) fail(404, 'Noticia no encontrada.');
    return n;
  }

  function noticiasAdmin(estadoFiltro) {
    let items = load(KEYS.noticias, []);
    if (estadoFiltro) items = items.filter(n => n.estado === estadoFiltro);
    items = items.sort((a,b) => b.id - a.id);
    return { data: items, total: items.length };
  }

  function noticiaCrear(body) {
    const items = load(KEYS.noticias, []);
    const n = {
      id: nextId(items),
      titulo: body.titulo,
      cuerpo: body.cuerpo,
      imagen_portada: body.imagen_portada || null,
      fecha_inicio_vigencia: body.fecha_inicio_vigencia,
      fecha_fin_vigencia: body.fecha_fin_vigencia || null,
      estado: body.estado || 'no_publicada',
      usuario: (load(KEYS.user, {})?.nombre) || 'IMSJ',
      multimedia: [], enlaces: body.enlaces || [],
    };
    items.push(n); save(KEYS.noticias, items);
    return n;
  }

  function noticiaActualizar(id, body) {
    const items = load(KEYS.noticias, []);
    const i = items.findIndex(x => x.id === parseInt(id, 10));
    if (i < 0) fail(404, 'Noticia no encontrada.');
    items[i] = { ...items[i], ...body };
    save(KEYS.noticias, items);
    return items[i];
  }

  function noticiaPublicar(id, estado) {
    return noticiaActualizar(id, { estado });
  }

  function noticiaEliminar(id) {
    const items = load(KEYS.noticias, []).filter(x => x.id !== parseInt(id, 10));
    save(KEYS.noticias, items);
    return { message: 'Noticia eliminada.' };
  }

  // ---- Tipos ----
  function tipos() { return load(KEYS.tipos, []); }

  // ---- Franjas ----
  function franjasDisponibles({ tipo_tramite_id, modalidad, desde, hasta } = {}) {
    const hoy = isoDay(0);
    let items = load(KEYS.franjas, []).filter(f =>
      f.activa && f.fecha >= hoy && f.cupos_reservados < f.cupos
    );
    if (tipo_tramite_id) items = items.filter(f => f.tipo_tramite_id == tipo_tramite_id);
    if (modalidad) items = items.filter(f => f.modalidad === modalidad);
    if (desde) items = items.filter(f => f.fecha >= desde);
    if (hasta) items = items.filter(f => f.fecha <= hasta);
    const tiposAll = tipos();
    return items
      .sort((a,b) => (a.fecha+a.hora_inicio).localeCompare(b.fecha+b.hora_inicio))
      .map(f => ({
        id: f.id,
        tipo_tramite: tiposAll.find(t => t.id === f.tipo_tramite_id),
        modalidad: f.modalidad,
        fecha: f.fecha,
        hora_inicio: f.hora_inicio,
        hora_fin: f.hora_fin,
        cupos: f.cupos,
        cupos_disponibles: f.cupos - f.cupos_reservados,
      }));
  }

  function franjasAdmin({ desde, hasta, modalidad } = {}) {
    let items = load(KEYS.franjas, []);
    if (desde) items = items.filter(f => f.fecha >= desde);
    if (hasta) items = items.filter(f => f.fecha <= hasta);
    if (modalidad) items = items.filter(f => f.modalidad === modalidad);
    const tiposAll = tipos();
    items = items
      .map(f => ({ ...f, tipo_tramite: tiposAll.find(t => t.id === f.tipo_tramite_id) }))
      .sort((a,b) => (a.fecha+a.hora_inicio).localeCompare(b.fecha+b.hora_inicio));
    return { data: items, total: items.length };
  }

  function franjaCrear(body) {
    if (body.fecha < isoDay(0)) fail(422, 'Validación', { fecha:['No se admite una fecha pasada.']});
    if (body.hora_fin <= body.hora_inicio) fail(422, 'Validación', { hora_fin:['Debe ser posterior al inicio.']});
    const items = load(KEYS.franjas, []);
    const f = {
      id: nextId(items),
      tipo_tramite_id: parseInt(body.tipo_tramite_id, 10),
      modalidad: body.modalidad,
      fecha: body.fecha,
      hora_inicio: body.hora_inicio,
      hora_fin: body.hora_fin,
      cupos: parseInt(body.cupos, 10),
      cupos_reservados: 0,
      activa: body.activa !== false,
    };
    items.push(f); save(KEYS.franjas, items);
    return f;
  }

  function franjaActualizar(id, body) {
    const items = load(KEYS.franjas, []);
    const i = items.findIndex(x => x.id === parseInt(id, 10));
    if (i < 0) fail(404, 'Franja no encontrada.');
    if (body.cupos != null && body.cupos < items[i].cupos_reservados) {
      fail(422, 'Validación', { cupos:[`No puede ser menor que cupos reservados (${items[i].cupos_reservados}).`]});
    }
    items[i] = { ...items[i], ...body };
    save(KEYS.franjas, items);
    return items[i];
  }

  function franjaEliminar(id) {
    const items = load(KEYS.franjas, []);
    const f = items.find(x => x.id === parseInt(id, 10));
    if (!f) fail(404, 'Franja no encontrada.');
    if (f.cupos_reservados > 0) fail(409, 'No se puede eliminar la franja: tiene reservas asociadas.');
    save(KEYS.franjas, items.filter(x => x.id !== f.id));
    return { message: 'Franja eliminada.' };
  }

  // ---- Agendas ----
  function agendaCrear(body) {
    const franjas = load(KEYS.franjas, []);
    const fi = franjas.findIndex(f => f.id === parseInt(body.franja_id, 10));
    if (fi < 0) fail(422, 'Validación', { franja_id:['Franja inexistente.']});
    const f = franjas[fi];
    if (!f.activa) fail(422, 'Validación', { franja_id:['La franja seleccionada no está disponible.']});
    if (fechaPasada(f.fecha)) fail(422, 'Validación', { franja_id:['No es posible reservar en una fecha pasada.']});
    if (f.cupos - f.cupos_reservados <= 0) fail(422, 'Validación', { franja_id:['No quedan cupos disponibles en esta franja.']});

    const agendas = load(KEYS.agendas, []);
    const doc = String(body.ciudadano_documento).trim();
    const duplicada = agendas.find(a =>
      a.franja_id === f.id &&
      a.ciudadano_documento === doc &&
      ['pendiente','confirmada'].includes(a.estado)
    );
    if (duplicada) fail(422, 'Validación', { ciudadano_documento:['Ya existe una reserva activa con este documento para esta franja.']});

    const tipo = tipos().find(t => t.id === f.tipo_tramite_id);
    const ag = {
      id: nextId(agendas),
      franja_id: f.id,
      tipo_tramite_id: f.tipo_tramite_id,
      modalidad: f.modalidad,
      ciudadano_nombre: body.ciudadano_nombre,
      ciudadano_documento: doc,
      ciudadano_email: body.ciudadano_email,
      ciudadano_telefono: body.ciudadano_telefono || null,
      costo_especial: tipo?.requiere_costo_especial ? tipo.costo_especial : null,
      estado: 'pendiente',
      codigo_reserva: randomCode(10),
      created_at: new Date().toISOString(),
    };
    agendas.push(ag); save(KEYS.agendas, agendas);
    franjas[fi].cupos_reservados += 1; save(KEYS.franjas, franjas);

    return {
      codigo_reserva: ag.codigo_reserva,
      estado: ag.estado,
      modalidad: ag.modalidad,
      costo_especial: ag.costo_especial,
      franja: { ...f, tipo_tramite: tipo, cupos_reservados: franjas[fi].cupos_reservados },
      mensaje: `Reserva creada. Conserve el código ${ag.codigo_reserva} para futuras consultas.`,
    };
  }

  function agendaPorDocCodigo(doc, codigo) {
    const a = load(KEYS.agendas, []).find(x =>
      x.ciudadano_documento === String(doc).trim() &&
      x.codigo_reserva === String(codigo).toUpperCase()
    );
    if (!a) fail(404, 'Reserva no encontrada.');
    const f = load(KEYS.franjas, []).find(x => x.id === a.franja_id);
    const tipo = tipos().find(t => t.id === a.tipo_tramite_id);
    return { ...a, franja: { ...f, tipo_tramite: tipo }, tipo_tramite: tipo };
  }

  function agendaAdmin({ desde, hasta, estado, modalidad } = {}) {
    const franjas = load(KEYS.franjas, []);
    const tiposAll = tipos();
    let items = load(KEYS.agendas, []).map(a => {
      const f = franjas.find(x => x.id === a.franja_id);
      return { ...a, franja: f, tipo_tramite: tiposAll.find(t => t.id === a.tipo_tramite_id) };
    });
    if (desde) items = items.filter(a => a.franja?.fecha >= desde);
    if (hasta) items = items.filter(a => a.franja?.fecha <= hasta);
    if (estado) items = items.filter(a => a.estado === estado);
    if (modalidad) items = items.filter(a => a.modalidad === modalidad);
    items.sort((a,b) => (b.created_at || '').localeCompare(a.created_at || ''));
    return { data: items, total: items.length };
  }

  function agendaConfirmar(id) {
    const agendas = load(KEYS.agendas, []);
    const i = agendas.findIndex(a => a.id === parseInt(id, 10));
    if (i < 0) fail(404, 'Reserva no encontrada.');
    if (agendas[i].estado !== 'pendiente') fail(409, 'Solo agendas pendientes se pueden confirmar.');
    agendas[i].estado = 'confirmada';
    save(KEYS.agendas, agendas);
    return agendas[i];
  }

  function agendaCancelar(id) {
    const agendas = load(KEYS.agendas, []);
    const i = agendas.findIndex(a => a.id === parseInt(id, 10));
    if (i < 0) fail(404, 'Reserva no encontrada.');
    if (['cancelada','completada'].includes(agendas[i].estado)) fail(409, 'La reserva ya no puede cancelarse.');
    const franjaId = agendas[i].franja_id;
    agendas[i].estado = 'cancelada';
    save(KEYS.agendas, agendas);
    const franjas = load(KEYS.franjas, []);
    const fi = franjas.findIndex(f => f.id === franjaId);
    if (fi >= 0 && franjas[fi].cupos_reservados > 0) {
      franjas[fi].cupos_reservados -= 1;
      save(KEYS.franjas, franjas);
    }
    return agendas[i];
  }

  // ---- Dashboard agregado ----
  function dashboardAgenda({ vista = 'semana', fecha } = {}) {
    const ref = fecha ? new Date(fecha+'T00:00:00') : new Date();
    let desde, hasta;
    if (vista === 'dia') { desde = new Date(ref); hasta = new Date(ref); }
    else if (vista === 'mes') {
      desde = new Date(ref.getFullYear(), ref.getMonth(), 1);
      hasta = new Date(ref.getFullYear(), ref.getMonth()+1, 0);
    } else {
      // semana ISO (lunes a domingo)
      desde = new Date(ref);
      const d = (desde.getDay() + 6) % 7;
      desde.setDate(desde.getDate() - d);
      hasta = new Date(desde); hasta.setDate(hasta.getDate()+6);
    }
    const dStr = desde.toISOString().slice(0,10);
    const hStr = hasta.toISOString().slice(0,10);
    const r = agendaAdmin({ desde: dStr, hasta: hStr });
    const items = r.data.filter(a => a.estado !== 'cancelada');

    const porFecha = {};
    for (const a of items) {
      const f = a.franja?.fecha; if (!f) continue;
      (porFecha[f] = porFecha[f] || []).push({
        id: a.id,
        codigo_reserva: a.codigo_reserva,
        hora_inicio: a.franja.hora_inicio,
        hora_fin: a.franja.hora_fin,
        modalidad: a.modalidad,
        tipo_tramite: a.tipo_tramite?.nombre || '',
        ciudadano_nombre: a.ciudadano_nombre,
        ciudadano_documento: a.ciudadano_documento,
        estado: a.estado,
        costo_especial: a.costo_especial,
      });
    }
    return {
      vista,
      desde: dStr,
      hasta: hStr,
      resumen: {
        total: items.length,
        pendientes: items.filter(a => a.estado === 'pendiente').length,
        confirmadas: items.filter(a => a.estado === 'confirmada').length,
        urgentes: items.filter(a => a.modalidad === 'urgente').length,
      },
      agendas_por_fecha: porFecha,
    };
  }

  // ---- Materiales ----
  function materialesPublicados() {
    return load(KEYS.materiales, []).filter(m => m.estado === 'publicado').sort((a,b)=>a.orden-b.orden);
  }
  function materialesAdmin() {
    return { data: load(KEYS.materiales, []).sort((a,b)=>a.orden-b.orden) };
  }
  function materialCrear(body) {
    const items = load(KEYS.materiales, []);
    const m = {
      id: nextId(items),
      titulo: body.titulo, descripcion: body.descripcion || null,
      archivo: null, archivo_url: null,
      enlace: body.enlace || null,
      estado: body.estado || 'no_publicado',
      orden: parseInt(body.orden || 0, 10),
      enlaces: [],
    };
    items.push(m); save(KEYS.materiales, items);
    return m;
  }
  function materialActualizar(id, body) {
    const items = load(KEYS.materiales, []);
    const i = items.findIndex(x => x.id === parseInt(id, 10));
    if (i < 0) fail(404, 'Material no encontrado.');
    items[i] = { ...items[i], ...body };
    save(KEYS.materiales, items);
    return items[i];
  }
  function materialEliminar(id) {
    save(KEYS.materiales, load(KEYS.materiales, []).filter(x => x.id !== parseInt(id, 10)));
    return { message: 'Material eliminado.' };
  }

  // ---- FAQ ----
  function faqPublicas() {
    return load(KEYS.faq, []).filter(p => p.estado === 'visible').sort((a,b)=>a.orden-b.orden);
  }
  function faqAdmin() {
    return load(KEYS.faq, []).sort((a,b)=>a.orden-b.orden);
  }
  function faqCrear(body) {
    const items = load(KEYS.faq, []);
    const p = {
      id: nextId(items),
      pregunta: body.pregunta, respuesta: body.respuesta,
      estado: body.estado || 'visible',
      orden: parseInt(body.orden || 0, 10),
      enlaces: [],
    };
    items.push(p); save(KEYS.faq, items);
    return p;
  }
  function faqActualizar(id, body) {
    const items = load(KEYS.faq, []);
    const i = items.findIndex(x => x.id === parseInt(id, 10));
    if (i < 0) fail(404, 'Pregunta no encontrada.');
    items[i] = { ...items[i], ...body };
    save(KEYS.faq, items);
    return items[i];
  }
  function faqEliminar(id) {
    save(KEYS.faq, load(KEYS.faq, []).filter(x => x.id !== parseInt(id, 10)));
    return { message: 'Pregunta eliminada.' };
  }

  // ----------- Cliente "API" estilo REST -----------
  // Mismo shape que la API antigua: get/post/patch/del. Devuelve promesas.
  function delay(v) { return new Promise(r => setTimeout(() => r(v), 80)); }
  function fail2(...args) { try { fail(...args); } catch (e) { return Promise.reject(e); } }

  function parseQuery(qs) {
    const out = {};
    new URLSearchParams(qs || '').forEach((v,k) => out[k] = v);
    return out;
  }

  async function get(path) {
    const [p, q] = path.split('?');
    const qp = parseQuery(q);

    if (p === '/noticias/publicadas') return delay(noticiasPublicadas());
    if (p === '/noticias')            return delay(noticiasAdmin(qp.estado));
    if (p.startsWith('/noticias/'))   return delay(noticiaById(p.split('/')[2]));

    if (p === '/tipos-tramite')       return delay(tipos());

    if (p === '/franjas/disponibles') return delay(franjasDisponibles(qp));
    if (p === '/franjas')             return delay(franjasAdmin(qp));

    if (p === '/agendas/my')          return delay(agendaPorDocCodigo(qp.documento, qp.codigo_reserva));
    if (p === '/agendas')             return delay(agendaAdmin(qp));

    if (p === '/dashboard/agenda')    return delay(dashboardAgenda(qp));

    if (p === '/materiales/publicados') return delay(materialesPublicados());
    if (p === '/materiales')            return delay(materialesAdmin());

    if (p === '/preguntas-frecuentes/publicadas') return delay(faqPublicas());
    if (p === '/preguntas-frecuentes')            return delay(faqAdmin());

    return fail2(404, 'Ruta no encontrada: GET '+p);
  }

  async function post(path, body) {
    if (path === '/noticias')      return delay(noticiaCrear(body));
    if (path === '/franjas')       return delay(franjaCrear(body));
    if (path === '/agendas')       return delay(agendaCrear(body));
    if (path === '/materiales')    return delay(materialCrear(body || {}));
    if (path === '/preguntas-frecuentes') return delay(faqCrear(body));
    if (path === '/auth/logout')   { localStorage.removeItem(KEYS.user); return delay({ message:'Sesión cerrada.' }); }
    return fail2(404, 'Ruta no encontrada: POST '+path);
  }

  async function patch(path, body) {
    let m;
    if ((m = path.match(/^\/noticias\/(\d+)$/)))             return delay(noticiaActualizar(m[1], body));
    if ((m = path.match(/^\/noticias\/(\d+)\/publicar$/)))   return delay(noticiaPublicar(m[1], 'publicada'));
    if ((m = path.match(/^\/noticias\/(\d+)\/despublicar$/))) return delay(noticiaPublicar(m[1], 'no_publicada'));
    if ((m = path.match(/^\/franjas\/(\d+)$/)))              return delay(franjaActualizar(m[1], body));
    if ((m = path.match(/^\/agendas\/(\d+)\/confirmar$/)))   return delay(agendaConfirmar(m[1]));
    if ((m = path.match(/^\/agendas\/(\d+)\/cancelar$/)))    return delay(agendaCancelar(m[1]));
    if ((m = path.match(/^\/materiales\/(\d+)$/)))           return delay(materialActualizar(m[1], body));
    if ((m = path.match(/^\/preguntas-frecuentes\/(\d+)$/))) return delay(faqActualizar(m[1], body));
    return fail2(404, 'Ruta no encontrada: PATCH '+path);
  }

  async function del(path) {
    let m;
    if ((m = path.match(/^\/noticias\/(\d+)$/)))             return delay(noticiaEliminar(m[1]));
    if ((m = path.match(/^\/franjas\/(\d+)$/)))              return delay(franjaEliminar(m[1]));
    if ((m = path.match(/^\/materiales\/(\d+)$/)))           return delay(materialEliminar(m[1]));
    if ((m = path.match(/^\/preguntas-frecuentes\/(\d+)$/))) return delay(faqEliminar(m[1]));
    return fail2(404, 'Ruta no encontrada: DELETE '+path);
  }

  // ----------- Auth simulada -----------
  function login(email, _password) {
    const e = String(email || '').trim().toLowerCase();
    const esImsj = e.endsWith('@imsj.gub.uy');
    const usuario = {
      email: e,
      nombre: esImsj ? (e.startsWith('admin@') ? 'Administrador IMSJ' : 'Personal IMSJ') : 'Ciudadano',
      rol: esImsj ? (e.startsWith('admin@') ? 'admin' : 'operador') : 'publico',
      es_imsj: esImsj,
    };
    save(KEYS.user, usuario);
    return usuario;
  }
  function currentUser() { return load(KEYS.user, null); }
  function logout()     { localStorage.removeItem(KEYS.user); }

  // ----------- init -----------
  seed();

  return {
    get, post, patch, del,
    login, logout, currentUser,
    resetData,
    KEYS,
  };
})();

// Alias para compatibilidad con código previo basado en `API.*`
const API = {
  get: (p) => Store.get(p),
  post: (p, body) => Store.post(p, body),
  patch: (p, body) => Store.patch(p, body),
  del: (p) => Store.del(p),
  // En IMSJ algunas páginas usaban API.upload — la simulamos como POST sin archivo real
  upload: (p, fd) => {
    const body = {};
    for (const [k, v] of fd.entries()) {
      if (v instanceof File) continue;
      body[k] = v;
    }
    if (body._method && body._method.toUpperCase() === 'PATCH') {
      delete body._method;
      return Store.patch(p, body);
    }
    return Store.post(p, body);
  },
  setToken: () => {}, getToken: () => 'mock', clear: () => Store.logout(),
};
