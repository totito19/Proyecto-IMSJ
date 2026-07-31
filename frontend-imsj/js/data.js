/* ═══════════════════════════════════════════════════════════════════════════
   data.js — datos de ejemplo (mock) idénticos a los de App.tsx.
   Sin backend: todo vive en memoria. Se intenta persistir en sessionStorage
   para que los cambios sobrevivan al navegar entre páginas; si el navegador
   lo bloquea (típico al abrir con file://), se degrada a solo memoria.
   ═══════════════════════════════════════════════════════════════════════════ */

const SEED = {
  reservas: [
    { id: 1, fecha: '16/06/2025', hora: '08:00', ciudadano: 'Ana García López',  documento: '1.234.567-8', tipo: 'Renovación Normal',  estado: 'confirmada' },
    { id: 2, fecha: '16/06/2025', hora: '09:30', ciudadano: 'Carlos Mendoza',    documento: '2.345.678-9', tipo: 'Prueba de Manejo',   estado: 'pendiente' },
    { id: 3, fecha: '16/06/2025', hora: '10:00', ciudadano: 'Laura Fernández',   documento: '3.456.789-0', tipo: 'Renovación Urgente', estado: 'urgente' },
    { id: 4, fecha: '16/06/2025', hora: '11:00', ciudadano: 'Roberto Silva',     documento: '4.567.890-1', tipo: 'Renovación Normal',  estado: 'confirmada' },
    { id: 5, fecha: '16/06/2025', hora: '13:00', ciudadano: 'María Torres',      documento: '5.678.901-2', tipo: 'Prueba de Manejo',   estado: 'pendiente' },
    { id: 6, fecha: '16/06/2025', hora: '14:30', ciudadano: 'Diego Ramos',       documento: '6.789.012-3', tipo: 'Renovación Normal',  estado: 'cancelada' },
    { id: 7, fecha: '17/06/2025', hora: '08:30', ciudadano: 'Sofía Herrera',     documento: '7.890.123-4', tipo: 'Renovación Urgente', estado: 'urgente' },
    { id: 8, fecha: '17/06/2025', hora: '09:00', ciudadano: 'Pablo Castillo',    documento: '8.901.234-5', tipo: 'Prueba de Manejo',   estado: 'confirmada' },
  ],

  noticias: [
    { id: 1, titulo: 'Nuevos horarios de atención a partir de julio',        resumen: 'La intendencia informa sobre los cambios en el calendario de atención para trámites de licencias.', estado: 'publicada', vigencia: '30/06/2025', fecha: '10/06/2025' },
    { id: 2, titulo: 'Requisitos actualizados para renovación de licencia B', resumen: 'Se actualizan los documentos requeridos para la renovación de categoría B.',                        estado: 'publicada', vigencia: '31/12/2025', fecha: '05/06/2025' },
    { id: 3, titulo: 'Mantenimiento del sistema — 20 de junio',               resumen: 'El sistema estará fuera de servicio el 20 de junio de 9:00 a 12:00 horas.',                        estado: 'borrador',  vigencia: '20/06/2025', fecha: '12/06/2025' },
    { id: 4, titulo: 'Campaña de educación vial: Verano seguro 2025',         resumen: 'Actividades de concientización para conductores durante la temporada estival.',                    estado: 'publicada', vigencia: '28/02/2026', fecha: '01/06/2025' },
  ],

  franjas: [
    { id: 1, fecha: '16/06/2025', horaInicio: '08:00', horaFin: '09:00', tipo: 'renovacion-normal',  cupos: 6, reservas: 4 },
    { id: 2, fecha: '16/06/2025', horaInicio: '09:00', horaFin: '10:00', tipo: 'prueba',             cupos: 4, reservas: 4 },
    { id: 3, fecha: '16/06/2025', horaInicio: '10:00', horaFin: '11:00', tipo: 'renovacion-urgente', cupos: 3, reservas: 2 },
    { id: 4, fecha: '16/06/2025', horaInicio: '13:00', horaFin: '14:00', tipo: 'renovacion-normal',  cupos: 6, reservas: 1 },
    { id: 5, fecha: '17/06/2025', horaInicio: '08:00', horaFin: '09:00', tipo: 'prueba',             cupos: 4, reservas: 0 },
    { id: 6, fecha: '17/06/2025', horaInicio: '09:00', horaFin: '10:00', tipo: 'renovacion-urgente', cupos: 3, reservas: 3 },
  ],

  materiales: [
    { id: 1, nombre: 'Reglamento Nacional de Tránsito 2024', tipo: 'documento', enlace: 'reglamento-transito-2024.pdf',    estado: 'activo' },
    { id: 2, nombre: 'Video: Señales de tránsito obligatorias', tipo: 'video',  enlace: 'https://ejemplo.com/video/senales', estado: 'activo' },
    { id: 3, nombre: 'Guía de estudio — Categoría B',        tipo: 'documento', enlace: 'guia-categoria-b.pdf',            estado: 'activo' },
    { id: 4, nombre: 'Simulacro de examen teórico',          tipo: 'enlace',    enlace: 'https://simulacro.imsj.gub.uy',   estado: 'activo' },
    { id: 5, nombre: 'Manual de primeros auxilios viales',   tipo: 'documento', enlace: 'primeros-auxilios.pdf',           estado: 'inactivo' },
  ],

  preguntas: [
    { id: 1, pregunta: '¿Cuáles son los documentos necesarios para renovar la licencia?', respuesta: 'Cédula de identidad vigente, certificado médico, foto carné y comprobante de pago de la tasa correspondiente.', visible: true },
    { id: 2, pregunta: '¿Con cuánta anticipación debo sacar turno?',                      respuesta: 'Recomendamos solicitar el turno con al menos 5 días hábiles de anticipación para asegurar disponibilidad.',   visible: true },
    { id: 3, pregunta: '¿Puedo cancelar o reprogramar mi turno?',                         respuesta: 'Sí, puede cancelar o reprogramar hasta 24 horas antes del turno desde el portal ciudadano.',                  visible: true },
    { id: 4, pregunta: '¿Qué pasa si no apruebo la prueba de manejo?',                    respuesta: 'Deberá esperar 30 días corridos para volver a solicitar un nuevo turno para la prueba.',                       visible: false },
    { id: 5, pregunta: '¿Aceptan pago en efectivo en la intendencia?',                    respuesta: 'Sí, se acepta efectivo, tarjeta de débito y transferencia bancaria.',                                         visible: true },
  ],
};

const STORAGE_PREFIX = 'imsj:';
const memoryStore = {};

const Store = {
  /** Lee una colección; devuelve una copia editable. */
  get(key) {
    if (memoryStore[key]) return memoryStore[key];
    let value = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
      if (raw) value = JSON.parse(raw);
    } catch (_) { /* file:// o storage bloqueado: se ignora */ }
    memoryStore[key] = value || JSON.parse(JSON.stringify(SEED[key] || []));
    return memoryStore[key];
  },

  /** Guarda una colección. */
  set(key, value) {
    memoryStore[key] = value;
    try {
      sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (_) { /* se mantiene solo en memoria */ }
    return value;
  },

  /** Restaura los datos originales (usado al cerrar sesión). */
  reset() {
    Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
    try {
      Object.keys(SEED).forEach((k) => sessionStorage.removeItem(STORAGE_PREFIX + k));
    } catch (_) { /* no-op */ }
  },
};
