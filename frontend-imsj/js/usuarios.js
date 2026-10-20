/** Alta, búsqueda y baja lógica de integrantes del personal IMSJ. */

let usuariosAdmin = [];
let queryUsuarios = '';

/** Filtra personal por nombre, cédula o rol utilizando la búsqueda global. */
function usuariosFiltrados() {
  if (!queryUsuarios) return usuariosAdmin;
  return usuariosAdmin.filter((usuario) =>
    [usuario.nombre, usuario.cedula, usuario.rol].join(' ').toLowerCase().includes(queryUsuarios),
  );
}

/** Convierte la marca temporal de la API a una fecha corta para la tabla. */
function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-UY');
}

/** Dibuja las cuentas activas y evita ofrecer la baja del usuario actual. */
function renderUsuarios() {
  const currentUser = ImsjApi.currentUser();
  const data = usuariosFiltrados();
  $('#tbody-usuarios').innerHTML = data
    .map(
      (usuario) => `
    <tr>
      <td><strong>${esc(usuario.nombre)}</strong></td>
      <td class="mono">${esc(usuario.cedula)}</td>
      <td>${badge(usuario.rol === 'DIRECTORA' ? 'aprobado' : 'activo').replace(usuario.rol === 'DIRECTORA' ? 'Aprobado' : 'Activo', usuario.rol === 'DIRECTORA' ? 'Directora' : 'Personal')}</td>
      <td>${esc(formatDateTime(usuario.created_at))}</td>
      <td><div class="actions">
        ${
          usuario.id === currentUser.id
            ? '<span class="self-label">Tu cuenta</span>'
            : actionBtn('trash-2', 'Quitar acceso', {
                danger: true,
                data: { accion: 'quitar', id: usuario.id },
              })
        }
      </div></td>
    </tr>`,
    )
    .join('');
  $('#empty-usuarios').hidden = data.length > 0;
  $('#contador-usuarios').textContent = usuariosAdmin.length;
  hydrateIcons($('#tbody-usuarios'));
}

/** Obtiene de la API la lista actual de integrantes del personal. */
async function cargarUsuarios() {
  try {
    const payload = await ImsjApi.request('/usuarios-admin');
    usuariosAdmin = Array.isArray(payload.usuarios) ? payload.usuarios : [];
    renderUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

/** Valida y envía los datos de una nueva cuenta administrativa. */
async function guardarUsuario(event) {
  event.preventDefault();
  // currentTarget deja de estar disponible después del primer await.
  // Conservar el formulario evita que el reset intente ejecutarse sobre null.
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  try {
    const payload = await ImsjApi.request('/usuarios-admin', {
      method: 'POST',
      body: {
        nombre: $('#u-nombre').value.trim(),
        cedula: $('#u-cedula').value.trim(),
        rol: $('#u-rol').value,
      },
    });
    Modal.close('modal-usuario');
    form.reset();
    await cargarUsuarios();
    alert(`Acceso creado para ${payload.usuario.nombre}. Clave inicial: ${payload.clave_inicial}`);
  } catch (error) {
    alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
}

// Conecta alta, búsqueda y baja lógica al finalizar la carga del documento.
document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!ImsjApi.isStaff(usuario)) {
    window.location.assign(
      `/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`,
    );
    return;
  }

  $('#btn-nuevo-usuario').addEventListener('click', () => Modal.open('modal-usuario'));
  $('#form-usuario').addEventListener('submit', guardarUsuario);
  $('#tbody-usuarios').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion="quitar"]');
    if (!button) return;
    const item = usuariosAdmin.find(
      (usuarioAdmin) => usuarioAdmin.id === Number(button.dataset.id),
    );
    if (!item || !confirm(`¿Quitar el acceso de ${item.nombre}?`)) return;

    try {
      await ImsjApi.request(`/usuarios-admin/${item.id}`, { method: 'DELETE' });
      await cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  });
  initSearch((query) => {
    queryUsuarios = query;
    renderUsuarios();
  });
  cargarUsuarios();
});
