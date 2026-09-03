let usuariosAdmin = [];
let queryUsuarios = '';

function usuariosFiltrados() {
  if (!queryUsuarios) return usuariosAdmin;
  return usuariosAdmin.filter((usuario) =>
    [usuario.nombre, usuario.cedula].join(' ').toLowerCase().includes(queryUsuarios));
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-UY');
}

function renderUsuarios() {
  const currentUser = ImsjApi.currentUser();
  const data = usuariosFiltrados();
  $('#tbody-usuarios').innerHTML = data.map((usuario) => `
    <tr>
      <td><strong>${esc(usuario.nombre)}</strong></td>
      <td class="mono">${esc(usuario.cedula)}</td>
      <td>${esc(formatDateTime(usuario.created_at))}</td>
      <td><div class="actions">
        ${usuario.id === currentUser.id
          ? '<span class="self-label">Tu cuenta</span>'
          : actionBtn('trash-2', 'Quitar acceso', { danger: true, data: { accion: 'quitar', id: usuario.id } })}
      </div></td>
    </tr>`).join('');
  $('#empty-usuarios').hidden = data.length > 0;
  $('#contador-usuarios').textContent = usuariosAdmin.length;
  hydrateIcons($('#tbody-usuarios'));
}

async function cargarUsuarios() {
  try {
    const payload = await ImsjApi.request('/usuarios-admin');
    usuariosAdmin = Array.isArray(payload.usuarios) ? payload.usuarios : [];
    renderUsuarios();
  } catch (error) {
    alert(error.message);
  }
}

async function guardarUsuario(event) {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;

  const submitButton = event.currentTarget.querySelector('[type="submit"]');
  submitButton.disabled = true;
  try {
    const payload = await ImsjApi.request('/usuarios-admin', {
      method: 'POST',
      body: {
        nombre: $('#u-nombre').value.trim(),
        cedula: $('#u-cedula').value.trim(),
      },
    });
    Modal.close('modal-usuario');
    event.currentTarget.reset();
    await cargarUsuarios();
    alert(`Acceso creado para ${payload.usuario.nombre}. Clave inicial: ${payload.clave_inicial}`);
  } catch (error) {
    alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const usuario = ImsjApi.currentUser();
  if (!usuario || usuario.rol !== 'PERSONAL_IMSJ') {
    window.location.assign(`/frontend-publico/login.html?return=${encodeURIComponent(window.location.pathname)}`);
    return;
  }

  $('#btn-nuevo-usuario').addEventListener('click', () => Modal.open('modal-usuario'));
  $('#form-usuario').addEventListener('submit', guardarUsuario);
  $('#tbody-usuarios').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-accion="quitar"]');
    if (!button) return;
    const item = usuariosAdmin.find((usuarioAdmin) => usuarioAdmin.id === Number(button.dataset.id));
    if (!item || !confirm(`¿Quitar el acceso de ${item.nombre}?`)) return;

    try {
      await ImsjApi.request(`/usuarios-admin/${item.id}`, { method: 'DELETE' });
      await cargarUsuarios();
    } catch (error) {
      alert(error.message);
    }
  });
  initSearch((query) => { queryUsuarios = query; renderUsuarios(); });
  cargarUsuarios();
});
