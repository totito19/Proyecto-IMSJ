// Lógica reusable para páginas de agenda (prueba / renovación normal / urgente)
async function cargarTiposTramite() {
  return await API.get('/tipos-tramite');
}

async function cargarFranjas({ tipoTramiteId, modalidad, desde, hasta }) {
  const qs = new URLSearchParams();
  if (tipoTramiteId) qs.set('tipo_tramite_id', tipoTramiteId);
  if (modalidad) qs.set('modalidad', modalidad);
  if (desde) qs.set('desde', desde);
  if (hasta) qs.set('hasta', hasta);
  return await API.get('/franjas/disponibles?' + qs.toString());
}

function agruparFranjasPorFecha(franjas) {
  const out = {};
  for (const f of franjas) {
    out[f.fecha] = out[f.fecha] || [];
    out[f.fecha].push(f);
  }
  return out;
}

function renderFranjas(franjas, selectedId) {
  const grupos = agruparFranjasPorFecha(franjas);
  const fechas = Object.keys(grupos).sort();
  if (!fechas.length) {
    return '<p class="text-slate-600 py-4">No hay franjas disponibles en este momento.</p>';
  }
  return fechas.map(fecha => `
    <div class="mb-4">
      <h3 class="font-semibold text-slate-700 mb-2">${fmtFecha(fecha)}</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        ${grupos[fecha].map(f => `
          <button type="button" data-franja-id="${f.id}"
            class="franja-btn border rounded p-2 text-sm hover:border-blue-500 hover:bg-blue-50
              ${selectedId == f.id ? 'border-blue-700 bg-blue-100 ring-2 ring-blue-300' : 'border-slate-300 bg-white'}">
            <div class="font-bold">${f.hora_inicio.slice(0,5)} – ${f.hora_fin.slice(0,5)}</div>
            <div class="text-xs text-slate-600">Cupos: ${f.cupos_disponibles}/${f.cupos}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

async function enviarReserva(form, franjaId) {
  const fd = new FormData(form);
  return await API.post('/agendas', {
    franja_id: franjaId,
    ciudadano_nombre: fd.get('nombre'),
    ciudadano_documento: fd.get('documento'),
    ciudadano_email: fd.get('email'),
    ciudadano_telefono: fd.get('telefono') || null,
  });
}
